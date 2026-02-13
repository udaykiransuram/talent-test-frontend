import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Toasts
import { Toaster } from "@/components/ui/toaster";
// Layout
import Navbar from "@/components/Navbar";
import OverflowDebugger from "@/components/OverflowDebugger";
import Footer from "@/components/Footer";
import ViewportHover from "@/components/ViewportHover";

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
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen flex flex-col relative overflow-x-hidden`}>
        {/* Site-wide glassy background (light blue + water droplets + subtle noise) */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          {/* Soft light blue gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100" />
          {/* Water droplet texture (tile) */}
          <div className="absolute inset-0 opacity-[0.18] bg-[url('/images/water-drops.png')] bg-repeat bg-[length:320px_320px]" />
          {/* Very subtle grain for diffusion */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          {/* Faint specular sweep to enhance glass feel */}
          <div className="absolute inset-0 opacity-[0.1] bg-[conic-gradient(from_210deg_at_10%_0%,rgba(255,255,255,0.25)_0deg,transparent_120deg)]" />
        </div>
        <Navbar />
        {process.env.NODE_ENV !== 'production' ? <OverflowDebugger /> : null}
        <ViewportHover />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
