# คู่มือเตรียม Demo Job Board

เอกสารสรุปสำหรับใช้ก่อนและระหว่างการนำเสนอ ห้ามใส่ password, webhook secret, session cookie หรือข้อมูลส่วนตัวจริงในไฟล์นี้

## ระบบ Production

- เว็บไซต์และ API: `https://team18-job-board-api.tawee-dev.workers.dev`
- Health check: `GET https://team18-job-board-api.tawee-dev.workers.dev/api/health`
- Cloudflare Worker: `team18-job-board-api`
- ฐานข้อมูล: Cloudflare D1 `team18-job-board-db`
- ระบบคู่เชื่อมต่อ: Notification Hub จาก `NOTIFICATION_SERVICE_URL`

## คำสั่งหลัก

รันจากโฟลเดอร์ root ของโปรเจกต์:

```powershell
npm.cmd install
npm.cmd run frontend:dev
npm.cmd run test:worker
npm.cmd test
npm.cmd run cf:deploy
```

- `npm.cmd run frontend:dev`: เปิด frontend สำหรับพัฒนาในเครื่อง
- `npm.cmd run test:worker`: รัน automated Worker tests 12 cases
- `npm.cmd test`: รัน Worker tests, TypeScript check, frontend build และ Wrangler dry-run
- `npm.cmd run cf:deploy`: build frontend และ deploy Worker ขึ้น Cloudflare

ผล Automated Test ที่คาดหวัง:

```text
12 tests
12 passed
0 failed
```

## Environment Variables และ Secrets

Production ต้องตั้งค่า secret ผ่าน Cloudflare ไม่ใส่ค่าจริงใน source control:

```powershell
npx.cmd wrangler secret put AUTH_SESSION_SECRET
npx.cmd wrangler secret put DEMO_STUDENT_EMAIL
npx.cmd wrangler secret put DEMO_STUDENT_PASSWORD
npx.cmd wrangler secret put DEMO_EMPLOYER_EMAIL
npx.cmd wrangler secret put DEMO_EMPLOYER_PASSWORD
npx.cmd wrangler secret put WEBHOOK_SECRET
npx.cmd wrangler secret put EVENT_WEBHOOK_SECRET
```

ตัวแปรที่กำหนดใน `wrangler.jsonc`:

```text
NOTIFICATION_SERVICE_URL=<partner Notification Hub URL>
```

ข้อควรระวัง:

- ห้าม commit `.env`, `.dev.vars` หรือ password จริง
- ห้ามแสดง secret ใน Postman screenshot
- ถ้า secret ถูกเปิดเผย ให้เปลี่ยน secret และแจ้งทีม Notification Hub ให้ใช้ค่าใหม่ตรงกัน
- `.env` ใช้สำหรับ local เท่านั้น ส่วน Production ใช้ Cloudflare Secrets/Vars

## Happy Path สำหรับนำเสนอ

1. เปิด Production URL และแสดงหน้า Public Job Search
2. ค้นหางานและใช้ตัวกรองหมวดหมู่ จังหวัด ประเภทงาน สถานะ ภาษา และการเรียงเงินเดือน
3. เปิดรายละเอียดงาน
4. Login ด้วย Student demo account
5. สมัครงานด้วยเบอร์โทรไทย 10 หลักที่ขึ้นต้นด้วย `0`
6. เปิด My Applications และแสดงสถานะการสมัคร
7. Logout แล้ว Login ด้วย Employer demo account
8. เปิด Applicants และ Applicant Details
9. เปลี่ยนสถานะใบสมัคร เช่น `shortlisted` เป็น `interview`
10. แสดง API response ที่มี `notification_sent: true`
11. กลับไป Student และเปิด Notifications
12. ใช้ Postman แสดง invalid webhook secret ได้ `401` และ duplicate event ได้ `duplicate: true`

ใช้เฉพาะข้อมูล demo ที่สร้างไว้ ห้ามใช้ข้อมูลส่วนตัวจริง

## Backend อยู่ที่ `src/worker.js`

| ฟังก์ชัน | Route |
| --- | --- |
| Health | `GET /api/health` |
| Login | `POST /api/auth/login` |
| Logout | `POST /api/auth/logout` |
| ตรวจ Session | `GET /api/auth/me` |
| ค้นหางาน | `GET /api/jobs` |
| สร้างงาน | `POST /api/jobs` |
| รายละเอียดงาน | `GET /api/jobs/:id` |
| แก้ไขงาน | `PATCH /api/jobs/:id` |
| ลบงาน | `DELETE /api/jobs/:id` |
| สมัครงาน | `POST /api/jobs/:id/applications` |
| ใบสมัครของ Student | `GET /api/applications/me` |
| ผู้สมัครของ Employer | `GET /api/employers/:id/applications` |
| เปลี่ยนสถานะใบสมัคร | `PATCH /api/applications/:id/status` |
| ข้อมูล Integration | `GET /api/integration/applications/:id` |
| Notifications | `GET /api/notifications` |
| อ่าน Notification | `PATCH /api/notifications/:id/read` |
| อ่าน Notifications ทั้งหมด | `PATCH /api/notifications/read-all` |
| รับ Callback จากทีมอื่น | `POST /api/webhooks/notification` |

ฟังก์ชันสำคัญ:

