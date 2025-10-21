"use client"

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { emptyImage } from "@/redux/slices/image-slice";

import Image from "next/image";
import { useState } from "react";
import ImageRemovePopUp from "./popUp";

export default function Preview() {
    const state = useAppSelector(state => state.image);
    const [popUp, setPopUp] = useState(false);
    const dispatch = useAppDispatch();

    const handleAccept = () => {
        dispatch(emptyImage());
        setPopUp(false);
    }
    const handleRject = () => {
        setPopUp(false);
    }

    return (
        <div className="lg:col-span-2 sm:order-2">
            <div className="bg-white rounded-2xl p-6 border border-purple-100">
                <div className="w-full flex justify-between relative px-4">
                    <h2 className="sm:text-lg font-semibold text-neutral-500 mb-4">Preview</h2>

                    {state.url &&
                        <button
                            className="bg-gradient-to-r from-[#ec008c] to-[#fc6767] text-white text-xs sm:text-sm cursor-pointer rounded-2xl h-8 sm:h-10 px-2 py-0"
                            onClick={() => setPopUp(true)}
                        >
                            Remove</button>
                    }
                    {popUp &&
                        <ImageRemovePopUp accept={handleAccept} reject={handleRject} />
                    }
                </div>
                {state.url
                    ? <Image src={state.url} alt="" width={720} height={720} quality={50} className="rounded-lg" />
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