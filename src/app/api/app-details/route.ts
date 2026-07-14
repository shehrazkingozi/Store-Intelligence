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
    let similarApps: any[] = [];

    if (store === 'appstore') {
      // Fetch from Apple App Store
      details = await storeScraper.app({ appId, country: 'us' });
      
      try {
        similarApps = await storeScraper.similar({ appId, country: 'us' });
      } catch (e) {
        console.error("Failed to fetch similar apps for iOS", e);
      }

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
        description: details.description,
        screenshots: details.screenshots,
        url: details.url,
        similar_apps: similarApps
      };
    } else {
      // Fetch from Google Play Store
      details = await gplay.app({ appId });
      try {
        similarApps = await gplay.similar({ appId });
      } catch (e) {
        console.error("Failed to fetch similar apps for Google Play", e);
      }
      details.similar_apps = similarApps;
    }
    
    const responseData = {
      appId: details.appId,
      title: details.title,
      icon: details.icon,
      developer: details.developer,
      installs: details.installs || "N/A",
      maxInstalls: details.maxInstalls || 0,
      score: details.score || 0,
      ratings: details.ratings || 0,
      released: details.released || "N/A",
      genre: details.genre || "App",
      description: details.description || "",
      screenshots: details.screenshots || [],
      similar_apps: details.similar_apps || [],
      url: details.url || "",
      store: store
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

        // Check if title or description changed
        const { data: existingApp } = await supabase
          .from('apps')
          .select('title, description')
          .eq('app_id', details.appId)
          .single();

        let shouldSaveHistory = false;
        if (!existingApp || existingApp.title !== details.title || existingApp.description !== details.description) {
          shouldSaveHistory = true;
        }

        // 1. Upsert into apps table (Static Data)
        await supabase.from('apps').upsert({
          app_id: details.appId,
          title: details.title,
          developer: details.developer,
          icon: details.icon,
          genre: details.genre,
          released: details.released,
          description: details.description,
          screenshots: details.screenshots,
          similar_apps: details.similar_apps,
          updated_at: new Date().toISOString()
        }, { onConflict: 'app_id' });

        // 2. Insert into app_history if changed
        if (shouldSaveHistory) {
          await supabase.from('app_history').insert({
            app_id: details.appId,
            title: details.title,
            description: details.description
          });
        }

        // 3. Upsert into daily_stats table (Dynamic Data)
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
