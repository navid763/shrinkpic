import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/navbars/header/header";
import Footer from "@/components/navbars/footer/footer";
import { ReduxProvider } from "@/redux/provider";
import { ToastContainer } from "react-toastify";
import ThemeSync from "@/components/other/ThemeSync";
import "react-toastify/dist/ReactToastify.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "shrinkPic - Free Online Image Compressor & Resizer",
  description: "Compress and resize images instantly in your browser. Free, fast, and private. Support for JPG, PNG, and WebP. No upload required - all processing happens locally.",
  metadataBase: new URL("https://www.shrinkpic.ir/"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",  // for old browsers
  }, keywords: ["image compressor", "image resizer", "compress images", "resize images", "optimize images", "reduce image size", "free image tool", "online image editor"],
  authors: [{ name: "Navid Rahmati" }],
  creator: "Navid Rahmati",
  publisher: "shrinkPic",
  openGraph: {
    title: "shrinkPic - Free Image Compressor & Resizer",
    description: "Compress and resize images instantly. 100% free and private - all processing in your browser.",
    url: "/",
    siteName: "shrinkPic",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "shrinkPic - Free Image Compressor",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

// 🟢 helper function runs on server + client
function getInitialThemeClass() {
  if (typeof window === "undefined") {
    // server-side: assume light (safe baseline)
    return "";
  }
  try {
    const t = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (t === "dark" || (!t && prefersDark)) {
      return "dark";
    }
  } catch (e) {
    console.log(e);
  }
  return "";
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialThemeClass = getInitialThemeClass();

  return (
    <html lang="en" className={initialThemeClass} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/logo/logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
            `,
          }}
        />
      </head>
      <body
        className={`${roboto.variable} ${geistMono.variable} ${geistSans.variable} antialiased`}
      >
        <ReduxProvider>
          <Header />

          {children}
          <ThemeSync />

          <SpeedInsights />
          <Analytics />
          <ToastContainer
            position="top-left"
            style={{ // changing position to center-left
              top: '40%',
              left: '0rem',
              transform: 'translateY(-50%)',
            }}
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="colored"
          />
          <Footer />
        </ReduxProvider>

        <p className="w-[50%] text-xs text-gray-500 sm:text-center px-4 pb-6 dark:text-[#8b7fb8]">
          Built by <a className="text-violet-600 font-semibold dark:text-[#baace2]" href="mailto:navidrahmati763@gmail.com">Navid Rahmati</a>
        </p>
      </body>
    </html>
  );
}
