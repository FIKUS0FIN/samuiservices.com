import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

const markdownText = `# Skill: Search listings on Samui Services

This skill allows agents to search for local businesses, services, restaurants, and real estate in Koh Samui.

## Usage
Query the API endpoint \`/api/search\` with the query parameter \`q\` or \`category\`.

### Example
\`GET https://samuiservices.com/api/search?q=builders\`
`;

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  
  // Compute SHA-256 digest dynamically
  const digestHex = crypto.createHash('sha256').update(markdownText).digest('hex');
  const digest = `sha256:${digestHex}`;
  
  return NextResponse.json({
    "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    "skills": [
      {
        "name": "search-listings",
        "type": "skill-md",
        "description": "Search and retrieve business listing data from Samui Services",
        "url": `${origin}/.well-known/agent-skills/search-listings.md`,
        "digest": digest
      }
    ]
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    }
  });
}
