"use client"

import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";

export default function Preview() {
    const state = useAppSelector(state => state.image);
    const aspectRatio = (state.width && state.height) ? (state.width / state.height) : null;

    return (
        <div className="lg:col-span-2 sm:order-2">
            <div className="bg-white rounded-2xl p-6 border border-purple-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
                {state.url
                    ? <Image src={state.url} alt="" width={720} height={720} quality={50} />
                    : <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center min-h-96">
                        <div className="text-center text-gray-400">
                            <svg
                                className="w-24 h-24 mx-auto mb-4 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <p className="text-lg">Your image preview will appear here</p>
                        </div>
                    </div>

                }
                {state.height && state.width &&
                    <div className="mt-4 text-center text-sm text-gray-600">
                        {state.width} × {state.height} pixels
                    </div>}
            </div>
        </div>
    )
}