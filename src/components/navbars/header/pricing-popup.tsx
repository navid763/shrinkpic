"use client"
import { motion } from "motion/react";
import CloseIcon from "@/components/icons/close-x";

interface IPricingPopup {
    popUpHandler: (showPopUp: boolean) => void
}

export default function PricingPopup({ popUpHandler }: IPricingPopup) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-[100vw] h-[100vh] bg-black/60 fixed inset-0 z-40 flex items-center justify-center px-4"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className=" w-full max-w-md bg-gradient-to-br from-white to-purple-50 dark:from-[#1a1229] dark:to-[#251a35] rounded-3xl shadow-2xl overflow-hidden"
            >


                <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-12 text-center">

                    <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>

                    <div
                        onClick={() => popUpHandler(false)}
                        className="cursor-pointer w-fit absolute left-8 top-7"
                    >
                        <CloseIcon className="w-6 h-6 text-white " />
                    </div>


                    <motion.div
                        initial={{ rotate: -10, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-4"
                    >
                        <svg
                            className="w-15 h-15 sm:w-20 sm:h-20 text-white mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            />
                        </svg>
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl sm:text-4xl font-bold text-white mb-1"
                    >
                        {"It's all free!"}
                    </motion.h2>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-purple-100 text-base sm:text-lg"
                    >
                        No hidden costs, no subscriptions
                    </motion.p>
                </div>


                <div className="px-8 py-4">
                    <div className="sm:space-y-4 space-y-2">
                        {[
                            { icon: "✨", text: "Unlimited image compression" },
                            { icon: "🎨", text: "Resize as many images as you want" },
                            { icon: "🔒", text: "100% private - all in your browser" },
                            { icon: "⚡", text: "Lightning fast processing" }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center gap-3 text-gray-700 dark:text-[#b4a7d6]"
                            >
                                <span className="text-2xl">{feature.icon}</span>
                                <span className="text-sm sm:text-base">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>


                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="w-full mt-6 bg-gray-100 dark:bg-[#2d2142] text-gray-700 dark:text-[#b4a7d6] font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-[#3d2f52] transition-colors"
                        onClick={() => popUpHandler(false)}
                    >
                        Got it!
                    </motion.button>
                </div>

                {/* <div className="h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500"></div> */}
            </motion.div>
        </motion.div>
    );
}