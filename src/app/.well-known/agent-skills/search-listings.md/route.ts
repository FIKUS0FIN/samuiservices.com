import { NextResponse } from 'next/server';

export async function GET() {
  const markdownText = `# Skill: Search listings on Samui Services

This skill allows agents to search for local businesses, services, restaurants, and real estate in Koh Samui.

## Usage
Query the API endpoint \`/api/search\` with the query parameter \`q\` or \`category\`.

### Example
\`GET https://samuiservices.com/api/search?q=builders\`
`;

  return new NextResponse(markdownText, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
