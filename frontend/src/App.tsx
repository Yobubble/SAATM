import { useState } from "react";
import "./App.css";
import { MapView } from "./components/map_view";
import { AirRouteInset } from "./components/air_route_inset";
import { AirRouteToggleButton } from "./components/air_route_toggle_button";
import { MockDataToggleButton } from "./components/mock_data_toggle_button";

function App() {
    const [showAirRoute, setShowAirRoute] = useState(true);
    const [caption, setCaption] = useState<string | null>(null);
    const [useMockData, setUseMockData] = useState(false);

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
            <MapView
                onAircraftClick={playAudioWithCaption}
                useMockData={useMockData}
            />
            {showAirRoute && (
                <div className="absolute top-5 right-5 z-50">
                    <AirRouteInset />
                </div>
            )}
            <div className="z-50 fixed bottom-8 right-8">
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
            {caption && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded z-1000">
                    {caption}
                </div>
            )}
        </div>
    );
}

export default App;
