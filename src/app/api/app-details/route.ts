import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get('appId');

  if (!appId) {
    return NextResponse.json({ success: false, error: 'appId is required' });
  }

  try {
    const details = await gplay.app({ appId });
    return NextResponse.json({
      success: true,
      data: {
        installs: details.installs,
        maxInstalls: details.maxInstalls,
        score: details.score,
        ratings: details.ratings,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
