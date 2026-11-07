-- Extended fictional dataset for demonstrations and integration testing.
-- Every insert is idempotent, so this migration is safe to apply once per D1 database.

INSERT OR IGNORE INTO employers (employer_id, company_name, approval_status) VALUES
  (30, 'Aurora Software House', 'approved'),
  (31, 'River City Analytics', 'approved'),
  (32, 'Siam Sustainable Foods', 'approved'),
  (33, 'Northern Health Tech', 'approved'),
  (34, 'Pixel Forge Studio', 'approved'),
  (35, 'TransitFlow Thailand', 'approved'),
  (36, 'Campus Learning Lab', 'approved'),
  (37, 'Andaman Travel Group', 'approved'),
  (38, 'Baan Mai Retail', 'approved'),
  (39, 'NextGen Manufacturing', 'pending');

INSERT OR IGNORE INTO students (student_id, name, email, consent_status) VALUES
  (30, 'Arisa Chantarang', 'arisa.demo@example.com', 'granted'),
  (31, 'Bodin Phanurat', 'bodin.demo@example.com', 'granted'),
  (32, 'Chananthida Rattanakul', 'chananthida.demo@example.com', 'granted'),
  (33, 'Darin Wattanakul', 'darin.demo@example.com', 'granted'),
  (34, 'Ekapol Nimsakul', 'ekapol.demo@example.com', 'granted'),
  (35, 'Fonnapa Kittisak', 'fonnapa.demo@example.com', 'granted'),
  (36, 'Gawin Thongchai', 'gawin.demo@example.com', 'granted'),
  (37, 'Hathaitip Sae-Lim', 'hathaitip.demo@example.com', 'granted'),
  (38, 'Inthira Chaimuang', 'inthira.demo@example.com', 'granted'),
  (39, 'Jirawat Kerdkaew', 'jirawat.demo@example.com', 'granted'),
  (40, 'Kanokwan Pholsri', 'kanokwan.demo@example.com', 'granted'),
  (41, 'Kritsada Yimlamai', 'kritsada.demo@example.com', 'granted'),
  (42, 'Lalinee Boonsong', 'lalinee.demo@example.com', 'granted'),
  (43, 'มนตรี ตั้งใจ', 'montri.demo@example.com', 'granted'),
  (44, 'Napatsorn Phromdee', 'napatsorn.demo@example.com', 'granted'),
  (45, 'Oranuch Kittipong', 'oranuch.demo@example.com', 'granted'),
  (46, 'Pakin Intarak', 'pakin.demo@example.com', 'granted'),
  (47, 'Pimchanok Raksakul', 'pimchanok.demo@example.com', 'granted'),
  (48, 'Rinrada Charoenpol', 'rinrada.demo@example.com', 'granted'),
  (49, 'Saran Bunyawat', 'saran.demo@example.com', 'granted'),
  (50, 'Sirinapa Phungam', 'sirinapa.demo@example.com', 'granted'),
  (51, 'Thanakrit Wongsawat', 'thanakrit.demo@example.com', 'granted'),
  (52, 'Thidarat Nualnoi', 'thidarat.demo@example.com', 'granted'),
  (53, 'Wichaya Chaiya', 'wichaya.demo@example.com', 'granted'),
  (54, 'Yada Sombat', 'yada.demo@example.com', 'granted');

