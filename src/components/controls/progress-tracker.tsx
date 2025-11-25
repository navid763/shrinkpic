"use client"

interface ProgressTrackerProps {
    current: number;
    total: number;
    stage: "preparing" | "uploading" | "processing" | "complete";
    uploadProgress?: number; // 0-100
}

export default function ProgressTracker({ current, total, stage, uploadProgress }: ProgressTrackerProps) {
    const percentage = Math.round((current / total) * 100);

    const stageText = {
        preparing: "Preparing images...",
        uploading: "Uploading to server...",
        processing: "Processing images...",
        complete: "Complete!"
    };

    const stageEmoji = {
        preparing: "📦",
        uploading: "⬆️",
        processing: "⚙️",
        complete: "✅"
    };

    return (
        <div className="mt-4 space-y-3">
            {/* Stage indicator */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-[#b4a7d6] flex items-center gap-2">
                    <span className="text-xl">{stageEmoji[stage]}</span>
                    {stageText[stage]}
                </span>
                <span className="font-semibold text-violet-600 dark:text-[#a78bfa]">
                    {current}/{total}
                </span>
            </div>

            {/* Processing progress bar */}
            <div className="w-full bg-gray-200 dark:bg-[#2d2142] rounded-full h-3 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Upload progress bar (only shown during upload) */}
            {stage === "uploading" && uploadProgress !== undefined && (
                <>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-[#8b7fb8]">
                        <span>Upload progress</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-[#2d2142] rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-blue-500 h-full transition-all duration-150"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </>
            )}

            {/* Percentage display */}
            <div className="text-center">
                <span className="text-2xl font-bold text-violet-600 dark:text-[#a78bfa]">
                    {percentage}%
                </span>
            </div>
        </div>
    );
}