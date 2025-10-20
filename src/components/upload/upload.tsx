"use client"

import { useState, useRef, useEffect } from "react";
import { setImage } from "@/redux/slices/image-slice";
import { useAppDispatch } from "@/redux/hooks";

export default function Upload() {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setimage] = useState("");
    const dispatch = useAppDispatch();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return

        const imageUrl = URL.createObjectURL(file);
        setimage(imageUrl);

        const img = document.createElement("img");
        img.src = imageUrl;
        img.onload = () => {
            dispatch(setImage({ url: imageUrl, width: img.naturalWidth, height: img.naturalHeight }))
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return
        const imageUrl = URL.createObjectURL(file);
        setimage(imageUrl);
    }

    useEffect(() => {
        if (image) {
            console.log("uploadd file: ", image)
        }
    }, [image]);


    return (
        <div className="max-w-2xl mx-auto mb-8">
            <div
                className="relative border-2 border-dashed border-gray-300 hover:border-violet-400 hover:bg-white rounded-2xl p-12 text-center cursor-pointer transition-all"
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-6 rounded-full">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xl font-semibold text-gray-700 mb-2">
                            {/* {selectedFile ? selectedFile.name : "Drop your image here"} */}
                        </p>
                        <p className="text-gray-500">or click to browse</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                        <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                            JPG
                        </span>
                        <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                            PNG
                        </span>
                        <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                            WEBP
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}