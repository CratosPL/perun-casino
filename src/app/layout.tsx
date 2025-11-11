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
        url: 'https://perun-casino.vercel.app/api/og',
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
    images: ['https://perun-casino.vercel.app/api/og'],
    creator: '@cratospl',
  },
  
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
      <head>
        {/* ✅ Explicit Farcaster Frame Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://perun-casino.vercel.app/api/og" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        
        {/* ✅ Explicit Open Graph */}
        <meta property="og:title" content="Thunder Casino" />
        <meta property="og:description" content="God of Thunder Games - Play provably fair arcade games" />
        <meta property="og:image" content="https://perun-casino.vercel.app/api/og" />
        <meta property="og:url" content="https://perun-casino.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Thunder Casino" />
        
        {/* ✅ Explicit Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Thunder Casino" />
        <meta name="twitter:description" content="Play provably fair arcade games with points" />
        <meta name="twitter:image" content="https://perun-casino.vercel.app/api/og" />
        <meta name="twitter:creator" content="@cratospl" />
      </head>
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
