import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "./layout-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "⚡ Thunder Casino | God of Thunder Games",
  description: "Play provably fair arcade games with points. Compete on leaderboards, claim daily bonuses, and have fun. Free to play.",
  
  openGraph: {
    type: 'website',
    url: 'https://perun-casino.vercel.app',
    title: 'Thunder Casino',
    siteName: 'Thunder Casino',
    description: 'God of Thunder Games - Play provably fair arcade games with points.',
    images: [
      {
        url: 'https://perun-casino.vercel.app/api/og', // ✅ ZMIENIONE Z /og-image.png
        width: 1200,
        height: 630,
        alt: 'Thunder Casino - God of Thunder Games',
      },
    ],
    locale: 'en_US',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Thunder Casino',
    description: 'Play provably fair arcade games with points.',
    images: ['https://perun-casino.vercel.app/api/og'], // ✅ ZMIENIONE Z /og-image.png
    creator: '@cratospl',
  },
  
  // ✅ DODAJ FARCASTER FRAME TAGS:
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://perun-casino.vercel.app/api/og',
    'fc:frame:image:aspect_ratio': '1.91:1',
    'og:image': 'https://perun-casino.vercel.app/api/og',
  },
  
  manifest: '/.well-known/farcaster.json',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
    shortcut: '/icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#0A0E27',
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
