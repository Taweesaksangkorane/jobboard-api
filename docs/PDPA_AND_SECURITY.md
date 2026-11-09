# Security and PDPA boundary for the demo

## Scope

This is an academic demonstration environment. Seeded employers, students, jobs, email addresses, phone numbers, and notifications are fictional. The interface warns users not to submit real personal data, passwords, CVs, or contact details.

## Controls implemented

- The Cloudflare Worker uses D1 prepared statements with bound values; user input is not interpolated into value positions in SQL.
- API mutation endpoints validate required fields, accepted application statuses, numeric notification recipients, JSON syntax/content type, and a 16 KB JSON request limit.
- The inbound partner webhook requires `x-webhook-secret`, compares it without an early-exit equality check, validates the event payload, and deduplicates `event_id` in D1.
- Browser CORS is same-origin by default (plus local Worker development URLs); untrusted origins do not receive an access-control allow-origin response.
- Responses include CSP, `nosniff`, referrer-policy, and permissions-policy headers.
- The public demo-profile list no longer returns email addresses.
- The source contains no secret values. Configure `WEBHOOK_SECRET` and `EVENT_WEBHOOK_SECRET` with `wrangler secret put`; never commit `.dev.vars` or `.env`.

## Explicit limitation

The role/profile picker is a demo convenience stored in browser local storage, not production authentication or authorization. The system must not receive real personal data until real identity authentication, server-side authorization, consent/versioning, retention/deletion workflow, audit logging, and a reviewed privacy notice are implemented.

## PDPA demonstration talking points

1. State the purpose: demonstrating job-board workflows with fictional data only.
2. State the data-minimization rule: use only seed data needed to demonstrate the flow; do not collect resumes or real contact data.
3. Show the warning on Demo Access and this document.
4. Show that cross-group data is limited to the notification event fields required by the webhook contract and protected by the shared secret.
5. If a real-person test is ever requested, stop and obtain an approved privacy notice, consent record, access controls, retention period, and deletion process first.
