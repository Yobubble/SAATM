// frontend/src/components/radio_transcript.tsx

import { useEffect, useRef } from "react";
import { TranscriptMessage } from "../utils/types";

// Added props for start/stop functionality
type RadioTranscriptProps = {
    messages: TranscriptMessage[];
    onStart: () => void;
    onStop: () => void;
};

export const RadioTranscript = ({
    messages,
    onStart,
    onStop,
}: RadioTranscriptProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // This effect runs every time a new message is added,
    // and it automatically scrolls the box to the bottom.
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="h-48 w-80 bg-black bg-opacity-50 rounded-lg p-2 flex flex-col gap-2">
            <h3 className="text-white text-sm font-bold border-b border-gray-500 pb-1">
                Radio Transcript
            </h3>

            {/* Start and Stop buttons */}
            <div className="flex gap-2">
                <button
                    onClick={onStart}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-2 rounded"
                >
                    Start
                </button>
                <button
                    onClick={onStop}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded"
                >
                    Stop
                </button>
            </div>

            <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto pr-1 h-full"
            >
                <ul className="flex flex-col gap-1.5">
                    {messages.map((msg, index) => (
                        <li
                            key={`${msg.timestamp}-${index}`}
                            className="text-white text-xs"
                        >
                            <span className="text-gray-400">
                                [{msg.timestamp.toFixed(2)}
                                {"]: "}
                            </span>
                            {msg.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};