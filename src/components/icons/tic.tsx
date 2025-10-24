import React from "react";

interface DoneIconProps {
    className?: string;
}

const TicIcon: React.FC<DoneIconProps> = ({ className }) => {
    return (
        <svg
            className={className || "w-4 h-4"}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
};

export default TicIcon;
