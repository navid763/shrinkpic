export default function Footer() {

    return (
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
            <div className="bg-white rounded-2xl px-8 pt-8 pb-4 border border-purple-100 dark:bg-[#1a1229] dark:border-purple-900/50">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-[#e4e0f1] mb-3">
                            💡 Pro Tips
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-[#b4a7d6]">
                            <li className="flex items-start gap-2">
                                <span className="text-violet-500 mt-1">•</span>
                                <span>Start with 80% quality for optimal balance</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-violet-500 mt-1">•</span>
                                <span>Enable aspect ratio lock to prevent distortion</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-violet-500 mt-1">•</span>
                                <span>For web use, 1920 px width is usually sufficient</span>
                            </li>
                        </ul>

                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-[#e4e0f1] mb-3">
                            🔒 Privacy First
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed dark:text-[#b4a7d6]">
                            All image processing happens directly in your browser. Your images
                            are never uploaded to any server, ensuring complete privacy and
                            security. Everything stays on your device.
                        </p>

                    </div>

                    <p className="text-xs text-gray-500 sm:text-center mt-4 dark:text-[#8b7fb8]">
                        Built by <a className="text-violet-600 font-semibold dark:text-[#baace2]" href="mailto:navidrahmati763@gmail.com">Navid Rahmati</a>
                    </p>

                </div>
            </div>
        </footer>
    )
}