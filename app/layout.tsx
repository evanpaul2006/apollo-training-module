import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apollo Learn",
  description: "Corporate Learning Management System for Apollo Tyres",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ConvexClientProvider>
          {children}
          <Toaster position="top-center" />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
