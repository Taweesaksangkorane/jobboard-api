PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS employers (
  employer_id INTEGER PRIMARY KEY,
  company_name TEXT NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  student_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  consent_status TEXT NOT NULL DEFAULT 'granted',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  job_id INTEGER PRIMARY KEY AUTOINCREMENT,
  employer_id INTEGER NOT NULL REFERENCES employers(employer_id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  province TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  content_language TEXT,
  title_th TEXT,
  title_en TEXT,
  description_th TEXT,
  description_en TEXT,
  responsibilities_th TEXT,
  responsibilities_en TEXT,
  qualifications_th TEXT,
  qualifications_en TEXT,
  required_skills_th TEXT,
  required_skills_en TEXT,
  benefits_th TEXT,
  benefits_en TEXT,
  work_type TEXT,
  salary_range TEXT,
  application_deadline TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  application_id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(student_id),
  job_id INTEGER NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'submitted',
  student_name TEXT,
  student_email TEXT,
  student_phone TEXT,
  notes TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  employer_feedback TEXT,
  applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, job_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  related_application_id INTEGER,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS integration_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  source TEXT,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS integration_outbox (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  target_url TEXT,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_filters ON jobs(status, province, category);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id, applied_at);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, created_at);
CREATE INDEX IF NOT EXISTS idx_outbox_status ON integration_outbox(status, created_at);

INSERT OR IGNORE INTO employers (employer_id, company_name, approval_status)
VALUES (1, 'Team 18 Demo Company', 'approved'), (2, 'Other Company', 'approved');

INSERT OR IGNORE INTO students (student_id, name, email, consent_status)
VALUES (4, 'Demo Student', 'student@example.com', 'granted');

INSERT OR IGNORE INTO jobs (
  job_id, employer_id, title, description, category, location, province, status
) VALUES (
  6, 1, 'Backend Developer Intern',
  'Develop backend APIs and database systems for the Team 18 job board.',
  'IT & Software', 'Mueang Chiang Rai', 'Chiang Rai', 'open'
);
