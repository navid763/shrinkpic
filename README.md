shrinkPic - Free Image Compressor & Resizer
<div align="center">
Show Image

Compress and resize images instantly. 100% free and private.

Live Demo · Report Bug · Request Feature

Show Image
Show Image
Show Image
Show Image

</div>
📋 Table of Contents
Features
Tech Stack
Architecture
Getting Started
Environment Variables
Server Setup
How It Works
Project Structure
Performance Optimization
Contributing
License
Contact
✨ Features
Core Functionality
🖼️ Single Image Processing - Browser-based compression and resizing
📦 Batch Processing - Process up to 20 images simultaneously via server
🎯 Quality Control - Adjustable compression from 10% to 100%
📐 Flexible Resizing - Multiple resize strategies:
Keep original size
Max width/height
Max longest side
Fit inside box
🔄 Format Conversion - Convert between JPG, PNG, and WebP
💾 Smart Downloads - Individual downloads or ZIP for batch processing
User Experience
🌓 Dark/Light Mode - Automatic theme detection with manual toggle
📱 Responsive Design - Works seamlessly on all devices
🔒 Privacy First - Single images never leave your browser
⚡ Real-time Preview - See results before downloading
📊 Progress Tracking - Visual feedback for batch operations
🎨 Modern UI - Clean, intuitive interface with animations
Technical Features
🚀 Server-Side Rendering - Next.js 15 with App Router
🔄 State Management - Redux Toolkit for predictable state
📦 Code Splitting - Optimized bundle sizes
🎭 Framer Motion - Smooth animations and transitions
📈 Analytics Ready - Vercel Analytics and Speed Insights integrated
🛠 Tech Stack
Frontend
Framework: Next.js 15.5.4
UI Library: React 19.1.0
Language: TypeScript 5.0
Styling: Tailwind CSS 4.0
State Management: Redux Toolkit 2.9.1
Animations: Framer Motion 12.23.24
Notifications: React Toastify 11.0.5
Image Processing
Browser: browser-image-compression 2.0.2
Server: Sharp 0.34.5
Batch Downloads: JSZip 3.10.1
Backend (External API)
Runtime: Node.js
Framework: Express 4.18.2
Upload Handling: Multer 1.4.5
CORS: cors 2.8.5
Development & Deployment
Package Manager: npm/yarn
Linting: ESLint 9
Deployment: Vercel (Frontend) + Render.com (API)
🏗 Architecture
Single Image Processing
User Upload → Browser Processing → Preview → Download
     ↓              ↓                   ↓
   File       browser-image      Object URL
              compression
Flow:

User uploads image via drag-drop or file picker
Image processed entirely in browser using canvas API
Results preview instantly with size comparison
Direct download without server interaction
Multi-Image Processing
User Upload → Client Prep → Server Upload → Processing → Download
     ↓             ↓              ↓              ↓           ↓
  Files      FormData      Express API      Sharp      ZIP File
Flow:

User uploads multiple images (max 20)
Client prepares FormData with settings
XMLHttpRequest uploads with progress tracking
Express server processes using Sharp
Results returned as base64
Client generates ZIP for download
🚀 Getting Started
Prerequisites
Node.js 18+
npm or yarn
Git
Frontend Setup
Clone the repository
bash
git clone https://github.com/navid763/shrinkpic.git
cd shrinkpic
Install dependencies
bash
npm install
# or
yarn install
Run development server
bash
npm run dev
# or
yarn dev
Open your browser
http://localhost:3000
Build for Production
bash
npm run build
npm start
🔐 Environment Variables
Create a .env.local file in the root directory:

env
# Analytics (Optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id

# API Endpoint for Batch Processing
NEXT_PUBLIC_BATCH_API_URL=https://your-api-endpoint.com
🖥 Server Setup
The batch processing server can be deployed separately to any Node.js hosting platform.

Local Development
Navigate to server directory
bash
cd multi-image-external-api
Install dependencies
bash
npm install
Start server
bash
npm start
Server runs on http://localhost:3000 by default.

