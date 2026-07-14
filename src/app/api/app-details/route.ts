import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';
import { supabase } from '@/lib/supabase';

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

    // Background Database Saving (Fire and Forget)
    // We do this asynchronously so it doesn't slow down the UI response
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
        }, { onConflict: 'app_id,date' }); // Requires unique_app_date constraint
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
