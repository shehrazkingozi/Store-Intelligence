import { NextResponse } from 'next/server';

export async function GET() {
  // Mock keywords data since live keyword ranking requires extensive tracking DB
  return NextResponse.json([
    { word: "fun game", volume: 85, rank: 3, previousRank: 5 },
    { word: "multiplayer", volume: 92, rank: 1, previousRank: 1 },
    { word: "action offline", volume: 45, rank: 12, previousRank: 8 },
    { word: "free strategy", volume: 60, rank: 5, previousRank: 15 }
  ]);
}
