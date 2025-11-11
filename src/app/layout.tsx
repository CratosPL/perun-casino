import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "./layout-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ✅ Basic metadata
  title: "⚡ Thunder Casino | God of Thunder Games",
  description: "Play provably fair arcade games with points. Compete on leaderboards, claim daily bonuses, and have fun. Free to play.",
  
  // ✅ Open Graph (Farcaster, Discord, Facebook)
  openGraph: {
    type: 'website',
    url: 'https://perun-casino.vercel.app',
    title: 'Thunder Casino',
    siteName: 'Thunder Casino',
    description: 'God of Thunder Games - Play provably fair arcade games with points.',
    images: [
      {
        url: 'https://perun-casino.vercel.app/og-image.png', // ✅ MUST EXIST!
        width: 1200,
        height: 630,
        alt: 'Thunder Casino - God of Thunder Games',
      },
    ],
    locale: 'en_US',
  },
  
  // ✅ Twitter Card (optional but recommended)
  twitter: {
    card: 'summary_large_image',
    title: 'Thunder Casino',
    description: 'Play provably fair arcade games with points.',
    images: ['https://perun-casino.vercel.app/og-image.png'],
    creator: '@cratospl', // ✅ Twój Twitter (opcjonalnie)
  },
  
  // ✅ Manifest
  manifest: '/.well-known/farcaster.json',
  
  // ✅ Icons
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
    shortcut: '/icon.png',
  },
  
  // ✅ Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  
  // ✅ Theme color
  themeColor: '#0A0E27',
  
  // ✅ Keywords (for SEO)
  keywords: ['casino', 'arcade', 'games', 'provably fair', 'free', 'points', 'leaderboard', 'farcaster'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
