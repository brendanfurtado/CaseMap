import type { Metadata } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CaseMap.live — Court Case Geographic Visualizer",
  description:
    "Explore New York court cases on an interactive 3D globe. Fly from a statewide overview into photorealistic 3D courthouse views, search cases by topic or party, and visualize the geographic landscape of New York litigation.",
  openGraph: {
    title: "CaseMap.live — Court Case Geographic Visualizer",
    description:
      "Explore New York court cases on an interactive 3D globe powered by CesiumJS and Google Photorealistic 3D Tiles.",
    url: "https://casemap.live",
    siteName: "CaseMap.live",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CaseMap.live — Court Case Geographic Visualizer",
    description:
      "Explore New York court cases on an interactive 3D globe powered by CesiumJS and Google Photorealistic 3D Tiles.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${jetbrainsMono.variable} min-h-screen bg-white text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
