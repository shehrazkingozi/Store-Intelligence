import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

// Simple in-memory cache to prevent fetching the same app repeatedly
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get('appId');

  if (!appId) {
    return NextResponse.json({ success: false, error: 'appId is required' });
  }

  // Check cache first
  const now = Date.now();
  if (cache[appId] && (now - cache[appId].timestamp < CACHE_TTL)) {
    return NextResponse.json({
      success: true,
      data: cache[appId].data,
      cached: true
    });
  }

  try {
    const details = await gplay.app({ appId });
    
    const responseData = {
      installs: details.installs,
      maxInstalls: details.maxInstalls,
      score: details.score,
      ratings: details.ratings,
      released: details.released,
      genre: details.genre,
    };

    // Save to cache
    cache[appId] = {
      data: responseData,
      timestamp: now
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      cached: false
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
