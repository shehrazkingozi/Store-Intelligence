import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'GAME';
  const country = searchParams.get('country') || 'us';

  try {
    const topFree = await gplay.list({
      category: category as any,
      collection: 'TOP_FREE' as any,
      num: 100,
      country: country,
    });

    const topNewFree = await gplay.list({
      category: category as any,
      collection: 'TOP_FREE' as any, // NEW_FREE is often deprecated/unstable in GPlay, fallback to TOP_FREE or empty
      num: 20,
      country: country,
    }).catch(() => []);

    const formatApp = (app: any) => ({
      appId: app.appId,
      title: app.title,
      developer: app.developer,
      icon: app.icon,
      rankChange: 0, // Mocked since we don't have historical DB in this stateless version
      installsText: app.installs || app.scoreText || "100K+",
    });

    const formattedTopFree = topFree.map(formatApp);

    // Mock biggest movers from topFree for demonstration
    const biggestMovers = formattedTopFree.slice(10, 20).map((app) => ({
      ...app,
      rankChange: Math.floor(Math.random() * 20) + 10
    }));

    return NextResponse.json({
      success: true,
      data: {
        topFree: formattedTopFree,
        topNewFree: topNewFree.map(formatApp),
        biggestMovers: biggestMovers,
        keywordCloud: [
          { word: "puzzle", movement: 2 },
          { word: "multiplayer", movement: 5 },
          { word: "action", movement: -1 },
          { word: "strategy", movement: 0 }
        ]
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
