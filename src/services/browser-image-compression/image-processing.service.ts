import imageCompression from "browser-image-compression";

interface ImageProcessingOptions {
    file?: File;
    url?: string;
    name: string;
    quality: number;
    imageWidth?: number;
    imageHeight?: number;
    targetWidth: number;
    targetHeight: number;
    format?: "jpg" | "png" | "webp";
}

export interface ProcessedImageResult {
    file: File;
    url: string;
    originalSizeKB: number;
    compressedSizeKB: number;
    savedPercentage: number;
    width: number;
    height: number;
    compressedName: string;
}

export class ImageProcessingService {
    static async processImage(options: ImageProcessingOptions): Promise<ProcessedImageResult> {
        let { file } = options;
        const { url, quality, imageWidth, imageHeight, name, targetHeight, targetWidth } = options;

        if (!file && url) {
            file = await this.urlToFile(url, name + "-compressed");
        }
        if (!file) throw new Error("Either 'file' or 'url' must be provided.");

        const originalSizeKB = Math.round(file.size / 1024);

        const finalTargetWidth = targetWidth ?? imageWidth;
        const finalTargetHeight = targetHeight ?? imageHeight;

        const compressionOptions = {
            maxWidthOrHeight: Math.max(finalTargetWidth, finalTargetHeight),
            initialQuality: quality / 100,
            useWebWorker: true,
            maxIteration: 10,
            alreadySmallerThan: 50 * 1024 //50 KB
        };

        try {
            const compressedFile = await imageCompression(file, compressionOptions);
            let finalFile = compressedFile;

            if ((targetWidth && targetWidth !== imageWidth) || (targetHeight && targetHeight !== imageHeight)) {
                finalFile = await this.resizeImage(compressedFile, finalTargetWidth, finalTargetHeight);
            }

            const { pureName, suffix } = this.nameSplitter(name);
            const targetFormat = options.format || suffix.toLowerCase(); // fallback: keep original format

            let convertedFile = finalFile;

            // Only convert if chosen format differs from original file type
            if (targetFormat && !file.type.includes(targetFormat)) {
                if (["jpg", "png", "webp"].includes(targetFormat)) {
                    convertedFile = await this.convertFormat(finalFile, targetFormat as "jpg" | "png" | "webp");
                }
            }

            const compressedSizeKB = Math.round(convertedFile.size / 1024);
            const savedPercentage = Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100);

            const previewUrl = URL.createObjectURL(convertedFile);
            const finalDimensions = await this.getImageDimensions(convertedFile);

            const additionalText = (targetHeight && targetHeight)
                ? `${targetWidth}-${targetHeight}`
                : "compressed";

            // 🆕 Updated: Use chosen format for final file name
            const compressedName = `${pureName}-${additionalText}.${targetFormat}`;

            return {
                file: convertedFile,
                url: previewUrl,
                compressedSizeKB,
                originalSizeKB,
                savedPercentage,
                width: finalDimensions.width,
                height: finalDimensions.height,
                compressedName
            };
        } catch (error) {
            console.error("Error processing image:", error);
            throw new Error("Failed to process image. Please try again.");
        }
    }

    static async urlToFile(url: string, fileName: string, mimeType?: string): Promise<File> {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], fileName, { type: mimeType || blob.type });
    }

    private static async resizeImage(
        file: File,
        width: number,
        height: number
    ): Promise<File> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) return reject(new Error("Failed to get canvas context"));

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error("Failed to create blob"));
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                        URL.revokeObjectURL(img.src);
                    },
                    file.type,
                    0.95
                );
            };
            img.onerror = () => reject(new Error("Failed to load image for resizing"));
            img.src = URL.createObjectURL(file);
        });
    }

    private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
                URL.revokeObjectURL(img.src);
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = URL.createObjectURL(file);
        });
    }

    static nameSplitter(fileName: string): { pureName: string; suffix: string } {
        if (!fileName.trim()) throw new Error("the file name can not be empty");
        const indexOfDot = fileName.lastIndexOf(".");
        if (indexOfDot === -1 || indexOfDot === 0 || indexOfDot === fileName.length - 1)
            throw new Error("invalid file name");

        const suffix = fileName.slice(indexOfDot + 1);
        const pureName = fileName.slice(0, indexOfDot);

        return { pureName, suffix };
    }

    private static async convertFormat(file: File, format: "jpg" | "png" | "webp"): Promise<File> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                if (!ctx) return reject(new Error("Failed to get canvas context"));

                ctx.drawImage(img, 0, 0);

                const mimeType = {
                    jpg: "image/jpeg",
                    png: "image/png",
                    webp: "image/webp"
                }[format];

                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error("Failed to create blob"));
                        const newFileName = file.name.replace(/\.[^.]+$/, `.${format}`);
                        const convertedFile = new File([blob], newFileName, {
                            type: mimeType,
                            lastModified: Date.now(),
                        });
                        resolve(convertedFile);
                        URL.revokeObjectURL(img.src);
                    },
                    mimeType,
                    0.95
                );
            };
            img.onerror = () => reject(new Error("Failed to load image for format conversion"));
            img.src = URL.createObjectURL(file);
        });
    }
}
