import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/worker.js';

const baseEnv = {
  WEBHOOK_SECRET: 'test-webhook-secret',
  DB: { prepare() { throw new Error('This request should not access D1'); } },
  ASSETS: { fetch: async () => new Response('asset') },
};

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

test('job creation rejects malformed and incomplete input before database writes', async () => {
  const malformed = await api('/api/jobs', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: 'not json' });
  assert.equal(malformed.status, 400);
  const incomplete = await api('/api/jobs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Only a title' }) });
  assert.equal(incomplete.status, 400);
  assert.equal((await incomplete.json()).error, 'Missing required fields');
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
