import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  
  return new NextResponse(JSON.stringify({
    "linkset": [
      {
        "anchor": `${origin}/api`,
        "service-desc": [
          {
            "href": `${origin}/openapi.json`,
            "type": "application/openapi+json"
          }
        ],
        "service-doc": [
          {
            "href": `${origin}/docs`,
            "type": "text/html"
          }
        ],
        "status": [
          {
            "href": `${origin}/api/health`
          }
        ]
      }
    ]
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/linkset+json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    }
  });
}
