import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { Formats } from "@/components/controls/controls";


export async function POST(req: NextRequest) {

    try {
        const formData = await req.formData();

        const files = formData.getAll("images") as File[];
        const quality = parseInt(formData.get("quality") as string);
        const width = formData.get("width") as string ? parseInt(formData.get("width") as string) : undefined;
        const height = formData.get("height") as string ? parseInt(formData.get("height") as string) : undefined;
        const format = formData.get("format") as Formats;

        const results = await Promise.all(
            files.map(async (file) => {
                const buffer = Buffer.from(await file.arrayBuffer());

                let pipeline = sharp(buffer);

                if (width || height) {
                    pipeline = pipeline.resize(width, height, {
                        fit: 'inside',
                        withoutEnlargement: true
                    });
                }

                if (format === "jpg") {
                    pipeline = pipeline.jpeg({ quality });
                } else if (format === "png") {
                    pipeline = pipeline.png({ quality });
                } else if (format === "webp") {
                    pipeline = pipeline.webp({ quality });
                }

                const processedBuffer = await pipeline.toBuffer();



                const metadata = await sharp(processedBuffer).metadata();

                return {
                    data: processedBuffer.toString('base64'),
                    name: file.name,
                    originalSize: file.size,
                    compressedSize: processedBuffer.length,
                    width: metadata.width,
                    height: metadata.height,
                    format: metadata.format
                };
            })
        );

        return NextResponse.json({ success: true, images: results });
    }
    catch (err) {
        console.error('Batch processing error:', err);
        return NextResponse.json(
            { success: false, error: 'Processing failed' },
            { status: 500 }
        );
    }

}

export const config = {
    api: {
        bodyParser: false,
        responseLimit: '50mb'
    }
};