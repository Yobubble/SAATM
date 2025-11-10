interface BgToggleButtonProps {
    isOSM: boolean;
    onToggle: () => void;
}

export function AirRouteToggleButton(props: Readonly<BgToggleButtonProps>) {
    return (
        <button
            onClick={props.onToggle}
            className="w-full  py-2 px-4 text-base cursor-pointer bg-white text-blue-500 hover:bg-blue-500 transition-colors hover:text-white border-none  rounded-xl shadow-md z-50"
        >
            {props.isOSM ? "Show Air Route" : "Hide Air Route"}
        </button>
    );
}
