import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { Formats } from "@/components/controls/controls";
import { ResizeStrategy } from "@/components/controls/resize-strategy-selector";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const files = formData.getAll("images") as File[];
        const quality = parseInt(formData.get("quality") as string);
        const resizeStrategy = formData.get("resizeStrategy") as ResizeStrategy;
        const maxWidth = formData.get("maxWidth") ? parseInt(formData.get("maxWidth") as string) : undefined;
        const maxHeight = formData.get("maxHeight") ? parseInt(formData.get("maxHeight") as string) : undefined;
        const format = formData.get("format") as Formats;

        const results = await Promise.all(
            files.map(async (file) => {
                const buffer = Buffer.from(await file.arrayBuffer());
                let pipeline = sharp(buffer);

                // Get original dimensions
                const metadata = await sharp(buffer).metadata();
                const originalWidth = metadata.width || 0;
                const originalHeight = metadata.height || 0;

                // Apply resize strategy
                let targetWidth: number | undefined;
                let targetHeight: number | undefined;

                switch (resizeStrategy) {
                    case "original":
                        // No resize
                        break;

                    case "max-width":
                        if (maxWidth && originalWidth > maxWidth) {
                            targetWidth = maxWidth;
                            // Height will be calculated automatically by Sharp
                        }
                        break;

                    case "max-height":
                        if (maxHeight && originalHeight > maxHeight) {
                            targetHeight = maxHeight;
                            // Width will be calculated automatically by Sharp
                        }
                        break;

                    case "max-dimension":
                        if (maxWidth) {
                            const maxDimension = maxWidth; // Using maxWidth as the max dimension value
                            if (originalWidth > maxDimension || originalHeight > maxDimension) {
                                if (originalWidth > originalHeight) {
                                    targetWidth = maxDimension;
                                } else {
                                    targetHeight = maxDimension;
                                }
                            }
                        }
                        break;

                    case "fit-inside":
                        if (maxWidth && maxHeight) {
                            targetWidth = maxWidth;
                            targetHeight = maxHeight;
                        }
                        break;
                }

                // Apply resize if needed
                if (targetWidth || targetHeight) {
                    pipeline = pipeline.resize(targetWidth, targetHeight, {
                        fit: resizeStrategy === "fit-inside" ? "inside" : "inside",
                        withoutEnlargement: true // Don't upscale images
                    });
                }

                // Format conversion and compression
                if (format === "jpg") {
                    pipeline = pipeline.jpeg({ quality });
                } else if (format === "png") {
                    pipeline = pipeline.png({ quality });
                } else if (format === "webp") {
                    pipeline = pipeline.webp({ quality });
                }

                const processedBuffer = await pipeline.toBuffer();
                const processedMetadata = await sharp(processedBuffer).metadata();

                return {
                    data: processedBuffer.toString('base64'),
                    name: file.name,
                    originalSize: file.size,
                    compressedSize: processedBuffer.length,
                    width: processedMetadata.width,
                    height: processedMetadata.height,
                    format: processedMetadata.format
                };
            })
        );

        return NextResponse.json({ success: true, images: results });
    } catch (err) {
        console.error('Batch processing error:', err);
        return NextResponse.json(
            { success: false, error: 'Processing failed' },
            { status: 500 }
        );
    }
}