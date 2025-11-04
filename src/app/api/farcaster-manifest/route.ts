import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    frame: {
      version: "next",
      name: "Perun Casino",
      iconUrl: "https://perun-casino.vercel.app/icon.png",
      homeUrl: "https://perun-casino.vercel.app",
      imageUrl: "https://perun-casino.vercel.app/og-image.png",
      splashImageUrl: "https://perun-casino.vercel.app/splash.png",
      splashBackgroundColor: "#0A0E27",
      webhookUrl: "https://perun-casino.vercel.app/api/webhook"
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