INSERT OR IGNORE INTO jobs (
  job_id, employer_id, title, description, category, location, province, status,
  content_language, title_en, description_en, work_type, salary_range, application_deadline
) VALUES
  (200, 30, 'Software Engineer Intern', 'Build and test features for a web platform.', 'IT & Software', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'en', 'Software Engineer Intern', 'Build and test features for a web platform.', 'Internship', '12,000-16,000 THB', '2027-04-15'),
  (201, 30, 'Junior Frontend Developer', 'Create responsive interfaces with React and TypeScript.', 'IT & Software', 'Bang Na', 'Bangkok', 'open', 'en', 'Junior Frontend Developer', 'Create responsive interfaces with React and TypeScript.', 'Full-time', '28,000-38,000 THB', '2027-04-20'),
  (202, 31, 'Business Intelligence Intern', 'Prepare reports and maintain dashboard data.', 'Data & Analytics', 'Mueang Chiang Mai', 'Chiang Mai', 'open', 'en', 'Business Intelligence Intern', 'Prepare reports and maintain dashboard data.', 'Internship', '12,000-18,000 THB', '2027-04-10'),
  (203, 31, 'Data Quality Associate', 'Validate datasets and document data-quality rules.', 'Data & Analytics', 'Chatuchak', 'Bangkok', 'open', 'en', 'Data Quality Associate', 'Validate datasets and document data-quality rules.', 'Full-time', '26,000-34,000 THB', '2027-04-25'),
  (204, 32, 'Food Product Development Intern', 'Support product trials and consumer research.', 'Food Science', 'Mueang Lamphun', 'Lamphun', 'open', 'en', 'Food Product Development Intern', 'Support product trials and consumer research.', 'Internship', '10,000-14,000 THB', '2027-04-12'),
  (205, 32, 'Quality Assurance Officer', 'Review quality records and coordinate audits.', 'Food Science', 'Bang Pakong', 'Chachoengsao', 'open', 'en', 'Quality Assurance Officer', 'Review quality records and coordinate audits.', 'Full-time', '24,000-31,000 THB', '2027-05-01'),
  (206, 33, 'Health Information Intern', 'Organize anonymized service and operations data.', 'Healthcare & Medical Administration', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'en', 'Health Information Intern', 'Organize anonymized service and operations data.', 'Internship', '11,000-15,000 THB', '2027-04-18'),
  (207, 33, 'Customer Support Specialist', 'Help users resolve account and scheduling issues.', 'Customer Service', 'Remote', 'Bangkok', 'open', 'en', 'Customer Support Specialist', 'Help users resolve account and scheduling issues.', 'Full-time', '23,000-30,000 THB', '2027-04-30'),
  (208, 34, 'Motion Graphic Intern', 'Create short animations for digital campaigns.', 'Graphic Design & Creative Media', 'Mueang Chiang Mai', 'Chiang Mai', 'open', 'en', 'Motion Graphic Intern', 'Create short animations for digital campaigns.', 'Internship', '10,000-14,000 THB', '2027-04-14'),
  (209, 34, 'Brand Designer', 'Develop visual identity and campaign assets.', 'Graphic Design & Creative Media', 'Pathum Wan', 'Bangkok', 'open', 'en', 'Brand Designer', 'Develop visual identity and campaign assets.', 'Full-time', '27,000-36,000 THB', '2027-04-28'),
  (210, 35, 'Operations Planning Intern', 'Support transport schedules and route planning.', 'Logistics & Supply Chain', 'Mueang Khon Kaen', 'Khon Kaen', 'open', 'en', 'Operations Planning Intern', 'Support transport schedules and route planning.', 'Internship', '10,000-14,000 THB', '2027-04-16'),
  (211, 35, 'Fleet Coordinator', 'Coordinate vehicles, drivers and delivery updates.', 'Logistics & Supply Chain', 'Lat Krabang', 'Bangkok', 'open', 'en', 'Fleet Coordinator', 'Coordinate vehicles, drivers and delivery updates.', 'Full-time', '25,000-33,000 THB', '2027-04-27'),
  (212, 36, 'Learning Content Intern', 'Create online learning activities and concise guides.', 'Education', 'Remote', 'Chiang Rai', 'open', 'en', 'Learning Content Intern', 'Create online learning activities and concise guides.', 'Internship', '9,000-13,000 THB', '2027-04-09'),
  (213, 36, 'Academic Operations Officer', 'Coordinate courses, classrooms and learner records.', 'Education', 'Mueang Phitsanulok', 'Phitsanulok', 'open', 'en', 'Academic Operations Officer', 'Coordinate courses, classrooms and learner records.', 'Full-time', '24,000-32,000 THB', '2027-05-03'),
  (214, 37, 'Travel Experience Intern', 'Assist with itineraries and guest communications.', 'Hospitality & Tourism', 'Mueang Phuket', 'Phuket', 'open', 'en', 'Travel Experience Intern', 'Assist with itineraries and guest communications.', 'Internship', '10,000-15,000 THB', '2027-04-19'),
  (215, 37, 'Reservation Agent', 'Manage reservations and guest requests.', 'Hospitality & Tourism', 'Ko Samui', 'Surat Thani', 'open', 'en', 'Reservation Agent', 'Manage reservations and guest requests.', 'Full-time', '22,000-29,000 THB', '2027-04-26'),
  (216, 38, 'E-commerce Intern', 'Maintain product listings and weekly reports.', 'Sales & Customer Service', 'Mueang Chiang Rai', 'Chiang Rai', 'open', 'en', 'E-commerce Intern', 'Maintain product listings and weekly reports.', 'Internship', '10,000-14,000 THB', '2027-04-13'),
  (217, 38, 'Store Operations Supervisor', 'Support daily retail operations and team schedules.', 'Sales & Customer Service', 'Mueang Nakhon Ratchasima', 'Nakhon Ratchasima', 'open', 'en', 'Store Operations Supervisor', 'Support daily retail operations and team schedules.', 'Full-time', '26,000-35,000 THB', '2027-05-02'),
  (218, 39, 'Manufacturing Engineer', 'Improve assembly processes and factory documentation.', 'Engineering', 'Si Racha', 'Chon Buri', 'open', 'en', 'Manufacturing Engineer', 'Improve assembly processes and factory documentation.', 'Full-time', '30,000-42,000 THB', '2027-04-29'),
  (219, 39, 'Production Planning Intern', 'Assist with production plans and material tracking.', 'Engineering', 'Amata City', 'Chon Buri', 'closed', 'en', 'Production Planning Intern', 'Assist with production plans and material tracking.', 'Internship', '11,000-15,000 THB', '2027-03-31');

