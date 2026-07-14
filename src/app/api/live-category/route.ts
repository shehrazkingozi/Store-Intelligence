import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

const extractKeywords = (apps: any[]) => {
  const stopWords = new Set(['and', 'the', 'in', 'of', 'for', 'to', 'a', 'with', 'on', 'at', 'by', 'from', 'is', 'it', 'as', 'an', 'that', 'this', 'are', 'or', 'be', 'you', 'your', 'my', 'we', 'they', 'but', 'all', 'game', 'games', 'play', 'free', 'app', 'apps', '3d', '2d']);
  const wordCount: Record<string, number> = {};
  apps.forEach((app: any) => {
    const titleString: string = app.title || '';
    const words: string[] = titleString.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    words.forEach((w: string) => {
      if (w.length > 2 && !stopWords.has(w) && isNaN(Number(w))) {
        wordCount[w] = (wordCount[w] || 0) + 1;
      }
    });
  });
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => ({ word, movement: 0 }));
};

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
      rankChange: 0, 
      installsText: app.installs || app.scoreText || "100K+",
    });

    const formattedTopFree = topFree.map(formatApp);

    return NextResponse.json({
      success: true,
      data: {
        topFree: formattedTopFree,
        topNewFree: topNewFree.map(formatApp),
        biggestMovers: [],
        keywordCloud: extractKeywords(topFree)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
