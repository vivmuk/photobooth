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

    const { page = '0', pageSize = '24', all = '0' } = event.queryStringParameters || {};
    const isAll = all === '1' || all === 'true';

    const buildUrl = (p) => `${scriptUrl}?list=1&page=${encodeURIComponent(p)}&pageSize=${encodeURIComponent(pageSize)}`;

    const fetchPage = async (p) => {
      const url = buildUrl(p);
      const res = await fetch(url, { method: 'GET' });
      const contentType = res.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const payload = isJson ? await res.json() : await res.text();
      if (!res.ok) {
        const message = isJson && payload?.error ? payload.error : `Upstream error ${res.status}`;
        throw new Error(message);
      }
      const files = Array.isArray(payload?.files) ? payload.files : [];
      return { files, raw: payload };
    };

    if (!isAll) {
      // Preserve existing paginated response passthrough for gallery
      const { raw } = await fetchPage(page);
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(raw),
      };
    }

    // Fetch every page server-side so the client only needs one request
    const combined = [];
    const seen = new Set();
    const limitPages = 100; // safety guard
    let currentPage = 0;

    while (currentPage < limitPages) {
      const { files } = await fetchPage(currentPage);
      for (const file of files) {
        if (file?.id && !seen.has(file.id)) {
          seen.add(file.id);
          combined.push(file);
        }
      }
      if (!files.length || files.length < Number(pageSize)) break;
      currentPage += 1;
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, files: combined, total: combined.length }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: String(err) }),
    };
  }
};

