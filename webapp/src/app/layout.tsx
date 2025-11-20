import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glass Watermelon ASMR",
  description:
    "Looping 3D glass watermelon cutting visual paired with a shimmering ASMR soundscape.",
  openGraph: {
    title: "Glass Watermelon Cutting ASMR",
    description:
      "Immerse yourself in a crystalline 3D watermelon slicing experience with generative ASMR audio.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glass Watermelon Cutting ASMR",
    description:
      "Crystalline 3D watermelon slicing visuals and calming ASMR sound.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
