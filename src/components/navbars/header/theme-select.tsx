"use client"

import { motion, AnimatePresence } from "motion/react"
import LightIcon from "@/components/icons/sun-light";
import MoonIcon from "@/components/icons/moon-dark";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { toggleTheme } from "@/redux/slices/theme-slice";
import { useEffect } from "react";

export default function ThemeSelect() {
    const theme = useAppSelector(state => state.theme.mode);
    const dispatch = useAppDispatch()

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark")
    }, [theme])

    return (
        <div
            className="flex items-center justify-center w-[80px] h-[30px] text-white sm:text-neutral-800 rounded-2xl sm:bg-white/60 backdrop-blur-md border border-neutral-300 gap-1.5 px-2.5 py-1 hover:text-[#8b5cf6] hover:border-[#e4e0f1] cursor-pointer"
            onClick={() => dispatch(toggleTheme())}
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.8 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="flex items-center gap-2"
                    >
                        <MoonIcon className="w-4 h-4" />
                        <span>dark</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="light"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.8 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="flex items-center gap-2"
                    >
                        <LightIcon className="w-6 h-6 " />
                        <span>light</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    )
}