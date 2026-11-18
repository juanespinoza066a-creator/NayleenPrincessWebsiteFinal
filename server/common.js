import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual
} from 'node:crypto';

export const cookieName = '__Host-nayleen-session';

export const hash = value =>
  createHash('sha256').update(value).digest('hex');

export const token = () => randomBytes(32).toString('hex');

export function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  const code = process.env.CARNIVAL_LOGIN_CODE;

  if (!url || !key || !code) {
    throw new Error(
      'The owner still needs to finish backend settings.'
    );
  }

  return {
    url: url.replace(/\/$/, ''),
    key,
    code
  };
}

export async function db(
  path,
  { method = 'GET', body, prefer } = {}
) {
  const { url, key } = config();

  const headers = {
    apikey: key,
    'Content-Type': 'application/json'
  };

  if (key.startsWith('eyJ')) {
    headers.Authorization = `Bearer ${key}`;
  }

  if (prefer) {
    headers.Prefer = prefer;
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(8000)
  });

  if (!response.ok) {
    throw new Error(
      'The save database is unavailable. Check its SQL setup and server settings.'
    );
  }

  // Successful database writes can return an empty body.
  const responseText = await response.text();

  return responseText.trim()
    ? JSON.parse(responseText)
    : null;
}

export function reply(res, status, data) {
  res.statusCode = status;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function sameOrigin(req) {
  const origin = req.headers.origin;

  if (!origin) return true;

  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

export async function body(req) {
  if (req.body !== undefined) {
    const value =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body;

    if (Buffer.byteLength(JSON.stringify(value)) > 100000) {
      throw new Error('Request too large.');
    }

    return value;
  }

  let text = '';

  for await (const chunk of req) {
    text += chunk;

    if (Buffer.byteLength(text) > 100000) {
      throw new Error('Request too large.');
    }
  }

  return JSON.parse(text || '{}');
}

export async function session(req) {
  const match = (req.headers.cookie || '')
    .split(';')
    .map(value => value.trim())
    .find(value => value.startsWith(cookieName + '='));

  const raw = match?.slice(cookieName.length + 1);

  if (!raw || !/^[a-f0-9]{64}$/.test(raw)) {
    return null;
  }

  const rows = await db(
    `carnival_sessions?token_hash=eq.${hash(raw)}` +
    `&expires_at=gt.${encodeURIComponent(new Date().toISOString())}` +
    '&select=token_hash&limit=1'
  );

  return rows?.length ? raw : null;
}

export function matchesCode(candidate) {
  const { key, code } = config();

  if (typeof candidate !== 'string' || candidate.length > 100) {
    return false;
  }

  const digest = value =>
    createHmac('sha256', key).update(value).digest();

  return timingSafeEqual(digest(candidate), digest(code));
}

export async function attempt(req) {
  const { key } = config();

  const ip = String(
    req.headers['x-vercel-forwarded-for'] ||
    req.headers['x-forwarded-for'] ||
    'unknown'
  )
    .split(',')[0]
    .trim();

  const id = createHmac('sha256', key)
    .update(ip)
    .digest('hex');

  return await db('rpc/carnival_take_attempt', {
    method: 'POST',
    body: { p_bucket: id }
  });
}

export function setCookie(res, value, maxAge = 604800) {
  res.setHeader(
    'Set-Cookie',
    `${cookieName}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
  );
}
