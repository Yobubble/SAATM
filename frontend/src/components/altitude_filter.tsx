interface AltitudeFilterProps {
    minAltitude: number | null;
    maxAltitude: number | null;
    onMinChange: (value: number | null) => void;
    onMaxChange: (value: number | null) => void;
}

export function AltitudeFilter({
    minAltitude,
    maxAltitude,
    onMinChange,
    onMaxChange,
}: Readonly<AltitudeFilterProps>) {
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            onMinChange(null);
        } else {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value)) {
                onMinChange(value);
            }
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            onMaxChange(null);
        } else {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value)) {
                onMaxChange(value);
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-4 z-50 min-w-[280px]">
            <h3 className="text-base font-semibold text-gray-700 mb-3">
                Altitude Filter
            </h3>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 min-w-[60px]">
                        Min (ft):
                    </label>
                    <input
                        type="number"
                        value={minAltitude === null ? "" : minAltitude}
                        onChange={handleMinChange}
                        placeholder="Min altitude"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 min-w-[60px]">
                        Max (ft):
                    </label>
                    <input
                        type="number"
                        value={maxAltitude === null ? "" : maxAltitude}
                        onChange={handleMaxChange}
                        placeholder="Max altitude"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">
                        Current Range:
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                        {minAltitude === null && maxAltitude === null
                            ? "No filter"
                            : minAltitude === null
                            ? `≤ ${maxAltitude?.toLocaleString()} ft`
                            : maxAltitude === null
                            ? `≥ ${minAltitude.toLocaleString()} ft`
                            : `${minAltitude.toLocaleString()} - ${maxAltitude.toLocaleString()} ft`}
                    </div>
                </div>
            </div>
        </div>
    );
}

