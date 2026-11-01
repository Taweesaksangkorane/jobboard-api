# JobBoard - แพลตฟอร์มหางานและฝึกงานสำหรับนิสิตและนักศึกษา

เว็บแอปพลิเคชัน Job Board สมบูรณ์แบบที่เชื่อมต่อโอกาสการทำงานและฝึกงานระหว่าง **นิสิต/นักศึกษา (Student)** และ **นายจ้าง/บริษัท (Employer)** พร้อมระบบบริหารจัดการใบสมัครและประกาศงานครบวงจร

---

## 🚀 ฟีเจอร์หลักของระบบ (Key Features)

### 1. ส่วนสาธารณะ (Public Area)
- **หน้าแรก (Home Page):** แสดง Hero Banner, ค้นหาด่วนตามคำค้นและจังหวัด, หมวดหมู่งานยอดนิยม, ตำแหน่งงานแนะนำล่าสุด, และขั้นตอนการใช้งาน (How It Works)
- **ค้นหาตำแหน่งงาน (Job Search):** ตัวกรองขั้นสูงตามจังหวัด, หมวดหมู่งาน, สถานะเปิดรับสมัคร, ค้นหาตามคำสำคัญ (Title, Company, Location), เรียงตามประกาศใหม่ล่าสุด พร้อมระบบ Pagination
- **รายละเอียดตำแหน่งงาน (Job Details):** แสดงข้อมูลบริษัท, สถานที่, ค่าตอบแทน, ภาระหน้าที่ความรับผิดชอบ, คุณสมบัติที่ต้องการ, สวัสดิการ พร้อมปุ่มสมัครงานทันที
- **สมัครงาน (Apply Job):** ฟอร์มกรอกข้อมูลผู้สมัคร, ข้อความแนะนำตัว, หนังสือยินยอม, และส่วนแนบไฟล์เรซูเม่
- **เข้าสู่ระบบ & สมัครสมาชิก (Guest-First Auth):** ระบบสิทธิ์แบบ Guest-First ไม่มีการล็อกอินอัตโนมัติ ผู้ใช้สามารถเลือกลงทะเบียนเป็นนักศึกษาหรือนายจ้างได้จริง พร้อมการตรวจสอบความปลอดภัยของรหัสผ่าน
- **ระบบป้องกันสิทธิ์ (Protected Routes & Guest Modal):** เมื่อผู้ใช้ทั่วไป (Guest) กด "สมัครงาน" หรือพยายามเข้าสู่พื้นที่สมาชิก ระบบจะแสดง Modal แจ้งเตือนให้เข้าสู่ระบบหรือสมัครสมาชิกก่อน

---

## 📡 REST API Endpoints

### ยืนยันตัวตนและสมาชิก (Authentication)
- `POST /api/auth/register` - ลงทะเบียนสมาชิกใหม่ (แยกประเภท Student และ Employer พร้อมตรวจสอบอีเมลซ้ำ)
- `POST /api/auth/login` - ตรวจสอบความถูกต้องของอีเมลและรหัสผ่าน พร้อมออก Auth Token
- `GET /api/auth/me` - ตรวจสอบสถานะและข้อมูลของเซสชันที่กำลังใช้งาน

### ตำแหน่งงาน (Jobs)
- `GET /api/jobs` - ดึงรายการประกาศงาน (รองรับฟิลเตอร์ `province`, `category`, `status`, `q`)
- `GET /api/jobs/:id` - ดึงรายละเอียดประกาศงานตาม ID
- `POST /api/jobs` - สร้างประกาศงานใหม่
- `PATCH /api/jobs/:id` - แก้ไขข้อมูลประกาศงาน
- `DELETE /api/jobs/:id` - ลบประกาศงาน

### ใบสมัครงาน (Applications)
- `POST /api/jobs/:jobId/applications` - ส่งใบสมัครงาน (จำเป็นต้องส่ง `student_id`)
- `GET /api/applications/me?student_id=STUDENT_ID` - ดึงใบสมัครของนักศึกษา
- `PATCH /api/applications/:applicationId/status` - อัปเดตสถานะใบสมัคร (`submitted`, `reviewing`, `shortlisted`, `accepted`, `rejected`)

### การเชื่อมต่อระบบ (Integration & Webhooks)
- `GET /api/integration/applications/:applicationId` - ดึงข้อมูลใบสมัครสำหรับการเชื่อมต่อภายนอก
- `POST /api/integration/notifications` - ส่งการแจ้งเตือน
- `POST /api/webhooks/notification` - รับ Webhook การแจ้งเตือน

---

## ⚠️ ข้อมูลสถานะการพัฒนา Backend (Backend Limitations Notice)

ตามข้อกำหนด Section 7 และ 9 ของระบบ ปัจจุบันระบบ Backend เดิมยังไม่มี Endpoint สำหรับฟังก์ชันต่อไปนี้:
1. Complete Authentication Endpoints (`/api/auth/*`)
2. Student Profile Management API (`/api/students/profile`)
3. Skills Management API (`/api/students/skills`)
4. File/Resume Upload to Cloud Storage API (`/api/upload`)
5. Company Profile Management API (`/api/employers/profile`)

แอปพลิเคชันนี้ได้จัดเตรียม **Service Abstraction Layer** และ **Demo Simulation Mode** ไว้อย่างชัดเจน พร้อมแถบแจ้งเตือนจำลอง เพื่อให้การทดสอบระบบลื่นไหลและพร้อมสำหรับการเชื่อมต่อกับ Backend จริงในขั้นต่อไป

---

## 💻 การติดตั้งและเปิดใช้งาน (Setup & Run)

```bash
# ติดตั้ง dependencies
npm install

# รัน Development Server (Fullstack Express + Vite)
npm run dev

# บิลด์สำหรับ Production
npm run build

# ทดสอบรัน Production
npm run start
```