Production Deployment (Render.com)
Push code to GitHub repository
Create new Web Service on Render
Configure build settings:
Build Command: npm install
Start Command: npm start
Environment: Node
Add environment variables if needed
Deploy
Alternative: Vercel Serverless API
You can also use the included Next.js API route at src/app/api/batch-compress/route.ts for serverless deployment on Vercel. Update the endpoint in batch-processing.service.ts:

typescript
private static API_ENDPOINT = '/api/batch-compress';
⚙️ How It Works
Image Compression Algorithm
Browser Processing (Single Image):

typescript
// 1. Load image to canvas
const img = new Image();
img.src = URL.createObjectURL(file);

// 2. Apply resize if needed
canvas.width = targetWidth;
canvas.height = targetHeight;
ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

// 3. Compress with quality setting
canvas.toBlob(blob => {
  // Result ready
}, mimeType, quality);
Server Processing (Multiple Images):

typescript
// Using Sharp for high-performance processing
let pipeline = sharp(buffer);

// Apply resize strategy
pipeline = pipeline.resize(width, height, {
  fit: 'inside',
  withoutEnlargement: true
});

// Apply format and quality
pipeline = pipeline.jpeg({ quality: 80 });

const result = await pipeline.toBuffer();
Resize Strategies Explained
Original Size - Compress only, no dimension changes
Max Width - Limit width, auto-calculate height (aspect ratio preserved)
Max Height - Limit height, auto-calculate width (aspect ratio preserved)
Max Longest Side - Constrain the larger dimension
Fit Inside Box - Fit within specified width × height box
📁 Project Structure
shrinkpic/
├── public/                      # Static assets
│   ├── logo/
│   └── og-image.png
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API routes
│   │   │   └── batch-compress/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles
│   │   ├── robots.ts            # SEO robots
│   │   └── sitemap.ts           # SEO sitemap
│   ├── components/
│   │   ├── advantages/          # Feature cards
│   │   ├── controls/            # Image controls
│   │   │   ├── controls.tsx
│   │   │   ├── quality-slider.tsx
│   │   │   ├── dimensions-control.tsx
│   │   │   ├── format-selector.tsx
│   │   │   ├── resize-strategy-selector.tsx
│   │   │   ├── progress-tracker.tsx
│   │   │   └── file-info.tsx
│   │   ├── icons/               # SVG icons
│   │   ├── navbars/
│   │   │   ├── header/
│   │   │   └── footer/
│   │   ├── preview/             # Image preview
│   │   ├── upload/              # Upload component
│   │   ├── spinner/             # Loading spinner
│   │   └── other/               # Utilities
│   ├── redux/
│   │   ├── slices/
│   │   │   ├── image-slice.ts   # Image state
│   │   │   └── theme-slice.ts   # Theme state
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── provider.tsx
│   └── services/
│       ├── browser-image-compression/
│       │   └── image-processing.service.ts
│       └── multi-image-processing/
│           └── batch-processing.service.ts
├── multi-image-external-api/    # Express server
│   ├── server.js
│   └── package.json
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
⚡ Performance Optimization
Frontend Optimizations
Code Splitting: Automatic route-based splitting
Image Optimization: Next.js Image component with WebP
Lazy Loading: Dynamic imports for heavy components
CSS Optimization: Tailwind CSS purging unused styles
Processing Optimizations
Web Workers: Browser compression uses workers
Batch Processing: Server handles 20 images concurrently
Stream Processing: Large files processed in chunks
Memory Management: URLs revoked after use
Network Optimizations
CDN Delivery: Static assets via Vercel Edge Network
Compression: Gzip/Brotli for text resources
Caching: Aggressive caching for static assets
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
Development Guidelines
Follow TypeScript best practices
Use Tailwind CSS for styling
Write meaningful commit messages
Test on multiple browsers before submitting
📝 License
This project is open source and available under the MIT License.

📧 Contact
Navid Rahmati

Email: navidrahmati763@gmail.com
LinkedIn: navid-rahmati-al
GitHub: navid763
Website: shrinkpic.ir
🙏 Acknowledgments
browser-image-compression - Client-side compression
Sharp - High-performance image processing
Tailwind CSS - Utility-first CSS framework
Framer Motion - Animation library
Vercel - Deployment platform
<div align="center">
Built with ❤️ by Navid Rahmati

⭐ Star this repo if you find it helpful!

</div>
