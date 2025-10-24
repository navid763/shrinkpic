"use client"

import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

type dimensionHandler = (value: number | "") => void;

interface DimensionsControlProps {
    height: number | "";
    width: number | "";
    heightSetter: dimensionHandler;
    widthSetter: dimensionHandler
}

export default function DimensionsControl({ heightSetter, widthSetter, height, width }: DimensionsControlProps) {
    const state = useAppSelector(state => state.image);

    const [maitainAspectRatio, setMaitainAspectRatio] = useState(true)

    const aspectRatio = (state.width && state.height) ? (state.width / state.height) : null;

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            widthSetter("");
            heightSetter("");

            return
        }

        const width = Number(value)
        const height = aspectRatio ? Math.round(width / aspectRatio) : "";

        widthSetter(width);
        if (maitainAspectRatio) heightSetter(height)
    }

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            heightSetter("");
            widthSetter("");

            return
        }

        const height = Number(value);
        const width = aspectRatio ? Math.round(height * aspectRatio) : "";

        heightSetter(height)
        if (maitainAspectRatio) widthSetter(width);
    }

    const handleMaintainAspectRatio = () => {
        setMaitainAspectRatio(!maitainAspectRatio);
        heightSetter("")
        widthSetter("")
    }

    useEffect(() => {
        if (!state.url) {
            heightSetter("");
            widthSetter("")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Dimensions
            </label>
            <div className="space-y-3">
                <div>
                    <input
                        type="number"
                        placeholder="Width"
                        value={width}
                        onChange={handleWidthChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Height"
                        value={height}
                        onChange={handleHeightChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                    />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        defaultChecked={maitainAspectRatio}
                        onChange={() => handleMaintainAspectRatio()}
                        className="w-4 h-4 text-violet-500 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <span className="text-sm text-gray-700">
                        Maintain aspect ratio
                    </span>
                </label>
            </div>

        </div>
    )
}