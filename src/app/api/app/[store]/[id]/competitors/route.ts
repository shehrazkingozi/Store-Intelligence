import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ store: string; id: string }> }
) {
  const { store, id } = await params;
  if (store !== 'gplay') return NextResponse.json([]);

  try {
    const similar = await gplay.similar({ appId: id });
    return NextResponse.json(similar);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
