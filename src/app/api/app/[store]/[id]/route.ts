import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ store: string; id: string }> }
) {
  const { store, id } = await params;

  if (store !== 'gplay') {
    return NextResponse.json({ success: false, error: 'Only gplay is supported in this stateless version' }, { status: 400 });
  }

  try {
    const app = await gplay.app({ appId: id });
    return NextResponse.json(app);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
