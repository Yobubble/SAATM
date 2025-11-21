import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Aircraft, AircraftApiResponse } from "../utils/types";
import { AircraftMarker } from "./aircraft_marker";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { filterAircraftByAltitude } from "../lib/altitudeFilter";

interface MapViewProps {
    onAircraftClick: (audioSrc: string) => void;
    aircraftData: AircraftApiResponse | null;
    selectedFlight: Aircraft | null;
    minAltitude: number;
    maxAltitude: number;
    showInfoBox: boolean;
}

const ChangeView = ({
    center,
    zoom,
}: {
    center: [number, number];
    zoom: number;
}) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

export function MapView({
    onAircraftClick,
    aircraftData,
    selectedFlight,
    minAltitude,
    maxAltitude,
    showInfoBox,
}: Readonly<MapViewProps>) {
    return (
        <MapContainer
            center={[13.69, 100.75]}
            zoom={10}
            className="w-full h-full z-0"
        >
            {selectedFlight && (
                <ChangeView
                    center={[selectedFlight.lat, selectedFlight.lon]}
                    zoom={13}
                />
            )}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {aircraftData &&
                filterAircraftByAltitude(
                    aircraftData.aircraft,
                    minAltitude,
                    maxAltitude,
                ).map((aircraft) => (
                    <AircraftMarker
                        key={aircraft.hex}
                        aircraft={aircraft}
                        onAircraftClick={onAircraftClick}
                        showInfoBox={showInfoBox}
                    />
                ))}
        </MapContainer>
    );
}
