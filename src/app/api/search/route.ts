import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ success: false, error: 'Query q is required' });
  }

  try {
    const results = await gplay.search({
      term: q,
      num: 120, // Maximize the limit to fetch as many as possible
      country: "us",
      lang: "en"
    });

    const formattedResults = results.map((app: any) => ({
      appId: app.appId,
      title: app.title,
      developer: app.developer,
      icon: app.icon,
      summary: app.summary,
      score: app.score,
      scoreText: app.scoreText,
      priceText: app.priceText,
      free: app.free,
    }));

    return NextResponse.json({
      success: true,
      data: formattedResults
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
