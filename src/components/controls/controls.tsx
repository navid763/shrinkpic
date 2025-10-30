"use client"

import TicIcon from "../icons/tic";
import DimensionsControl from "./dimensions-control";
import QualitySlider from "./quality-slider";
import { useState, useCallback, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import Downloadicon from "../icons/download";
import FileInfo from "./file-info";
import { ToastContainer, toast } from "react-toastify";
import { ImageProcessingService, ProcessedImageResult } from "@/services/browser-image-compression/image-processing.service";
import Spinner from "../spinner/spinner";

export default function Controls() {

    const images = useAppSelector(state => state.images);

    const [height, setHeight] = useState<number | "">("");
    const [width, setWidth] = useState<number | "">("");
    const [quality, setQuality] = useState(80);
    const [compressionResult, setCompressionResult] = useState<ProcessedImageResult | null>(null)
    const [loading, setLoading] = useState(false);

    const handleHeight = useCallback((height: number | "") => {
        setHeight(height);
    }, []);

    const handleWidth = useCallback((width: number | "") => {
        setWidth(width);
    }, []);

    const handleQuality = useCallback((quality: number) => {
        setQuality(quality);
    }, []);


    const anyControlIsNotSet = (!quality || !width || !height);

    async function applyChanges() {
        if (images.length !== 0) {
            if (anyControlIsNotSet) {
                toast.warn("please set dimensions or quality for selected image");
                return
            }



            if (images.length === 1) {
                setLoading(true);
                const image = images[0];
                const result = await ImageProcessingService.processImage({
                    url: image.url,
                    quality: quality,
                    targetHeight: height,
                    targetWidth: width,
                    name: image.name

                });

                setCompressionResult(result)
                setLoading(false)
            }
        }

    };

    const handleDownload = () => {
        if (compressionResult) {
            const a = document.createElement("a");
            a.href = compressionResult.url;
            a.download = compressionResult.compressedName; // the downloaded file name
            a.click();
        }
    }

    useEffect(() => {
        if (images.length === 0) {
            setCompressionResult(null)
        }
    }, [images])

    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl bg-white p-6 border border-purple-100">
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

                <div
                    className={`w-full   mt-4 text-white font-medium py-2 px-4 rounded-lg flex  items-center justify-center cursor-pointer ${(!anyControlIsNotSet && images.length === 1) ? "bg-violet-500 hover:bg-violet-600 transition-colors" : "bg-violet-300"} ${loading ? "gap-4" : "gap-2"}`}
                    onClick={applyChanges}
                >
                    {loading ? <Spinner size={2} className="mb-3" /> : <TicIcon />}
                    Apply Resize
                </div>
                {images.length > 1 && <div className="w-full flex justify-center"><span className="w-[90%] self-center text-center text-xs text-white bg-fuchsia-950 rounded-md mt-1.5">Multi-image editing is coming soon ✨</span></div>
                }

                {compressionResult &&
                    <FileInfo originalSize={compressionResult.originalSizeKB} compressedSize={compressionResult.compressedSizeKB} savedPercentage={compressionResult.savedPercentage} />}
            </div>

            <button
                className={`w-full ${compressionResult ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600" : "bg-fuchsia-300"}  text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center cursor-pointer gap-2 shadow-lg shadow-violet-200`}
                onClick={handleDownload}
            >
                <Downloadicon />
                Download Image
            </button>


            <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="colored"
            />
        </div>
    )
}