import { Formats } from "@/components/controls/controls";
// import { Blob } from "buffer";
import { ImageProcessingService } from "../browser-image-compression/image-processing.service";
import { ResizeStrategy } from "@/components/controls/resize-strategy-selector";

export interface ProgressCallback {
    onProgress?: (current: number, total: number) => void;
    onUploadProgress?: (percentage: number) => void;
}

interface ImageInput {
    file?: File;
    url?: string;
    name: string
}

export interface BatchProcessingOptions {
    images: ImageInput[];
    quality: number;
    resizeStrategy: ResizeStrategy;
    maxWidth?: number;
    maxHeight?: number;
    format: Formats
}

export interface BatchProcessingResults {
    name: string;
    originalSize: number;
    compressedSize: number;
    savedPercentage: number;
    width: number;
    height: number;
    blob: Blob
    url: string
}



export class BatchProcessingService {
    private static API_ENDPOINT = '/api/batch-compress';
    private static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static MAX_BATCH_SIZE = 20; // Max images per batch

    static async processBatch(
        options: BatchProcessingOptions,
        callbacks: ProgressCallback
    ): Promise<BatchProcessingResults[]> {

        const { images, quality, resizeStrategy, maxWidth, maxHeight, format } = options;
        const { onProgress, onUploadProgress } = callbacks || {};

        this.validateImqges(images);

        const files = await this.prepareFiles(images); // if instead of file, urls have been provided
        const chunks = this.chunkArray(files, this.MAX_BATCH_SIZE)

        const allResults: BatchProcessingResults[] = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const formData = new FormData();

            chunk.forEach(file => formData.append("images", file));
            formData.append("quality", quality.toString());
            formData.append("resizeStrategy", resizeStrategy);
            if (maxWidth) formData.append('maxWidth', maxWidth.toString());
            if (maxHeight) formData.append('maxHeight', maxHeight.toString());
            formData.append('format', format);

            try {
                const response = await this.uploadWithProgress(
                    formData,
                    onUploadProgress
                );

                if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

                const data = await response.json();
                if (!data.success) throw new Error(data.error || 'Processing failed');

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const results = data.images.map((img: any) => {
                    const byteCharacters = atob(img.data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);

                    const mimeType = this.getMimeType(format);
                    const blob = new Blob([byteArray], { type: mimeType });
                    const url = URL.createObjectURL(blob);

                    const savedPercentage = Math.round(
                        ((img.originalSize - img.compressedSize) / img.originalSize) * 100
                    );


                    return {
                        name: img.name,
                        originalSize: Math.round(img.originalSize / 1024),
                        compressedSize: Math.round(img.compressedSize / 1024),
                        savedPercentage,
                        width: img.width,
                        height: img.height,
                        blob,
                        url
                    };
                });

                allResults.push(...results);

                if (onProgress) {
                    onProgress(allResults.length, files.length);
                }

            } catch (err) {
                console.error('Batch processing error:', err);
                throw new Error('Failed to process images on server');
            }
        }

        return allResults
    }


    private static validateImqges(images: ImageInput[]) {
        if (images.length === 0) throw new Error("no images provided");

        if (images.length > this.MAX_BATCH_SIZE) throw new Error(`Maximum ${this.MAX_BATCH_SIZE} images allowed per batch`);

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

    private static prepareFiles(images: ImageInput[]): Promise<File[]> {

        const filePromises = images.map(async (img, index) => {
            let { file } = img;
            const { url, name } = img;

            if (!file && url) {
                file = await ImageProcessingService.urlToFile(url, name || `image-${index + 1}`)
            }

            if (!file) throw new Error(`Either 'file' or 'url' must be provided for image at index ${index}`);
            return file
        });

        return Promise.all(filePromises)
    }

    private static chunkArray<T>(array: T[], chunkSize: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    private static getMimeType(format: string): string {
        const mimeTypes: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp'
        };
        return mimeTypes[format] || 'image/jpeg';
    }

    static async downloadAsZip(results: BatchProcessingResults[], zipName: string = 'compressed-images.zip') {

        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        results.forEach((result, index) => {
            const fileName = this.generateFileName(result.name, index, result.width, result.height);
            zip.file(fileName, result.blob);
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
        a.download = this.generateFileName(result.name, 0, result.width, result.height);
        a.click();
    }

    private static uploadWithProgress(
        formData: FormData,
        onUploadProgress?: (percentage: number) => void
    ): Promise<Response> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onUploadProgress) {
                    const percentage = Math.round((event.loaded / event.total) * 100);
                    onUploadProgress(percentage);
                }
            });

            // Handle completion
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Create a Response object from XMLHttpRequest
                    const response = new Response(xhr.responseText, {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        headers: new Headers({
                            'Content-Type': xhr.getResponseHeader('Content-Type') || 'application/json'
                        })
                    });
                    resolve(response);
                } else {
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                }
            });

            // Handle errors
            xhr.addEventListener('error', () => {
                reject(new Error('Network error occurred'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Upload aborted'));
            });

            // Send request
            xhr.open('POST', this.API_ENDPOINT);
            xhr.send(formData);
        });
    }

    private static generateFileName(originalName: string, index: number, width: number, height: number): string {
        const nameWithoutExt = originalName.replace(/\.[^.]+$/, '');
        return `${nameWithoutExt}-${width}x${height}-compressed.jpg`;
    }

    static revokeUrls(results: BatchProcessingResults[]) {
        results.forEach(result => URL.revokeObjectURL(result.url));
    }
}