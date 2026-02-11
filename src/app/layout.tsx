import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Toasts
import { Toaster } from "@/components/ui/toaster";
// Layout
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Precision Diagnostics — Alyra Tech",
    template: "%s — Precision Diagnostics",
  },
  description:
    "Marks show scores. We show understanding. Diagnose concept, procedure, and prerequisite gaps to drive visible growth.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Precision Diagnostics — Alyra Tech",
    description:
      "Marks show scores. We show understanding. Diagnose concept, procedure, and prerequisite gaps to drive visible growth.",
    url: siteUrl,
    siteName: "Precision Diagnostics",
    images: [
      {
        url: "/og-image.svg", // Swap to /og-image.png after adding PNG
        width: 1200,
        height: 630,
        alt: "Precision Diagnostics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precision Diagnostics — Alyra Tech",
    description:
      "Marks show scores. We show understanding. Diagnose concept, procedure, and prerequisite gaps to drive visible growth.",
    images: ["/og-image.svg"],
  },
};

// Move themeColor to viewport per Next.js 15 recommendation
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen flex flex-col relative overflow-x-clip`}>
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