- `handleApi()`: ควบคุม API routes
- `requireRole()`: ตรวจสิทธิ์ Student/Employer
- `isValidThaiPhone()`: ตรวจเบอร์โทร 10 หลัก
- `sendWebhook()`: ส่ง event ไป Notification Hub
- `secretsMatch()`: ตรวจ shared secret
- `applySecurityHeaders()`: เพิ่ม security headers และ CORS

## ตำแหน่งไฟล์ Frontend

- Routes: `frontend/src/App.tsx`
- API wrapper: `frontend/src/services/apiClient.ts`
- Login/Session: `frontend/src/services/authService.ts`
- Jobs: `frontend/src/services/jobService.ts`
- Applications: `frontend/src/services/applicationService.ts`
- Notifications: `frontend/src/services/notificationService.ts`
- Student data: `frontend/src/services/studentService.ts`

หน้าเว็บหลัก:

- Public Search: `frontend/src/pages/public/JobSearchPage.tsx`
- Job Details: `frontend/src/pages/public/JobDetailsPage.tsx`
- Student Dashboard: `frontend/src/pages/student/StudentDashboardPage.tsx`
- Student Applications: `frontend/src/pages/student/MyApplicationsPage.tsx`
- Student Profile: `frontend/src/pages/student/StudentProfilePage.tsx`
- Student Skills: `frontend/src/pages/student/MySkillsPage.tsx`
- Student Notifications: `frontend/src/pages/student/NotificationsPage.tsx`
- Employer Dashboard: `frontend/src/pages/employer/EmployerDashboardPage.tsx`
- Manage Jobs: `frontend/src/pages/employer/ManageJobsPage.tsx`
- Create Job: `frontend/src/pages/employer/CreateJobPage.tsx`
- Edit Job: `frontend/src/pages/employer/EditJobPage.tsx`
- Applicants: `frontend/src/pages/employer/ApplicantsPage.tsx`
- Applicant Review: `frontend/src/pages/employer/ApplicantReviewPage.tsx`
- Company Profile: `frontend/src/pages/employer/CompanyProfilePage.tsx`

## Webhook Flow

```text
Employer เปลี่ยนสถานะใบสมัคร
        |
        v
PATCH /api/applications/:id/status
        |
        v
Job Board สร้าง application-status event
        |
        v
ส่ง Outbound Event ไป Notification Hub
        |
        v
Notification Hub ส่ง Inbound Callback กลับมา
        |
        v
POST /api/webhooks/notification
        |
        v
D1 บันทึก integration event และ Student notification
```

หลักฐานที่ต้องจำ:

- Secret ผิด: HTTP `401`, `Invalid webhook secret`
- ส่งครั้งแรก: `stored: true`, `notification_created: true`
- ส่ง event เดิมซ้ำ: `duplicate: true`, `Event already processed`
- ใช้ `event_id` เดิมทั้งสองครั้ง

## Testing และไฟล์หลักฐาน

- Automated tests: `tests/worker.test.mjs`
- Manual evidence: `docs/MANUAL_TEST_EVIDENCE.md`
- Security/PDPA: `docs/PDPA_AND_SECURITY.md`
- Development/Git/AI: `docs/DEVELOPMENT_AND_AI_EVIDENCE.md`
- Postman: `postman/Team18-Cloudflare-API.postman_collection.json`

คำสั่งตรวจสอบ:

```powershell
npm.cmd run test:worker
npm.cmd test
```

ผลที่ต้องเห็น:

- Worker tests: 12 passed, 0 failed
- TypeScript check: ผ่าน
- Frontend build: ผ่าน
- Wrangler dry-run: ผ่าน

Vite chunk-size warning เป็น warning ที่ไม่ทำให้ test fail หากคำสั่งจบสำเร็จ

## Security และ PDPA

- แยกสิทธิ์ Student และ Employer ด้วย signed role session
- Session cookie เป็น `HttpOnly`, `Secure`, `SameSite=Lax`
- Webhook ต้องใช้ shared secret
- ป้องกัน event ซ้ำด้วย `event_id`
- ใช้ prepared statements และ bound values กับ D1
- ตรวจสอบ JSON, input และ application status
- มี CSP, `nosniff`, referrer-policy และ permissions-policy
- ใช้ข้อมูล demo สมมติเท่านั้น
- ระบบนี้เป็น academic demo ไม่ใช่ production identity service เต็มรูปแบบ

## ถ้าอาจารย์ให้แก้สด

- แก้เบอร์โทร: `frontend/src/components/applications/ApplyModal.tsx` และ `src/worker.js`
- แก้ API response: route ที่เกี่ยวข้องใน `src/worker.js`
- แก้ Webhook: `sendWebhook()` และ route `/api/webhooks/notification`
- แก้ API call frontend: ไฟล์ใน `frontend/src/services/`
- แก้หน้า UI: ไฟล์ใน `frontend/src/pages/`
- เพิ่ม test: `tests/worker.test.mjs`

หลังแก้โค้ด:

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

แสดง commit ของสมาชิกแต่ละคน และอย่าใช้ `git add .` หากมีไฟล์อื่นที่ไม่เกี่ยวข้องอยู่ใน working tree

## คำตอบสั้นเรื่อง Architecture

> Frontend ใช้ React และ TypeScript ติดต่อ Backend ผ่าน REST API บน Cloudflare Workers โดยใช้ Cloudflare D1 เป็นฐานข้อมูล และเชื่อมต่อ Notification Hub ของทีมอื่นผ่าน Webhook ที่มีการตรวจสอบ secret และป้องกัน event ซ้ำ ระบบแบ่งเป็น Public, Student และ Employer พร้อม role-based access control
