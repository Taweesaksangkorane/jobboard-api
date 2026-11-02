-- Rich, non-production demo dataset for UI/API demonstrations.
INSERT OR IGNORE INTO employers (employer_id, company_name, approval_status) VALUES
  (10, 'Northstar Digital Co., Ltd.', 'approved'),
  (11, 'Lanna Creative Studio', 'approved'),
  (12, 'GreenPath Logistics', 'approved'),
  (13, 'Mekong FinTech Lab', 'approved'),
  (14, 'Chiang Rai Wellness Center', 'approved'),
  (15, 'Blue Mountain Hospitality', 'approved'),
  (16, 'FutureWorks Engineering', 'approved'),
  (17, 'BrightMind Education', 'approved'),
  (18, 'Siam Retail Solutions', 'approved'),
  (19, 'CloudNine Marketing', 'approved');

INSERT OR IGNORE INTO students (student_id, name, email, consent_status) VALUES
  (10, 'Anan Saelim', 'anan.demo@example.com', 'granted'),
  (11, 'Benjamas Khamdee', 'benjamas.demo@example.com', 'granted'),
  (12, 'Chayut Wongsa', 'chayut.demo@example.com', 'granted'),
  (13, 'Darunee Inta', 'darunee.demo@example.com', 'granted'),
  (14, 'Ekkarat Boonmee', 'ekkarat.demo@example.com', 'granted'),
  (15, 'Fahsai Kaewta', 'fahsai.demo@example.com', 'granted'),
  (16, 'Kittipong Meesuk', 'kittipong.demo@example.com', 'granted'),
  (17, 'Lalita Charoen', 'lalita.demo@example.com', 'granted'),
  (18, 'Nattapon Srisai', 'nattapon.demo@example.com', 'granted'),
  (19, 'Orathai Phromma', 'orathai.demo@example.com', 'granted'),
  (20, 'Pichaya Maneerat', 'pichaya.demo@example.com', 'granted'),
  (21, 'Ratchanon Khamla', 'ratchanon.demo@example.com', 'granted'),
  (22, 'Sirinya Jaidee', 'sirinya.demo@example.com', 'granted'),
  (23, 'Thanawat Panya', 'thanawat.demo@example.com', 'granted'),
  (24, 'Waranya Saengdao', 'waranya.demo@example.com', 'granted');

