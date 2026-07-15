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
    const topFreeAll = await gplay.list({
      category: category as any,
      collection: 'TOP_FREE' as any,
      num: 150,
      country: country,
    });
    
    const topFree = topFreeAll.slice(0, 100);

    // Fetch details for the top 80 to get release dates and identify the genuinely newest
    // To avoid rate limiting and long latency, we limit to the top 80 candidates.
    const candidateApps = topFreeAll.slice(0, 80);
    const appDetailsPromises = candidateApps.map((app: any) => 
      gplay.app({ appId: app.appId }).catch(() => null)
    );
    
    const detailedApps = await Promise.all(appDetailsPromises);
    const validDetailedApps = detailedApps.filter(app => app && app.released);
    
    // Sort by release date descending (newest first)
    validDetailedApps.sort((a, b) => {
      const dateA = new Date(a?.released || 0).getTime();
      const dateB = new Date(b?.released || 0).getTime();
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });

    const topNewFreeRaw = validDetailedApps.slice(0, 20);

    const formatApp = (app: any) => ({
      appId: app.appId,
      title: app.title,
      developer: app.developer,
      icon: app.icon,
      rankChange: 0, 
      installsText: app.installs || app.scoreText || "100K+",
    });

    // If for some reason we couldn't fetch details, we use the fallback
    const topNewFree = topNewFreeRaw.length > 0 
      ? topNewFreeRaw.map(formatApp) 
      : topFreeAll.slice(100, 120).map(formatApp);

    const formattedTopFree = topFree.map(formatApp);

    return NextResponse.json({
      success: true,
      data: {
        topFree: formattedTopFree,
        topNewFree: topNewFree,
        biggestMovers: [],
        keywordCloud: extractKeywords(topFree)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
