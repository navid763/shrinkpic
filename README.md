# 🖼️ ShrinkPic - Image Resizer & Compressor

A modern, privacy-focused web application for compressing and resizing images instantly - all processing happens directly in your browser.


## ✨ Features

- **🔒 Complete Privacy** - Single image processing happens locally in your browser. No uploads, no servers, no data collection
- **📐 Smart Resizing** - Resize images with intelligent aspect ratio maintenance
- **🎨 Quality Control** - Adjust compression quality from 10% to 100% for optimal file size vs quality balance
- **🌓 Dark Mode** - Beautiful dark theme with smooth transitions
- **📦 Batch Preview** - Upload and preview multiple images at once
- **⚡ Instant Processing** - Fast, efficient image compression using browser-native APIs
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **💾 Easy Download** - One-click download of your optimized images

## 🚧 Upcoming Features

- **🔄 Multi-Image Processing** - Batch compression and resizing for multiple images (server-side processing for better performance)
- **📦 Bulk Download** - Download all processed images as a ZIP file
- **⚙️ Advanced Settings** - Per-image quality control in batch mode

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/navid763/shrinkpic.git
cd shrinkpic
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit
- **Image Processing:** browser-image-compression (client-side)
- **Animations:** Framer Motion
- **UI Components:** Custom React components
- **Notifications:** React Toastify

## 📖 Usage

1. **Upload Images**
   - Drag and drop images onto the upload area
   - Or click to browse and select files
   - Supports JPG, PNG, and WEBP formats (max 10MB per file)

2. **Adjust Settings**
   - Set desired width and height (minimum 50px)
   - Toggle "Maintain aspect ratio" to preserve image proportions
   - Adjust quality slider (10-100%)

3. **Process & Download**
   - Click "Apply Resize" to compress/resize your image
   - View file size savings and compression stats
   - Click "Download Image" to save the optimized file

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js app router
│   ├── layout.tsx               # Root layout with theme setup
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── advantages/              # Feature cards
│   ├── controls/                # Image controls (dimensions, quality)
│   ├── icons/                   # SVG icon components
│   ├── navbars/                 # Header and footer
│   ├── other/                   # Utility components (checkmark, theme sync)
│   ├── preview/                 # Image preview with popup
│   ├── spinner/                 # Loading spinner
│   └── upload/                  # File upload component
├── redux/
│   ├── slices/                  # Redux slices (images, theme)
│   ├── hooks.ts                 # Typed Redux hooks
│   ├── provider.tsx             # Redux provider
│   └── store.ts                 # Redux store configuration
└── services/
    └── browser-image-compression/ # Image processing service
```

## 🎨 Key Features Explained

### Hybrid Processing Architecture

**Single Image Processing (Client-Side)**
- Uses browser-native Canvas API and `browser-image-compression` library
- Zero server load - all processing happens in your browser
- Complete privacy - images never leave your device
- Instant processing with no network latency

**Multi-Image Processing (Coming Soon - Server-Side)**
- Batch processing will be handled server-side for optimal performance
- Parallel processing of multiple images
- Reduced client-side memory usage
- Progress tracking and status updates
- Note: For batch operations, images will be temporarily uploaded and processed securely, then immediately deleted

### Privacy-First Design
Single image operations maintain complete privacy with 100% client-side processing. For upcoming batch features, we'll implement secure server-side processing with automatic deletion after download.

### Dark Mode Implementation
Theme preferences are synced with localStorage and system preferences, with SSR-safe hydration to prevent flash of unstyled content.

### Smart Image Processing
- Automatic dimension calculation based on aspect ratio
- Minimum dimension validation (50px)
- Progressive compression with quality control
- Efficient memory management with URL.revokeObjectURL

### Multi-Image Support
Preview multiple images with a clean, stacked interface. Batch processing coming soon!

## 🔐 Privacy & Security

- **Single Images:** 100% client-side processing - your images never leave your device
- **Batch Processing (Coming Soon):** 
  - Secure HTTPS upload
  - Server-side processing for performance
  - Automatic deletion after download
  - No permanent storage
  - Optional client-side processing for privacy-conscious users

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) for efficient client-side image compression
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling approach
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management

## 📧 Contact

navid rahmati - email: navidrahmati763@gmail.com

Project Link: [https://github.com/navid763/shrinkpic](https://github.com/navid763/shrinkpic)

---

⭐ If you found this project helpful, please give it a star!