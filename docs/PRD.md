# Job Board Product Requirements Document

## 1. Product summary

**Product:** Job Board API  
**Product type:** Responsive web application with a REST API  
**Project team:** Team 18 - 2026_PlatformDev  
**Production URL (documented; recheck before a presentation):** `https://team18-job-board-api.tawee-dev.workers.dev`  
**Source repository:** `https://github.com/Taweesaksangkorane/jobboard-api`

Job Board lets Students find vacancies and submit applications. Employers create and manage their own vacancies, review applicants, and update application statuses. Application-status changes are sent to the external Notification Hub; a validated callback then creates the Student notification in Job Board.

The application is a React/TypeScript frontend served with a Cloudflare Worker REST API and Cloudflare D1 database. It is an academic demonstration using fictional accounts and data, not a production recruitment service.

## 2. Goals

- Let public visitors search and inspect approved-employer job listings.
- Let authenticated Students submit an application and view only their own applications and notifications.
- Let authenticated Employers manage only their own jobs and applicants.
- Deliver application-status events through the Notification Hub integration.
- Provide Thai/English UI support where the frontend has translations or bilingual job content.
- Apply server-side session, role, ownership, input-validation, and webhook controls.

## 3. Users and access boundaries

| Actor | Access |
| --- | --- |
| Public visitor | `/login`, `/jobs`, and `/jobs/:id`; no session required for job discovery. |
| Student | Signed Student session; own applications and notifications. |
| Employer | Signed Employer session; own jobs and applicants only. |
| Notification Hub | Service integration, not an interactive user. It receives status events and posts authenticated callbacks. |

The Worker derives protected identities from signed session cookies. It does not trust a Student or Employer identifier supplied by the browser.

## 4. Implemented browser routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Redirects an anonymous visitor to `/login`; redirects a signed-in user to the relevant dashboard. | Public redirect |
| `/login`, `/register` | Demo sign-in screen. `/register` is an alias, not production registration. | Public |
| `/jobs`, `/jobs/:id` | Job search and job detail. | Public |
| `/student/dashboard` | Student dashboard. | Student |
| `/student/applications`, `/student/applications/:id` | Student application list/detail. | Student |
| `/student/notifications` | Student notifications. | Student |
| `/student/profile`, `/student/skills` | Demo profile/skills interface. These edits are client-side only and are not persisted by the Worker or D1. | Student |
| `/employer/dashboard` | Employer dashboard. | Employer |
| `/employer/jobs`, `/employer/jobs/create`, `/employer/jobs/:id/edit` | Employer job management. | Employer |
| `/employer/applicants`, `/employer/applicants/:applicationId` | Employer applicant review. | Employer |
| `/employer/profile` | Demo company-profile interface. Its edits are client-side only and are not persisted by the Worker or D1. | Employer |

## 5. Functional requirements

### Authentication and authorization

- Demo Student and Employer login uses configured fictional accounts.
- Protected requests use short-lived, signed `HttpOnly`, `Secure`, `SameSite=Lax` cookies.
- Missing authentication returns `401`; a valid session with the wrong role returns `403`.
- Student application and notification queries are scoped to the session Student.
- Employer job and applicant actions are scoped to the session Employer.

### Job discovery and job management

- Public users can list and view jobs belonging to approved employers.
- `GET /api/jobs` supports `q`, `province`, `category`, `status`, `work_type`, `lang`, and `sort` filters.
- Search text is capped at 100 characters and SQL values are bound parameters.
- An Employer can create, update, close, and delete only its own jobs.
- A job requires title, description, category, location, and province; job status is `open` or `closed`.

### Applications

- An authenticated Student can apply only to an open job.
- Contact phone input must normalize to exactly 10 digits and begin with `0`.
- The database prevents duplicate applications with `UNIQUE(student_id, job_id)`.
- A Student can retrieve only their own application history.
- An Employer can retrieve applicants for its own jobs and set one of: `submitted`, `reviewing`, `shortlisted`, `interview`, `rejected`, or `accepted`.

