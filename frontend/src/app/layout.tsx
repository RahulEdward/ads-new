import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Studio Pro - Create Stunning Content in Seconds",
  description: "Enterprise-grade AI content generation platform. Create images, banners, logos, videos, and more with the power of AI.",
  keywords: ["AI", "image generation", "video generation", "banner", "logo", "content creation"],
  openGraph: {
    title: "AI Studio Pro - Create Stunning Content in Seconds",
    description: "Enterprise-grade AI content generation platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
