"use client";

import { useEffect, useState } from "react";

interface CheckmarkProps {
    show: boolean;
    duration?: number;
}

export default function Checkmark({ show, duration = 1200 }: CheckmarkProps) {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        setVisible(show);
        if (show) {
            const timer = setTimeout(() => setVisible(false), duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration]);

    if (!visible) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl">
            <svg
                className="w-16 h-16 text-green-500"
                viewBox="0 0 52 52"
            >
                <circle
                    className="stroke-current stroke-2 fill-none opacity-70"
                    cx="26"
                    cy="26"
                    r="25"
                />
                <path
                    className="stroke-current stroke-2 fill-none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="48"
                    strokeDashoffset="48"
                    d="M14 27l7 7 17-17"
                >
                    <animate
                        attributeName="stroke-dashoffset"
                        from="48"
                        to="0"
                        dur="0.6s"
                        fill="freeze"
                    />
                </path>
            </svg>
        </div>
    );
}
