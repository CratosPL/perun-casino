import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../lib/providers";
import { MiniKitProvider } from "../lib/minikit-provider";  // ← DODAJ
import { Navbar } from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "⚡ PERUN Casino | God of Thunder Games",
  description: "Enter the realm of Perun, Slavic God of Thunder. Buy Thunder Coins, play epic provably fair games, and claim divine rewards on Base blockchain.",
  keywords: "perun, casino, crypto, blockchain, base, thunder, games, gambling, web3",
  authors: [{ name: "PERUN Casino" }],
  openGraph: {
    title: "⚡ PERUN Casino | God of Thunder Games",
    description: "Enter the realm of Perun. Buy Thunder Coins, play epic games, claim divine rewards.",
    type: "website",
    locale: "en_US",
    siteName: "PERUN Casino",
  },
  twitter: {
    card: "summary_large_image",
    title: "⚡ PERUN Casino | God of Thunder Games",
    description: "Enter the realm of Perun. Buy Thunder Coins, play epic games.",
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
        <MiniKitProvider>  {/* ← DODAJ */}
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </MiniKitProvider>  {/* ← DODAJ */}
      </body>
    </html>
  );
}
