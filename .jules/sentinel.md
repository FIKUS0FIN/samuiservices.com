## 2024-05-16 - [Fix SSRF bypasses via Cloudflare DNS over HTTPS]
**Vulnerability:** External fetch endpoints (`api/ai/crawl` and `api/upload-external-images`) were vulnerable to Server-Side Request Forgery (SSRF) and DNS rebinding attacks because they only checked hostnames directly instead of resolving them to IPs.
**Learning:** Using `dns/promises` is not supported on Cloudflare Workers/Edge environments. Doing so breaks URL checking completely.
**Prevention:** Instead of native Node.js `dns` module, use Cloudflare's DNS over HTTPS API (`https://cloudflare-dns.com/dns-query`) using `fetch` with the `application/dns-json` accept header to resolve hostnames to IP addresses before checking against internal IP ranges.