### Notifications and integration

- Updating an application status creates an `integration_outbox` event and attempts delivery to `${NOTIFICATION_SERVICE_URL}/api/webhooks/jobboard`.
- The Notification Hub is the notification source of truth: Job Board does not create a local notification merely because the status changed.
- `POST /api/webhooks/notification` requires `x-webhook-secret`.
- The callback requires an event ID/type, a positive recipient ID, and a message. It accepts documented field aliases such as `eventId`/`event_id` and `userId`/`student_id`/`recipient_id`.
- Repeated callback event IDs are acknowledged without creating another notification.
- Accepted callbacks are stored in `integration_events` and `notifications` in the same D1 batch.
- The Cloudflare scheduled handler retries pending outbox events; the configured Cron cadence is every minute.

## 6. Data and technical requirements

- React, TypeScript, and Vite build the frontend; Cloudflare Worker serves the built assets and `/api/*`.
- `src/worker.js` owns API authorization and business logic.
- Cloudflare D1 is bound as `DB`; migrations are versioned in `migrations/`.
- Core entities: `students`, `employers`, `jobs`, `applications`, `notifications`, `integration_events`, and `integration_outbox`.
- D1 prepared statements with bound values are used for user-controlled query data.
- JSON request bodies are limited to 16 KB and malformed/non-JSON mutation bodies are rejected.
- Secrets including session signing credentials and webhook secrets must be configured in Cloudflare, never committed to the frontend.

## 7. UX requirements

- Responsive public, Student, and Employer layouts.
- Thai/English interface resources and bilingual job fields when data exists.
- Clear loading, empty, error, success, and validation feedback for supported user journeys.
- Student notifications are visible and can be marked read individually or all at once.
- The Student layout refreshes notification state periodically.

## 8. Non-goals and known gaps

- This is not real-user registration: no production registration, email verification, password reset, or identity assurance exists.
- Student Profile, Skills, and Company Profile pages are visual/demo features; their edits currently do not persist through an API or D1.
- The system must not receive real applicant personal data, CVs, passwords, or contact details.
- PDPA compliance audit, consent versioning, retention/deletion workflow, audited privacy notice, rate limiting, and comprehensive audit logging remain out of scope.
- The joint partner replay scenario (manual test M-06) is still pending evidence.
- Several manual screenshots remain required, including browser loading, notification UI, invalid-phone feedback, and webhook-secret rejection.
- The automated Worker suite is not end-to-end browser coverage or proof that the partner service is live at any later date.

## 9. Acceptance criteria

1. A visitor can open `/jobs`, search/filter listings, and inspect a job without a session.
2. An authenticated Student can submit an eligible application and view only their own applications and notifications.
3. An authenticated Employer can create/manage only its own jobs and review only applicants for those jobs.
4. Unauthenticated job creation returns `401`; a Student attempting it returns `403`.
5. Invalid/missing job input and invalid Thai phone input return `400` without the intended write.
6. A duplicate Student/job application is rejected by Worker/database rules.
7. An allowed Employer application-status update creates an outbound outbox event.
8. A valid Notification Hub callback creates a notification for the intended Student; a bad secret returns `401` and incomplete payload returns `400`.
9. A replayed event ID does not create a duplicate notification. This remains pending joint manual evidence.
10. The Worker test suite, frontend type check, production build, and Wrangler deployment dry-run pass.

## 10. Verification status

`npm.cmd test` was run for this revision. It passed 12 Worker tests, the frontend TypeScript check, Vite production build, and Wrangler deployment dry-run. The build emitted a non-blocking warning that the JavaScript bundle exceeds 500 KB.

This verification does not deploy, query the live D1 database, or prove current Notification Hub availability. Recheck the deployment URL, configured secrets, D1 migration state, and partner endpoint before a final demonstration.
