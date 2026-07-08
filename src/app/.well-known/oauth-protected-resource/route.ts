import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  
  return NextResponse.json({
    "resource": origin,
    "authorization_servers": [
      origin
    ],
    "scopes_supported": [
      "read:listings",
      "write:listings"
    ],
    "bearer_methods_supported": [
      "header"
    ]
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    }
  });
}
