import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    expires_in: 3600,
  });
}
