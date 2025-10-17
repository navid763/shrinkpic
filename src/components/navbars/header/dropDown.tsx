"use client"

import { useEffect, useRef, useState } from "react";
import NavBar from "./navbar";
import MenuIcon from "@/components/icons/menu";

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
        <div ref={menuIconRef} className="sm:hidden w-[80%] flex flex-col items-end relative">
            <div onClick={() => setDrop(!drop)}>
                <MenuIcon className="w-5 h-5 text-neutral-800" />
            </div>

            <div
                className={`${drop ? "w-[200px] px-2 py-4 gap-6" : "w-0 p-0 translate-x-full"} h-fit flex flex-col-reverse items-center justify-between bg-neutral-300 rounded-md transition-all duration-300 absolute top-8 right-0 overflow-hidden`}>
                <NavBar />
            </div>
        </div>
    )
}