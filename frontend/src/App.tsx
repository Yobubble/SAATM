import { useState } from "react";
import "./App.css";
import { MapView } from "./components/map_view";
import { AirRouteInset } from "./components/air_route_inset";
import { AirRouteToggleButton } from "./components/air_route_toggle_button";

function App() {
    const [showAirRoute, setShowAirRoute] = useState(true);
    const [caption, setCaption] = useState<string | null>(null);

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
            <MapView onAircraftClick={playAudioWithCaption} />
            {showAirRoute && (
                <div className="absolute top-5 right-5 z-50">
                    <AirRouteInset />
                </div>
            )}
            <div className="absolute z-50">
                <AirRouteToggleButton
                    isOSM={!showAirRoute}
                    onToggle={() => setShowAirRoute(!showAirRoute)}
                />
            </div>
            {caption && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded z-[1000]">
                    {caption}
                </div>
            )}
        </div>
    );
}

export default App;
