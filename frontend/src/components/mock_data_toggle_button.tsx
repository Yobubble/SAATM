interface MockDataToggleButtonProps {
    useMockData: boolean;
    onToggle: () => void;
}

export function MockDataToggleButton(
    props: Readonly<MockDataToggleButtonProps>
) {
    return (
        <button
            onClick={props.onToggle}
            className="w-[150px]  py-2 px-4 text-base cursor-pointer bg-white text-blue-500 hover:bg-blue-500 transition-colors hover:text-white border-none rounded-xl shadow-md z-50"
        >
            {props.useMockData ? "Use Real API" : "Use Mock Data"}
        </button>
    );
}
