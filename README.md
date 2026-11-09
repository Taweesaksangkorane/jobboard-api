# Assignment: Job Board API

**Team:** Team 18
**Project type:** Academic job-board platform
**Production URL:** `https://team18-job-board-api.tawee-dev.workers.dev`

## 1. Project Overview

Job Board is a web platform that connects students with employers. Employers can publish job opportunities and manage applicants, while students can search for jobs, submit applications, track application status, and receive notifications.

The system has three main user areas:

- **Public:** job search, filtering, sorting, bilingual job details, and public browsing.
- **Student:** dashboard, profile, skills, applications, application status, and notifications.
- **Employer:** company profile, job management, applicant review, and application status updates.

The system is deployed as one Cloudflare Worker serving the React frontend and API, with Cloudflare D1 as the database and a cross-group Notification Hub webhook integration.

## 2. Technology Stack

| Technology | Purpose |
| --- | --- |
| React | Frontend user interface |
| TypeScript | Frontend language and type checking |
| Vite | Frontend development and production build |
| Cloudflare Workers | Backend API and application hosting |
| Cloudflare D1 | Relational SQLite-compatible database |
| Node.js Test Runner | Automated backend API tests |
| Postman | API and webhook verification |

## 3. Database Selection

The current production database is **Cloudflare D1**, bound to the Worker as `DB` and configured in `wrangler.jsonc`. D1 is suitable for this academic system because the application uses related records for employers, students, jobs, applications, notifications, and integration events.

## 4. Database Requirements and Business Rules

- Each job belongs to an employer.
- A student can submit multiple applications for different jobs.
- A student cannot apply to the same job more than once because of `UNIQUE(student_id, job_id)`.
- Job status is limited to `open` and `closed`.
- Application status is controlled by the Worker application-status validation.
- Application status changes create notification integration events.
- Webhook event IDs are stored to prevent duplicate events from creating duplicate notifications.
- D1 queries use prepared statements and bound values.
- All seeded records are fictional demo data.

## 5. Database Structure

The initial D1 migration creates these tables:

1. `employers`
2. `students`
3. `jobs`
4. `applications`
5. `notifications`
6. `integration_events`
7. `integration_outbox`

Indexes support job filters, student applications, job applications, notifications, and pending webhook retries. The migration files are in [migrations](migrations/).

## 6. System Architecture

```text
React/Vite browser UI
          |
          v
Cloudflare Worker REST API
          |
          v
Cloudflare D1
          |
          v
Notification Hub webhook integration
```

Student and Employer actions use short-lived signed role cookies. Service-to-service webhook requests use the `x-webhook-secret` header. A scheduled Cloudflare Cron Trigger retries pending notification deliveries.

## 7. API Design

The Worker exposes REST API routes for authentication, jobs, applications, notifications, and partner integration.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Create a Student or Employer session |
| GET | `/api/jobs` | Search and filter jobs |
| GET | `/api/jobs/:id` | Get job details |
| POST | `/api/jobs` | Create a job as an Employer |
| PATCH | `/api/jobs/:id` | Update an Employer's job |
| DELETE | `/api/jobs/:id` | Delete an Employer's job |
| POST | `/api/jobs/:id/applications` | Submit a Student application |
| GET | `/api/applications/me` | Get the signed-in Student's applications |
| GET | `/api/employers/:id/applications` | Get an Employer's applicants |
| PATCH | `/api/applications/:id/status` | Update application status and create an event |
| GET | `/api/notifications` | Get the signed-in Student's notifications |
| POST | `/api/webhooks/notification` | Receive an authenticated partner callback |

The job search API supports keyword, province, category, work type, status, language, and sort parameters. Protected routes derive the user identity from the signed session instead of trusting client-supplied role IDs.

## 8. Application and Notification Workflow

```text
Student submits application
    |
    v
Employer reviews the application
    |
    v
Employer updates the application status
    |
    v
Worker sends an outbound event to Notification Hub
    |
    v
Notification Hub sends an inbound callback
    |
    v
Worker validates, deduplicates, and stores the notification
```

## 9. Security and PDPA

- Signed, short-lived `HttpOnly`, `Secure`, `SameSite=Lax` session cookies protect Student and Employer actions.
- Role checks prevent Students from using Employer-only routes and prevent cross-employer access.
- Webhook callbacks require `x-webhook-secret` and reject invalid secrets with HTTP `401`.
- Webhook event IDs are deduplicated before a notification is created.
- JSON content, request size, phone numbers, application statuses, and required fields are validated.
- D1 statements use bound parameters instead of interpolating user values.
- Responses include CSP, `nosniff`, referrer-policy, permissions-policy, and restricted CORS headers.
- All demonstration data is fictional; real applicant data must not be entered.

