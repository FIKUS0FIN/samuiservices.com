import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  
  return NextResponse.json({
    "issuer": origin,
    "authorization_endpoint": `${origin}/api/auth/signin`,
    "token_endpoint": `${origin}/api/auth/token`,
    "jwks_uri": `${origin}/api/auth/jwks`,
    "grant_types_supported": ["authorization_code", "client_credentials"],
    "response_types_supported": ["code", "token"],
    "agent_auth": {
      "skill": "agent-registration",
      "register_uri": `${origin}/api/agent/register`,
      "identity_types_supported": ["anonymous"],
      "anonymous": {
        "credential_types_supported": ["api_key"]
      },
      "claim_uri": `${origin}/api/agent/claim`
    }
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    }
  });
}
