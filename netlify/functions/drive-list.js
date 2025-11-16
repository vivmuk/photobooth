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
      'https://script.google.com/macros/s/AKfycbwgBuaDQkRBRRwuzfTlvd-lXRsmUmqOpfph6fVE_5DA_qFiAWdPMNrnf-Qw3GuOV1YQqw/exec';
    const { page = '0', pageSize = '24' } = event.queryStringParameters || {};
    const url = `${scriptUrl}?list=1&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;
    const res = await fetch(url, { method: 'GET' });
    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { ...corsHeaders, 'Content-Type': res.headers.get('content-type') || 'application/json' },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: String(err) }),
    };
  }
};

