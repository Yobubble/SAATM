// frontend/src/App.tsx

import { FlightSearch } from "./components/flight_search";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import { MapView } from "./components/map_view";
import { AirRouteInset } from "./components/air_route_inset";
import { AirRouteToggleButton } from "./components/air_route_toggle_button";
import { MockDataToggleButton } from "./components/mock_data_toggle_button";
import { InfoBoxToggleButton } from "./components/info_box_toggle_button";
import { Aircraft, AircraftApiResponse, TranscriptMessage } from "./utils/types";
import { mockAircraftData } from "./utils/mock_data";
import { StopFollowingButton } from "./components/stop_following_button";
import { AltitudeFilter } from "./components/altitude_filter";
import { RadioTranscript } from "./components/radio_transcript";

import YouTube from "react-youtube";
import { mockTranscript } from "./utils/mockTranscript";
import { TranscriptToggleButton } from "./components/transcript_toggle_button";

function App() {
    const [showAirRoute, setShowAirRoute] = useState(true);
    // const [caption, setCaption] = useState<string | null>(null);
    const [useMockData, setUseMockData] = useState(false);
    const [showInfoBox, setShowInfoBox] = useState(true);
    const [aircraftData, setAircraftData] =
        useState<AircraftApiResponse | null>(null);
    const [searchResults, setSearchResults] = useState<Aircraft[]>([]);
    const [selectedFlight, setSelectedFlight] = useState<Aircraft | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // This state holds the real-time list of messages
    const [transcriptMessages, setTranscriptMessages] = useState<
        TranscriptMessage[]
    >([]);
    // This state controls the visibility of the transcript UI
    const [showTranscript, setShowTranscript] = useState(true);

    // These refs will control the simulation
    const playerRef = useRef<any>(null); // Holds the YouTube player object
    const transcriptIndexRef = useRef(0); // Tracks which message we're waiting for
    // This ref holds the ID of the animation frame for cancellation
    const requestIDRef = useRef<number | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setSearchResults([]);
                setSearchError(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    useEffect(() => {
        if (selectedFlight && aircraftData) {
            const updatedFlight = aircraftData.aircraft.find(
                (ac) => ac.hex === selectedFlight.hex
            );
            if (updatedFlight) {
                setSelectedFlight(updatedFlight);
            }
        }
    }, [aircraftData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/aircraft`
                );
                const data: AircraftApiResponse = await response.json();
                setAircraftData(data);
            } catch (error) {
                console.error("Error fetching aircraft data:", error);
            }
        };

        if (useMockData) {
            setAircraftData({
                total: mockAircraftData.length,
                now: Date.now() / 1000,
                message: "mock data",
                aircraft: mockAircraftData,
                cached: false,
                location: {
                    lat: 13.69,
                    lon: 100.75,
                    radius: 100,
                },
            });
            return;
        }

        fetchData();

        const interval = setInterval(fetchData, 1000); // Fetch every 1 seconds

        return () => clearInterval(interval);
    }, [useMockData]);

    const handleSearch = (flightId: string) => {
        if (flightId.trim() === "") {
            setSearchError("Flight ID cannot be empty.");
            setSearchResults([]);
            setSelectedFlight(null);
            return;
        }

        setSearchError(null);

        if (!aircraftData) {
            setSearchError("Aircraft data not available yet.");
            return;
        }

        const exactMatch = aircraftData.aircraft.find(
            (ac) =>
                ac.flight?.trim().toLowerCase() ===
                flightId.trim().toLowerCase()
        );

        if (exactMatch) {
            setSelectedFlight(exactMatch);
            setSearchResults([]);
        } else {
            const prefixMatches = aircraftData.aircraft.filter((ac) =>
                ac.flight
                    ?.trim()
                    .toLowerCase()
                    .startsWith(flightId.trim().toLowerCase())
            );
            if (prefixMatches.length > 0) {
                setSearchResults(prefixMatches);
            } else {
                setSearchError("No flights found.");
                setSearchResults([]);
            }
            setSelectedFlight(null);
        }
    };
    const [minAltitude, setMinAltitude] = useState<number | null>(null);
    const [maxAltitude, setMaxAltitude] = useState<number | null>(null);

    const playAudioWithCaption = (audioSrc: string) => {
        const audio = new Audio(audioSrc);

        // TODO: fetch transcribing api here

        // setCaption("Technologia! Techcologia!");
        audio.play();
        // audio.onended = () => {
        //     setCaption(null);
        // };
    };

    // This function saves the player reference when it's ready.
    const onPlayerReady = (event: any) => {
        playerRef.current = event.target;
    };

    // This function checks the player time and adds transcript messages in sync.
    const checkTranscript = () => {
        if (!playerRef.current) {
            return;
        }

        const player = playerRef.current;
        // Get player's current time and offset it by the video's start time (6037s)
        const currentTime = player.getCurrentTime() - 6037;

        // Check if we're past the start and still have messages to show
        if (
            currentTime >= 0 &&
            transcriptIndexRef.current < mockTranscript.length
        ) {
            const nextMessage = mockTranscript[transcriptIndexRef.current];

            // If the video time is past the message's timestamp, show it!
            if (currentTime >= nextMessage.timestamp) {
                setTranscriptMessages((prev) => [...prev, nextMessage]);
                // Advance our counter to look for the *next* message
                transcriptIndexRef.current += 1;
            }
        }

        // Keep the loop running as long as there are messages left
        if (transcriptIndexRef.current < mockTranscript.length) {
            requestIDRef.current = requestAnimationFrame(checkTranscript);
        }
    };

    // Function to START the transcript and audio
    const handleStartTranscript = () => {
        // Stop any previous animations
        if (requestIDRef.current) {
            cancelAnimationFrame(requestIDRef.current);
        }

        // Reset state
        setTranscriptMessages([]);
        transcriptIndexRef.current = 0;

        if (playerRef.current) {
            // Start player from the beginning (6037s) and play
            playerRef.current.seekTo(6037, true);
            playerRef.current.playVideo();
            // Start the transcript loop
            requestIDRef.current = requestAnimationFrame(checkTranscript);
        }
    };

    // Function to STOP the transcript and audio
    const handleStopTranscript = () => {
        // Stop any pending animation frames
        if (requestIDRef.current) {
            cancelAnimationFrame(requestIDRef.current);
        }
        if (playerRef.current) {
            // Stop the video
            playerRef.current.stopVideo();
        }
    };

    return (
        <div className="relative h-screen w-screen">
            <YouTube
                videoId="_iKLQ2pRbMo" // The video ID
                opts={{
                    height: "0",
                    width: "0",
                    playerVars: {
                        start: 6037, // The start time in seconds
                    },
                }}
                onReady={onPlayerReady}
                className="hidden" // Visually hide the player
            />

            <div
                ref={searchRef}
                className="absolute top-3 left-14 z-50 flex flex-col gap-2"
            >
                <FlightSearch onSearch={handleSearch} />
                {selectedFlight && (
                    <StopFollowingButton
                        onClick={() => setSelectedFlight(null)}
                    />
                )}
                {searchError && (
                    <div className="bg-red-500/50 text-white p-2 rounded-2xl ">
                        {searchError}
                    </div>
                )}
                {searchResults.length > 0 && (
                    <div className="rounded-2xl">
                        <ul className="flex flex-col gap-2 items-start">
                            {searchResults.map((ac) => (
                                <button
                                    key={ac.hex}
                                    onClick={() => {
                                        setSelectedFlight(ac);
                                        setSearchResults([]);
                                    }}
                                    className="cursor-pointer w-full h-8 rounded-2xl hover:bg-blue-500 hover:text-white bg-white"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setSelectedFlight(ac);
                                            setSearchResults([]);
                                        }
                                    }}
                                >
                                    {ac.flight}
                                </button>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <MapView
                // MODIFIED: This prop is required by MapViewProps and is added back
                onAircraftClick={playAudioWithCaption}
                aircraftData={aircraftData}
                selectedFlight={selectedFlight}
                useMockData={useMockData}
                minAltitude={minAltitude ?? 0}
                maxAltitude={maxAltitude ?? 0}
                showInfoBox={showInfoBox}
            />
            {showAirRoute && (
                <div className="absolute top-5 right-5 z-50">
                    <AirRouteInset />
                </div>
            )}
            <div className="z-50 fixed bottom-8 right-4">
                <div className="flex flex-col gap-2">
                    <TranscriptToggleButton
                        showTranscript={showTranscript}
                        onToggle={() => setShowTranscript(!showTranscript)}
                    />
                    <MockDataToggleButton
                        useMockData={useMockData}
                        onToggle={() => setUseMockData(!useMockData)}
                    />
                    <InfoBoxToggleButton
                        showInfoBox={showInfoBox}
                        onToggle={() => setShowInfoBox(!showInfoBox)}
                    />
                    <AirRouteToggleButton
                        isOSM={!showAirRoute}
                        onToggle={() => setShowAirRoute(!showAirRoute)}
                    />
                </div>
            </div>

            {/* This block is now conditional on `showTranscript` */}
            {/* The layout is stacked: Filter first, then Transcript */}
            {showTranscript && (
                <div className="z-50 fixed bottom-5 left-5 flex flex-col gap-4">
                    <AltitudeFilter
                        minAltitude={minAltitude}
                        maxAltitude={maxAltitude}
                        onMinChange={setMinAltitude}
                        onMaxChange={setMaxAltitude}
                    />
                    <RadioTranscript
                        messages={transcriptMessages}
                        onStart={handleStartTranscript}
                        onStop={handleStopTranscript}
                    />
                </div>
            )}
        </div>
    );
}

export default App;