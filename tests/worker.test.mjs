import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/worker.js';

const testSecret = 'test-session-secret-at-least-32-bytes-long';
const baseEnv = {
  WEBHOOK_SECRET: 'test-webhook-secret',
  AUTH_SESSION_SECRET: testSecret,
  DB: { prepare() { throw new Error('This request should not access D1'); } },
  ASSETS: { fetch: async () => new Response('asset') },
};

async function createTestCookie(session, secret = testSecret) {
  const bytes = new TextEncoder().encode(JSON.stringify({ ...session, exp: Math.floor(Date.now() / 1000) + 3600 }));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const payload = btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sigBytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
  let sigBinary = '';
  for (const byte of sigBytes) sigBinary += String.fromCharCode(byte);
  const signature = btoa(sigBinary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
  const cookieName = session.role === 'student' ? 'jobboard_student_session' : 'jobboard_employer_session';
  return `${cookieName}=${payload}.${signature}`;
}

async function api(path, init = {}, env = baseEnv) {
  return worker.fetch(new Request(`https://example.test${path}`, init), env);
}

test('health endpoint is available with browser security headers', async () => {
  const response = await api('/api/health', { headers: { origin: 'https://example.test' } });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://example.test');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
});

test('untrusted browser origins do not receive CORS access', async () => {
  const response = await api('/api/health', { headers: { origin: 'https://attacker.example' } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), null);
});

test('job creation requires authenticated employer', async () => {
  const unauth = await api('/api/jobs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Test' }) });
  assert.equal(unauth.status, 401);
  assert.equal((await unauth.json()).error, 'Authentication required');
});

test('a student session cannot use employer-only job creation', async () => {
  const cookie = await createTestCookie({ id: 4, role: 'student', email: 'student@example.com', name: 'Test Student' });
  const response = await api('/api/jobs', { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Test' }) });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error, 'You are not authorized for this action');
});

test('a valid signed session is available from the server-only session endpoint', async () => {
  const cookie = await createTestCookie({ id: 4, role: 'student', email: 'student@example.com', name: 'Test Student' });
  const response = await api('/api/auth/me', { headers: { cookie } });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body.data, { id: '4', name: 'Test Student', email: 'student@example.com', role: 'student', studentId: '4' });
});

test('student and employer sessions can coexist in separate role cookies', async () => {
  const studentCookie = await createTestCookie({ id: 4, role: 'student', email: 'student@example.com', name: 'Test Student' });
  const employerCookie = await createTestCookie({ id: 1, role: 'employer', email: 'employer@example.com', name: 'Test Employer' });
  const headers = { cookie: `${studentCookie}; ${employerCookie}` };
  const student = await api('/api/auth/me?role=student', { headers });
  const employer = await api('/api/auth/me?role=employer', { headers });
  assert.equal((await student.json()).data.role, 'student');
  assert.equal((await employer.json()).data.role, 'employer');
});

test('job creation rejects malformed and incomplete input before database writes', async () => {
  const cookie = await createTestCookie({ id: 1, role: 'employer', email: 'emp@example.com', name: 'Test Employer' });
  const authHeaders = { cookie };
  const malformed = await api('/api/jobs', { method: 'POST', headers: { ...authHeaders, 'content-type': 'text/plain' }, body: 'not json' });
  assert.equal(malformed.status, 400);
  const incomplete = await api('/api/jobs', { method: 'POST', headers: { ...authHeaders, 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Only a title' }) });
  assert.equal(incomplete.status, 400);
  assert.equal((await incomplete.json()).error, 'Missing required fields');
});

test('application submission rejects a contact number that is not exactly ten Thai digits', async () => {
  const cookie = await createTestCookie({ id: 4, role: 'student', email: 'student@example.com', name: 'Test Student' });
  const response = await api('/api/jobs/6/applications', {
    method: 'POST',
    headers: { cookie, 'content-type': 'application/json' },
    body: JSON.stringify({ student_phone: '085123456789' }),
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /exactly 10 digits/);
});

test('notification webhook rejects a missing or incorrect shared secret', async () => {
  const request = { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ eventId: 'event-1', eventType: 'TEST', userId: 4, message: 'test' }) };
  assert.equal((await api('/api/webhooks/notification', request)).status, 401);
  assert.equal((await api('/api/webhooks/notification', { ...request, headers: { ...request.headers, 'x-webhook-secret': 'wrong' } })).status, 401);
});

test('notification webhook validates required fields after authentication', async () => {
  const response = await api('/api/webhooks/notification', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-webhook-secret': 'test-webhook-secret' },
    body: JSON.stringify({ eventId: 'event-1' }),
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /event_id/);
});

test('job search uses D1-bound keyword, filter, and sort parameters', async () => {
  const recorded = { sql: '', values: [] };
  const env = {
    ...baseEnv,
    DB: {
      prepare(sql) {
        recorded.sql = sql;
        return {
          bind(...values) {
            recorded.values = values;
            return { all: async () => ({ results: [] }) };
          },
        };
      },
    },
  };
  const response = await api('/api/jobs?q=backend&province=Bangkok&work_type=Internship&lang=both&sort=salary_desc', {}, env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).count, 0);
  assert.match(recorded.sql, /LOWER\(j\.title\) LIKE \?/);
  assert.match(recorded.sql, /ORDER BY CAST\(REPLACE/);
  assert.equal(recorded.sql.includes('backend'), false);
  assert.equal(recorded.values.at(-1), '%backend%');
  assert.equal(recorded.values.filter((value) => value === '%backend%').length, 10);
});

test('job search rejects an excessively long keyword', async () => {
  const response = await api(`/api/jobs?q=${'x'.repeat(101)}`);
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /100 characters/);
});
