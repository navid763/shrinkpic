"use client"

import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify"

type dimensionHandler = (value: number | "") => void;

interface DimensionsControlProps {
    height: number | "";
    width: number | "";
    heightSetter: dimensionHandler;
    widthSetter: dimensionHandler
    minDimension: number
}

export default function DimensionsControl({ heightSetter, widthSetter, height, width, minDimension }: DimensionsControlProps) {
    const toastStyle = { style: { background: "#FCB53B", color: "#fff", borderRadius: "10px", fontWeight: "500" } }

    const state = useAppSelector(state => state.images);

    const [maintainAspectRatio, setMaitnainAspectRatio] = useState(true);
    const [danger, setDanger] = useState({ width: false, height: false });

    const aspectRatio = useMemo(() => {
        if (!state.length || !state[0].width || !state[0].height) return null;
        return state[0].width / state[0].height;
    }, [state]);


    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (state.length === 0) {
            toast.info("upload an image(s) first");
            return
        }

        setDanger(prev => {
            return { ...prev, width: false }
        });


        const value = e.target.value;
        if (value === "") {
            widthSetter("");
            heightSetter("");

            return
        }

        const width = Number(value);
        const height = aspectRatio ? Math.round(width / aspectRatio) : "";

        widthSetter(width);
        if (maintainAspectRatio) heightSetter(height)
    }

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (state.length === 0) {
            toast.info("upload an image(s) first");
            return
        }

        setDanger(prev => {
            return { ...prev, height: false }
        });


        const value = e.target.value;
        if (value === "") {
            heightSetter("");
            widthSetter("");

            return
        }

        const height = Number(value);
        const width = aspectRatio ? Math.round(height * aspectRatio) : "";

        heightSetter(height)
        if (maintainAspectRatio) widthSetter(width);
    }

    const handleMaintainAspectRatio = () => {
        if (!maintainAspectRatio) { // only when the maintainAspectRatio is off and user tries to turn it on, reset dimensions
            heightSetter("")
            widthSetter("")
        }
        setMaitnainAspectRatio(!maintainAspectRatio); // toggle the maintainAspectRatio

    }

    const handleBlurWidth = (dimension: number | ""): void => {
        if (state.length > 0 && dimension) {
            if (dimension < minDimension) {
                widthSetter("");
                setDanger(prev => {
                    return { ...prev, width: true }
                });
                toast.info(`WIDTH must be at least ${minDimension}px`, toastStyle);
            } else {
                setDanger({ height: false, width: false })
            }
        }
    };

    const handleBlurHeight = (dimension: number | ""): void => {
        if (state.length > 0 && dimension) {
            if (dimension < minDimension) {
                heightSetter("");
                setDanger(prev => {
                    return { ...prev, height: true }
                });
                toast.info(`HEIGHT must be at least ${minDimension}px`, toastStyle);
            } else {
                setDanger({ height: false, width: false })
            }
        }
    }

    useEffect(() => {
        if (state.length === 0) {
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
                        onBlur={() => handleBlurWidth(width)}
                        className={`w-full px-4 py-2 border ${danger.width ? "border-red-400" : "border-gray-300 focus:ring-violet-500 focus:border-transparent"}  rounded-lg focus:ring-2  outline-none`}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Height"
                        value={height}
                        onChange={handleHeightChange}
                        onBlur={() => handleBlurHeight(height)}
                        className={`w-full px-4 py-2 border ${danger.height ? "border-red-400" : "border-gray-300 focus:ring-violet-500 focus:border-transparent"}  rounded-lg focus:ring-2  outline-none`}
                    />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={maintainAspectRatio}
                        onChange={handleMaintainAspectRatio}
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