import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get('appId');

  if (!appId) {
    return NextResponse.json({ success: false, error: 'No appId provided' }, { status: 400 });
  }

  try {
    const app = await gplay.app({ appId });
    const genreId = app.genreId;

    if (!genreId) {
      return NextResponse.json({ success: true, rank: null, category: null });
    }

    const list = await (gplay as any).list({
      category: genreId,
      collection: (gplay as any).collection.TOP_FREE,
      num: 200
    });

    const index = list.findIndex((a: any) => a.appId === appId);
    if (index !== -1) {
      return NextResponse.json({ success: true, rank: index + 1, category: genreId });
    } else {
      return NextResponse.json({ success: true, rank: '> 200', category: genreId });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
