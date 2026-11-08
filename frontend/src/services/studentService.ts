import { apiRequest } from './apiClient';

export type DemoStudent = {
  student_id: number;
  name: string;
  email: string | null;
};

export type DemoEmployer = {
  employer_id: number;
  company_name: string;
};

export const studentService = {
  getStudents: () => apiRequest<DemoStudent[]>('/api/students'),
  getEmployers: () => apiRequest<DemoEmployer[]>('/api/employers'),
};