INSERT OR IGNORE INTO jobs (
  job_id, employer_id, title, description, category, location, province, status,
  content_language, title_th, title_en, description_th, description_en,
  work_type, salary_range, application_deadline
) VALUES
  (100, 1, 'Frontend Developer Intern', 'Build accessible React interfaces for a modern job platform.', 'IT & Software', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'both', 'นักศึกษาฝึกงาน Frontend Developer', 'Frontend Developer Intern', 'พัฒนาหน้าเว็บ React ที่ใช้งานง่ายและรองรับมือถือ', 'Build accessible React interfaces for a modern job platform.', 'Internship', '10,000-15,000 THB', '2027-02-28'),
  (101, 10, 'Junior Backend Developer', 'Develop APIs, automated tests and cloud integrations.', 'IT & Software', 'Mueang Chiang Mai', 'Chiang Mai', 'open', 'en', NULL, 'Junior Backend Developer', NULL, 'Develop APIs, automated tests and cloud integrations.', 'Full-time', '25,000-35,000 THB', '2027-03-15'),
  (102, 10, 'Data Analyst Intern', 'Analyze business data and create interactive dashboards.', 'IT & Software', 'Chatuchak', 'Bangkok', 'open', 'both', 'นักศึกษาฝึกงาน Data Analyst', 'Data Analyst Intern', 'วิเคราะห์ข้อมูลธุรกิจและสร้างแดชบอร์ด', 'Analyze business data and create interactive dashboards.', 'Internship', '12,000-18,000 THB', '2027-03-10'),
  (103, 11, 'Graphic Designer', 'Create brand identities, social media artwork and campaign assets.', 'Graphic Design & Creative Media', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'both', 'กราฟิกดีไซเนอร์', 'Graphic Designer', 'ออกแบบสื่อประชาสัมพันธ์และอัตลักษณ์แบรนด์', 'Create brand identities, social media artwork and campaign assets.', 'Full-time', '22,000-30,000 THB', '2027-02-20'),
  (104, 11, 'UX/UI Design Intern', 'Research user needs and prototype responsive products.', 'Graphic Design & Creative Media', 'Mueang Chiang Mai', 'Chiang Mai', 'open', 'en', NULL, 'UX/UI Design Intern', NULL, 'Research user needs and prototype responsive products.', 'Internship', '10,000-14,000 THB', '2027-03-01'),
  (105, 12, 'Supply Chain Coordinator', 'Coordinate inventory, deliveries and supplier schedules.', 'Logistics & Supply Chain', 'Bang Phli', 'Samut Prakan', 'open', 'both', 'เจ้าหน้าที่ประสานงานซัพพลายเชน', 'Supply Chain Coordinator', 'ประสานงานคลังสินค้า การขนส่ง และผู้จัดจำหน่าย', 'Coordinate inventory, deliveries and supplier schedules.', 'Full-time', '24,000-32,000 THB', '2027-03-20'),
  (106, 12, 'Logistics Operations Intern', 'Support route planning and daily delivery operations.', 'Logistics & Supply Chain', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'th', 'นักศึกษาฝึกงานฝ่ายโลจิสติกส์', NULL, 'สนับสนุนการวางแผนเส้นทางและงานขนส่งประจำวัน', NULL, 'Internship', '9,000-12,000 THB', '2027-02-25'),
  (107, 13, 'Finance Operations Analyst', 'Reconcile transactions and improve financial reporting.', 'Finance & Accounting', 'Pathum Wan', 'Bangkok', 'open', 'en', NULL, 'Finance Operations Analyst', NULL, 'Reconcile transactions and improve financial reporting.', 'Full-time', '30,000-42,000 THB', '2027-03-31'),
  (108, 13, 'Accounting Intern', 'Assist with invoices, tax documents and monthly closing.', 'Finance & Accounting', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'both', 'นักศึกษาฝึกงานบัญชี', 'Accounting Intern', 'ช่วยจัดทำใบแจ้งหนี้ เอกสารภาษี และปิดบัญชี', 'Assist with invoices, tax documents and monthly closing.', 'Internship', '10,000-13,000 THB', '2027-03-05'),
  (109, 14, 'Clinic Administrator', 'Coordinate appointments, records and patient services.', 'Healthcare & Medical Administration', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'both', 'เจ้าหน้าที่ธุรการคลินิก', 'Clinic Administrator', 'ดูแลนัดหมาย เอกสาร และบริการผู้รับบริการ', 'Coordinate appointments, records and patient services.', 'Full-time', '20,000-28,000 THB', '2027-02-28'),
  (110, 1, 'Cloud Support Intern', 'Support Cloudflare services, monitoring and incident documentation.', 'IT & Software', 'Remote', 'Bangkok', 'open', 'both', 'นักศึกษาฝึกงาน Cloud Support', 'Cloud Support Intern', 'ดูแลระบบคลาวด์ การติดตามสถานะ และเอกสารเหตุขัดข้อง', 'Support cloud services, monitoring and incident documentation.', 'Internship', '12,000-16,000 THB', '2027-03-15'),
  (111, 14, 'Health Data Assistant', 'Prepare anonymized reports and validate clinic datasets.', 'Healthcare & Medical Administration', 'Mae Sai', 'Chiang Rai', 'closed', 'en', NULL, 'Health Data Assistant', NULL, 'Prepare anonymized reports and validate clinic datasets.', 'Part-time', '500 THB/day', '2026-12-15'),
  (112, 15, 'Hotel Guest Relations Officer', 'Deliver excellent guest experiences and coordinate front desk services.', 'Hospitality & Tourism', 'Mueang Phuket', 'Phuket', 'open', 'both', 'เจ้าหน้าที่ลูกค้าสัมพันธ์โรงแรม', 'Hotel Guest Relations Officer', 'ดูแลประสบการณ์ผู้เข้าพักและประสานงานส่วนหน้า', 'Deliver excellent guest experiences and coordinate front desk services.', 'Full-time', '23,000-32,000 THB', '2027-03-30'),
  (113, 15, 'Tourism Content Intern', 'Create bilingual travel stories and short-form video content.', 'Hospitality & Tourism', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'both', 'นักศึกษาฝึกงานผลิตคอนเทนต์ท่องเที่ยว', 'Tourism Content Intern', 'ผลิตบทความและวิดีโอท่องเที่ยวสองภาษา', 'Create bilingual travel stories and short-form video content.', 'Internship', '9,000-13,000 THB', '2027-02-28'),
  (114, 16, 'Mechanical Engineer', 'Design components and support manufacturing improvement projects.', 'Engineering', 'Si Racha', 'Chon Buri', 'open', 'en', NULL, 'Mechanical Engineer', NULL, 'Design components and support manufacturing improvement projects.', 'Full-time', '32,000-45,000 THB', '2027-04-01'),
  (115, 16, 'IoT Engineering Intern', 'Prototype sensors, firmware and monitoring dashboards.', 'Engineering', 'Mueang Chiang Mai', 'Chiang Mai', 'open', 'both', 'นักศึกษาฝึกงานวิศวกรรม IoT', 'IoT Engineering Intern', 'พัฒนาต้นแบบเซนเซอร์ เฟิร์มแวร์ และแดชบอร์ด', 'Prototype sensors, firmware and monitoring dashboards.', 'Internship', '12,000-18,000 THB', '2027-03-20'),
  (116, 17, 'English Teaching Assistant', 'Support classroom activities and digital learning materials.', 'Education', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'en', NULL, 'English Teaching Assistant', NULL, 'Support classroom activities and digital learning materials.', 'Part-time', '450-600 THB/hour', '2027-02-20'),
  (117, 17, 'EdTech Content Creator', 'Develop concise lessons, quizzes and learning videos.', 'Education', 'Remote', 'Bangkok', 'open', 'both', 'ผู้ผลิตสื่อการเรียนรู้ออนไลน์', 'EdTech Content Creator', 'พัฒนาบทเรียน แบบทดสอบ และวิดีโอการเรียนรู้', 'Develop concise lessons, quizzes and learning videos.', 'Contract', '25,000-40,000 THB/project', '2027-03-10'),
  (118, 18, 'Sales Operations Officer', 'Maintain sales data and coordinate customer follow-ups.', 'Sales & Customer Service', 'Mueang Khon Kaen', 'Khon Kaen', 'open', 'both', 'เจ้าหน้าที่สนับสนุนงานขาย', 'Sales Operations Officer', 'ดูแลข้อมูลการขายและติดตามลูกค้า', 'Maintain sales data and coordinate customer follow-ups.', 'Full-time', '22,000-30,000 THB', '2027-03-31'),
  (119, 18, 'Customer Success Intern', 'Help customers onboard and document product feedback.', 'Sales & Customer Service', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'both', 'นักศึกษาฝึกงาน Customer Success', 'Customer Success Intern', 'ช่วยลูกค้าเริ่มใช้งานและรวบรวมข้อเสนอแนะ', 'Help customers onboard and document product feedback.', 'Internship', '10,000-14,000 THB', '2027-03-01'),
  (120, 1, 'QA Automation Intern', 'Write API and browser tests for the job board platform.', 'IT & Software', 'Remote', 'Chiang Rai', 'open', 'both', 'นักศึกษาฝึกงาน QA Automation', 'QA Automation Intern', 'เขียนชุดทดสอบ API และหน้าเว็บสำหรับระบบหางาน', 'Write API and browser tests for the job board platform.', 'Internship', '11,000-16,000 THB', '2027-03-18'),
  (121, 19, 'Digital Marketing Specialist', 'Plan campaigns and optimize content performance.', 'Marketing & Communications', 'Huai Khwang', 'Bangkok', 'open', 'both', 'ผู้เชี่ยวชาญการตลาดดิจิทัล', 'Digital Marketing Specialist', 'วางแผนแคมเปญและวิเคราะห์ประสิทธิภาพคอนเทนต์', 'Plan campaigns and optimize content performance.', 'Full-time', '28,000-40,000 THB', '2027-03-25'),
  (122, 19, 'Social Media Intern', 'Schedule posts, create short videos and report engagement.', 'Marketing & Communications', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'both', 'นักศึกษาฝึกงาน Social Media', 'Social Media Intern', 'จัดตารางโพสต์ ผลิตวิดีโอสั้น และสรุปผล', 'Schedule posts, create short videos and report engagement.', 'Internship', '9,000-13,000 THB', '2027-02-28'),
  (123, 10, 'DevOps Engineer', 'Improve CI/CD, observability and cloud reliability.', 'IT & Software', 'Watthana', 'Bangkok', 'open', 'en', NULL, 'DevOps Engineer', NULL, 'Improve CI/CD, observability and cloud reliability.', 'Full-time', '45,000-70,000 THB', '2027-04-15'),
  (124, 11, 'Video Editor', 'Edit campaign, interview and product video content.', 'Graphic Design & Creative Media', 'Mueang Chiang Mai', 'Chiang Mai', 'open', 'both', 'นักตัดต่อวิดีโอ', 'Video Editor', 'ตัดต่อวิดีโอแคมเปญ สัมภาษณ์ และผลิตภัณฑ์', 'Edit campaign, interview and product video content.', 'Contract', '20,000-35,000 THB/project', '2027-03-12'),
  (125, 12, 'Procurement Assistant', 'Compare quotations and maintain supplier documentation.', 'Business & Administration', 'Lat Krabang', 'Bangkok', 'open', 'both', 'ผู้ช่วยฝ่ายจัดซื้อ', 'Procurement Assistant', 'เปรียบเทียบราคาและดูแลเอกสารผู้ขาย', 'Compare quotations and maintain supplier documentation.', 'Full-time', '21,000-28,000 THB', '2027-03-22'),
  (126, 13, 'Business Analyst Intern', 'Map business processes and document product requirements.', 'Business & Administration', 'Remote', 'Bangkok', 'open', 'en', NULL, 'Business Analyst Intern', NULL, 'Map business processes and document product requirements.', 'Internship', '13,000-18,000 THB', '2027-03-28'),
  (127, 15, 'Event Coordinator', 'Plan corporate events and coordinate venues and vendors.', 'Hospitality & Tourism', 'Mueang Chiang Mai', 'Chiang Mai', 'open', 'both', 'ผู้ประสานงานอีเวนต์', 'Event Coordinator', 'วางแผนงานและประสานสถานที่กับผู้ให้บริการ', 'Plan corporate events and coordinate venues and vendors.', 'Contract', '25,000-38,000 THB', '2027-03-08'),
  (128, 17, 'Academic Coordinator', 'Coordinate course schedules, instructors and student records.', 'Education', 'Mueang Phitsanulok', 'Phitsanulok', 'closed', 'both', 'เจ้าหน้าที่ประสานงานวิชาการ', 'Academic Coordinator', 'ประสานตารางเรียน ผู้สอน และข้อมูลนักศึกษา', 'Coordinate course schedules, instructors and student records.', 'Full-time', '23,000-31,000 THB', '2026-12-31'),
  (129, 18, 'E-commerce Operations Intern', 'Manage product listings, orders and weekly sales reports.', 'Sales & Customer Service', 'Mueang Nakhon Ratchasima', 'Nakhon Ratchasima', 'open', 'both', 'นักศึกษาฝึกงาน E-commerce', 'E-commerce Operations Intern', 'ดูแลรายการสินค้า คำสั่งซื้อ และรายงานยอดขาย', 'Manage product listings, orders and weekly sales reports.', 'Internship', '10,000-14,000 THB', '2027-03-15');

