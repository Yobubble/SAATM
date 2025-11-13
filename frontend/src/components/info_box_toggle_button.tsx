interface InfoBoxToggleButtonProps {
    showInfoBox: boolean;
    onToggle: () => void;
}

export function InfoBoxToggleButton(
    props: Readonly<InfoBoxToggleButtonProps>
) {
    return (
        <button
            onClick={props.onToggle}
            className="w-[150px] py-2 px-4 text-base cursor-pointer bg-white text-blue-500 hover:bg-blue-500 transition-colors hover:text-white border-none rounded-xl shadow-md z-50"
        >
            {props.showInfoBox ? "Hide Info Boxes" : "Show Info Boxes"}
        </button>
    );
}

