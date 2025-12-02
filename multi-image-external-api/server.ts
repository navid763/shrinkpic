import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";

const app = express();
app.use(cors()); // allow Next.js domain to call this API
const upload = multer();

app.post("/process-images", upload.array("images"), async (req, res) => {
    try {
        const { quality, resizeStrategy, maxWidth, maxHeight, format } = req.body;

        const responses = await Promise.all(
            req.files.map(async (file) => {
                let pipeline = sharp(file.buffer);

                const metadata = await pipeline.metadata();

                let targetWidth;
                let targetHeight;

                switch (resizeStrategy) {
                    case "max-width":
                        if (maxWidth && metadata.width > maxWidth) targetWidth = Number(maxWidth);
                        break;
                    case "max-height":
                        if (maxHeight && metadata.height > maxHeight) targetHeight = Number(maxHeight);
                        break;
                }

                if (targetWidth || targetHeight) {
                    pipeline = pipeline.resize(targetWidth, targetHeight, {
                        fit: "inside",
                        withoutEnlargement: true,
                    });
                }

                if (format === "jpg") pipeline = pipeline.jpeg({ quality: Number(quality) });
                else if (format === "png") pipeline = pipeline.png({ quality: Number(quality) });
                else if (format === "webp") pipeline = pipeline.webp({ quality: Number(quality) });

                const output = await pipeline.toBuffer();

                return {
                    name: file.originalname,
                    data: output.toString("base64"),
                    originalSize: file.size,
                    compressedSize: output.length,
                };
            })
        );

        return res.json({ success: true, images: responses });
    } catch (err) {
        console.error("API error:", err);
        res.status(500).json({ success: false, error: "Processing failed" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Sharp API running on port " + PORT));
