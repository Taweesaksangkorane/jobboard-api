# หลักฐานการพัฒนา ทีม Git และการใช้ AI

## Architecture

```text
Browser (React/Vite)
        |
Cloudflare Worker -- Cloudflare D1
        |
Notification Hub ของ partner -- Webhook callback
```

Worker ให้บริการทั้งหน้าเว็บและ REST API บน HTTPS origin เดียวกัน ส่วน D1 เก็บข้อมูล demo สมมติ และใช้ signed session กับการเชื่อมต่อแบบ shared secret

## ขั้นตอนการพัฒนา

1. แก้ไขงานเป็นส่วนเล็ก ๆ และรัน `npm.cmd test`
2. ตรวจ `git diff`
3. commit งานที่เกี่ยวข้องเป็นชุดเล็ก ๆ
4. deploy ด้วย `npm.cmd run cf:deploy`
5. ตรวจ Production URL และบันทึกหลักฐาน

## หน้าที่สมาชิก

| สมาชิก | หน้าที่ | สิ่งที่เปิดแสดง |
|---|---|---|
| 6731503012 — Taweesak Sangkoranee | Backend API และ Webhook integration | `src/worker.js`, D1 query, webhook |
| 6731503036 — Wichayapon Seepin | UI/UX และ Job Search | หน้าค้นหา ตัวกรอง และ responsive UI |
| 6731503044 — Aubolwan Maneechan | เอกสาร PDPA และ Deployment | README, security document, Production URL |
| 6731503123 — Sawitta Thiabsaeng | Frontend | React pages และ Student/Employer flow |
| 6731503127 — Onpreya Thiabsaeng | Testing และ QA | `tests/worker.test.mjs` และ manual evidence |

## หลักฐาน Git

```powershell
git status --short
git log --oneline -12
git show --stat <commit-id>
```

ให้เปิด commit ที่เกี่ยวข้องกับงานของสมาชิกแต่ละคน และไม่แสดง secret

## การใช้ AI

ใช้ AI เป็นผู้ช่วยในการอธิบายโค้ด ปรับ UI ร่าง test cases จัดโครงสร้างเอกสาร และแก้ปัญหา โดยสมาชิกตรวจสอบผลลัพธ์ รัน test และทดสอบกับระบบจริงแล้ว AI ไม่ได้ใช้ประมวลผล CV จริง password หรือ secret

## คำตอบ Architecture แบบสั้น

> Frontend ใช้ React และ TypeScript ติดต่อ Cloudflare Worker ผ่าน REST API, Worker ใช้ Cloudflare D1 เก็บข้อมูล และเชื่อม Notification Hub ของ partner ผ่าน Webhook ที่มีการยืนยันตัวตน ระบบแบ่งเป็น Public, Student และ Employer พร้อม role-based access control
