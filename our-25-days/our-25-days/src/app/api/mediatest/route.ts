import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // TODO: Implement media test logic
  return NextResponse.json({ message: `Media test route` });
} 