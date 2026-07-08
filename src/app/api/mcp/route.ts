import { NextResponse } from 'next/server';

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('event: endpoint\ndata: "/api/mcp"\n\n'));
      controller.close();
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as any;
    if (body.method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id || null,
        result: {
          tools: [
            {
              name: 'search_listings',
              description: 'Search for businesses or services on Koh Samui',
              inputSchema: {
                type: 'object',
                properties: {
                  query: { type: 'string', description: 'Search keyword' },
                  category: { type: 'string', description: 'Category slug' }
                }
              }
            }
          ]
        }
      });
    }
    
    return NextResponse.json({
      jsonrpc: '2.0',
      id: body.id || null,
      error: {
        code: -32601,
        message: 'Method not found'
      }
    }, { status: 404 });
  } catch {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: 'Parse error'
      }
    }, { status: 400 });
  }
}
