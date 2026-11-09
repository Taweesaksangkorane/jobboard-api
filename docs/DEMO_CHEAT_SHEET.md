# Job Board Final Demo Cheat Sheet

Use this file as a quick reference during the final presentation. Do not write passwords, webhook secrets, session cookies, or real personal data here.

## Production

- App and API: `https://team18-job-board-api.tawee-dev.workers.dev`
- Health check: `GET https://team18-job-board-api.tawee-dev.workers.dev/api/health`
- Cloudflare Worker: `team18-job-board-api`
- Cloudflare database: D1 `team18-job-board-db`
- Partner service: Notification Hub configured by `NOTIFICATION_SERVICE_URL`

## Main Commands

Run from the repository root:

```powershell
npm.cmd install
npm.cmd run frontend:dev
npm.cmd run test:worker
npm.cmd test
npm.cmd run cf:deploy
```

What each command does:

- `npm.cmd run frontend:dev`: starts the Vite frontend for local UI work.
- `npm.cmd run test:worker`: runs the 12 Node.js Worker tests.
- `npm.cmd test`: runs Worker tests, frontend TypeScript check, frontend build, and Wrangler deploy dry-run.
- `npm.cmd run cf:deploy`: builds the frontend and deploys the Worker to Cloudflare.

Expected automated result:

```text
12 tests
12 passed
0 failed
```

## Happy Path Demo

1. Open the Production URL and show Public Job Search.
2. Search by keyword and apply filters for category, province, work type, status, language, and salary sorting.
3. Open Job Details.
4. Log in as the fictional Student account.
5. Submit an application with a valid Thai phone number containing exactly 10 digits and starting with `0`.
6. Open My Applications and show the application status.
7. Log out and log in as the fictional Employer account.
8. Open Applicants and Applicant Details.
9. Change the application status, for example from `shortlisted` to `interview`.
10. Show the API response containing `notification_sent: true`.
11. Return to the Student account and open Notifications.
12. Use Postman to show invalid webhook secret `401` and duplicate event `duplicate: true`.

Do not use real accounts or real personal data during the demonstration.

## Backend Location: `src/worker.js`

| Feature | Route or function |
| --- | --- |
| Health | `GET /api/health` |
| Login | `POST /api/auth/login` |
| Logout | `POST /api/auth/logout` |
| Current session | `GET /api/auth/me` |
| Search jobs | `GET /api/jobs` |
| Create job | `POST /api/jobs` |
| Job details | `GET /api/jobs/:id` |
| Edit job | `PATCH /api/jobs/:id` |
| Delete job | `DELETE /api/jobs/:id` |
| Apply for job | `POST /api/jobs/:id/applications` |
| Student applications | `GET /api/applications/me` |
| Employer applicants | `GET /api/employers/:id/applications` |
| Update application status | `PATCH /api/applications/:id/status` |
| Integration application lookup | `GET /api/integration/applications/:id` |
| Student notifications | `GET /api/notifications` |
| Mark notification read | `PATCH /api/notifications/:id/read` |
| Mark all notifications read | `PATCH /api/notifications/read-all` |
| Inbound partner callback | `POST /api/webhooks/notification` |

Important backend helpers:

- `handleApi()`: routes API requests.
- `requireRole()`: enforces Student/Employer permissions.
- `isValidThaiPhone()`: validates a 10-digit Thai phone number.
- `sendWebhook()`: sends outbound events to Notification Hub.
- `secretsMatch()`: validates shared secrets.
- `applySecurityHeaders()`: adds CSP, CORS, and browser security headers.

## Frontend Locations

- Routes: `frontend/src/App.tsx`
- API wrapper: `frontend/src/services/apiClient.ts`
- Authentication: `frontend/src/services/authService.ts`
- Jobs: `frontend/src/services/jobService.ts`
- Applications: `frontend/src/services/applicationService.ts`
- Notifications: `frontend/src/services/notificationService.ts`
- Student data: `frontend/src/services/studentService.ts`

Pages:

- Public search: `frontend/src/pages/public/JobSearchPage.tsx`
- Job details: `frontend/src/pages/public/JobDetailsPage.tsx`
- Student dashboard: `frontend/src/pages/student/StudentDashboardPage.tsx`
- Student applications: `frontend/src/pages/student/MyApplicationsPage.tsx`
- Student application details: `frontend/src/pages/student/ApplicationDetailsPage.tsx`
- Student profile: `frontend/src/pages/student/StudentProfilePage.tsx`
- Student skills: `frontend/src/pages/student/MySkillsPage.tsx`
- Student notifications: `frontend/src/pages/student/NotificationsPage.tsx`
- Employer dashboard: `frontend/src/pages/employer/EmployerDashboardPage.tsx`
- Employer jobs: `frontend/src/pages/employer/ManageJobsPage.tsx`
- Create job: `frontend/src/pages/employer/CreateJobPage.tsx`
- Edit job: `frontend/src/pages/employer/EditJobPage.tsx`
- Applicants: `frontend/src/pages/employer/ApplicantsPage.tsx`
- Applicant review: `frontend/src/pages/employer/ApplicantReviewPage.tsx`
- Company profile: `frontend/src/pages/employer/CompanyProfilePage.tsx`

## Webhook Flow

```text
Employer updates application status
        |
        v
PATCH /api/applications/:id/status
        |
        v
Job Board creates an application-status event
        |
        v
Outbound request to Notification Hub
        |
        v
Notification Hub sends callback
        |
        v
POST /api/webhooks/notification
        |
        v
D1 stores integration event and Student notification
```

Webhook evidence:

- Invalid secret: HTTP `401`, error `Invalid webhook secret`.
- First duplicate-test request: `stored: true`, `notification_created: true`.
- Same event sent again: `duplicate: true`, message `Event already processed`.
- Use the same `event_id` for the first and second duplicate-test request.
- Never show the `x-webhook-secret` value in screenshots or chat.

## Automated Tests and Evidence

- Test source: `tests/worker.test.mjs`
- Manual evidence: `docs/MANUAL_TEST_EVIDENCE.md`
- Security/PDPA evidence: `docs/PDPA_AND_SECURITY.md`
- Development, Git, and AI evidence: `docs/DEVELOPMENT_AND_AI_EVIDENCE.md`
- API/Postman evidence: `postman/Team18-Cloudflare-API.postman_collection.json`

Capture these terminal results:

1. `npm.cmd run test:worker`: 12 passed, 0 failed.
2. `npm.cmd test`: Worker tests, TypeScript check, frontend build, and Wrangler dry-run all pass.

A Vite chunk-size warning is non-blocking if the command finishes successfully. Do not call a warning a test failure.

## Security and PDPA Talking Points

- Student and Employer actions use signed role sessions.
- Session cookies are short-lived, `HttpOnly`, `Secure`, and `SameSite=Lax`.
- Webhook requests require a shared secret.
- Webhook event IDs are deduplicated.
- D1 queries use prepared statements and bound values.
- JSON size/content and application status inputs are validated.
- Responses include CSP, `nosniff`, referrer-policy, and permissions-policy headers.
- Demo records are fictional; do not enter real applicant data.
- This is a controlled academic demo, not a production identity service.

## Live Modification Map

If asked to make a small change:

- Phone validation: `frontend/src/components/applications/ApplyModal.tsx` and `src/worker.js`.
- API response text: the matching route in `src/worker.js`.
- Webhook behavior: `sendWebhook()` and `POST /api/webhooks/notification` in `src/worker.js`.
- Frontend API call: the matching file in `frontend/src/services/`.
- Page UI: the matching file in `frontend/src/pages/`.
- Automated test: `tests/worker.test.mjs`.

After a code change:

```powershell
npm.cmd test
npm.cmd run cf:deploy
```

## Git Evidence

```powershell
git status --short
git log --oneline -12
git show --stat <commit-id>
```

Show the commit belonging to each member. Do not use `git add .` if unrelated local changes are present; stage only the intended files.

## Short Architecture Answer

> The frontend uses React and TypeScript. It communicates with a Cloudflare Worker through REST APIs. The Worker uses Cloudflare D1 for persistence and integrates with the partner Notification Hub through authenticated webhooks. The system has Public, Student, and Employer flows with role-based access control.
