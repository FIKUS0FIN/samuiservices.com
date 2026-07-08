import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    claimed: true,
    message: 'Agent profile linked successfully.'
  });
}
