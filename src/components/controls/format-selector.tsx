"use client"
import { Formats } from "./controls";
import { useAppSelector } from "@/redux/hooks";
import { ImageProcessingService } from "@/services/browser-image-compression/image-processing.service";

interface FormatSelectorProps {
    format: Formats;
    formatSetter: (frm: Formats) => void
}

export default function FormatSelector({ format, formatSetter }: FormatSelectorProps) {
    const images = useAppSelector(state => state.images);

    const originalFormat = images.length > 0 ? ImageProcessingService.nameSplitter(images[0].name).suffix : "jpg";

    const HandleValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as Formats | "original";

        if (value === "original") {
            formatSetter(originalFormat as Formats);
            return;
        }

        formatSetter(value);
    };

    return (
        <div className="w-full flex justify-evenly items-center text-sm mt-2 relative">
            <label className="text-gray-700 dark:text-[#b4a7d6] font-medium">
                Select Download Format :
            </label>
            <select
                className="w-[40%] border border-gray-300 dark:border-[#2d2142] bg-white dark:bg-[#1a1229] text-gray-800 dark:text-[#8b7fb8] rounded-lg text-center py-2 px-5 focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:focus:ring-[#f0abfc] outline-none cursor-pointer"
                value={format}
                onChange={HandleValue}
            >
                <option value="original" className="bg-white dark:bg-[#1a1229]">Original</option>
                <option value="jpg" className="bg-white dark:bg-[#1a1229]">JPG</option>
                <option value="png" className="bg-white dark:bg-[#1a1229]">PNG</option>
                <option value="webp" className="bg-white dark:bg-[#1a1229]">WEBP</option>
            </select>
            {format === "png" &&
                <span className="text-xs text-red-500 py-1 absolute top-[100%]">Converting photos to PNG may increase the file size</span>
            }
        </div>
    )
}