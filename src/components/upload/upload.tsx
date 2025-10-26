"use client"

import { useState, useRef, useEffect } from "react";
import { setImages, imageState } from "@/redux/slices/image-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface uploadedImages {
    url: string;
    size: number;
    name: string
}

export default function Upload() {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadedImages, setUploadedImages] = useState<uploadedImages[]>([]);
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.images);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return

        const images = Array.from(files).filter(image => image.type.startsWith("image/"))
            .map(image => {
                return {
                    url: URL.createObjectURL(image),
                    size: Math.round(image.size / 1024),
                    name: image.name
                }
            });
        setUploadedImages(images)
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        if (!files || files.length === 0) return

        const images = Array.from(files).filter(image => image.type.startsWith("image/"))
            .map(image => {
                return {
                    url: URL.createObjectURL(image),
                    size: Math.round(image.size / 1024),
                    name: image.name
                }
            });
        setUploadedImages(images)
    }

    useEffect(() => {
        if (uploadedImages.length === 0) return;

        Promise.all(
            uploadedImages.map(image => {
                return new Promise<imageState>((resolve) => {
                    const img = document.createElement("img");
                    img.onload = () => {
                        resolve({
                            url: image.url,
                            name: image.name,
                            size: image.size,
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        });
                    };
                    img.src = image.url;
                });
            })
        ).then(images => {
            dispatch(setImages(images))
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedImages])


    if (state.length) return null;

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
                    multiple
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