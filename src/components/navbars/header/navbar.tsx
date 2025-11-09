"use client"

import ThemeSelect from "./theme-select";
import PricingPopup from "./pricing-popup";
import { useState } from "react";

export default function NavBar() {
    const [pricingPopUp, setPricingPopUp] = useState(false)
    return (
        <>
            <div className="flex flex-col text-white sm:text-neutral-800 sm:flex-row justify-center items-center gap-3 sm:dark:text-[#e4e0f1]">
                <span>COMPRESS</span>
                <span>RESIZE</span>
                <span onClick={() => setPricingPopUp(true)} className="cursor-pointer" >PRICING</span>
                <span>ABOUT US</span>
                {pricingPopUp && <PricingPopup popUpHandler={setPricingPopUp} />}
            </div>

            <ThemeSelect />

            <div className="w-full sm:w-[25%] justify-center flex gap-3">
                <button className="w-[45%]  sm:w-[max(45%,_80px)] bg-white text-center border text-neutral-800  border-neutral-300 rounded-lg px-2.5 py-1 sm:dark:bg-[#251a35] sm:dark:border-purple-800 sm:dark:text-white">logIn</button>
                <button className="w-[45%]  sm:w-[max(45%,_80px)] bg-blue-500 text-center text-white rounded-lg px-2.5 py-1">sinUp</button>
            </div>
        </>
    )
}