"use client"

interface QualitySliderProps {
    quality: number;
    qualitySetter: (quakity: number) => void
}

export default function QualitySlider({ quality, qualitySetter }: QualitySliderProps) {

    const handleQuality = (e: React.ChangeEvent<HTMLInputElement>) => {
        qualitySetter(Number(e.target.value));
    }

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Quality: <span className="text-violet-600">{quality}%</span>
            </label>
            <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(handleQuality)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller</span>
                <span>Better Quality</span>
            </div>

        </div>
    )
}
