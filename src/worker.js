const jsonHeaders = { 'content-type': 'application/json; charset=UTF-8' };
const jobFields = [
  'title', 'description', 'category', 'location', 'province', 'status',
  'content_language', 'title_th', 'title_en', 'description_th', 'description_en',
  'responsibilities_th', 'responsibilities_en', 'qualifications_th', 'qualifications_en',
  'required_skills_th', 'required_skills_en', 'benefits_th', 'benefits_en',
  'work_type', 'salary_range', 'application_deadline',
];
const applicationStatuses = ['submitted', 'reviewing', 'shortlisted', 'interview', 'rejected', 'accepted'];
const maxJsonBytes = 16 * 1024;
const sessionDurationSeconds = 4 * 60 * 60;

function reply(body, status = 200, headers = {}) {
  return Response.json(body, { status, headers: { ...jsonHeaders, ...headers } });
}

function base64UrlEncode(value) {
  const bytes = value instanceof Uint8Array ? value : new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

async function createSession(session, secret) {
  const payload = base64UrlEncode(JSON.stringify({ ...session, exp: Math.floor(Date.now() / 1000) + sessionDurationSeconds }));
  const signature = base64UrlEncode(await hmac(payload, secret));
  return `${payload}.${signature}`;
}

function sessionCookieName(role) {
  return role === 'student' ? 'jobboard_student_session' : 'jobboard_employer_session';
}

function cookieValue(request, name) {
  const cookie = request.headers.get('cookie') || '';
  return cookie.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

async function readSession(request, env, expectedRole) {
  if (!env.AUTH_SESSION_SECRET) return null;
  const roles = expectedRole ? [expectedRole] : ['employer', 'student'];
  for (const role of roles) {
    const token = cookieValue(request, sessionCookieName(role));
    if (!token || !token.includes('.')) continue;
    const [payload, signature] = token.split('.');
    const expected = base64UrlEncode(await hmac(payload, env.AUTH_SESSION_SECRET));
    if (!secretsMatch(signature, expected)) continue;
    try {
      const session = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
      if (session.role === role && Number.isInteger(Number(session.id)) && session.exp > Math.floor(Date.now() / 1000)) return session;
    } catch { /* Try another role cookie. */ }
  }
  return null;
}

function sessionCookie(token, role) {
  return `${sessionCookieName(role)}=${token}; Path=/; Max-Age=${sessionDurationSeconds}; HttpOnly; Secure; SameSite=Lax`;
}

function clearSessionCookie(role) {
  return `${sessionCookieName(role)}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

async function requireRole(request, env, role) {
  const session = await readSession(request, env, role);
  if (!session) {
    const anotherRoleSession = role ? await readSession(request, env) : null;
    if (anotherRoleSession) return { error: reply({ success: false, error: 'You are not authorized for this action' }, 403) };
    return { error: reply({ success: false, error: 'Authentication required' }, 401) };
  }
  if (role && session.role !== role) return { error: reply({ success: false, error: 'You are not authorized for this action' }, 403) };
  return { session };
}

async function bodyOf(request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType && !contentType.toLowerCase().includes('application/json')) return null;
  try {
    const raw = await request.text();
    if (raw.length > maxJsonBytes) return null;
    return raw ? JSON.parse(raw) : {};
  } catch { return null; }
}

function secretsMatch(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string') return false;
  const actual = new TextEncoder().encode(provided);
  const wanted = new TextEncoder().encode(expected);
  let difference = actual.length ^ wanted.length;
  const length = Math.max(actual.length, wanted.length);
  for (let index = 0; index < length; index += 1) difference |= (actual[index] || 0) ^ (wanted[index] || 0);
  return difference === 0;
}

function applySecurityHeaders(request, response, env) {
  const headers = new Headers(response.headers);
  const requestOrigin = new URL(request.url).origin;
  const configuredOrigins = (env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean);
  const allowedOrigins = new Set([requestOrigin, 'http://localhost:8787', 'http://127.0.0.1:8787', 'http://localhost:5173', 'http://127.0.0.1:5173', ...configuredOrigins]);
  const origin = request.headers.get('origin');
  if (origin && allowedOrigins.has(origin)) {
    headers.set('access-control-allow-origin', origin);
    headers.set('access-control-allow-credentials', 'true');
  }
  headers.set('vary', 'Origin');
  headers.set('access-control-allow-headers', 'content-type,x-webhook-secret,x-partner-service');
  headers.set('access-control-allow-methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('content-security-policy', "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'");
  return new Response(response.body, { status: response.status, headers });
}

function failure(error, status = 500) {
  return reply({ success: false, error: error instanceof Error ? error.message : String(error) }, status);
}

async function sendWebhook(env, targetUrl, payload) {
  if (!targetUrl) return { success: false, error: 'NOTIFICATION_SERVICE_URL is not configured' };
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-webhook-secret': env.EVENT_WEBHOOK_SECRET || env.WEBHOOK_SECRET || '' },
      body: JSON.stringify(payload),
    });
    const responseBody = await response.text();
    return { success: response.ok, statusCode: response.status, responseBody, partnerUrl: targetUrl, requestTimestamp: new Date().toISOString(), error: response.ok ? undefined : `HTTP ${response.status}` };
  } catch (error) {
    return { success: false, error: error.message, partnerUrl: targetUrl, requestTimestamp: new Date().toISOString() };
  }
}

async function retryOutbox(env) {
  const { results = [] } = await env.DB.prepare("SELECT * FROM integration_outbox WHERE status = 'pending' ORDER BY created_at LIMIT 10").all();
  for (const item of results) {
    const result = await sendWebhook(env, item.target_url, JSON.parse(item.payload));
    await env.DB.prepare(`UPDATE integration_outbox SET status = ?, attempt_count = attempt_count + 1, last_error = ?, sent_at = ? WHERE event_id = ?`)
      .bind(result.success ? 'sent' : 'pending', result.error || null, result.success ? new Date().toISOString() : null, item.event_id).run();
  }
}

async function handleApi(request, env, url) {
  const method = request.method;
  const path = url.pathname;
  let match;

  if (method === 'OPTIONS') return new Response(null, { status: 204 });
  if (method === 'GET' && path === '/api/health') return reply({ success: true, message: 'Job Board API is running on Cloudflare Workers' });

  if (method === 'POST' && path === '/api/auth/login') {
    const input = await bodyOf(request);
    if (!input || typeof input.email !== 'string' || typeof input.password !== 'string') return reply({ success: false, error: 'Email and password are required' }, 400);
    if (!env.AUTH_SESSION_SECRET || !env.DEMO_STUDENT_EMAIL || !env.DEMO_STUDENT_PASSWORD || !env.DEMO_EMPLOYER_EMAIL || !env.DEMO_EMPLOYER_PASSWORD) {
      return reply({ success: false, error: 'Demo authentication is not configured' }, 503);
    }
    const email = input.email.trim().toLowerCase();
    const accounts = [
      { role: 'student', email: env.DEMO_STUDENT_EMAIL.toLowerCase(), password: env.DEMO_STUDENT_PASSWORD, id: 4 },
      { role: 'employer', email: env.DEMO_EMPLOYER_EMAIL.toLowerCase(), password: env.DEMO_EMPLOYER_PASSWORD, id: 1 },
    ];
    const account = accounts.find((candidate) => secretsMatch(email, candidate.email) && secretsMatch(input.password, candidate.password));
    if (!account) return reply({ success: false, error: 'Invalid email or password' }, 401);
    const profile = account.role === 'student'
      ? await env.DB.prepare('SELECT student_id AS id, name FROM students WHERE student_id = ?').bind(account.id).first()
      : await env.DB.prepare('SELECT employer_id AS id, company_name AS name FROM employers WHERE employer_id = ? AND approval_status = ?').bind(account.id, 'approved').first();
    if (!profile) return reply({ success: false, error: 'Demo account is unavailable' }, 403);
    const token = await createSession({ id: Number(profile.id), role: account.role, email: account.email, name: profile.name }, env.AUTH_SESSION_SECRET);
    return reply({ success: true, data: { id: String(profile.id), name: profile.name, email: account.email, role: account.role, studentId: account.role === 'student' ? String(profile.id) : undefined, companyName: account.role === 'employer' ? profile.name : undefined } }, 200, { 'set-cookie': sessionCookie(token, account.role) });
  }

  if (method === 'POST' && path === '/api/auth/logout') {
    const input = await bodyOf(request);
    const role = input?.role;
    if (!['student', 'employer'].includes(role)) return reply({ success: false, error: 'A valid session role is required' }, 400);
    return reply({ success: true, data: null }, 200, { 'set-cookie': clearSessionCookie(role) });
  }

  if (method === 'GET' && path === '/api/auth/me') {
    const requestedRole = url.searchParams.get('role');
    if (requestedRole && !['student', 'employer'].includes(requestedRole)) return reply({ success: false, error: 'Invalid session role' }, 400);
    const auth = await requireRole(request, env, requestedRole || undefined);
    if (auth.error) return auth.error;
    const { session } = auth;
    return reply({ success: true, data: { id: String(session.id), name: session.name, email: session.email, role: session.role, studentId: session.role === 'student' ? String(session.id) : undefined, companyName: session.role === 'employer' ? session.name : undefined } });
  }

  if (method === 'GET' && path === '/api/students') {
    const { results } = await env.DB.prepare('SELECT student_id, name FROM students ORDER BY student_id').all();
    return reply({ success: true, count: results.length, data: results });
  }

  if (method === 'GET' && path === '/api/employers') {
    const { results } = await env.DB.prepare("SELECT employer_id, company_name FROM employers WHERE approval_status = 'approved' ORDER BY company_name").all();
    return reply({ success: true, count: results.length, data: results });
  }

  if (method === 'GET' && path === '/api/test-db') {
    const row = await env.DB.prepare('SELECT COUNT(*) AS count FROM jobs').first();
    return reply({ success: true, message: 'Connected to Cloudflare D1 successfully', count: row.count });
  }

  if (method === 'GET' && path === '/api/jobs') {
    const clauses = ["e.approval_status = 'approved'"];
    const values = [];
    for (const key of ['province', 'category', 'status', 'work_type']) {
      if (url.searchParams.get(key)) { clauses.push(`j.${key} = ?`); values.push(url.searchParams.get(key)); }
    }
    const language = url.searchParams.get('lang');
    if (language) { clauses.push('j.content_language = ?'); values.push(language); }
    const query = (url.searchParams.get('q') || '').trim();
    if (query) {
      if (query.length > 100) return reply({ success: false, error: 'Search query must be 100 characters or fewer' }, 400);
      const pattern = `%${query.toLowerCase()}%`;
      clauses.push(`(
        LOWER(j.title) LIKE ? OR LOWER(j.description) LIKE ? OR LOWER(j.location) LIKE ? OR
        LOWER(j.province) LIKE ? OR LOWER(j.category) LIKE ? OR LOWER(e.company_name) LIKE ? OR
        LOWER(COALESCE(j.title_th, '')) LIKE ? OR LOWER(COALESCE(j.title_en, '')) LIKE ? OR
        LOWER(COALESCE(j.description_th, '')) LIKE ? OR LOWER(COALESCE(j.description_en, '')) LIKE ?
      )`);
      values.push(...Array(10).fill(pattern));
    }
    const sort = url.searchParams.get('sort');
    const orderBy = sort === 'salary_asc'
      ? "CAST(REPLACE(COALESCE(j.salary_range, ''), ',', '') AS INTEGER) ASC, j.created_at DESC"
      : sort === 'salary_desc'
        ? "CAST(REPLACE(COALESCE(j.salary_range, ''), ',', '') AS INTEGER) DESC, j.created_at DESC"
        : 'j.created_at DESC';
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { results } = await env.DB.prepare(`SELECT j.*, e.company_name FROM jobs j JOIN employers e ON e.employer_id = j.employer_id ${where} ORDER BY ${orderBy}`).bind(...values).all();
    return reply({ success: true, count: results.length, data: results });
  }

  if (method === 'POST' && path === '/api/jobs') {
    const auth = await requireRole(request, env, 'employer');
    if (auth.error) return auth.error;
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    for (const key of ['title', 'description', 'category', 'location', 'province']) {
      if (!input[key]) return reply({ success: false, error: 'Missing required fields' }, 400);
    }
    const employer = await env.DB.prepare('SELECT * FROM employers WHERE employer_id = ?').bind(auth.session.id).first();
    if (!employer) return reply({ success: false, error: 'Employer not found' }, 404);
    if (employer.approval_status !== 'approved') return reply({ success: false, error: 'Employer is not approved' }, 403);
    const fields = ['employer_id', ...jobFields.filter((key) => input[key] !== undefined)];
    const values = fields.map((key) => key === 'employer_id' ? auth.session.id : key === 'status' ? (input[key] || 'open') : input[key]);
    if (!fields.includes('status')) { fields.push('status'); values.push('open'); }
    const result = await env.DB.prepare(`INSERT INTO jobs (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`).bind(...values).run();
    const data = await env.DB.prepare('SELECT * FROM jobs WHERE job_id = ?').bind(result.meta.last_row_id).first();
    return reply({ success: true, message: 'Job created successfully', data }, 201);
  }

  if ((match = path.match(/^\/api\/jobs\/(\d+)$/))) {
    const jobId = match[1];
    const existing = await env.DB.prepare("SELECT j.* FROM jobs j JOIN employers e ON e.employer_id = j.employer_id WHERE j.job_id = ? AND e.approval_status = 'approved'").bind(jobId).first();
    if (!existing) return reply({ success: false, error: 'Job not found' }, 404);
    if (method === 'GET') return reply({ success: true, data: existing });
    if (method === 'DELETE') {
      const auth = await requireRole(request, env, 'employer');
      if (auth.error) return auth.error;
      if (Number(existing.employer_id) !== Number(auth.session.id)) return reply({ success: false, error: 'You are not authorized to delete this job' }, 403);
      await env.DB.batch([
        env.DB.prepare('DELETE FROM notifications WHERE related_application_id IN (SELECT application_id FROM applications WHERE job_id = ?)').bind(jobId),
        env.DB.prepare("DELETE FROM integration_outbox WHERE COALESCE(json_extract(payload, '$.metadata.job_id'), json_extract(payload, '$.data.job_id')) = ?").bind(Number(jobId)),
        env.DB.prepare('DELETE FROM jobs WHERE job_id = ?').bind(jobId),
      ]);
      return reply({ success: true, message: 'Job deleted successfully', job_id: Number(jobId) });
    }
    if (method === 'PATCH') {
      const auth = await requireRole(request, env, 'employer');
      if (auth.error) return auth.error;
      const input = await bodyOf(request);
      if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
      if (Number(existing.employer_id) !== Number(auth.session.id)) return reply({ success: false, error: 'You are not authorized to update this job' }, 403);
      const fields = jobFields.filter((key) => input[key] !== undefined);
      if (!fields.length) return reply({ success: false, error: 'No fields to update' }, 400);
      await env.DB.prepare(`UPDATE jobs SET ${fields.map((key) => `${key} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE job_id = ?`).bind(...fields.map((key) => input[key]), jobId).run();
      const data = await env.DB.prepare('SELECT * FROM jobs WHERE job_id = ?').bind(jobId).first();
      return reply({ success: true, message: 'Job updated successfully', data });
    }
  }

  if (method === 'POST' && (match = path.match(/^\/api\/jobs\/(\d+)\/applications$/))) {
    const auth = await requireRole(request, env, 'student');
    if (auth.error) return auth.error;
    const jobId = match[1];
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    const student = await env.DB.prepare('SELECT * FROM students WHERE student_id = ?').bind(auth.session.id).first();
    if (!student) return reply({ success: false, error: 'Student not found' }, 404);
    const job = await env.DB.prepare('SELECT * FROM jobs WHERE job_id = ?').bind(jobId).first();
    if (!job) return reply({ success: false, error: 'Job not found' }, 404);
    if (job.status !== 'open') return reply({ success: false, error: 'Job is not open for applications' }, 400);
    const duplicate = await env.DB.prepare('SELECT application_id FROM applications WHERE student_id = ? AND job_id = ?').bind(auth.session.id, jobId).first();
    if (duplicate) return reply({ success: false, error: 'Student has already applied for this job' }, 409);
    const result = await env.DB.prepare('INSERT INTO applications (student_id, job_id, student_name, student_email, student_phone, notes, resume_url, portfolio_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(auth.session.id, jobId, input.student_name || null, input.student_email || null, input.student_phone || null, input.notes || null, input.resume_url || null, input.portfolio_url || null).run();
    const data = await env.DB.prepare('SELECT * FROM applications WHERE application_id = ?').bind(result.meta.last_row_id).first();
    return reply({ success: true, message: 'Application submitted successfully', data }, 201);
  }

  if (method === 'GET' && path === '/api/applications/me') {
    const auth = await requireRole(request, env, 'student');
    if (auth.error) return auth.error;
    const { results } = await env.DB.prepare(`SELECT a.*, j.title AS job_title, j.category, j.province, j.location, j.work_type, j.salary_range, e.company_name FROM applications a JOIN jobs j ON j.job_id = a.job_id JOIN employers e ON e.employer_id = j.employer_id WHERE a.student_id = ? ORDER BY a.applied_at DESC`).bind(auth.session.id).all();
    return reply({ success: true, count: results.length, data: results });
  }

  if (method === 'GET' && (match = path.match(/^\/api\/employers\/(\d+)\/applications$/))) {
    const auth = await requireRole(request, env, 'employer');
    if (auth.error) return auth.error;
    if (Number(match[1]) !== Number(auth.session.id)) return reply({ success: false, error: 'You are not authorized to view these applications' }, 403);
    const { results } = await env.DB.prepare(`SELECT a.*, j.title AS job_title, j.category, j.province, j.location, s.name AS student_name, s.email AS student_email FROM applications a JOIN jobs j ON j.job_id = a.job_id JOIN students s ON s.student_id = a.student_id WHERE j.employer_id = ? ORDER BY a.applied_at DESC`).bind(match[1]).all();
    return reply({ success: true, count: results.length, data: results });
  }

  if (method === 'PATCH' && (match = path.match(/^\/api\/applications\/(\d+)\/status$/))) {
    const auth = await requireRole(request, env, 'employer');
    if (auth.error) return auth.error;
    const id = match[1];
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    if (!applicationStatuses.includes(input.status)) return reply({ success: false, error: 'Invalid application status' }, 400);
    const application = await env.DB.prepare('SELECT a.*, j.employer_id FROM applications a JOIN jobs j ON j.job_id = a.job_id WHERE a.application_id = ?').bind(id).first();
    if (!application) return reply({ success: false, error: 'Application not found' }, 404);
    if (Number(application.employer_id) !== Number(auth.session.id)) return reply({ success: false, error: 'You are not authorized to update this application' }, 403);
    await env.DB.prepare('UPDATE applications SET status = ?, employer_feedback = COALESCE(?, employer_feedback), updated_at = CURRENT_TIMESTAMP WHERE application_id = ?').bind(input.status, input.employer_feedback || null, id).run();
    const data = await env.DB.prepare('SELECT * FROM applications WHERE application_id = ?').bind(id).first();
    const eventId = `app-status-${id}-${input.status}-${Date.now()}`;
    const notificationData = { application_id: data.application_id, student_id: data.student_id, job_id: data.job_id, old_status: application.status, new_status: data.status };
    const event = {
      eventId,
      eventType: 'APPLICATION_STATUS_CHANGED',
      userId: String(data.student_id),
      title: 'Job Application Status Updated',
      message: `Your application status has changed from ${application.status} to ${data.status}`,
      severity: 'medium',
      timestamp: new Date().toISOString(),
      metadata: notificationData,
    };
    const targetUrl = env.NOTIFICATION_SERVICE_URL ? `${env.NOTIFICATION_SERVICE_URL.replace(/\/$/, '')}/api/webhooks/jobboard` : null;
    // Notification Service is the notification source of truth. It will call
    // /api/webhooks/notification back after processing this outbox event.
    await env.DB.prepare('INSERT INTO integration_outbox (event_id, event_type, target_url, payload) VALUES (?, ?, ?, ?)')
      .bind(eventId, event.eventType, targetUrl, JSON.stringify(event)).run();
    const sent = await sendWebhook(env, targetUrl, event);
    await env.DB.prepare('UPDATE integration_outbox SET status = ?, attempt_count = 1, last_error = ?, sent_at = ? WHERE event_id = ?').bind(sent.success ? 'sent' : 'pending', sent.error || null, sent.success ? new Date().toISOString() : null, eventId).run();
    return reply({ success: true, message: 'Application status updated successfully', data, integration: { event_id: eventId, notification_sent: sent.success, notification_status: sent.success ? 'sent' : 'pending' } });
  }

  if (method === 'GET' && (match = path.match(/^\/api\/integration\/applications\/(\d+)$/))) {
    const auth = await requireRole(request, env);
    const partnerRequest = env.WEBHOOK_SECRET && secretsMatch(request.headers.get('x-webhook-secret'), env.WEBHOOK_SECRET);
    if (auth.error && !partnerRequest) return auth.error;
    const data = await env.DB.prepare(`
      SELECT a.*, j.title AS job_title, j.employer_id,
             COALESCE(a.student_name, s.name) AS student_name,
             COALESCE(a.student_email, s.email) AS student_email
      FROM applications a
      JOIN jobs j ON j.job_id = a.job_id
      LEFT JOIN students s ON s.student_id = a.student_id
      WHERE a.application_id = ?
    `).bind(match[1]).first();
    if (!data) return reply({ success: false, error: 'Application not found', requested_at: new Date().toISOString() }, 404);
    if (!partnerRequest && auth.session.role === 'employer' && Number(data.employer_id) !== Number(auth.session.id)) return reply({ success: false, error: 'You are not authorized to view this application' }, 403);
    if (!partnerRequest && auth.session.role === 'student' && Number(data.student_id) !== Number(auth.session.id)) return reply({ success: false, error: 'You are not authorized to view this application' }, 403);
    return reply({ success: true, requested_at: new Date().toISOString(), data });
  }

  if (method === 'GET' && path === '/api/notifications') {
    const auth = await requireRole(request, env, 'student');
    if (auth.error) return auth.error;
    const { results } = await env.DB.prepare('SELECT notification_id AS id, recipient_id, title, message, type, related_application_id, read, created_at FROM notifications WHERE recipient_id = ? ORDER BY created_at DESC').bind(auth.session.id).all();
    return reply({ success: true, count: results.length, data: results.map((row) => ({ ...row, id: String(row.id), read: Boolean(row.read) })) });
  }

  if (method === 'PATCH' && path === '/api/notifications/read-all') {
    const auth = await requireRole(request, env, 'student');
    if (auth.error) return auth.error;
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    const result = await env.DB.prepare('UPDATE notifications SET read = 1 WHERE recipient_id = ? AND read = 0').bind(auth.session.id).run();
    return reply({ success: true, data: { updated: result.meta.changes || 0 } });
  }

  if (method === 'PATCH' && (match = path.match(/^\/api\/notifications\/(\d+)\/read$/))) {
    const auth = await requireRole(request, env, 'student');
    if (auth.error) return auth.error;
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    const notification = await env.DB.prepare('SELECT notification_id FROM notifications WHERE notification_id = ? AND recipient_id = ?').bind(match[1], auth.session.id).first();
    if (!notification) return reply({ success: false, error: 'Notification not found' }, 404);
    await env.DB.prepare('UPDATE notifications SET read = 1 WHERE notification_id = ?').bind(match[1]).run();
    return reply({ success: true, data: { id: String(match[1]), read: true } });
  }

  if (method === 'POST' && path === '/api/webhooks/notification') {
    if (!env.WEBHOOK_SECRET || !secretsMatch(request.headers.get('x-webhook-secret'), env.WEBHOOK_SECRET)) return reply({ success: false, error: 'Invalid webhook secret' }, 401);
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    const eventId = input.event_id || input.eventId;
    const eventType = input.event_type || input.eventType || input.type;
    const recipientValue = input.userId ?? input.user_id ?? input.student_id ?? input.recipient_id ?? input.metadata?.userId ?? input.metadata?.user_id ?? input.metadata?.student_id;
    const recipientId = Number(recipientValue);
    const message = input.message || input.description || input.content;
    const relatedApplicationValue = input.related_application_id ?? input.relatedApplicationId ?? input.application_id ?? input.applicationId ?? input.metadata?.application_id ?? input.metadata?.applicationId;
    const relatedApplicationId = Number.isInteger(Number(relatedApplicationValue)) ? Number(relatedApplicationValue) : null;

    if (!eventId || !eventType) return reply({ success: false, error: 'event_id/eventId and event_type/eventType are required' }, 400);
    if (!Number.isInteger(recipientId) || recipientId <= 0) return reply({ success: false, error: 'A positive integer userId, user_id, student_id, or recipient_id is required' }, 400);
    if (!message) return reply({ success: false, error: 'message, description, or content is required' }, 400);

    const existing = await env.DB.prepare('SELECT event_id FROM integration_events WHERE event_id = ?').bind(eventId).first();
    if (existing) return reply({ success: true, duplicate: true, event_id: eventId, message: 'Event already processed' });

    const notificationTitle = input.title || 'Notification from Notification Hub';
    await env.DB.batch([
      env.DB.prepare('INSERT INTO integration_events (event_id, event_type, source, payload) VALUES (?, ?, ?, ?)').bind(eventId, eventType, 'notification-service', JSON.stringify(input)),
      env.DB.prepare('INSERT INTO notifications (recipient_id, title, message, type, related_application_id) VALUES (?, ?, ?, ?, ?)').bind(recipientId, notificationTitle, message, eventType, relatedApplicationId),
    ]);
    return reply({ success: true, message: 'Webhook received and notification created', event_id: eventId, stored: true, notification_created: true, recipient_id: recipientId, received_at: new Date().toISOString() });
  }

  if (method === 'POST' && path === '/api/integration/notifications') {
    const auth = await requireRole(request, env, 'employer');
    if (auth.error) return auth.error;
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    if (!input.application_id) return reply({ success: false, error: 'application_id is required' }, 400);
    const application = await env.DB.prepare('SELECT * FROM applications WHERE application_id = ?').bind(input.application_id).first();
    if (!application) return reply({ success: false, error: 'Application not found' }, 404);
    const job = await env.DB.prepare('SELECT employer_id FROM jobs WHERE job_id = ?').bind(application.job_id).first();
    if (!job || Number(job.employer_id) !== Number(auth.session.id)) return reply({ success: false, error: 'You are not authorized to send this notification' }, 403);
    const notification = { student_id: application.student_id, application_id: application.application_id, type: 'APPLICATION_STATUS_CHANGED', message: input.message || `Your application status is ${application.status}` };
    const target = env.NOTIFICATION_SERVICE_URL ? `${env.NOTIFICATION_SERVICE_URL.replace(/\/$/, '')}/api/notifications` : null;
    const result = await sendWebhook(env, target, notification);
    if (!result.success) return reply({ success: false, message: 'Notification service request failed', integration: result }, 502);
    return reply({ success: true, message: 'Notification created successfully', integration: { partner_url: result.partnerUrl, request_timestamp: result.requestTimestamp, status_code: result.statusCode, partner_response: result.responseBody } });
  }

  return reply({ success: false, error: 'Not found' }, 404);
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const response = url.pathname.startsWith('/api/')
        ? await handleApi(request, env, url)
        : await env.ASSETS.fetch(request);
      return applySecurityHeaders(request, response, env);
    } catch (error) { return applySecurityHeaders(request, failure(error), env); }
  },
  async scheduled(_controller, env, ctx) { ctx.waitUntil(retryOutbox(env)); },
};

export { applySecurityHeaders, bodyOf, handleApi, secretsMatch };
