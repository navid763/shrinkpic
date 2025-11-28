"use client"

export type ResizeStrategy =
    | "original"           // Keep original dimensions
    | "max-width"          // Set max width, maintain aspect ratio
    | "max-height"         // Set max height, maintain aspect ratio
    | "max-dimension"      // Set max for longest side
    | "fixed"              // Fixed dimensions (may distort)
    | "fit-inside"         // Fit inside box, maintain aspect ratio
    | "cover";             // Cover box, may crop

interface ResizeStrategyProps {
    strategy: ResizeStrategy;
    strategySetter: (strategy: ResizeStrategy) => void;
    maxWidth: number | "";
    maxHeight: number | "";
    maxWidthSetter: (width: number | "") => void;
    maxHeightSetter: (height: number | "") => void;
    multiImage: boolean; // Show different UI for multi-image
}

export default function ResizeStrategySelector({
    strategy,
    strategySetter,
    maxWidth,
    maxHeight,
    maxWidthSetter,
    maxHeightSetter,
    multiImage
}: ResizeStrategyProps) {

    const strategies = [
        {
            value: "original" as ResizeStrategy,
            label: "Keep Original Size",
            description: "Compress only, don't resize",
            icon: "📐",
            needsDimensions: false
        },
        {
            value: "max-width" as ResizeStrategy,
            label: "Max Width",
            description: "Limit width, keep aspect ratio",
            icon: "↔️",
            needsDimensions: "width"
        },
        {
            value: "max-height" as ResizeStrategy,
            label: "Max Height",
            description: "Limit height, keep aspect ratio",
            icon: "↕️",
            needsDimensions: "height"
        },
        {
            value: "max-dimension" as ResizeStrategy,
            label: "Max Longest Side",
            description: "Limit longest side (width or height)",
            icon: "📏",
            needsDimensions: "single"
        },
        {
            value: "fit-inside" as ResizeStrategy,
            label: "Fit Inside Box",
            description: "Fit within dimensions, keep aspect ratio",
            icon: "🖼️",
            needsDimensions: "both"
        }
    ];

    return (
        <div className="mb-6 space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-[#b4a7d6]">
                {multiImage ? "Resize Strategy" : "Resize Mode"}
            </label>

            {/* Strategy selector */}
            <select
                value={strategy}
                onChange={(e) => strategySetter(e.target.value as ResizeStrategy)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-[#2d2142] bg-white dark:bg-[#1a1229] text-gray-800 dark:text-[#8b7fb8] rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:focus:ring-[#f0abfc] outline-none cursor-pointer"
            >
                {strategies.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.icon} {s.label}
                    </option>
                ))}
            </select>

            {/* Description */}
            <p className="text-xs text-gray-500 dark:text-[#b4a7d6]">
                {strategies.find(s => s.value === strategy)?.description}
            </p>

            {/* Dimension inputs based on strategy */}
            {strategy !== "original" && (
                <div className="space-y-2 mt-3">
                    {/* Max Width input */}
                    {(strategy === "max-width" || strategy === "fit-inside") && (
                        <div>
                            <label className="text-xs text-gray-600 dark:text-[#b4a7d6] mb-1 block">
                                Max Width (px)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 1920"
                                value={maxWidth}
                                onChange={(e) => maxWidthSetter(e.target.value ? Number(e.target.value) : "")}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-[#2d2142] bg-white dark:bg-[#1a1229] rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </div>
                    )}

                    {/* Max Height input */}
                    {(strategy === "max-height" || strategy === "fit-inside") && (
                        <div>
                            <label className="text-xs text-gray-600 dark:text-[#b4a7d6] mb-1 block">
                                Max Height (px)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 1080"
                                value={maxHeight}
                                onChange={(e) => maxHeightSetter(e.target.value ? Number(e.target.value) : "")}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-[#2d2142] bg-white dark:bg-[#1a1229] rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </div>
                    )}

                    {/* Max Dimension input (for longest side) */}
                    {strategy === "max-dimension" && (
                        <div>
                            <label className="text-xs text-gray-600 dark:text-[#b4a7d6] mb-1 block">
                                Max Dimension (px)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 2000"
                                value={maxWidth}
                                onChange={(e) => maxWidthSetter(e.target.value ? Number(e.target.value) : "")}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-[#2d2142] bg-white dark:bg-[#1a1229] rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </div>
                    )}

                    {/* Quick presets */}
                    <div className="flex gap-2 flex-wrap mt-2">
                        <button
                            onClick={() => strategy === "max-dimension" ? maxWidthSetter(1920) : (maxWidthSetter(1920), maxHeightSetter(1080))}
                            className="px-3 py-1 text-xs bg-violet-100 dark:bg-[#2d2142] text-violet-700 dark:text-[#a78bfa] rounded-full hover:bg-violet-200 dark:hover:bg-[#3d2f52]"
                        >
                            Full HD (1920)
                        </button>
                        <button
                            onClick={() => strategy === "max-dimension" ? maxWidthSetter(1280) : (maxWidthSetter(1280), maxHeightSetter(720))}
                            className="px-3 py-1 text-xs bg-violet-100 dark:bg-[#2d2142] text-violet-700 dark:text-[#a78bfa] rounded-full hover:bg-violet-200 dark:hover:bg-[#3d2f52]"
                        >
                            HD (1280)
                        </button>
                        <button
                            onClick={() => strategy === "max-dimension" ? maxWidthSetter(800) : (maxWidthSetter(800), maxHeightSetter(600))}
                            className="px-3 py-1 text-xs bg-violet-100 dark:bg-[#2d2142] text-violet-700 dark:text-[#a78bfa] rounded-full hover:bg-violet-200 dark:hover:bg-[#3d2f52]"
                        >
                            Web (800)
                        </button>
                    </div>
                </div>
            )}

            {/* Visual explanation for multi-image */}
            {multiImage && strategy !== "original" && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                        <span className="text-blue-500 dark:text-blue-400 text-lg">ℹ️</span>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            {strategy === "max-width" && "All images will have the same width. Height will adjust to maintain aspect ratio."}
                            {strategy === "max-height" && "All images will have the same height. Width will adjust to maintain aspect ratio."}
                            {strategy === "max-dimension" && "Ensures no image exceeds this dimension. Smaller images stay original size."}
                            {strategy === "fit-inside" && "All images will fit within the box. Aspect ratios preserved."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}