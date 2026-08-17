import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';
import { supabase } from '@/lib/supabase';

// This API is triggered by Vercel Cron once a day at midnight.
// It fetches the top charts and adds them to our database tracking queue.
export async function GET(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase client not initialized' });
    }

    // Verify Vercel Cron Secret (optional but good practice)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log("CRON: Fetching top charts for daily tracking...");

    // Fetch Top 150 Free Games/Apps to track
    const topFree = await gplay.list({
      category: 'GAME' as any,
      collection: 'TOP_FREE' as any,
      num: 150,
      country: 'us'
    });

    // Prepare for bulk insert (Queueing)
    const appsToQueue = topFree.map((app: any) => ({
      app_id: app.appId.toString(),
      title: app.title,
      developer: app.developer,
      icon: app.icon,
      // We only insert static data here. The 10-minute queue processor will fetch descriptions/screenshots.
      updated_at: new Date().toISOString()
    }));

    // Bulk upsert into apps table (ignore duplicates so we don't overwrite full details if they exist)
    for (let i = 0; i < appsToQueue.length; i += 100) {
      const batch = appsToQueue.slice(i, i + 100);
      await supabase.from('apps').upsert(batch, { onConflict: 'app_id', ignoreDuplicates: true });
    }

    console.log(`CRON: Successfully queued ${appsToQueue.length} top apps for detailed tracking.`);

    return NextResponse.json({
      success: true,
      message: `Queued ${appsToQueue.length} apps for daily tracking.`
    });
  } catch (error: any) {
    console.error("CRON Error fetching top charts:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
