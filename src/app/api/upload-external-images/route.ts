import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import crypto from 'crypto';
import dns from 'dns/promises';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as { imageUrls: string[] };
    let { imageUrls } = body;

    if (!imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json({ error: 'Missing required field: imageUrls array' }, { status: 400 });
    }
    
    // De-duplicate
    imageUrls = Array.from(new Set(imageUrls));
    // Limit to prevent abuse
    imageUrls = imageUrls.slice(0, 10);

    let env: any = {};
    try {
      env = getCloudflareContext().env || {};
    } catch (e) {
      // Fallback
    }

    const s3AccessKey = env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
    const s3SecretKey = env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
    const s3Endpoint = env.R2_ENDPOINT || process.env.R2_ENDPOINT || env.AWS_ENDPOINT || process.env.AWS_ENDPOINT;
    const s3Bucket = env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || env.AWS_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
    const s3PublicUrl = env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || env.AWS_PUBLIC_URL || process.env.AWS_PUBLIC_URL;

    // If no S3 credentials, just return the external URLs as a fallback
    if (!s3AccessKey || !s3SecretKey || !s3Endpoint || !s3Bucket) {
      console.warn("S3/R2 credentials not fully configured. Returning original external URLs.");
      return NextResponse.json({ result: imageUrls });
    }

    const s3Client = new S3Client({
      region: "auto",
      endpoint: s3Endpoint,
      credentials: {
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretKey,
      },
    });

    const uploadedUrls: string[] = [];

    for (const url of imageUrls) {
      // 🛡️ Sentinel: Prevent Server-Side Request Forgery (SSRF)
      try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;

        // Check domain endings
        if (/^(localhost|127\.|192\.168\.|10\.|169\.254\.|::1|fd00:|fe80:)/.test(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
          console.warn(`Blocked SSRF attempt for URL: ${url}`);
          continue;
        }

        // 🛡️ Sentinel: Prevent DNS Rebinding & Octal IP SSRF
        // Resolve IP and check if it's private/loopback
        const lookupResult = await dns.lookup(hostname);
        const resolvedIp = lookupResult.address;

        if (/^(127\.|192\.168\.|10\.|169\.254\.|::1|fd00:|fe80:)/.test(resolvedIp)) {
           console.warn(`Blocked SSRF (DNS Rebinding/Private IP) attempt for URL: ${url}`);
           continue;
        }
      } catch (e) {
        continue; // Invalid URL
      }

      try {
        const response = await fetch(url);
        if (!response.ok) continue;

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        // Ensure it's an image
        if (!contentType.startsWith('image/')) continue;

        const ext = contentType.split('/')[1] || 'jpg';
        const fileKey = `crawled/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;

        await s3Client.send(new PutObjectCommand({
          Bucket: s3Bucket,
          Key: fileKey,
          Body: buffer,
          ContentType: contentType,
        }));

        const finalUrl = s3PublicUrl ? `${s3PublicUrl}/${fileKey}` : `${s3Endpoint}/${s3Bucket}/${fileKey}`;
        uploadedUrls.push(finalUrl);

      } catch (err) {
        console.error(`Failed to upload image ${url}`, err);
        // Fallback to original
        uploadedUrls.push(url);
      }
    }

    return NextResponse.json({ result: uploadedUrls });

  } catch (error) {
    console.error('Upload external images error:', error);
    return NextResponse.json({ error: 'Failed to process images' }, { status: 500 });
  }
}
