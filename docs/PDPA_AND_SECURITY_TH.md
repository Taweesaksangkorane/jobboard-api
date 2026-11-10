# ความปลอดภัยและ PDPA สำหรับ Demo

## ขอบเขต

ระบบนี้เป็นสภาพแวดล้อมสาธิตทางการศึกษา ข้อมูล employer, student, email, เบอร์โทร และ notification เป็นข้อมูลสมมติทั้งหมด ห้ามกรอกข้อมูลส่วนตัวจริง CV จริง หรือ password จริง

## มาตรการที่ทำไว้

- ใช้ D1 prepared statements และ `bind()` ไม่ต่อ string จาก input เข้า SQL
- ตรวจ required fields, status, recipient, JSON, content type และจำกัด JSON request 16 KB
- Webhook ต้องมี `x-webhook-secret` ตรวจแบบไม่หยุดเปรียบเทียบกลางคัน ตรวจ payload และกัน `event_id` ซ้ำ
- CORS อนุญาตเฉพาะ origin ที่กำหนด origin ที่ไม่น่าเชื่อถือจะไม่ได้รับ allow-origin
- Response มี CSP, `nosniff`, referrer-policy และ permissions-policy
- ไม่ส่ง email ของ profile demo ออกโดยไม่จำเป็น
- Secret ตั้งผ่าน `wrangler secret put` และไม่ commit `.env` หรือ `.dev.vars`

## Authentication และ Authorization

Worker ตรวจ login จาก Cloudflare Secrets และออก signed session cookie อายุสั้นที่เป็น `HttpOnly`, `Secure`, `SameSite=Lax` พร้อมตรวจสิทธิ์ Student/Employer และ ownership ของข้อมูล

ระบบนี้เหมาะกับ controlled academic demo ไม่ใช่ระบบยืนยันตัวตน production จึงยังไม่รองรับ email verification, password reset, consent/version, retention/deletion workflow, audit log และ rate limiting อย่างครบถ้วน

## ประเด็นพูดเรื่อง PDPA

1. จุดประสงค์คือสาธิต workflow ของ Job Board ด้วยข้อมูลสมมติ
2. ใช้ข้อมูลเท่าที่จำเป็นและไม่รับ CV หรือข้อมูลติดต่อจริง
3. ข้อมูลที่ส่งให้ partner จำกัดเฉพาะ field ของ notification event
4. การส่งข้ามระบบใช้ shared secret
5. หากถูกขอให้ใช้ข้อมูลบุคคลจริง ต้องหยุดและจัดทำ privacy notice, consent, access control, retention และ deletion process ก่อน

## เปิดหลักฐานตรงไหน

| หัวข้อ | หลักฐาน |
|---|---|
| Cloud deployment | Production URL และ [wrangler.jsonc](../wrangler.jsonc) |
| Access control | `requireRole()` และ protected routes ใน [src/worker.js](../src/worker.js) |
| Webhook security | `POST /api/webhooks/notification` และ Postman |
| SQL injection/input | `prepare()`, `bind()` และ [tests/worker.test.mjs](../tests/worker.test.mjs) |
| Browser security | `/api/health` response headers และ automated tests |
| Data minimization | Demo Access และข้อมูลสมมติในระบบ |

Production URL เป็นระบบสาธิตที่ควบคุมได้ ห้ามใช้กับข้อมูลผู้สมัครจริง
