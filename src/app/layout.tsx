import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MasAI - Sistem Penaksir Emas Cerdas Berbasis Multimodal AI & Self-Reflective RAG",
  description:
    "Platform inovatif dari Pegadaian yang menggabungkan kecerdasan buatan dengan regulasi untuk estimasi nilai emas yang akurat, transparan, dan terpercaya.",
  keywords: [
    "MasAI",
    "Pegadaian",
    "AI",
    "Multimodal AI",
    "RAG",
    "Emas",
    "Gadai",
    "Estimasi Harga",
    "Machine Learning",
  ],
  authors: [{ name: "Pegadaian Digital Team" }],
  // --- BAGIAN INI DIUBAH ---
  icons: {
    icon: "/icon.svg", // Mengarah ke file SVG lokal yang akan kita buat
  },
  // ------------------------
  openGraph: {
    title: "MasAI - Sistem Penaksir Emas Cerdas",
    description: "Estimasi nilai emas akurat dengan AI untuk Pegadaian",
    url: "https://masai.pegadaian.co.id",
    siteName: "MasAI by Pegadaian",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MasAI - Sistem Penaksir Emas Cerdas",
    description:
      "Platform AI untuk estimasi nilai emas yang akurat dan transparan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}