"use client";

import { motion, AnimatePresence } from "motion/react";
import LightIcon from "@/components/icons/sun-light";
import MoonIcon from "@/components/icons/moon-dark";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { toggleTheme } from "@/redux/slices/theme-slice";
import { useEffect, useState } from "react";

export default function ThemeSelect() {
    const theme = useAppSelector((state) => state.theme.mode);
    const dispatch = useAppDispatch();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (theme === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [theme]);


    if (!mounted) {  // Placeholder before hydration
        return (
            <div
                className="flex items-center justify-center w-[80px] h-[30px] rounded-2xl sm:bg-white/75 border border-neutral-100 dark:border-0 dark:bg-[#2e2243]"
                aria-hidden
            />
        );
    }

    return (
        <motion.div
            className="flex items-center justify-center w-[80px] h-[30px] text-white sm:text-neutral-800 rounded-2xl sm:bg-white/75 backdrop-blur-md border border-neutral-300 gap-1.5 px-2.5 py-1 sm:hover:text-[#8b5cf6] hover:border-[#e4e0f1] cursor-pointer"
            onClick={() => dispatch(toggleTheme())}

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.8 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
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
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="flex items-center gap-2"
                    >
                        <LightIcon className="w-6 h-6" />
                        <span>light</span>

                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
