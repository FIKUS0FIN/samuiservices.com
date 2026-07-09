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
    "subject_types_supported": ["public"],
    "id_token_signing_alg_values_supported": ["RS256"],
    "agent_auth": {
      "skill": `${origin}/auth.md`,
      "register_uri": `${origin}/api/agent/register`,
      "identity_types_supported": ["anonymous", "identity_assertion"],
      "anonymous": {
        "credential_types_supported": ["api_key"]
      },
      "identity_assertion": {
        "assertion_types_supported": ["urn:ietf:params:oauth:token-type:id-jag", "verified_email"],
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
