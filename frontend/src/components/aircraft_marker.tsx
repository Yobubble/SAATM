import { Marker } from "react-leaflet";
import L from "leaflet";
import { AircraftData } from "../utils/types";
import { renderToStaticMarkup } from "react-dom/server";
import { FaPlaneUp } from "react-icons/fa6";

const airplaneSvg = renderToStaticMarkup(<FaPlaneUp size={15} color="blue" />);

const createAircraftIcon = (aircraft: AircraftData, showInfo: boolean) => {
    const { track, flight, gs, alt_baro, hex } = aircraft;
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
            <strong>Hex:</strong> ${hex} <br />
            <strong>ID:</strong> ${flight} <br />
            <strong>Speed:</strong> ${gs} knots <br />
            <strong>Altitude:</strong> ${alt_baro} ft <br />
            <strong>Heading:</strong> ${track}°
        </div>
    `;

    return new L.DivIcon({
        html: `
            <div>
                <div style="transform: rotate(${track}deg); width: 30px; height: 30px;">
                    ${airplaneSvg}
                </div>
                ${showInfo ? statsHtml : ""}
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
    showInfo: boolean;
}

export function AircraftMarker(props: Readonly<AircraftMarkerProps>) {
    const icon = createAircraftIcon(props.aircraft, props.showInfo);
    const laLong: [number, number] = [props.aircraft.lat, props.aircraft.lon];

    const handleMarkerClick = () => {
        props.onAircraftClick("/technologia.mp3");
    };

    return (
        <Marker
            position={laLong}
            icon={icon}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        ></Marker>
    );
}
