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
    // Fetch directly from Google Drive viewer endpoint server-side
    const url = `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        // A basic UA can help avoid some anti-bot heuristics
        'User-Agent': 'Mozilla/5.0 NetlifyFunctionImageProxy',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://rajandmanali.netlify.app/',
      },
    });
    // Pass-through content-type (expecting image/*)
    let contentType = res.headers.get('content-type') || 'image/jpeg';
    // Some Drive responses return text/html with an <img>; try to coerce
    if (contentType.includes('text/html')) {
      contentType = 'image/jpeg';
    }
    const arrayBuffer = await res.arrayBuffer();
    return {
      statusCode: res.status,
      headers: { ...corsHeaders, 'Content-Type': contentType, 'Cache-Control': 'public, max-age=300' },
      body: Buffer.from(arrayBuffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: String(err) }),
    };
  }
};

