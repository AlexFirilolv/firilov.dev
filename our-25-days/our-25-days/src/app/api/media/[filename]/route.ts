import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  // TODO: Implement media serving logic
  return NextResponse.json({ message: `Serving media ${params.filename}` });
} 