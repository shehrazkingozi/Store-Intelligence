import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';
import store from 'app-store-scraper';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ success: false, error: 'Query q is required' });
  }

  // Clean the query by removing quotes
  const cleanQuery = q.replace(/["']/g, '').trim();

  try {
    // We will do a "Deep Search" to match or exceed ASO tools capabilities.
    // We search the exact term, plus term + "game", plus term + "app" to force Google Play to return clusters it might hide.
    const queries = [
      cleanQuery,
      `${cleanQuery} game`,
      `${cleanQuery} app`
    ];

    // Create promises for Google Play (Deep Search)
    const playStorePromises = queries.map(query => 
      gplay.search({
        term: query,
        num: 120,
        country: "us",
        lang: "en"
      }).catch((err: any) => {
        console.error("Gplay search error for query:", query, err);
        return [];
      })
    );

    // Create promise for App Store
    const appStorePromise = store.search({
      term: cleanQuery,
      num: 50,
      country: "us"
    }).catch((err: any) => {
      console.error("App Store search error:", err);
      return [];
    });

    // Run all searches concurrently for maximum speed
    const [playResults1, playResults2, playResults3, iosResults] = await Promise.all([
      ...playStorePromises,
      appStorePromise
    ]);

    // Merge and deduplicate Google Play results
    const uniquePlayApps = new Map();
    [...playResults1, ...playResults2, ...playResults3].forEach((app: any) => {
      if (!uniquePlayApps.has(app.appId)) {
        uniquePlayApps.set(app.appId, {
          appId: app.appId,
          title: app.title,
          developer: app.developer,
          icon: app.icon,
          summary: app.summary,
          score: app.score,
          scoreText: app.scoreText,
          priceText: app.priceText,
          free: app.free,
          store: 'playstore'
        });
      }
    });

    const finalPlayResults = Array.from(uniquePlayApps.values());

    // Process iOS results
    const finalIosResults = iosResults.map((app: any) => ({
      appId: app.appId, // iOS appId is usually a string of numbers or the bundle ID
      title: app.title,
      developer: app.developer,
      icon: app.icon,
      summary: app.summary || "",
      score: app.score,
      scoreText: app.score ? app.score.toFixed(1) : "",
      priceText: app.price === 0 ? "Free" : (app.price ? `$${app.price}` : ""),
      free: app.free,
      store: 'appstore'
    }));

    // Combine both stores. We'll interleave them or just put Play Store first then App Store,
    // or sort them by some relevance. Let's just combine and sort by score for a mixed feel.
    let combined = [...finalPlayResults, ...finalIosResults];
    
    // Calculate Relevance Score
    const lQuery = cleanQuery.toLowerCase();
    combined.forEach(app => {
      let rel = 0;
      const lTitle = app.title.toLowerCase();
      if (lTitle === lQuery) rel = 100;
      else if (lTitle.startsWith(lQuery)) rel = 50;
      else if (lTitle.includes(lQuery)) rel = 10;
      app.relevanceScore = rel;
    });

    // Sort by Relevance, then by app score (rating)
    combined.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return (b.score || 0) - (a.score || 0);
    });

    // Bulk insert searched apps into tracking queue
    try {
      if (supabase && combined.length > 0) {
        // Prepare minimal data for tracking queue
        const appsToQueue = combined.map(app => ({
          app_id: app.appId.toString(),
          title: app.title,
          developer: app.developer,
          icon: app.icon,
          // Do not overwrite existing full details if they exist
          updated_at: new Date().toISOString()
        }));
        
        // Upsert in batches of 100 to avoid request too large errors
        for (let i = 0; i < appsToQueue.length; i += 100) {
          const batch = appsToQueue.slice(i, i + 100);
          // onConflict 'app_id' ensures we don't insert duplicates.
          // By ignoring conflicts, we don't overwrite existing full descriptions/stats.
          await supabase.from('apps').upsert(batch, { onConflict: 'app_id', ignoreDuplicates: true });
        }
      }
    } catch (dbError) {
      console.error("Failed to queue searched apps:", dbError);
    }

    return NextResponse.json({
      success: true,
      data: combined
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
