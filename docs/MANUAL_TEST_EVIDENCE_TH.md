# หลักฐานการทดสอบด้วยคน — Cloudflare Demo

ให้ทดสอบกับ Production URL โดยใช้ข้อมูลสมมติเท่านั้น ห้ามใช้หรือแสดง password, secret, cookie และข้อมูลส่วนตัวจริง

| ID | สิ่งที่ทำ | ผลที่คาดหวัง | ผู้สาธิต | หลักฐาน |
|---|---|---|---|---|
| M-01 | เปิด `/` | เว็บไซต์เปิดผ่าน HTTPS | Sawitta | ภาพหน้าเว็บและ URL |
| M-02 | Login ด้วย Student และเปิด Notifications | สร้าง session และเห็นข้อมูลตามสิทธิ์ | Sawitta | ภาพ Dashboard/Notifications |
| M-03 | Employer เปลี่ยนใบสมัคร 62 จาก `shortlisted` เป็น `interview` | เปลี่ยนสถานะและมี integration event | Taweesak | ภาพ UI และ response |
| M-04 | Student ตรวจ Notification | เห็น notification ของสถานะใหม่ | Taweesak | ภาพทั้งสองระบบ |
| M-05 | กรอกเบอร์เกิน 10 หลัก | ระบบปฏิเสธและไม่สร้างใบสมัคร | Onpreya | ภาพ error หรือ HTTP 400 |
| M-06 | ส่ง partner event เดิมซ้ำ | ได้ `duplicate: true` และไม่สร้าง notification ซ้ำ | Taweesak | Postman response |
| M-07 | ส่ง Webhook ด้วย secret ผิด | ได้ HTTP 401 | Onpreya | Postman response โดยซ่อน secret |

## คำสั่งทดสอบ

```powershell
npm.cmd run test:worker
npm.cmd test
```

## สถานะที่ต้องอัปเดตก่อนสอบ

- M-06 ต้องทดสอบร่วมกับ partner ให้เสร็จ
- M-01, M-02, M-05 และ M-07 ต้องมี screenshot ล่าสุด
- ระบุชื่อผู้นำเสนอในหลักฐานทุกแถว

ใช้ Postman collection ใน [postman/](../postman/) สำหรับ M-04, M-06 และ M-07
