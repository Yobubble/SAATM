import { FlightSearch } from "./components/flight_search";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import { MapView } from "./components/map_view";
import { AirRouteInset } from "./components/air_route_inset";
import { AirRouteToggleButton } from "./components/air_route_toggle_button";
import { MockDataToggleButton } from "./components/mock_data_toggle_button";
import { Aircraft, AircraftApiResponse } from "./utils/types";
import { mockAircraftData } from "./utils/mock_data";
import { StopFollowingButton } from "./components/stop_following_button";
import { AltitudeFilter } from "./components/altitude_filter";

function App() {
    const [showAirRoute, setShowAirRoute] = useState(true);
    const [caption, setCaption] = useState<string | null>(null);
    const [useMockData, setUseMockData] = useState(false);
    const [aircraftData, setAircraftData] =
        useState<AircraftApiResponse | null>(null);
    const [searchResults, setSearchResults] = useState<Aircraft[]>([]);
    const [selectedFlight, setSelectedFlight] = useState<Aircraft | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

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

        setCaption("Technologia! Techcologia!");
        audio.play();
        audio.onended = () => {
            setCaption(null);
        };
    };

    return (
        <div className="relative h-screen w-screen">
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
                onAircraftClick={playAudioWithCaption}
                aircraftData={aircraftData}
                selectedFlight={selectedFlight}
                useMockData={useMockData}
                minAltitude={minAltitude ?? 0}
                maxAltitude={maxAltitude ?? 0}
            />
            {showAirRoute && (
                <div className="absolute top-5 right-5 z-50">
                    <AirRouteInset />
                </div>
            )}
            <div className="z-50 fixed bottom-8 right-4">
                <div className="flex flex-col gap-2">
                    <MockDataToggleButton
                        useMockData={useMockData}
                        onToggle={() => setUseMockData(!useMockData)}
                    />
                    <AirRouteToggleButton
                        isOSM={!showAirRoute}
                        onToggle={() => setShowAirRoute(!showAirRoute)}
                    />
                </div>
            </div>
            <div className="z-50 fixed bottom-5 left-5">
                <AltitudeFilter
                    minAltitude={minAltitude}
                    maxAltitude={maxAltitude}
                    onMinChange={setMinAltitude}
                    onMaxChange={setMaxAltitude}
                />
            </div>
            {caption && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded z-1000">
                    {caption}
                </div>
            )}
        </div>
    );
}

export default App;
