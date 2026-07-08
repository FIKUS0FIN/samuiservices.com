import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  
  return NextResponse.json({
    "serverInfo": {
      "name": "Samui Services MCP Server",
      "version": "1.0.0"
    },
    "endpoint": `${origin}/api/mcp`,
    "capabilities": {
      "tools": [
        {
          "name": "search_listings",
          "description": "Search for businesses or services on Koh Samui",
          "inputSchema": {
            "type": "object",
            "properties": {
              "query": { "type": "string", "description": "Search keyword" },
              "category": { "type": "string", "description": "Category slug" }
            }
          }
        }
      ]
    }
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    }
  });
}
