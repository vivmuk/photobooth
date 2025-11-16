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
    const scriptUrl =
      process.env.GDRIVE_WEBAPP_URL ||
      'https://script.google.com/macros/s/AKfycbwCy4SM1Y7Gaa3dfCmIcx2ADc0pNiEb5hlbxIuQkE1wv8XsWTqhk5DHkz3qSKA7PKq5NA/exec';
    const id = (event.queryStringParameters && event.queryStringParameters.id) || '';
    if (!id) {
      return { statusCode: 400, headers: corsHeaders, body: 'Missing id' };
    }
    // Ask Apps Script to return the image content directly for the file id
    const url = `${scriptUrl}?image=1&id=${encodeURIComponent(id)}`;
    const res = await fetch(url, { method: 'GET' });
    // Pass-through content-type (expecting image/*)
    const contentType = res.headers.get('content-type') || 'image/jpeg';
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

