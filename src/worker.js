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

function reply(body, status = 200) {
  return Response.json(body, { status, headers: jsonHeaders });
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
  const allowedOrigins = new Set([requestOrigin, 'http://localhost:8787', 'http://127.0.0.1:8787', ...configuredOrigins]);
  const origin = request.headers.get('origin');
  if (origin && allowedOrigins.has(origin)) headers.set('access-control-allow-origin', origin);
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
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    for (const key of ['employer_id', 'title', 'description', 'category', 'location', 'province']) {
      if (!input[key]) return reply({ success: false, error: 'Missing required fields' }, 400);
    }
    const employer = await env.DB.prepare('SELECT * FROM employers WHERE employer_id = ?').bind(input.employer_id).first();
    if (!employer) return reply({ success: false, error: 'Employer not found' }, 404);
    if (employer.approval_status !== 'approved') return reply({ success: false, error: 'Employer is not approved' }, 403);
    const fields = ['employer_id', ...jobFields.filter((key) => input[key] !== undefined)];
    const values = fields.map((key) => key === 'status' ? (input[key] || 'open') : input[key]);
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
      await env.DB.batch([
        env.DB.prepare('DELETE FROM notifications WHERE related_application_id IN (SELECT application_id FROM applications WHERE job_id = ?)').bind(jobId),
        env.DB.prepare("DELETE FROM integration_outbox WHERE COALESCE(json_extract(payload, '$.metadata.job_id'), json_extract(payload, '$.data.job_id')) = ?").bind(Number(jobId)),
        env.DB.prepare('DELETE FROM jobs WHERE job_id = ?').bind(jobId),
      ]);
      return reply({ success: true, message: 'Job deleted successfully', job_id: Number(jobId) });
    }
    if (method === 'PATCH') {
      const input = await bodyOf(request);
      if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
      if (String(existing.employer_id) !== String(input.employer_id)) return reply({ success: false, error: 'You are not authorized to update this job' }, 403);
      const fields = jobFields.filter((key) => input[key] !== undefined);
      if (!fields.length) return reply({ success: false, error: 'No fields to update' }, 400);
      await env.DB.prepare(`UPDATE jobs SET ${fields.map((key) => `${key} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE job_id = ?`).bind(...fields.map((key) => input[key]), jobId).run();
      const data = await env.DB.prepare('SELECT * FROM jobs WHERE job_id = ?').bind(jobId).first();
      return reply({ success: true, message: 'Job updated successfully', data });
    }
  }

  if (method === 'POST' && (match = path.match(/^\/api\/jobs\/(\d+)\/applications$/))) {
    const jobId = match[1];
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    if (!input.student_id) return reply({ success: false, error: 'student_id is required' }, 400);
    const student = await env.DB.prepare('SELECT * FROM students WHERE student_id = ?').bind(input.student_id).first();
    if (!student) return reply({ success: false, error: 'Student not found' }, 404);
    const job = await env.DB.prepare('SELECT * FROM jobs WHERE job_id = ?').bind(jobId).first();
    if (!job) return reply({ success: false, error: 'Job not found' }, 404);
    if (job.status !== 'open') return reply({ success: false, error: 'Job is not open for applications' }, 400);
    const duplicate = await env.DB.prepare('SELECT application_id FROM applications WHERE student_id = ? AND job_id = ?').bind(input.student_id, jobId).first();
    if (duplicate) return reply({ success: false, error: 'Student has already applied for this job' }, 409);
    const result = await env.DB.prepare('INSERT INTO applications (student_id, job_id, student_name, student_email, student_phone, notes, resume_url, portfolio_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(input.student_id, jobId, input.student_name || null, input.student_email || null, input.student_phone || null, input.notes || null, input.resume_url || null, input.portfolio_url || null).run();
    const data = await env.DB.prepare('SELECT * FROM applications WHERE application_id = ?').bind(result.meta.last_row_id).first();
    return reply({ success: true, message: 'Application submitted successfully', data }, 201);
  }

  if (method === 'GET' && path === '/api/applications/me') {
    const studentId = url.searchParams.get('student_id');
    if (!studentId) return reply({ success: false, error: 'student_id is required' }, 400);
    const { results } = await env.DB.prepare(`SELECT a.*, j.title AS job_title, j.category, j.province, j.location, j.work_type, j.salary_range, e.company_name FROM applications a JOIN jobs j ON j.job_id = a.job_id JOIN employers e ON e.employer_id = j.employer_id WHERE a.student_id = ? ORDER BY a.applied_at DESC`).bind(studentId).all();
    return reply({ success: true, count: results.length, data: results });
  }

  if (method === 'GET' && (match = path.match(/^\/api\/employers\/(\d+)\/applications$/))) {
    const { results } = await env.DB.prepare(`SELECT a.*, j.title AS job_title, j.category, j.province, j.location, s.name AS student_name, s.email AS student_email FROM applications a JOIN jobs j ON j.job_id = a.job_id JOIN students s ON s.student_id = a.student_id WHERE j.employer_id = ? ORDER BY a.applied_at DESC`).bind(match[1]).all();
    return reply({ success: true, count: results.length, data: results });
  }

  if (method === 'PATCH' && (match = path.match(/^\/api\/applications\/(\d+)\/status$/))) {
    const id = match[1];
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    if (!applicationStatuses.includes(input.status)) return reply({ success: false, error: 'Invalid application status' }, 400);
    const application = await env.DB.prepare('SELECT * FROM applications WHERE application_id = ?').bind(id).first();
    if (!application) return reply({ success: false, error: 'Application not found' }, 404);
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
    const data = await env.DB.prepare('SELECT application_id, student_id, job_id, status, applied_at, updated_at FROM applications WHERE application_id = ?').bind(match[1]).first();
    if (!data) return reply({ success: false, error: 'Application not found', requested_at: new Date().toISOString() }, 404);
    return reply({ success: true, requested_at: new Date().toISOString(), data });
  }

  if (method === 'GET' && path === '/api/notifications') {
    const recipientId = url.searchParams.get('recipient_id');
    if (!recipientId) return reply({ success: false, error: 'recipient_id is required' }, 400);
    const { results } = await env.DB.prepare('SELECT notification_id AS id, recipient_id, title, message, type, related_application_id, read, created_at FROM notifications WHERE recipient_id = ? ORDER BY created_at DESC').bind(recipientId).all();
    return reply({ success: true, count: results.length, data: results.map((row) => ({ ...row, id: String(row.id), read: Boolean(row.read) })) });
  }

  if (method === 'PATCH' && path === '/api/notifications/read-all') {
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    const recipientId = Number(input.recipient_id);
    if (!Number.isInteger(recipientId) || recipientId <= 0) {
      return reply({ success: false, error: 'A positive integer recipient_id is required' }, 400);
    }
    const result = await env.DB.prepare('UPDATE notifications SET read = 1 WHERE recipient_id = ? AND read = 0').bind(recipientId).run();
    return reply({ success: true, data: { updated: result.meta.changes || 0 } });
  }

  if (method === 'PATCH' && (match = path.match(/^\/api\/notifications\/(\d+)\/read$/))) {
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    const recipientId = Number(input.recipient_id);
    if (!Number.isInteger(recipientId) || recipientId <= 0) {
      return reply({ success: false, error: 'A positive integer recipient_id is required' }, 400);
    }
    const notification = await env.DB.prepare('SELECT notification_id FROM notifications WHERE notification_id = ? AND recipient_id = ?').bind(match[1], recipientId).first();
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
    const input = await bodyOf(request);
    if (!input) return reply({ success: false, error: 'A valid JSON request body up to 16 KB is required' }, 400);
    if (!input.application_id) return reply({ success: false, error: 'application_id is required' }, 400);
    const application = await env.DB.prepare('SELECT * FROM applications WHERE application_id = ?').bind(input.application_id).first();
    if (!application) return reply({ success: false, error: 'Application not found' }, 404);
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
