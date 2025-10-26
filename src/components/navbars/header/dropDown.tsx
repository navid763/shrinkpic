"use client"

import { useEffect, useRef, useState } from "react";
import NavBar from "./navbar";
import MenuIcon from "@/components/icons/menu";
import { motion, AnimatePresence } from "framer-motion";

export default function DropDown() {
    const [drop, setDrop] = useState(false);
    const menuIconRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        function handleClickDown(e: MouseEvent) {
            if (menuIconRef.current && !menuIconRef.current.contains(e.target as Node)) {
                setDrop(false);
            }
        }

        if (drop) {
            document.addEventListener("mousedown", handleClickDown);
        } else {
            document.removeEventListener("mousedown", handleClickDown);
        }

        return () => document.removeEventListener("mousedown", handleClickDown);
    }, [drop])


    return (
        <div
            ref={menuIconRef}
            className="sm:hidden w-[90%] flex flex-col items-end text-sm relative"
        >
            <div onClick={() => setDrop(!drop)}>
                <MenuIcon className="w-5 h-5 text-neutral-800" />
            </div>

            <AnimatePresence>
                {drop && (
                    <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, x: 100 }}     // شروع از راست و محو
                        animate={{ opacity: 1, x: 0 }}       // ظاهر شدن با اسلاید
                        exit={{ opacity: 0, x: 100 }}        // محو شدن و رفتن به راست
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-8 right-0 bg-gray-500 rounded-md px-4 py-6 shadow-lg flex flex-col-reverse items-center gap-6 z-30"
                    >
                        <NavBar />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}