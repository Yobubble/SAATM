import React from "react";

interface StopFollowingButtonProps {
    onClick: () => void;
}

export const StopFollowingButton: React.FC<StopFollowingButtonProps> = ({
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="p-2 bg-red-500 text-white rounded-2xl"
        >
            Stop Following
        </button>
    );
};
