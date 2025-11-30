import { Formats } from "@/components/controls/controls";
import { ImageProcessingService, ProcessedImageResult } from "../browser-image-compression/image-processing.service";
import { ResizeStrategy } from "@/components/controls/resize-strategy-selector";

export interface ProgressCallback {
    onProgress?: (current: number, total: number) => void;
    onUploadProgress?: (percentage: number) => void;
}

interface ImageInput {
    file?: File;
    url?: string;
    name: string;
    width?: number;
    height?: number;
}

export interface BatchProcessingOptions {
    images: ImageInput[];
    quality: number;
    resizeStrategy: ResizeStrategy;
    maxWidth?: number;
    maxHeight?: number;
    format: Formats;
}

export interface BatchProcessingResults {
    name: string;
    originalSize: number;
    compressedSize: number;
    savedPercentage: number;
    width: number;
    height: number;
    blob: Blob;
    url: string;
}

export class BatchProcessingService {
    private static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static MAX_BATCH_SIZE = 20; // Max images per batch

    /**
     * Process multiple images CLIENT-SIDE (no server upload)
     * This avoids Vercel timeout and size limits
     */
    static async processBatch(
        options: BatchProcessingOptions,
        callbacks: ProgressCallback
    ): Promise<BatchProcessingResults[]> {
        const { images, quality, resizeStrategy, maxWidth, maxHeight, format } = options;
        const { onProgress } = callbacks || {};

        this.validateImages(images);

        const allResults: BatchProcessingResults[] = [];

        for (let i = 0; i < images.length; i++) {
            const img = images[i];

            // Report that we're starting this image (current = i, so we see 0/5, 1/5, etc.)
            if (onProgress) {
                onProgress(i, images.length);
            }

            try {
                // Calculate target dimensions based on strategy
                const { targetWidth, targetHeight } = this.calculateDimensions(
                    img,
                    resizeStrategy,
                    maxWidth,
                    maxHeight
                );

                // Process image client-side
                const result = await ImageProcessingService.processImage({
                    url: img.url,
                    file: img.file,
                    name: img.name,
                    quality: quality,
                    imageWidth: img.width,
                    imageHeight: img.height,
                    targetWidth: targetWidth,
                    targetHeight: targetHeight,
                    format: format
                });

                // Convert ProcessedImageResult to BatchProcessingResults
                const batchResult: BatchProcessingResults = {
                    name: result.compressedName,
                    originalSize: result.originalSizeKB,
                    compressedSize: result.compressedSizeKB,
                    savedPercentage: result.savedPercentage,
                    width: result.width,
                    height: result.height,
                    blob: result.file,
                    url: result.url
                };

                allResults.push(batchResult);

                // Report progress after completing this image (i+1 completed out of total)
                if (onProgress) {
                    onProgress(i + 1, images.length);
                }

            } catch (err) {
                console.error(`Failed to process image ${img.name}:`, err);
                throw new Error(`Failed to process image: ${img.name}`);
            }
        }

        return allResults;
    }

    /**
     * Calculate target dimensions based on resize strategy
     */
    private static calculateDimensions(
        img: ImageInput,
        strategy: ResizeStrategy,
        maxWidth?: number,
        maxHeight?: number
    ): { targetWidth: number; targetHeight: number } {
        const originalWidth = img.width || 1920;
        const originalHeight = img.height || 1080;
        const aspectRatio = originalWidth / originalHeight;

        let targetWidth = originalWidth;
        let targetHeight = originalHeight;

        switch (strategy) {
            case "original":
                // Keep original dimensions
                break;

            case "max-width":
                if (maxWidth && originalWidth > maxWidth) {
                    targetWidth = maxWidth;
                    targetHeight = Math.round(maxWidth / aspectRatio);
                }
                break;

            case "max-height":
                if (maxHeight && originalHeight > maxHeight) {
                    targetHeight = maxHeight;
                    targetWidth = Math.round(maxHeight * aspectRatio);
                }
                break;

            case "max-dimension":
                if (maxWidth) {
                    const maxDimension = maxWidth;
                    if (originalWidth > maxDimension || originalHeight > maxDimension) {
                        if (originalWidth > originalHeight) {
                            targetWidth = maxDimension;
                            targetHeight = Math.round(maxDimension / aspectRatio);
                        } else {
                            targetHeight = maxDimension;
                            targetWidth = Math.round(maxDimension * aspectRatio);
                        }
                    }
                }
                break;

            case "fit-inside":
                if (maxWidth && maxHeight) {
                    const widthRatio = maxWidth / originalWidth;
                    const heightRatio = maxHeight / originalHeight;
                    const scale = Math.min(widthRatio, heightRatio, 1); // Don't upscale

                    targetWidth = Math.round(originalWidth * scale);
                    targetHeight = Math.round(originalHeight * scale);
                }
                break;
        }

        return { targetWidth, targetHeight };
    }

    private static validateImages(images: ImageInput[]) {
        if (images.length === 0) throw new Error("No images provided");

        if (images.length > this.MAX_BATCH_SIZE) {
            throw new Error(`Maximum ${this.MAX_BATCH_SIZE} images allowed per batch`);
        }

        images.forEach((img, index) => {
            if (!img.file && !img.url) {
                throw new Error(`Image at index ${index} must have either 'file' or 'url'`);
            }

            if (!img.name) {
                throw new Error(`Image at index ${index} must have a 'name'`);
            }

            if (img.file && img.file.size > this.MAX_FILE_SIZE) {
                throw new Error(`File ${img.name} exceeds maximum size of 10MB`);
            }

            if (img.file && !img.file.type.startsWith('image/')) {
                throw new Error(`File ${img.name} is not an image`);
            }
        });
    }

    static async downloadAsZip(results: BatchProcessingResults[], zipName: string = 'compressed-images.zip') {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        results.forEach((result) => {
            zip.file(result.name, result.blob);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);

        const a = document.createElement('a');
        a.href = url;
        a.download = zipName;
        a.click();

        URL.revokeObjectURL(url);
    }

    static async downloadIndividual(result: BatchProcessingResults) {
        const a = document.createElement('a');
        a.href = result.url;
        a.download = result.name;
        a.click();
    }

    static revokeUrls(results: BatchProcessingResults[]) {
        results.forEach(result => URL.revokeObjectURL(result.url));
    }
}