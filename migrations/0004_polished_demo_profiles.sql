-- Polished fictional data for the Job Board demo.
-- This migration intentionally updates only the original generic demo profiles
-- and adds records that make both employer demo accounts useful to present.

UPDATE employers
SET company_name = 'Siam TechWorks Co., Ltd.'
WHERE employer_id = 1 AND company_name = 'Team 18 Demo Company';

UPDATE employers
SET company_name = 'Blue River Consulting Co., Ltd.'
WHERE employer_id = 2 AND company_name = 'Other Company';

UPDATE students
SET name = 'Nattapong Srisawat', email = 'nattapong.demo@example.com'
WHERE student_id = 4 AND name = 'Demo Student';

UPDATE jobs
SET
  title = 'Backend Developer Intern',
  description = 'Support API development, write automated tests, and collaborate with a product team on a real web platform.',
  content_language = 'both',
  title_th = 'นักศึกษาฝึกงาน Backend Developer',
  title_en = 'Backend Developer Intern',
  description_th = 'ร่วมพัฒนา API เขียน automated tests และทำงานกับทีมผลิตภัณฑ์บนเว็บแพลตฟอร์มจริง',
  description_en = 'Support API development, write automated tests, and collaborate with a product team on a real web platform.',
  responsibilities_th = 'พัฒนา REST API, เขียน unit tests และช่วยตรวจสอบคุณภาพโค้ด',
  responsibilities_en = 'Build REST APIs, write unit tests, and support code-quality reviews.',
  qualifications_th = 'กำลังศึกษา Computer Science, IT หรือสาขาที่เกี่ยวข้อง',
  qualifications_en = 'Studying Computer Science, IT, or a related field.',
  required_skills_th = 'JavaScript หรือ TypeScript, SQL และ Git',
  required_skills_en = 'JavaScript or TypeScript, SQL, and Git.',
  work_type = 'Internship',
  salary_range = '12,000-15,000 THB',
  application_deadline = '2027-03-31',
  updated_at = CURRENT_TIMESTAMP
WHERE job_id = 6;

INSERT OR IGNORE INTO jobs (
  job_id, employer_id, title, description, category, location, province, status,
  content_language, title_th, title_en, description_th, description_en,
  responsibilities_th, responsibilities_en, qualifications_th, qualifications_en,
  required_skills_th, required_skills_en, work_type, salary_range, application_deadline
) VALUES
  (220, 2, 'Digital Marketing Coordinator',
   'Plan social media content, coordinate campaign assets, and prepare weekly performance reports.',
   'Marketing & Communications', 'วัฒนา', 'Bangkok', 'open', 'both',
   'Digital Marketing Coordinator', 'Digital Marketing Coordinator',
   'วางแผนคอนเทนต์โซเชียล ประสานงานสื่อแคมเปญ และสรุปรายงานผลประจำสัปดาห์',
   'Plan social media content, coordinate campaign assets, and prepare weekly performance reports.',
   'จัดทำ content calendar และติดตามผลแคมเปญ',
   'Create content calendars and track campaign results.',
   'ปริญญาตรีด้านการตลาด นิเทศศาสตร์ หรือสาขาที่เกี่ยวข้อง',
   'Degree in marketing, communications, or a related field.',
   'Content writing, Canva และ Google Analytics เบื้องต้น',
   'Content writing, Canva, and basic Google Analytics.',
   'Full-time', '25,000-32,000 THB', '2027-04-15'),
  (221, 2, 'Business Operations Intern',
   'Assist with client meeting notes, simple data analysis, and internal process documentation.',
   'Business & Administration', 'คลองเตย', 'Bangkok', 'open', 'both',
   'นักศึกษาฝึกงาน Business Operations', 'Business Operations Intern',
   'ช่วยสรุปรายงานประชุม วิเคราะห์ข้อมูลเบื้องต้น และจัดทำเอกสารกระบวนการทำงานภายใน',
   'Assist with client meeting notes, simple data analysis, and internal process documentation.',
   'สรุปรายงานประชุมและจัดทำเอกสารการทำงาน',
   'Prepare meeting notes and internal process documentation.',
   'กำลังศึกษา Business Administration, Economics หรือสาขาที่เกี่ยวข้อง',
   'Studying Business Administration, Economics, or a related field.',
   'Excel หรือ Google Sheets และการสื่อสารภาษาไทย',
   'Excel or Google Sheets and Thai communication skills.',
   'Internship', '10,000-13,000 THB', '2027-04-10');

INSERT OR IGNORE INTO applications (
  student_id, job_id, status, student_name, student_email, student_phone, notes, employer_feedback, applied_at, updated_at
) VALUES
  (4, 220, 'reviewing', 'Nattapong Srisawat', 'nattapong.demo@example.com', '089-555-0104',
   'Portfolio includes university campaign planning and short-form video examples.', NULL,
   '2026-11-05 10:15:00', '2026-11-07 09:30:00'),
  (10, 221, 'submitted', 'Anan Saelim', 'anan.demo@example.com', '089-555-0110',
   'Interested in consulting operations and process improvement.', NULL,
   '2026-11-06 14:20:00', '2026-11-06 14:20:00');

INSERT OR IGNORE INTO notifications (
  notification_id, recipient_id, title, message, type, related_application_id, read, created_at
) SELECT
  3001, 4, 'Application under review',
  'Blue River Consulting is reviewing your application for Digital Marketing Coordinator.',
  'job.application.reviewing', application_id, 0, '2026-11-07 09:30:00'
FROM applications
WHERE student_id = 4 AND job_id = 220;

INSERT OR IGNORE INTO notifications (
  notification_id, recipient_id, title, message, type, related_application_id, read, created_at
) SELECT
  3002, 10, 'Application received',
  'Blue River Consulting received your application for Business Operations Intern.',
  'job.application.submitted', application_id, 0, '2026-11-06 14:20:00'
FROM applications
WHERE student_id = 10 AND job_id = 221;
