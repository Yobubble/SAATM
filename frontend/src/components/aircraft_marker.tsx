import { Marker } from "react-leaflet";
import L from "leaflet";
import { AircraftData } from "../utils/types";
import { IconPlaneTilt } from "@tabler/icons-react";
import { renderToStaticMarkup } from "react-dom/server";

const airplaneSvg = renderToStaticMarkup(
    <IconPlaneTilt size={30} stroke={1.5} />
);

const createAircraftIcon = (aircraft: AircraftData) => {
    const { heading, id, speed, altitude } = aircraft;
    const statsHtml = `
        <div style="
            position: absolute;
            left: 35px; /* Position it to the right of the icon */
            top: -15px; /* Align with the top of the icon */
            width: 150px;
            background-color: rgba(255, 255, 255, 0.8);
            border: 1px solid #ccc;
            padding: 5px;
            border-radius: 10px;
            font-size: 12px;
            white-space: nowrap;
        ">
            <strong>ID:</strong> ${id} <br />
            <strong>Speed:</strong> ${speed} knots <br />
            <strong>Altitude:</strong> ${altitude} ft <br />
            <strong>Heading:</strong> ${heading}°
        </div>
    `;

    return new L.DivIcon({
        html: `
            <div>
                <div style="transform: rotate(${heading}deg); width: 30px; height: 30px;">
                    ${airplaneSvg}
                </div>
                ${statsHtml}
            </div>
        `,
        className: "bg-transparent",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    });
};

interface AircraftMarkerProps {
    aircraft: AircraftData;
    onAircraftClick: (audioSrc: string) => void;
}

export function AircraftMarker(props: Readonly<AircraftMarkerProps>) {
    const icon = createAircraftIcon(props.aircraft);

    const handleMarkerClick = () => {
        props.onAircraftClick("/technologia.mp3");
    };

    return (
        <Marker
            position={props.aircraft.position}
            icon={icon}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        ></Marker>
    );
}
