"use client"


import TicIcon from "../icons/tic";
import DimensionsControl from "./dimensions-control";
import QualitySlider from "./quality-slider";
import { useState, useCallback } from "react";
import { useAppSelector } from "@/redux/hooks";
import Downloadicon from "../icons/download";
import FileInfo from "./file-info";

export default function Controls() {
    const fileSize = useAppSelector(state => state.image.size ?? null);

    const [height, setHeight] = useState<number | "">("");
    const [width, setWidth] = useState<number | "">("");
    const [quality, setQuality] = useState(80);

    const handleHeight = useCallback((height: number | "") => {
        setHeight(height);
    }, []);

    const handleWidth = useCallback((width: number | "") => {
        setWidth(width);
    }, []);

    const handleQuality = useCallback((quality: number) => {
        setQuality(quality);
    }, []);

    return (
        <div className="lg:col-span-1 space-y-6">
            <div className=" rounded-2xl bg-white p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-neutral-500">Settings</h2>
                </div>

                <DimensionsControl
                    heightSetter={handleHeight}
                    widthSetter={handleWidth}
                    height={height}
                    width={width}
                />

                <QualitySlider qualitySetter={handleQuality} quality={quality} />

                <button className="w-full mt-4 bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center cursor-pointer gap-2">
                    <TicIcon />
                    Apply Resize
                </button>

                <FileInfo fileSize={fileSize} />
            </div>


            <button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center cursor-pointer gap-2 shadow-lg shadow-violet-200">
                <Downloadicon />
                Download Image
            </button>
        </div>
    )
}