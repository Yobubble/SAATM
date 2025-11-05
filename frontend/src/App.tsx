import { useState } from "react";
import "./App.css";
import { MapView } from "./components/map_view";
import { AirRouteInset } from "./components/air_route_inset";
import { AirRouteToggleButton } from "./components/air_route_toggle_button";

function App() {
    const [showAirRoute, setShowAirRoute] = useState(true);

    return (
        <div className="relative h-screen w-screen">
            <MapView />
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
        </div>
    );
}

export default App;
