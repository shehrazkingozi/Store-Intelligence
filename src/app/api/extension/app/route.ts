import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  try {
    const app = await gplay.app({ appId: id });
    return NextResponse.json({
      success: true,
      data: {
        appId: app.appId,
        title: app.title,
        developer: app.developer,
        icon: app.icon,
        score: app.score,
        ratings: app.ratings,
        installs: app.installs,
        priceText: app.priceText,
        genre: app.genre,
        released: app.released,
        updated: new Date(app.updated).toLocaleDateString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