INSERT OR IGNORE INTO applications (
  student_id, job_id, status, student_name, student_email, student_phone, notes, employer_feedback, applied_at, updated_at
) VALUES
  (30, 200, 'submitted', 'Arisa Chantarang', 'arisa.demo@example.com', '081-000-0030', 'Portfolio includes two web applications.', NULL, '2026-11-01 09:00:00', '2026-11-01 09:00:00'),
  (31, 201, 'reviewing', 'Bodin Phanurat', 'bodin.demo@example.com', '081-000-0031', 'Interested in accessible frontend development.', NULL, '2026-10-28 10:15:00', '2026-11-03 11:20:00'),
  (32, 202, 'shortlisted', 'Chananthida Rattanakul', 'chananthida.demo@example.com', '081-000-0032', 'Dashboard and SQL coursework attached.', 'Please prepare a short portfolio walkthrough.', '2026-10-24 14:00:00', '2026-11-02 09:30:00'),
  (33, 203, 'interview', 'Darin Wattanakul', 'darin.demo@example.com', '081-000-0033', 'Experience cleaning survey data.', 'Interview scheduled for next week.', '2026-10-20 08:30:00', '2026-11-04 13:00:00'),
  (34, 204, 'accepted', 'Ekapol Nimsakul', 'ekapol.demo@example.com', '081-000-0034', 'Food science laboratory experience.', 'Welcome to the internship programme.', '2026-10-12 11:00:00', '2026-10-30 16:00:00'),
  (35, 205, 'submitted', 'Fonnapa Kittisak', 'fonnapa.demo@example.com', '081-000-0035', 'Quality systems course completed.', NULL, '2026-11-02 09:45:00', '2026-11-02 09:45:00'),
  (36, 206, 'reviewing', 'Gawin Thongchai', 'gawin.demo@example.com', '081-000-0036', 'Health data project attached.', NULL, '2026-10-29 13:30:00', '2026-11-03 10:00:00'),
  (37, 207, 'rejected', 'Hathaitip Sae-Lim', 'hathaitip.demo@example.com', '081-000-0037', 'Customer support volunteer experience.', 'The role has been filled.', '2026-10-15 15:00:00', '2026-10-27 09:00:00'),
  (38, 208, 'shortlisted', 'Inthira Chaimuang', 'inthira.demo@example.com', '081-000-0038', 'Animation reel included.', 'Please send an updated reel.', '2026-10-25 12:10:00', '2026-11-02 14:10:00'),
  (39, 209, 'interview', 'Jirawat Kerdkaew', 'jirawat.demo@example.com', '081-000-0039', 'Brand identity case study attached.', 'Interview scheduled for Friday.', '2026-10-22 10:30:00', '2026-11-04 09:15:00'),
  (40, 210, 'submitted', 'Kanokwan Pholsri', 'kanokwan.demo@example.com', '081-000-0040', 'Route planning group project.', NULL, '2026-11-03 08:00:00', '2026-11-03 08:00:00'),
  (41, 211, 'reviewing', 'Kritsada Yimlamai', 'kritsada.demo@example.com', '081-000-0041', 'Logistics internship experience.', NULL, '2026-10-30 16:20:00', '2026-11-04 11:00:00'),
  (42, 212, 'accepted', 'Lalinee Boonsong', 'lalinee.demo@example.com', '081-000-0042', 'Created learning materials for peer tutoring.', 'Offer accepted and onboarding started.', '2026-10-10 09:10:00', '2026-10-29 15:20:00'),
  (43, 213, 'submitted', 'มนตรี ตั้งใจ', 'montri.demo@example.com', '081-000-0043', 'Academic administration coursework.', NULL, '2026-11-01 14:40:00', '2026-11-01 14:40:00'),
  (44, 214, 'reviewing', 'Napatsorn Phromdee', 'napatsorn.demo@example.com', '081-000-0044', 'Fluent Thai and English communication.', NULL, '2026-10-31 10:30:00', '2026-11-03 16:00:00'),
  (45, 215, 'shortlisted', 'Oranuch Kittipong', 'oranuch.demo@example.com', '081-000-0045', 'Hospitality service certificate.', 'Please confirm your available start date.', '2026-10-23 11:15:00', '2026-11-02 10:15:00'),
  (46, 216, 'submitted', 'Pakin Intarak', 'pakin.demo@example.com', '081-000-0046', 'Managed online catalogues for a student project.', NULL, '2026-11-02 13:00:00', '2026-11-02 13:00:00'),
  (47, 217, 'reviewing', 'Pimchanok Raksakul', 'pimchanok.demo@example.com', '081-000-0047', 'Part-time retail experience.', NULL, '2026-10-27 09:20:00', '2026-11-03 09:20:00'),
  (48, 218, 'interview', 'Rinrada Charoenpol', 'rinrada.demo@example.com', '081-000-0048', 'Manufacturing improvement case study.', 'Interview scheduled with the engineering lead.', '2026-10-21 14:30:00', '2026-11-04 10:45:00'),
  (49, 219, 'rejected', 'Saran Bunyawat', 'saran.demo@example.com', '081-000-0049', 'Production planning course completed.', 'Position is no longer available.', '2026-10-14 08:50:00', '2026-10-26 13:30:00'),
  (50, 200, 'shortlisted', 'Sirinapa Phungam', 'sirinapa.demo@example.com', '081-000-0050', 'Full-stack capstone project.', 'Please complete the coding exercise.', '2026-10-26 15:20:00', '2026-11-02 15:20:00'),
  (51, 202, 'submitted', 'Thanakrit Wongsawat', 'thanakrit.demo@example.com', '081-000-0051', 'Interested in reporting automation.', NULL, '2026-11-03 12:00:00', '2026-11-03 12:00:00'),
  (52, 208, 'reviewing', 'Thidarat Nualnoi', 'thidarat.demo@example.com', '081-000-0052', 'Illustration and motion studies attached.', NULL, '2026-10-29 10:00:00', '2026-11-04 08:40:00'),
  (53, 210, 'interview', 'Wichaya Chaiya', 'wichaya.demo@example.com', '081-000-0053', 'Supply chain analytics project.', 'Panel interview scheduled.', '2026-10-22 13:30:00', '2026-11-04 15:30:00'),
  (54, 214, 'accepted', 'Yada Sombat', 'yada.demo@example.com', '081-000-0054', 'Tourism management project attached.', 'Offer accepted.', '2026-10-11 10:00:00', '2026-10-28 10:00:00');

INSERT OR IGNORE INTO notifications (
  notification_id, recipient_id, title, message, type, related_application_id, read, created_at
)
SELECT 2000 + application_id, student_id, 'Application status updated',
  'Your application for ' || jobs.title || ' is now ' || applications.status,
  'status_change', application_id,
  CASE WHEN applications.status IN ('submitted', 'reviewing') THEN 0 ELSE 1 END,
  applications.updated_at
FROM applications
JOIN jobs ON jobs.job_id = applications.job_id
WHERE applications.job_id BETWEEN 200 AND 219;
