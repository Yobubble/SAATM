import React, { useState } from "react";

interface FlightSearchProps {
    onSearch: (flightId: string) => void;
}

export const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
    const [flightId, setFlightId] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(flightId);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={flightId}
                onChange={(e) => setFlightId(e.target.value)}
                placeholder="Enter Flight ID"
                className="p-2 rounded-2xl bg-white drop-shadow-2xl text-blue-500"
            />
            <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-2xl drop-shadow-2xl"
            >
                Search
            </button>
        </form>
    );
};
