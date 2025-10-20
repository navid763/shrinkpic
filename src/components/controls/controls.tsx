export default function Controls() {

    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {/* Quality Slider */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Quality: <span className="text-violet-600">80%</span>
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={100}
                        defaultValue={80}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Smaller</span>
                        <span>Better Quality</span>
                    </div>
                </div>
                {/* Dimensions */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Dimensions
                    </label>
                    <div className="space-y-3">
                        <div>
                            <input
                                type="number"
                                placeholder="Width"
                                defaultValue={1920}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                placeholder="Height"
                                defaultValue={1080}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                defaultChecked={false}
                                className="w-4 h-4 text-violet-500 border-gray-300 rounded focus:ring-violet-500"
                            />
                            <span className="text-sm text-gray-700">
                                Maintain aspect ratio
                            </span>
                        </label>
                    </div>
                    <button className="w-full mt-3 bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Apply Resize
                    </button>
                </div>
                {/* File Info */}
                <div className="space-y-3 pt-6 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Original:</span>
                        <span className="font-medium text-gray-800">2.5 MB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compressed:</span>
                        <span className="font-medium text-green-600">450 KB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Saved:</span>
                        <span className="font-medium text-violet-600">82%</span>
                    </div>
                </div>
            </div>
            {/* Download Button */}
            <button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-200">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                Download Image
            </button>
        </div>
    )
}