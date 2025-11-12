import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Aircraft, AircraftApiResponse } from "../utils/types";
import { AircraftMarker } from "./aircraft_marker";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface MapViewProps {
    onAircraftClick: (audioSrc: string) => void;
    aircraftData: AircraftApiResponse | null;
    selectedFlight: Aircraft | null;
    useMockData: boolean;
    minAltitude: number;
    maxAltitude: number;
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
    useMockData,
    minAltitude,
    maxAltitude,
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
            {aircraftData?.aircraft
                .filter((aircraft) => {
                    const altitude = aircraft.alt_baro;
                    if (minAltitude > 0 && maxAltitude > 0) {
                        return altitude >= minAltitude && altitude <= maxAltitude;
                    } else if (minAltitude > 0) {
                        return altitude >= minAltitude;
                    } else if (maxAltitude > 0) {
                        return altitude <= maxAltitude;
                    }
                    return true; // No filter applied (both are 0 or null)
                })
                .map((aircraft) => (
                    <AircraftMarker
                        key={aircraft.hex}
                        aircraft={aircraft}
                        onAircraftClick={onAircraftClick}
                    />
                ))}
        </MapContainer>
    );
}
