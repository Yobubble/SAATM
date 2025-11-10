import { MapContainer, TileLayer } from "react-leaflet";
import { AircraftApiResponse } from "../utils/types";
import { AircraftMarker } from "./aircraft_marker";
import { useEffect, useState } from "react";
import { mockAircraftData } from "../utils/mock_data";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
    onAircraftClick: (audioSrc: string) => void;
    useMockData: boolean;
}

export function MapView({
    onAircraftClick,
    useMockData,
}: Readonly<MapViewProps>) {
    const [aircraftData, setAircraftData] =
        useState<AircraftApiResponse | null>(null);

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

    return (
        <MapContainer
            center={[13.69, 100.75]}
            zoom={10}
            className="w-full h-full z-0"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {aircraftData?.aircraft.map((aircraft) => (
                <AircraftMarker
                    key={aircraft.hex}
                    aircraft={aircraft}
                    onAircraftClick={onAircraftClick}
                />
            ))}
        </MapContainer>
    );
}
