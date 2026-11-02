export type UserRole = 'student' | 'employer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  website?: string;
  address?: string;
  faculty?: string;
  major?: string;
  university?: string;
  yearOfStudy?: string;
  portfolioUrl?: string;
  bio?: string;
  avatarUrl?: string;
}

export type JobCategory =
  | 'IT & Software'
  | 'Marketing & Communications'
  | 'Business & Administration'
  | 'Finance & Accounting'
  | 'Graphic Design & Creative Media'
  | 'Engineering'
  | 'Healthcare & Medical Administration'
  | 'Hospitality & Tourism'
  | 'Logistics & Supply Chain'
  | 'Education'
  | 'Sales & Customer Service'
  | 'Marketing'
  | 'Business'
  | 'Design'
  | 'Other';

export type JobWorkType =
  | 'Full-time'
  | 'Internship'
  | 'Part-time'
  | 'Contract'
  | 'Co-op';

export type JobStatus = 'open' | 'closed';

export type JobContentLanguage = 'th' | 'en' | 'both';

export interface Job {
  id: string;
  title: string;
  description: string;
  title_th?: string;
  title_en?: string;
  description_th?: string;
  description_en?: string;
  responsibilities_th?: string;
  responsibilities_en?: string;
  qualifications_th?: string;
  qualifications_en?: string;
  required_skills_th?: string;
  required_skills_en?: string;
  benefits_th?: string;
  benefits_en?: string;
  content_language?: JobContentLanguage;
  category: JobCategory;
  location: string;
  province: string;
  status: JobStatus;
  company_name: string;
  company_logo?: string;
  employer_id: string;
  salary_range?: string;
  work_type?: JobWorkType;
  application_deadline?: string;
  is_demo?: boolean;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus =
  | 'submitted'
  | 'reviewing'
  | 'shortlisted'
  | 'interview'
  | 'rejected'
  | 'accepted';

export interface Application {
  id: string;
  job_id: string;
  student_id: string;
  student_code?: string;
  student_name?: string;
  student_email?: string;
  student_phone?: string;
  avatar_url?: string;
  university?: string;
  faculty?: string;
  major?: string;
  year_of_study?: string;
  notes?: string;
  resume_url?: string;
  portfolio_url?: string;
  employer_feedback?: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  // Enriched fields from job & applicant queries
  job_title?: string;
  job_title_th?: string;
  job_title_en?: string;
  company_name?: string;
  location?: string;
  province?: string;
  category?: JobCategory;
  work_type?: JobWorkType;
  salary_range?: string;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: 'status_change' | 'new_application' | 'system';
  related_application_id?: string;
  read: boolean;
  created_at: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
}
