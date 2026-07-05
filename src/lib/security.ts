

export async function isInternalUrl(urlString: string): Promise<boolean> {
  try {
    const url = new URL(urlString);
    let hostname = url.hostname.toLowerCase();

    // Remove brackets for IPv6
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.substring(1, hostname.length - 1);
    }

    // Check for common internal hostnames
    if (hostname === 'localhost' || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      return true;
    }

    // Check for IPv6 loopback and unspecified
    if (hostname === '::1' || hostname === '::' || hostname === '0:0:0:0:0:0:0:1' || hostname === '0:0:0:0:0:0:0:0') {
      return true;
    }

    // Resolve the hostname using Cloudflare Workers compatible fetch to Cloudflare DNS over HTTPS
    // Fallback to basic string check if fetch fails or is not available
    let addresses: string[] = [];
    const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    if (!isIPv4 && hostname.includes('.')) {
      try {
        const dohResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, {
          headers: { 'accept': 'application/dns-json' }
        });
        if (dohResponse.ok) {
           const data = await dohResponse.json() as { Answer?: { type: number, data: string }[] };
           if (data.Answer) {
             addresses = data.Answer.filter((a) => a.type === 1 || a.type === 28).map((a) => a.data);
           }
        }
        if (addresses.length === 0) {
          // If no A/AAAA records, it might just be a string check
           addresses = [hostname];
        }
      } catch (_e) {
        // Fallback to hostname check if DoH fails
        addresses = [hostname];
      }
    } else {
      addresses = [hostname];
    }

    for (const ip of addresses) {
      if (
        ip === '::1' ||
        ip.startsWith('127.') ||
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        ip.startsWith('169.254.')
      ) {
        return true;
      }

      const parts = ip.split('.');
      if (parts.length === 4 && parts[0] === '172') {
        const secondPart = parseInt(parts[1], 10);
        if (secondPart >= 16 && secondPart <= 31) return true;
      }
    }

    return false;
  } catch (_e) {
    return true; // Fail secure
  }
}


/**
 * A safe fetch wrapper that prevents SSRF via HTTP redirects.
 */
export async function safeFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let currentUrl = url;
  let redirects = 0;
  const MAX_REDIRECTS = 5;

  while (redirects < MAX_REDIRECTS) {
    if (await isInternalUrl(currentUrl)) {
      throw new Error('SSRF Attempt: Blocked access to internal or private IP address');
    }

    const response = await fetch(currentUrl, {
      ...options,
      redirect: 'manual' // Do not follow redirects automatically
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        return response; // No location header, return as is
      }

      // Resolve relative URLs
      currentUrl = new URL(location, currentUrl).toString();
      redirects++;
    } else {
      return response;
    }
  }

  throw new Error('Too many redirects');
}
