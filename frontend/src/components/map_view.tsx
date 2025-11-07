import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AircraftData } from "../utils/types";
import { AircraftMarker } from "./aircraft_marker";

const mockAircraftData: AircraftData[] = [
    {
        id: "A1",
        position: [13.7, 100.76],
        speed: 450,
        altitude: 35000,
        heading: 90,
    },
    {
        id: "B2",
        position: [13.68, 100.74],
        speed: 500,
        altitude: 32000,
        heading: 270,
    },
];

interface MapViewProps {
    onAircraftClick: (audioSrc: string) => void;
}

export function MapView({ onAircraftClick }: Readonly<MapViewProps>) {
    return (
        <MapContainer
            center={[13.69, 100.75]}
            zoom={12}
            className="w-full h-full z-0"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {mockAircraftData.map((aircraft) => (
                <AircraftMarker
                    key={aircraft.id}
                    aircraft={aircraft}
                    onAircraftClick={onAircraftClick}
                />
            ))}
        </MapContainer>
    );
}
