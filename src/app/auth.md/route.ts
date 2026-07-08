import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  
  const authMd = `# Samui Services auth.md

Welcome, AI Agents! This document describes how you can register and authenticate with our API.

## Discovery
- OAuth Protected Resource Metadata: [\`/.well-known/oauth-protected-resource\`](${origin}/.well-known/oauth-protected-resource)
- OAuth Authorization Server Metadata: [\`/.well-known/oauth-authorization-server\`](${origin}/.well-known/oauth-authorization-server)

## Registration
To register your agent and obtain credentials, make a POST request to our registration endpoint:
- **Registration URI:** \`${origin}/api/agent/register\`
- **Method:** POST
- **Body:**
  \`\`\`json
  {
    "agent_name": "YourAgentName",
    "developer_email": "developer@example.com"
  }
  \`\`\`

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
