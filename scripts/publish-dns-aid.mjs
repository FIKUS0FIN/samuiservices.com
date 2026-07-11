import dns from 'dns/promises';

const token = process.env.CLOUDFLARE_API_TOKEN;
const domain = 'samuiservices.com';

if (!token) {
  console.log('⚠️ CLOUDFLARE_API_TOKEN is not set. Skipping DNS-AID record publishing.');
  process.exit(0);
}

async function run() {
  console.log(`Starting DNS-AID publishing for ${domain}...`);

  try {
    // 1. Fetch Zone ID
    const zoneRes = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${domain}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!zoneRes.ok) {
      throw new Error(`Failed to fetch zone info: ${zoneRes.statusText} (${zoneRes.status})`);
    }

    const zoneData = await zoneRes.json();
    if (!zoneData.success || zoneData.result.length === 0) {
      throw new Error(`Zone ${domain} not found or API token lacks permission to list zones.`);
    }

    const zoneId = zoneData.result[0].id;
    console.log(`Resolved Zone ID: ${zoneId}`);

    // 2. Fetch existing DNS records for the zone
    const dnsRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=100`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!dnsRes.ok) {
      throw new Error(`Failed to list DNS records: ${dnsRes.statusText} (${dnsRes.status})`);
    }

    const dnsData = await dnsRes.json();
    if (!dnsData.success) {
      throw new Error('Failed to parse DNS records response.');
    }

    const existingRecords = dnsData.result;
    console.log(`Fetched ${existingRecords.length} existing DNS records.`);

    // 3. Define target records
    const targetRecords = [
      { name: `_index._agents.${domain}`, type: 'SVCB', content: `1 ${domain}. alpn="a2a" port=443 mandatory=alpn,port` },
      { name: `_index._agents.${domain}`, type: 'HTTPS', content: `1 ${domain}. alpn="a2a" port=443 mandatory=alpn,port` },
      { name: `_a2a._agents.${domain}`, type: 'SVCB', content: `1 ${domain}. alpn="a2a" port=443 mandatory=alpn,port` },
      { name: `_a2a._agents.${domain}`, type: 'HTTPS', content: `1 ${domain}. alpn="a2a" port=443 mandatory=alpn,port` },
    ];

    for (const target of targetRecords) {
      // Check if exact record already exists
      const match = existingRecords.find(
        (r) => r.name.toLowerCase() === target.name.toLowerCase() && r.type === target.type
      );

      if (match) {
        // Compare content (stripping quotes or normalized spacing if necessary, or just simple check)
        const normalize = (c) => c.replace(/\s+/g, ' ').trim().replace(/\"/g, '"');
        const matchContent = match.content || '';
        if (normalize(matchContent) === normalize(target.content)) {
          console.log(`✅ Record ${target.type} for ${target.name} already exists with correct content. Skipping.`);
          continue;
        }

        // If content differs, delete the old record first
        console.log(`🔄 Record content mismatch for ${target.name} (${target.type}). Deleting old record...`);
        const delRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${match.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!delRes.ok) {
          console.warn(`Failed to delete record ${match.id}: ${delRes.statusText}`);
        } else {
          console.log(`Deleted record ${match.id}.`);
        }
      }

      // Create new record
      console.log(`➕ Creating ${target.type} record for ${target.name}...`);
      
      // Try BIND format content payload first
      let createRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: target.type,
          name: target.name,
          content: target.content,
          ttl: 3600,
          proxied: false,
        }),
      });

      let createData = await createRes.json();

      // If BIND content format fails, retry using the structured data object format
      if (!createRes.ok || !createData.success) {
        console.log(`⚠️ BIND format content creation failed. Retrying with structured data payload...`);
        createRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: target.type,
            name: target.name,
            ttl: 3600,
            proxied: false,
            data: {
              priority: 1,
              target: `${domain}.`,
              value: 'alpn="a2a" port=443 mandatory=alpn,port',
            },
          }),
        });
        createData = await createRes.json();
      }

      if (!createRes.ok || !createData.success) {
        console.error(`❌ Failed to create ${target.type} record for ${target.name}:`, JSON.stringify(createData.errors || createData));
      } else {
        console.log(`🎉 Successfully created ${target.type} record for ${target.name}! Record ID: ${createData.result.id}`);
      }
    }

    console.log('DNS-AID records check and update completed.');
  } catch (error) {
    console.error('❌ DNS-AID publishing process failed:', error);
    const msg = error.message || String(error);
    if (msg.includes('403') || msg.includes('Forbidden')) {
      console.warn('⚠️ Cloudflare API Token does not have permission to manage DNS records (403 Forbidden). Skipping DNS-AID record publishing.');
      process.exit(0);
    }
    process.exit(1);
  }
}

run();
