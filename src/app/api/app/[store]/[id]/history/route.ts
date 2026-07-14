import { NextResponse } from 'next/server';

export async function GET() {
  // Mock rank history chart data
  const dates = [];
  const ranks = [];
  const d = new Date();
  for (let i = 30; i >= 0; i--) {
    const temp = new Date(d);
    temp.setDate(temp.getDate() - i);
    dates.push(temp.toISOString().split('T')[0]);
    ranks.push(Math.floor(Math.random() * 50) + 10); // Random rank between 10 and 60
  }

  return NextResponse.json({
    dates,
    ranks
  });
}
