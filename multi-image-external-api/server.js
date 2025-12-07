import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import { memoryRateLimiter } from "./middleware/rate-limiter.js";


const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy to get correct IP addresses
app.set('trust proxy', 1);

// Enable CORS with specific origins
app.use(cors({
    origin: ['https://shrinkpic.ir', 'https://www.shrinkpic.ir', 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Body parser for JSON (if needed)
app.use(express.json());

// Configure multer for file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 20
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Batch Image Processing API is running',
        version: '1.0.0',
        endpoints: {
            health: 'GET /',
            batchCompress: 'POST /batch-compress'
        },
        rateLimit: {
            enabled: true,
            max: 5,
            window: '10 minutes'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        rateLimit: 'enabled'
    });
});


// Helper to process each image
async function processImage(file, options) {
    try {
        let pipeline = sharp(file.buffer);

        // Get original dimensions
        const metadata = await sharp(file.buffer).metadata();
        const originalWidth = metadata.width || 0;
        const originalHeight = metadata.height || 0;

        let targetWidth;
        let targetHeight;

        const { resizeStrategy, maxWidth, maxHeight, quality, format } = options;

        switch (resizeStrategy) {
            case "original":
                break;
            case "max-width":
                if (maxWidth && originalWidth > maxWidth) targetWidth = maxWidth;
                break;
            case "max-height":
                if (maxHeight && originalHeight > maxHeight) targetHeight = maxHeight;
                break;
            case "max-dimension":
                if (maxWidth) {
                    if (originalWidth > originalHeight) targetWidth = maxWidth;
                    else targetHeight = maxWidth;
                }
                break;
            case "fit-inside":
                if (maxWidth && maxHeight) {
                    targetWidth = maxWidth;
                    targetHeight = maxHeight;
                }
                break;
        }

        if (targetWidth || targetHeight) {
            pipeline = pipeline.resize(targetWidth, targetHeight, {
                fit: "inside",
                withoutEnlargement: true,
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
        const processedMetadata = await sharp(processedBuffer).metadata();

        return {
            data: processedBuffer.toString("base64"),
            name: file.originalname,
            originalSize: file.size,
            compressedSize: processedBuffer.length,
            width: processedMetadata.width,
            height: processedMetadata.height,
            format: processedMetadata.format,
        };
    } catch (error) {
        console.error(`Error processing ${file.originalname}:`, error);
        throw error;
    }
}

app.use('/batch-compress', memoryRateLimiter);

// Batch compress API route
app.post("/batch-compress", upload.array("images", 20), async (req, res) => {
    console.log('📥 Received batch-compress request');
    console.log('Client IP:', req.ip);
    console.log('Files count:', req.files?.length || 0);
    console.log('Body:', req.body);

    try {
        const files = req.files;
        if (!files || files.length === 0) {
            console.error('❌ No images uploaded');
            return res.status(400).json({ success: false, error: "No images uploaded" });
        }

        const quality = parseInt(req.body.quality) || 80;
        const resizeStrategy = req.body.resizeStrategy || "original";
        const maxWidth = req.body.maxWidth ? parseInt(req.body.maxWidth) : undefined;
        const maxHeight = req.body.maxHeight ? parseInt(req.body.maxHeight) : undefined;
        const format = req.body.format || "jpg";

        console.log(`Processing ${files.length} images with quality ${quality}, strategy ${resizeStrategy}`);

        const results = await Promise.all(
            files.map((file) =>
                processImage(file, { quality, resizeStrategy, maxWidth, maxHeight, format })
            )
        );

        console.log('✅ Successfully processed', results.length, 'images');
        return res.json({ success: true, images: results });
    } catch (err) {
        console.error("❌ Batch processing error:", err);
        return res.status(500).json({
            success: false,
            error: "Processing failed",
            details: err.message
        });
    }
});

// 404 handler
app.use((req, res) => {
    console.log('❌ 404 - Route not found:', req.method, req.path);
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method,
        availableRoutes: ['GET /', 'GET /health', 'POST /batch-compress']
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏱️  Rate Limiting: 5 requests per 10 minutes per IP`);
    console.log(`🔗 Available routes:`);
    console.log(`   GET  / (health check)`);
    console.log(`   GET  /health`);
    console.log(`   POST /batch-compress (rate limited)`);
});