INSERT OR IGNORE INTO applications (
  student_id, job_id, status, student_name, student_email, notes, applied_at, updated_at
) VALUES
  (4, 100, 'reviewing', 'Demo Student', 'student@example.com', 'Interested in React and accessible design.', '2026-10-15 09:10:00', '2026-10-20 11:00:00'),
  (4, 102, 'shortlisted', 'Demo Student', 'student@example.com', 'Enjoy working with data visualization.', '2026-10-18 13:20:00', '2026-10-25 10:30:00'),
  (4, 104, 'submitted', 'Demo Student', 'student@example.com', 'Portfolio available on request.', '2026-10-28 16:00:00', '2026-10-28 16:00:00'),
  (4, 110, 'interview', 'Demo Student', 'student@example.com', 'Cloud platform learning project attached.', '2026-10-22 08:45:00', '2026-11-01 14:00:00'),
  (4, 120, 'accepted', 'Demo Student', 'student@example.com', 'Experience writing Postman tests.', '2026-10-12 15:15:00', '2026-10-30 09:00:00'),
  (10, 100, 'submitted', 'Anan Saelim', 'anan.demo@example.com', 'React coursework and team projects.', '2026-10-29 09:00:00', '2026-10-29 09:00:00'),
  (11, 100, 'shortlisted', 'Benjamas Khamdee', 'benjamas.demo@example.com', 'Frontend portfolio included.', '2026-10-25 10:00:00', '2026-11-01 10:00:00'),
  (12, 102, 'reviewing', 'Chayut Wongsa', 'chayut.demo@example.com', 'Strong spreadsheet and SQL skills.', '2026-10-27 11:30:00', '2026-10-30 11:30:00'),
  (13, 103, 'interview', 'Darunee Inta', 'darunee.demo@example.com', 'Brand design portfolio available.', '2026-10-20 12:00:00', '2026-11-02 13:00:00'),
  (14, 105, 'submitted', 'Ekkarat Boonmee', 'ekkarat.demo@example.com', 'Interested in operations planning.', '2026-10-30 08:00:00', '2026-10-30 08:00:00'),
  (15, 108, 'accepted', 'Fahsai Kaewta', 'fahsai.demo@example.com', 'Accounting major seeking internship.', '2026-10-10 09:30:00', '2026-10-26 16:30:00'),
  (16, 110, 'reviewing', 'Kittipong Meesuk', 'kittipong.demo@example.com', 'Cloud fundamentals certification.', '2026-10-24 13:40:00', '2026-10-29 13:40:00'),
  (17, 113, 'shortlisted', 'Lalita Charoen', 'lalita.demo@example.com', 'Bilingual travel content portfolio.', '2026-10-21 14:20:00', '2026-10-31 14:20:00'),
  (18, 115, 'submitted', 'Nattapon Srisai', 'nattapon.demo@example.com', 'Built ESP32 sensor project.', '2026-11-01 10:10:00', '2026-11-01 10:10:00'),
  (19, 116, 'reviewing', 'Orathai Phromma', 'orathai.demo@example.com', 'English education student.', '2026-10-26 15:00:00', '2026-10-30 15:00:00'),
  (20, 119, 'rejected', 'Pichaya Maneerat', 'pichaya.demo@example.com', 'Customer service experience.', '2026-10-11 08:10:00', '2026-10-24 08:10:00'),
  (21, 120, 'shortlisted', 'Ratchanon Khamla', 'ratchanon.demo@example.com', 'Automated API testing project.', '2026-10-23 11:15:00', '2026-11-01 11:15:00'),
  (22, 120, 'reviewing', 'Sirinya Jaidee', 'sirinya.demo@example.com', 'Quality assurance coursework.', '2026-10-28 09:25:00', '2026-10-31 09:25:00'),
  (23, 122, 'submitted', 'Thanawat Panya', 'thanawat.demo@example.com', 'Creates short-form campus videos.', '2026-11-02 12:30:00', '2026-11-02 12:30:00'),
  (24, 126, 'interview', 'Waranya Saengdao', 'waranya.demo@example.com', 'Business process case study attached.', '2026-10-19 10:45:00', '2026-11-02 10:45:00'),
  (10, 123, 'reviewing', 'Anan Saelim', 'anan.demo@example.com', 'CI/CD lab experience.', '2026-10-22 16:10:00', '2026-10-29 16:10:00'),
  (11, 124, 'submitted', 'Benjamas Khamdee', 'benjamas.demo@example.com', 'Video editing showreel available.', '2026-11-01 14:15:00', '2026-11-01 14:15:00'),
  (12, 129, 'shortlisted', 'Chayut Wongsa', 'chayut.demo@example.com', 'Marketplace operations project.', '2026-10-24 09:35:00', '2026-10-31 09:35:00');

INSERT OR IGNORE INTO notifications (
  notification_id, recipient_id, title, message, type, related_application_id, read, created_at
)
SELECT 1000 + application_id, student_id, 'Application status updated',
  'Your application for ' || jobs.title || ' is now ' || applications.status,
  'status_change', application_id,
  CASE WHEN applications.status IN ('submitted', 'reviewing') THEN 0 ELSE 1 END,
  applications.updated_at
FROM applications
JOIN jobs ON jobs.job_id = applications.job_id
WHERE applications.job_id BETWEEN 100 AND 129;
