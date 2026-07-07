import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { satoshi } from "./font";
import BackToTop from "@/components/BackToTop";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { LoadingProvider } from "@/hooks/Context/LoadingContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SHIFATU HALIMAH | Frontend Developer Portfolio",
  description:
    "Discover the portfolio of Shifatu Halimah, a Frontend Developer passionate about building fast, responsive, and user-friendly web applications with React, Javascript and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter ">
        <LoadingProvider>
          <SmoothScroll>
            <Loader />
            <Navbar />
            {children}
            <Footer />
            <BackToTop />
          </SmoothScroll>
        </LoadingProvider>
      </body>
    </html>
  );
}
