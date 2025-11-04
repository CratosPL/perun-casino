const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const minikitConfig = {
  accountAssociation: {
    // Wypełnimy później po deployment
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    version: "1",
    name: "PERUN Casino",
    subtitle: "Virtual Coins Gambling",
    description: "Buy PERUN coins with crypto, play provably fair games, compete for monthly rewards",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0A0A0A",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["casino", "gaming", "crypto", "rewards"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Play. Win. Compete.",
    ogTitle: "PERUN Casino - Virtual Coins Gambling",
    ogDescription: "Buy coins, play provably fair games, win monthly rewards",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
  },
} as const;