This is a controlled academic demo, not a production identity service. Email verification, password reset, consent versioning, retention/deletion workflows, audit logging, rate limiting, and a reviewed privacy notice remain outside the demo scope.

## 10. Testing and Quality Assurance

Automated tests are in [tests/worker.test.mjs](tests/worker.test.mjs) and contain 12 Node.js Worker test cases covering health, security headers, CORS, authentication, authorization, input validation, phone validation, webhook validation, and SQL parameter binding.

Run the complete quality check with:

```powershell
npm.cmd test
```

This runs Worker tests, the frontend TypeScript check, the Vite production build, and the Wrangler deployment dry-run. The latest verified result is 12 tests passed and 0 failed. Manual browser and Postman evidence is recorded in [docs/MANUAL_TEST_EVIDENCE.md](docs/MANUAL_TEST_EVIDENCE.md).

## 11. Development Process, Git, and AI Usage

The team worked in focused changes, reviewed diffs, ran automated checks, and deployed the verified application to Cloudflare. AI tools were used for code explanation, UI iteration, test-case drafting, documentation structure, and troubleshooting. Generated changes were reviewed and tested by the team. See [docs/DEVELOPMENT_AND_AI_EVIDENCE.md](docs/DEVELOPMENT_AND_AI_EVIDENCE.md) for team contributions and Git evidence.

## 12. Running the Project

```powershell
npm.cmd install
npm.cmd run cf:db:local
npm.cmd run cf:dev
```

Open the Worker URL that Wrangler prints (normally `http://localhost:8787`).

## 13. Cloud Deployment

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

## 14. Demonstration Flow

1. Sign in as the configured student demo account.
2. Browse an approved job and submit an application.
3. Sign out, then sign in as the configured employer demo account and update the application status.
4. The Worker writes an internal notification, places an event in the outbox, and sends it to the Notification Hub.
5. The partner callback reaches `POST /api/webhooks/notification`; it is authenticated, validated, deduplicated, and stored in D1.
6. Return to the matching student profile and open Notifications.

## Final presentation plan (5–10 minutes)

1. Open the production URL and show the Job Board home page and job search.
2. Sign in with the fictional Student demo account, open a job, and submit an application with a valid 10-digit Thai phone number.
3. Sign out and sign in with the fictional Employer demo account. Open the applicant list and change the application status.
4. Show the status-update API response with `notification_sent` and explain that the event is sent to the partner Notification Hub.
5. Show the Student notification created after the partner callback reaches `/api/webhooks/notification`.
6. Use Postman to show the wrong-secret `401` case and the duplicate-event response. Do not display passwords or webhook secrets.

Production presentation URL: `https://team18-job-board-api.tawee-dev.workers.dev`

The Happy Path is Student login -> job search -> application submission -> Employer status update -> partner webhook -> Student notification. The browser UI demonstrates the user journey; Postman provides request/response evidence for the API and webhook integration.

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

## 15. Supporting Evidence

- Manual testing: [docs/MANUAL_TEST_EVIDENCE.md](docs/MANUAL_TEST_EVIDENCE.md)
- Security and PDPA: [docs/PDPA_AND_SECURITY.md](docs/PDPA_AND_SECURITY.md)
- Development, Git, and AI usage: [docs/DEVELOPMENT_AND_AI_EVIDENCE.md](docs/DEVELOPMENT_AND_AI_EVIDENCE.md)
- Thai presentation cheat sheet: [docs/DEMO_CHEAT_SHEET_TH.md](docs/DEMO_CHEAT_SHEET_TH.md)
- English presentation cheat sheet: [docs/DEMO_CHEAT_SHEET.md](docs/DEMO_CHEAT_SHEET.md)
- Postman collection: `postman/Team18-Cloudflare-API.postman_collection.json`
- Postman environment: `postman/Team18-Cloudflare-API.postman_environment.json`

## 16. Conclusion

Job Board provides a deployed Cloudflare platform for public job search, Student applications, Employer recruitment management, and cross-group notification integration. The project includes automated and manual testing evidence, role-based security controls, PDPA boundaries for fictional demo data, and a documented Git/AI development process.
