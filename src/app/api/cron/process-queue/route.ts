import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';
import { supabase } from '@/lib/supabase';

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This API is triggered by Vercel Cron every 10 minutes.
// It processes a chunk of 10 apps that haven't been updated today.
export async function GET(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase client not initialized' });
    }

    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log("CRON: Processing background queue...");

    const today = new Date().toISOString().split('T')[0];

    // Find up to 10 apps that don't have a daily_stats entry for today
    // OR apps whose updated_at date is before today
    const { data: appsToProcess, error: fetchError } = await supabase
      .from('apps')
      .select('app_id')
      .order('updated_at', { ascending: true }) // Oldest updated first
      .limit(10);

    if (fetchError || !appsToProcess || appsToProcess.length === 0) {
      return NextResponse.json({ success: true, message: "No apps in queue to process." });
    }

    console.log(`CRON: Picked ${appsToProcess.length} apps to process.`);
    
    let successCount = 0;

    // Process sequentially with a delay to avoid rate limiting
    for (const appRecord of appsToProcess) {
      const appId = appRecord.app_id;
      
      try {
        console.log(`CRON: Fetching full details for ${appId}`);
        const details = await gplay.app({ appId });
        
        // 1. Update static info (description, screenshots, etc.)
        // This ensures the database always has the latest app info
        await supabase.from('apps').update({
          title: details.title,
          developer: details.developer,
          icon: details.icon,
          genre: details.genre,
          released: details.released,
          description: details.description,
          screenshots: details.screenshots,
          updated_at: new Date().toISOString()
        }).eq('app_id', appId);

        // 2. Insert into daily_stats
        await supabase.from('daily_stats').upsert({
          app_id: appId,
          date: today,
          installs: details.installs,
          max_installs: details.maxInstalls,
          score: details.score,
          ratings: details.ratings,
          reviews: details.reviews,
        }, { onConflict: 'app_id,date' });

        successCount++;
        
        // Small delay (500ms) before the next app to play nice with Google Play servers
        await delay(500);
      } catch (err) {
        console.error(`CRON: Failed to process app ${appId}:`, err);
        // Even if it fails, update its timestamp so we don't get stuck in a loop trying it every 10 mins
        await supabase.from('apps').update({
          updated_at: new Date().toISOString()
        }).eq('app_id', appId);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${successCount} out of ${appsToProcess.length} apps.`
    });
  } catch (error: any) {
    console.error("CRON Error processing queue:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
