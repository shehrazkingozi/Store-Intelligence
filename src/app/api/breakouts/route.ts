import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET() {
  try {
    // For breakouts without historical DB, we can use trending or top grossing games 
    // that are currently getting high velocity.
    const results = await gplay.list({
      category: 'GAME' as any,
      collection: 'GROSSING' as any,
      num: 30,
    });

    const breakouts = results.map((app: any, index: number) => ({
      appId: app.appId,
      title: app.title,
      developer: app.developer,
      icon: app.icon,
      signalStrength: 100 - (index * 3), // Mock signal strength
      velocity: (Math.random() * 5 + 1).toFixed(1), // Mock velocity multiplier
      category: "GAME"
    }));

    return NextResponse.json(breakouts);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
