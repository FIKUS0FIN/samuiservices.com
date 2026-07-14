import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/markdown')) {
    const { pathname } = request.nextUrl;
    
    let rewriteUrl = null;
    if (pathname === '/') {
      rewriteUrl = '/llms.txt';
    } else {
      const listingMatch = pathname.match(/^\/listing\/([^/]+)$/);
      if (listingMatch) {
        rewriteUrl = `/api/agent/listing/${listingMatch[1]}`;
      }
    }
    
    if (rewriteUrl) {
      const url = request.nextUrl.clone();
      url.pathname = rewriteUrl;
      return NextResponse.rewrite(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/listing/:slug*'],
};
