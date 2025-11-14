// frontend/src/components/radio_transcript.tsx

import { useEffect, useRef } from "react";
import { TranscriptMessage } from "../utils/types";

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
        <div className="h-48 w-96 bg-white rounded-lg p-2 flex flex-col gap-2 shadow-md">
            <h3 className="text-black text-sm font-bold border-b border-gray-300 pb-1">
                Radio Transcript
            </h3>

            <div className="flex gap-2">
                <button
                    onClick={onStart}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded"
                >
                    Start
                </button>
                <button
                    onClick={onStop}
                    className="flex-1 bg-white hover:bg-gray-100 text-black border border-gray-300 text-xs font-bold py-1 px-2 rounded"
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
                            className="text-black text-xs"
                        >
                            <span className="text-gray-500">
                                [{msg.timestamp}
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