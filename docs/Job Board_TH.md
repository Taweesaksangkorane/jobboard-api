# รายงานการทดสอบและประกันคุณภาพ — Job Board API

**GitHub:** https://github.com/Taweesaksangkorane/jobboard-api

## 1. วัตถุประสงค์

ตรวจสอบความถูกต้อง ความน่าเชื่อถือ และความปลอดภัยของระบบ โดยครอบคลุม authentication, authorization, การจัดการงาน, การสมัครงาน, การเปลี่ยนสถานะ, notification, validation และ API security

ใช้การทดสอบ 2 แบบ:

1. **Automated Testing** ตรวจ API และ security ด้วย test script
2. **Manual Testing** ตรวจการใช้งานจริงผ่าน browser และ Postman

## 2. Automated Testing

ไฟล์ทดสอบคือ [tests/worker.test.mjs](../tests/worker.test.mjs) มี 12 กรณี:

| ID | กรณีทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| AT-01 | Health check | HTTP 200 พร้อม security headers |
| AT-02 | CORS | ไม่อนุญาต origin ที่ไม่น่าเชื่อถือ |
| AT-03 | Authentication | ผู้ไม่ login สร้างงานไม่ได้ |
| AT-04 | Authorization | Student สร้างงานไม่ได้ |
| AT-05 | Signed session | ตรวจ session ที่ถูกต้องได้ |
| AT-06 | Role session | Student และ Employer แยกสิทธิ์กัน |
| AT-07 | Job validation | ปฏิเสธข้อมูลสร้างงานไม่ครบ |
| AT-08 | Phone validation | ปฏิเสธเบอร์โทรไม่ถูกต้อง |
| AT-09 | Webhook authentication | ปฏิเสธ secret ผิด |
| AT-10 | Webhook validation | ปฏิเสธ payload ไม่ครบ |
| AT-11 | SQL binding | ค้นหางานใช้ parameter binding |
| AT-12 | Search validation | ปฏิเสธ keyword ยาวเกินกำหนด |

รันด้วย:

```powershell
npm.cmd run test:worker
```

ผลที่บันทึกไว้: 12 ผ่าน, 0 ไม่ผ่าน

## 3. Overall Quality Check

```powershell
npm.cmd test
```

คำสั่งนี้ตรวจ Worker tests, Frontend lint/type check, production build และ Wrangler deployment dry-run

## 4. Manual Testing

| ID | กรณีทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| M-01 | เปิดเว็บไซต์ | เปิดผ่าน HTTPS |
| M-02 | Student login | Login และเข้าหน้าตามสิทธิ์ได้ |
| M-03 | เปลี่ยนสถานะใบสมัคร | Employer เปลี่ยนสถานะได้ |
| M-04 | Student notification | Student ได้รับสถานะใหม่ |
| M-05 | เบอร์โทรไม่ถูกต้อง | ระบบปฏิเสธ input |
| M-06 | Webhook ซ้ำ | ไม่สร้าง notification ซ้ำ |
| M-07 | Secret ผิด | API ตอบ HTTP 401 |

## 5. สรุปผล

Automated testing รวม 12 กรณี และ manual testing รวม 7 กรณี รวม 19 กรณี ผลที่คาดหวังคือผ่านทั้งหมด โดยต้องแนบ screenshot ล่าสุดของแต่ละกรณีและบันทึกกรณีที่ยัง pending ตามจริง
