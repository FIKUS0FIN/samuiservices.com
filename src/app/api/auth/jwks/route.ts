import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    keys: [
      {
        kty: 'RSA',
        use: 'sig',
        kid: 'mock-key-id',
        alg: 'RS256',
        n: 'mock-modulus',
        e: 'AQAB',
      }
    ]
  });
}
