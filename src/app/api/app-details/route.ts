import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';
import storeScraper from 'app-store-scraper';
import { supabase } from '@/lib/supabase';

// Simple in-memory cache to prevent fetching the same app repeatedly
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get('appId');
  const store = searchParams.get('store') || 'playstore';

  if (!appId) {
    return NextResponse.json({ success: false, error: 'appId is required' });
  }

  const cacheKey = `${store}_${appId}`;

  // Check cache first
  const now = Date.now();
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_TTL)) {
    return NextResponse.json({
      success: true,
      data: cache[cacheKey].data,
      cached: true
    });
  }

  try {
    let details: any;

    if (store === 'appstore') {
      // Fetch from Apple App Store
      details = await storeScraper.app({ appId, country: 'us' });
      
      // Standardize Apple data to match Google Play structure for DB
      details = {
        appId: details.appId.toString(),
        title: details.title,
        developer: details.developer,
        icon: details.icon,
        genre: details.primaryGenre,
        released: details.released,
        installs: "N/A (iOS)",
        maxInstalls: 0,
        score: details.score,
        ratings: details.reviews,
        reviews: details.reviews,
      };
    } else {
      // Fetch from Google Play Store
      details = await gplay.app({ appId });
    }
    
    const responseData = {
      installs: details.installs || "N/A",
      maxInstalls: details.maxInstalls || 0,
      score: details.score || 0,
      ratings: details.ratings || 0,
      released: details.released || "N/A",
      genre: details.genre || "App",
    };

    // Save to cache
    cache[cacheKey] = {
      data: responseData,
      timestamp: now
    };

    // Background Database Saving (Fire and Forget)
    (async () => {
      try {
        if (!supabase) return;

        // 1. Upsert into apps table (Static Data)
        await supabase.from('apps').upsert({
          app_id: details.appId,
          title: details.title,
          developer: details.developer,
          icon: details.icon,
          genre: details.genre,
          released: details.released,
          updated_at: new Date().toISOString()
        }, { onConflict: 'app_id' });

        // 2. Upsert into daily_stats table (Dynamic Data)
        const today = new Date().toISOString().split('T')[0];
        await supabase.from('daily_stats').upsert({
          app_id: details.appId,
          date: today,
          installs: details.installs,
          max_installs: details.maxInstalls,
          score: details.score,
          ratings: details.ratings,
          reviews: details.reviews,
        }, { onConflict: 'app_id,date' });
      } catch (dbError) {
        console.error("Failed to save to database in background", dbError);
      }
    })();

    return NextResponse.json({
      success: true,
      data: responseData,
      cached: false
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
