import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Roboto } from "next/font/google"
import "./globals.css";
import Header from "@/components/navbars/header/header";
import Footer from "@/components/navbars/footer";
import { ReduxProvider } from "@/redux/provider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "shrinkPic",
  description: "Easily resize and compress images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${geistMono.variable} ${roboto.variable} ${geistSans.variable} antialiased`}
      >
        <ReduxProvider>
          <Header />
          {children}

          <ToastContainer
            position="top-left"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
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
