import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "./layout-client"; // Importujemy komponent kliencki

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "⚡ PERUN Casino | God of Thunder Games",
  description: "Enter the realm of Perun, Slavic God of Thunder. Buy Thunder Coins, play epic provably fair games, and claim divine rewards on Base blockchain.",
  openGraph: {
    title: "⚡ PERUN Casino",
    description: "God of Thunder Games - Buy Thunder Coins & Play",
    images: [
      {
        url: "https://perun-casino.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Renderujemy komponent kliencki, który zawiera resztę logiki */}
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}


