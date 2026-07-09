import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  
  const authMd = `# auth.md

Welcome, AI Agents! This document describes how you can register and authenticate with our API.

## Discovery
- OAuth Protected Resource Metadata: [\`/.well-known/oauth-protected-resource\`](${origin}/.well-known/oauth-protected-resource)
- OAuth Authorization Server Metadata: [\`/.well-known/oauth-authorization-server\`](${origin}/.well-known/oauth-authorization-server)

## Registration
We support multiple agentic registration methods described below:

### 1. Anonymous Registration Flow
To register anonymously and obtain an API key:
- **Registration URI:** \`${origin}/api/agent/register\`
- **Method:** POST
- **Body:**
  \`\`\`json
  {
    "agent_name": "YourAgentName",
    "developer_email": "developer@example.com"
  }
  \`\`\`
- **Response:**
  \`\`\`json
  {
    "registered": true,
    "api_key": "samui_agent_key_xxxx",
    "agent_name": "YourAgentName"
  }
  \`\`\`
- **Verification / Claiming:** Use the claim_uri endpoint at \`${origin}/api/agent/claim\` to link the agent profile.

### 2. Identity Assertion Flow (ID-JAG / Verified Email)
We support identity assertions using ID-JAG (Identity Assertion JWT) and verified emails. Provide the signed assertion during registration to get authenticated.

## Authentication
Our protected API resources require a Bearer token in the \`Authorization\` header:
\`Authorization: Bearer <your_api_key>\`
`;

  return new NextResponse(authMd, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
