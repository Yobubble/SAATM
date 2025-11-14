// frontend/src/components/transcript_toggle_button.tsx

// This component provides a toggle button for showing/hiding the transcript.
// It is styled to be consistent with other toggle buttons in the UI.

type TranscriptToggleButtonProps = {
    showTranscript: boolean;
    onToggle: () => void;
};

export const TranscriptToggleButton = ({
    showTranscript,
    onToggle,
}: TranscriptToggleButtonProps) => {
    return (
        <button
            onClick={onToggle}
            className={`w-full h-10 px-4 py-2 rounded-full text-white font-bold transition-colors ${
                showTranscript
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
            Transcript: {showTranscript ? "ON" : "OFF"}
        </button>
    );
};