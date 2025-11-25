"use client"

import TicIcon from "../icons/tic";
import DimensionsControl from "./dimensions-control";
import QualitySlider from "./quality-slider";
import { useState, useCallback, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import Downloadicon from "../icons/download";
import FileInfo from "./file-info";
import { toast } from "react-toastify";
import { ImageProcessingService, ProcessedImageResult } from "@/services/browser-image-compression/image-processing.service";
import Spinner from "../spinner/spinner";
import Checkmark from "../other/checknark";
import FormatSelector from "./format-selector";
import { BatchProcessingService, BatchProcessingResults } from "@/services/multi-image-processing/batch-processing.service";
import ProgressTracker from "./progress-tracker";

export type Formats = "jpg" | "png" | "webp";
type ProcessingStage = "preparing" | "uploading" | "processing" | "complete";

export default function Controls() {
    const CHECKMARK_DURATION = 1200 //ms
    const MIN_DIMENSION = 50;

    const images = useAppSelector(state => state.images);

    const [height, setHeight] = useState<number | "">("");
    const [width, setWidth] = useState<number | "">("");
    const [quality, setQuality] = useState(80);
    const [format, setFormat] = useState<Formats>("jpg");
    const [compressionResult, setCompressionResult] = useState<ProcessedImageResult | null>(null)
    const [batchResults, setBatchResults] = useState<BatchProcessingResults[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [showCheckMark, setShowCheckMark] = useState(false);
    const [initialSettings, setInitialSettings] = useState<{ width: number | "", height: number | "", quality: number, format: string } | null>(null)

    const [processingStage, setProcessingStage] = useState<ProcessingStage>("preparing");
    const [processedCount, setProcessedCount] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleHeight = useCallback((height: number | "") => {
        setHeight(height);
    }, []);

    const handleWidth = useCallback((width: number | "") => {
        setWidth(width);
    }, []);

    const handleQuality = useCallback((quality: number) => {
        setQuality(quality);
    }, []);

    const handleFormat = useCallback((format: Formats) => {
        setFormat(format)
    }, []);

    const hasChanged = () => {
        if (!initialSettings) return true;
        return initialSettings.width !== width ||
            initialSettings.height !== height ||
            initialSettings.quality !== quality ||
            initialSettings.format !== format;
    };

    const anyControlIsNotSetSingle = (!quality || !width || !height);
    const anyControlIsNotSetMulti = (!quality || (!width && !height));

    async function applyChanges() {
        if (images.length !== 0) {

            if (!hasChanged()) {
                toast.info("No changes detected");
                return
            }

            if (images.length === 1) {
                if (anyControlIsNotSetSingle) return

                try {
                    setLoading(true);

                    const image = images[0];

                    const result = await ImageProcessingService.processImage({
                        url: image.url,
                        quality: quality,
                        targetHeight: height,
                        targetWidth: width,
                        name: image.name,
                        format: format

                    });

                    setCompressionResult(result);
                    setInitialSettings({ width: width as number, height: height as number, quality, format });

                } catch (error) {
                    toast.error("Error during proccessing the image. please try again");
                    console.error(error);
                } finally {
                    setLoading(false);
                    setShowCheckMark(true);
                }

            }

            if (images.length > 1) {
                if (anyControlIsNotSetMulti) return

                const imagesToProcess = images.map(img => {
                    return { url: img.url, name: img.name }
                });

                const options = {
                    images: imagesToProcess,
                    quality: quality,
                    width: width ? width : undefined,
                    height: height ? height : undefined,
                    format: format
                }

                try {
                    setLoading(true);
                    setProcessingStage("preparing");
                    setProcessedCount(0);
                    setUploadProgress(0);

                    const results = await BatchProcessingService.processBatch(
                        options,
                        {
                            onProgress: (current, total) => {
                                setProcessingStage("processing");
                                setProcessedCount(current);
                                console.log(`Processing: ${current}/${total}`);
                            },
                            onUploadProgress: (percentage) => {
                                setProcessingStage("uploading");
                                setUploadProgress(percentage);
                                console.log(`Upload: ${percentage}%`);
                            }
                        }
                    );
                    setProcessingStage("complete");
                    setBatchResults(results);
                    setInitialSettings({ width: width as number, height: height as number, quality, format });
                    toast.success(`Successfully processed ${results.length} images!`);

                } catch (err) {
                    console.error(err);
                    toast.error("Error during batch processing. Please try again");

                } finally {
                    setLoading(false);
                    setShowCheckMark(true);
                }
            }
        }

    };

    const handleDownload = () => {
        if (images.length === 1 && compressionResult) {
            const a = document.createElement("a");
            a.href = compressionResult.url;
            a.download = compressionResult.compressedName; // the downloaded file name
            a.click();
        }

        if (images.length > 1 && batchResults) {
            BatchProcessingService.downloadAsZip(batchResults, "compressed-images.zip")
        }
    }

    useEffect(() => {
        if (images.length === 0) {
            setCompressionResult(null);
            setBatchResults(null);
            setShowCheckMark(false);
            setInitialSettings(null);
            setProcessedCount(0);
            setUploadProgress(0);
        }
    }, [images]);

    useEffect(() => {
        if (showCheckMark) {
            const timer = setTimeout(() => setShowCheckMark(false), CHECKMARK_DURATION + 1);
            return () => clearTimeout(timer);
        }
    }, [showCheckMark]);


    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl bg-white dark:bg-[#1a1229] p-6 border border-purple-100 dark:border-[#2d2142] relative">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-neutral-500 dark:text-[#8b7fb8]">Settings</h2>
                </div>

                <DimensionsControl
                    heightSetter={handleHeight}
                    widthSetter={handleWidth}
                    height={height}
                    width={width}
                    minDimension={MIN_DIMENSION}
                />

                <QualitySlider qualitySetter={handleQuality} quality={quality} />

                <FormatSelector format={format} formatSetter={handleFormat} />

                <div
                    className={`w-full mt-7 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center ${((!anyControlIsNotSetSingle && images.length === 1) || (!anyControlIsNotSetMulti && images.length > 1)) ? "bg-violet-500 hover:bg-violet-600 transition-colors cursor-pointer" : "bg-violet-300"} ${loading ? "gap-4" : "gap-2"}`}
                    onClick={applyChanges}
                >
                    {loading ? <Spinner size={2} className="mb-3" /> : <TicIcon />}
                    Apply Resize
                </div>

                {loading && images.length > 1 && (
                    <ProgressTracker
                        current={processedCount}
                        total={images.length}
                        stage={processingStage}
                        uploadProgress={uploadProgress}
                    />
                )}


                {compressionResult && images.length === 1 && (
                    <FileInfo
                        originalSize={compressionResult.originalSizeKB}
                        compressedSize={compressionResult.compressedSizeKB}
                        savedPercentage={compressionResult.savedPercentage}
                    />
                )}


                {batchResults && images.length > 1 && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                            ✅ Processing Complete!
                        </h3>
                        <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <p>Processed: {batchResults.length} images</p>
                            <p>Total saved: {batchResults.reduce((acc, r) => acc + r.savedPercentage, 0) / batchResults.length}% average</p>
                        </div>
                    </div>
                )}

                <Checkmark show={showCheckMark} duration={CHECKMARK_DURATION} />
            </div>

            <button
                className={`w-full ${(compressionResult || batchResults) ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 cursor-pointer" : "bg-fuchsia-300"} text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2`}
                onClick={handleDownload}
            >
                <Downloadicon />
                {images.length > 1 ? "Download as ZIP" : "Download Image"}
            </button>
        </div>
    );
}