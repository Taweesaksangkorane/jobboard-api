# Team 18 Job Board — Cloudflare demo

A deployable academic job-board demonstration built entirely on Cloudflare.

## Live system

- App and API: `https://team18-job-board-api.tawee-dev.workers.dev`
- Health check: `GET /api/health`
- Database: Cloudflare D1 (`team18-job-board-db`)
- Deployment: Cloudflare Worker + static Vite assets

The Worker serves the React application and API from one origin. D1 stores fictional demo employers, students, jobs, applications, notifications, webhook events, and an outbound retry outbox. A Cloudflare Cron Trigger retries pending notification deliveries each minute.

## System architecture

```text
React/Vite browser UI -> Cloudflare Worker API -> Cloudflare D1
                                  |
                         Notification Hub webhook
```

User sessions and partner webhooks use different authentication mechanisms: signed role cookies protect Student/Employer actions, while `x-webhook-secret` protects service-to-service callbacks.

## Run locally

```powershell
npm.cmd install
npm.cmd run cf:db:local
npm.cmd run cf:dev
```

Open the Worker URL that Wrangler prints (normally `http://localhost:8787`).

## Deploy

```powershell
npm.cmd test
npm.cmd run cf:deploy
```

Configure webhook secrets outside source control:

```powershell
npx.cmd wrangler secret put WEBHOOK_SECRET
npx.cmd wrangler secret put EVENT_WEBHOOK_SECRET
```

Configure the two demo login accounts and the server-side session signing key outside source control as well:

```powershell
npx.cmd wrangler secret put AUTH_SESSION_SECRET
npx.cmd wrangler secret put DEMO_STUDENT_EMAIL
npx.cmd wrangler secret put DEMO_STUDENT_PASSWORD
npx.cmd wrangler secret put DEMO_EMPLOYER_EMAIL
npx.cmd wrangler secret put DEMO_EMPLOYER_PASSWORD
```

Use unique temporary passwords. `AUTH_SESSION_SECRET` must be a long random value. Do not commit the account emails or passwords; the placeholder values in `.dev.vars.example` are intentionally fictional.

`NOTIFICATION_SERVICE_URL` is configured in `wrangler.jsonc`. The partner endpoint health check should be confirmed with the partner group before a live evaluation.

## Demonstration flow

1. Sign in as the configured student demo account.
2. Browse an approved job and submit an application.
3. Sign out, then sign in as the configured employer demo account and update the application status.
4. The Worker writes an internal notification, places an event in the outbox, and sends it to the Notification Hub.
5. The partner callback reaches `POST /api/webhooks/notification`; it is authenticated, validated, deduplicated, and stored in D1.
6. Return to the matching student profile and open Notifications.

The Worker issues a short-lived, `HttpOnly`, `Secure`, `SameSite=Lax` signed session cookie. The API ignores client-supplied student/employer IDs for protected actions and derives identity and role from this session. Do not enter real personal data.

## Cross-group webhook contract

Outbound application-status events are sent to:

```text
POST {NOTIFICATION_SERVICE_URL}/api/webhooks/jobboard
content-type: application/json
x-webhook-secret: <shared secret>
```

Inbound partner notifications use:

```text
POST /api/webhooks/notification
content-type: application/json
x-webhook-secret: <shared secret>
```

Required inbound fields: `eventId` (or `event_id`), `eventType` (or `event_type`), a positive numeric recipient (`userId`, `student_id`, or `recipient_id`), and `message`. Repeated event IDs return a successful duplicate response without creating another notification.

## Testing evidence

`npm.cmd test` runs:

1. Node Worker tests for health, security headers, CORS, JSON validation, webhook authentication, and webhook validation.
2. Frontend TypeScript checking.
3. Production Vite build.
4. Wrangler deployment dry-run.

Use [docs/MANUAL_TEST_EVIDENCE.md](docs/MANUAL_TEST_EVIDENCE.md) for the human-verification record. The importable Postman collection and environment are in `postman/`.

## ตรวจ Automated Tests เพิ่มเติม

จากไฟล์ `tests/worker.test.mjs` ปัจจุบันมี Test Cases 12 กรณี ครอบคลุมเรื่องต่อไปนี้

- Health endpoint และ Security Headers
- CORS ปฏิเสธ Origin ที่ไม่ได้รับอนุญาต
- Authorization สำหรับ Employer และ Student
- Signed Session และการแยก Session ตามบทบาท
- Input Validation ก่อนเขียน Database รวมถึงเบอร์โทรไทย 10 หลัก
- Webhook Secret Authentication
- Webhook Payload Validation
- SQL Parameter Binding สำหรับการค้นหางาน
- การปฏิเสธ Keyword ที่ยาวเกินกำหนด

## Development process, Git, and AI usage

ดู [docs/DEVELOPMENT_AND_AI_EVIDENCE.md](docs/DEVELOPMENT_AND_AI_EVIDENCE.md) สำหรับสถาปัตยกรรม, ขั้นตอนทำงาน, ตารางทีมที่ต้องกรอกก่อนประเมิน, คำสั่งแสดง Git history, และคำอธิบายการใช้ AI อย่างโปร่งใส

## Security and PDPA boundary

See [docs/PDPA_AND_SECURITY.md](docs/PDPA_AND_SECURITY.md). All displayed records are fictional demo data. The repository must not contain real CVs, passwords, webhook secrets, or personal test data.
