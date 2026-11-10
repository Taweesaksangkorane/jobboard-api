# เช็กลิสต์การนำเสนอ Mini Project รอบสุดท้าย

**วิชา:** 2026_PlatformDev  
**วันเวลา:** 10 พฤศจิกายน 2026 เวลา 13:00–18:00

## 1. ระบบและการ Deploy บน Cloud

- [x] ระบบทำงานครบและ deploy แล้วบน Cloudflare
- [x] มี Production URL สำหรับสาธิต
- [x] ไม่ได้ทำงานเฉพาะ localhost หรือ ngrok
- [x] ทดสอบ Production URL แล้ว

**เปิดให้ดู:** เว็บไซต์ `https://team18-job-board-api.tawee-dev.workers.dev` และ [wrangler.jsonc](../wrangler.jsonc)

## 2. ฟีเจอร์และสถานการณ์สาธิต

- [x] Job Search และตัวกรอง
- [x] Student/Employer Login
- [x] สมัครงาน
- [x] Employer ตรวจใบสมัครและเปลี่ยนสถานะ
- [x] Student ดู Notification

**Happy Path:** ค้นหางาน → Student Login → สมัครงาน → Employer เปลี่ยนสถานะ → Webhook → Student ดู Notification  
**เปิดให้ดู:** [DEMO_CHEAT_SHEET_TH.md](./DEMO_CHEAT_SHEET_TH.md) และเว็บไซต์จริง

## 3. การเชื่อมต่อกับกลุ่มอื่น

- [x] เชื่อมต่อ Notification Hub ของกลุ่มอื่นผ่าน Webhook
- [x] มี outbound request และ inbound callback
- [x] มีการตรวจ shared secret
- [x] มีการป้องกัน event ซ้ำ
- [ ] ยืนยัน partner group ให้พร้อมในเวลาสอบ

**เปิดให้ดู:** [wrangler.jsonc](../wrangler.jsonc), [src/worker.js](../src/worker.js), Postman ใน [postman/](../postman/)

หลักฐานที่ต้องแสดง:

- Endpoint และ HTTP method
- Request/response
- `401` เมื่อ secret ผิด
- `duplicate: true` เมื่อส่ง event เดิมซ้ำ

## 4. กระบวนการพัฒนาและการใช้ AI

- [x] Architecture และ design
- [x] ขั้นตอนการพัฒนา
- [x] หน้าที่ของสมาชิก
- [x] การใช้ AI
- [x] GitHub และ commit history
- [ ] สมาชิกทุกคนต้องอธิบายส่วนของตนเองได้

**เปิดให้ดู:** [DEVELOPMENT_AND_AI_EVIDENCE_TH.md](./DEVELOPMENT_AND_AI_EVIDENCE_TH.md)

## 5. Security และ PDPA

- [x] Authentication และ signed session
- [x] Role-based authorization
- [x] Input validation
- [x] CORS และ security headers
- [x] Prepared SQL และ bound parameters
- [x] Webhook secret และ event deduplication
- [x] ใช้ข้อมูล demo สมมติเท่านั้น

**เปิดให้ดู:** [PDPA_AND_SECURITY_TH.md](./PDPA_AND_SECURITY_TH.md) และโค้ดใน [src/worker.js](../src/worker.js)

## 6. Testing และ QA

- [x] Automated tests 12 กรณี
- [x] Manual tests 7 กรณี
- [x] Postman tests
- [x] บันทึกผลผ่าน/ไม่ผ่านตามจริง

```powershell
npm.cmd run test:worker
npm.cmd test
```

**เปิดให้ดู:** [Job Board_TH.md](./Job%20Board_TH.md) และ [MANUAL_TEST_EVIDENCE_TH.md](./MANUAL_TEST_EVIDENCE_TH.md)

## 7. ความเข้าใจ Source Code และการแก้ไขสด

- [ ] สมาชิกทุกคนอธิบายโค้ดได้
- [ ] ทุกคนพร้อมแก้ไขจุดเล็ก ๆ
- [x] รู้คำสั่งทดสอบและ deploy

```powershell
npm.cmd test
npm.cmd run cf:deploy
```

## 8. การเข้าร่วมและการประสานงาน

- [ ] สมาชิกทุกคนเข้าร่วม
- [x] เตรียมเวลา 5–10 นาที
- [ ] ซ้อมส่งต่อหน้าจอ
- [ ] ติดต่อ partner group และยืนยันระบบพร้อม

## ห้ามแสดง

ห้ามแสดง password, webhook secret, session cookie, API key, CV จริง หรือข้อมูลส่วนตัวจริง

## Go / No-Go ก่อนเริ่มสอบ

ต้องยืนยันให้ครบ: URL ใช้งานได้, Happy Path สำเร็จ, Webhook เชื่อมต่อได้, มี security/test evidence, สมาชิกอธิบายโค้ดได้, deploy ใหม่ได้ และ partner พร้อม
