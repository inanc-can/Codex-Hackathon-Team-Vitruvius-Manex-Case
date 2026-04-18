import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Sans_3, Geist } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const headlineFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["500", "600", "700"],
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Quality Resolution Copilot",
  description:
    "Stakeholder-centered quality investigation and action tracking for the Manex hackathon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", headlineFont.variable, bodyFont.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
