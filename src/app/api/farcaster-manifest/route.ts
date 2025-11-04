import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjMzMjMzMiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJFNzE5MzZlYUQwQTY4MTZiZmIzRUIwNmVjYTEwQWQyOGU4NTg4NGEifQ",
      payload: "eyJkb21haW4iOiJwZXJ1bi1jYXNpbm8udmVyY2VsLmFwcCJ9",
      signature: "GKVHAxQGgNVy+tgophs8pi37jAbzJqrsBE0/7/Xk3pEWtstm0HfrWMef9F6oJgvDu+3QySh9ug9rAqCHuDZidBw="
    },
    frame: {
      version: "next",
      name: "Perun Casino",
      subtitle: "God of Thunder Games",
      description: "Arcade mini-games with Thunder Coins. Buy coins with USDC, play provably fair games, compete on leaderboards. Convert coins back anytime. Small stakes fun on Base.",
      primaryCategory: "games",
      tags: ["arcade", "leaderboard", "base", "crypto", "casual"],
      tagline: "Play. Compete. Convert.",
      iconUrl: "https://perun-casino.vercel.app/icon.png",
      homeUrl: "https://perun-casino.vercel.app",
      imageUrl: "https://perun-casino.vercel.app/og-image.png",
      splashImageUrl: "https://perun-casino.vercel.app/splash.png",
      splashBackgroundColor: "#0A0E27",
      webhookUrl: "https://perun-casino.vercel.app/api/webhook"
    }
  };

  return NextResponse.json(manifest);
}
