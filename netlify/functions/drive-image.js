exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }
  try {
    const id = (event.queryStringParameters && event.queryStringParameters.id) || '';
    if (!id) {
      return { statusCode: 400, headers: corsHeaders, body: 'Missing id' };
    }
    const scriptUrl = process.env.GDRIVE_WEBAPP_URL; // optional

    // Helper to stream a fetch into a Netlify response with image content-type
    const toResponse = async (res) => {
      let contentType = res.headers.get('content-type') || 'image/jpeg';
      if (contentType.includes('text/html')) {
        // Drive occasionally serves HTML wrappers; force image if we know it's an image
        contentType = 'image/jpeg';
      }
      const arrayBuffer = await res.arrayBuffer();
      return {
        statusCode: res.status,
        headers: { ...corsHeaders, 'Content-Type': contentType, 'Cache-Control': 'public, max-age=300' },
        body: Buffer.from(arrayBuffer).toString('base64'),
        isBase64Encoded: true,
      };
    };

    // 1) Try Apps Script image endpoint if available (doGet?image=1&id=...)
    if (scriptUrl) {
      try {
        const scriptImageUrl = `${scriptUrl}?image=1&id=${encodeURIComponent(id)}`;
        const sr = await fetch(scriptImageUrl, { method: 'GET' });
        const sct = (sr.headers.get('content-type') || '').toLowerCase();
        if (sr.ok && (sct.startsWith('image/') || sct.includes('octet-stream'))) {
          return await toResponse(sr);
        }
        // fall through to drive if script doesn't return image
      } catch (_) {
        // ignore and fall back
      }
    }

    // 2) Fallback: fetch from Google Drive server-side (prefer download to avoid HTML)
    const driveUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
    const dr = await fetch(driveUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 NetlifyFunctionImageProxy',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://rajandmanali.netlify.app/',
      },
    });
    return await toResponse(dr);
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: String(err) }),
    };
  }
};

