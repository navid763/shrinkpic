"use client"

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { emptyImages } from "@/redux/slices/image-slice";

import Image from "next/image";
import { useState } from "react";
import ImageRemovePopUp from "./popUp";
import ImagePlaceholderIcon from "../icons/image-placeholder";

const obj = [{ src: "/test-images/2.jpg" },
{ src: "/test-images/1.jpg" },
{ src: "/test-images/2.jpg" },
{ src: "/test-images/1.jpg" },
{ src: "/test-images/1.jpg" },
{ src: "/test-images/1.jpg" },
{ src: "/test-images/1.jpg" }
]

export default function Preview() {
    const state = useAppSelector(state => state.images);
    const [popUp, setPopUp] = useState(false);
    const dispatch = useAppDispatch();

    const handleAccept = () => {
        dispatch(emptyImages());
        setPopUp(false);
    }
    const handleRject = () => {
        setPopUp(false);
    }

    return (
        <div className="lg:col-span-2 sm:order-2">
            <div className="bg-white rounded-2xl p-6 border border-purple-100">
                <div className="w-full flex justify-between relative px-4">
                    <h2 className="sm:text-lg font-semibold text-neutral-500 mb-4">Preview</h2>

                    {state.length > 0 &&
                        <button
                            className="bg-gradient-to-r from-[#ec008c] to-[#fc6767] text-white text-xs sm:text-sm cursor-pointer rounded-2xl h-8 sm:h-10 px-2 py-0"
                            onClick={() => setPopUp(true)}
                        >
                            Remove</button>
                    }
                    {popUp &&
                        <ImageRemovePopUp accept={handleAccept} reject={handleRject} />
                    }


                </div>


                {state.length === 100 &&
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center min-h-96">
                        <div className="text-center text-gray-400">
                            <ImagePlaceholderIcon />
                            <p className="text-lg">Your image preview will appear here</p>
                        </div>
                    </div>
                }

                {state.length === 100 &&
                    <Image src={state[0].url} alt="" width={720} height={720} className="rounded-lg" />
                }


                {obj.length > 1 &&
                    < div className="w-full flex flex-col sm:flex-row items-center justify-center bg-gray-50 rounded-xl p-4 min-h-64 overflow-hidden">
                        {obj.slice(0, 3).map((img, i) => {
                            return (
                                <div className={`relative w-[120px] h-[120px] sm:w-[175px] sm:h-[175px] border border-neutral-300 rounded-lg overflow-hidden shadow-sm bg-white transition-transform hover:scale-105 duration-200 ${i >= 1 && "-mt-[35px] sm:mt-0 sm:-ml-[80px]"} `} key={i}>
                                    <Image src={img.src} alt="img1" fill className="object-cover rounded-lg" />
                                </div>
                            )
                        })}

                        {obj.length > 3 &&
                            <div className="-mt-[20px] sm:mt-0 sm:-ml-[25px] bg-gray-100/80 w-[120px] h-[80px] sm:w-[135px] sm:h-[175px] border border-neutral-100 rounded-lg text-sm font-bold flex justify-center items-center">
                                + {obj.length - 3} images
                            </div>
                        }
                    </div>
                }


                {state.length > 0 &&
                    <div className="mt-4 text-center text-sm text-gray-600">
                        {state[0].width} × {state[0].height} pixels
                    </div>}
            </div>
        </div >
    )
}