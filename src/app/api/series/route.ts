import { NextResponse } from 'next/server';
import { getSeriesWithCounts } from '@/service/posts';

export async function GET() {
  try {
    const series = getSeriesWithCounts();
    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json([], { status: 500 });
  }
}