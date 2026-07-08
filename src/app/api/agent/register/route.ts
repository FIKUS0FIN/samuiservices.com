import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { agent_name?: string };
    return NextResponse.json({
      registered: true,
      api_key: 'samui_agent_key_' + Math.random().toString(36).substring(2),
      agent_name: body.agent_name || 'AnonymousAgent',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
