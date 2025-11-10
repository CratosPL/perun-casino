// src/app/api/farcaster-manifest/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjMzMjMzMiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJFNzE5MzZlYUQwQTY4MTZiZmIzRUIwNmVjYTEwQWQyOGU4NTg4NGEifQ",
      payload: "eyJkb21haW4iOiJwZXJ1bi1jYXNpbm8udmVyY2VsLmFwcCJ9",
      signature: "GKVHAxQGgNVy+tgophs8pi37jAbzJqrsBE0/7/Xk3pEWtstm0HfrWMef9F6oJgvDu+3QySh9ug9rAqCHuDZidBw="
    },
    miniapp: {
      version: "1",
      name: "Perun Casino",
      subtitle: "Free Arcade Games", // ✅ ZMIENIONE: God of Thunder → Free Arcade
      description: "Play provably fair arcade games with points. Compete on leaderboards, claim daily bonuses, and have fun. No crypto required.", // ✅ ZMIENIONE: usunięto Thunder Coins/USDC
      primaryCategory: "games",
      tags: ["arcade", "leaderboard", "points", "free", "casino"], // ✅ ZMIENIONE: crypto → points, base → free
      tagline: "Play. Compete. Win.", // ✅ ZMIENIONE: Convert → Win
      iconUrl: "https://perun-casino.vercel.app/icon.png",
      homeUrl: "https://perun-casino.vercel.app",
      splashImageUrl: "https://perun-casino.vercel.app/splash.png",
      splashBackgroundColor: "#0A0E27",
      webhookUrl: "https://perun-casino.vercel.app/api/webhook",
      requiredChains: ["eip155:8453"], // Można zostawić dla przyszłości
      requiredCapabilities: [
        "wallet.getEthereumProvider",
        "actions.signIn"
      ]
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
