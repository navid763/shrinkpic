import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/navbars/header/header";
import Footer from "@/components/navbars/footer";
import { ReduxProvider } from "@/redux/provider";
import { ToastContainer } from "react-toastify";
import ThemeSync from "@/components/other/ThemeSync";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "shrinkPic",
  description: "Easily resize and compress images",
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
          <ToastContainer
            position="top-left"
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
      </body>
    </html>
  );
}
