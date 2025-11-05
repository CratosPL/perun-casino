import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../lib/providers";
import { MiniKitProvider } from "../lib/minikit-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "⚡ PERUN Casino | God of Thunder Games",
  description: "Enter the realm of Perun, Slavic God of Thunder. Buy Thunder Coins, play epic provably fair games, and claim divine rewards on Base blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MiniKitProvider>
          <Providers>
            {children}
          </Providers>
        </MiniKitProvider>
      </body>
    </html>
  );
}
