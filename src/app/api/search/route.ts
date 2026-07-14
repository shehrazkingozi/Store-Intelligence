import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
  }

  try {
    const results = await gplay.search({
      term: q,
      num: 20,
      country: 'us',
    });

    const formatted = results.map((app: any) => ({
      appId: app.appId,
      title: app.title,
      developer: app.developer,
      icon: app.icon,
      score: app.score,
      priceText: app.price === 0 ? "Free" : app.priceText || "Free"
    }));

    return NextResponse.json({
      success: true,
      data: formatted
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
