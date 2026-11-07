import { apiRequest } from './apiClient';

export type DemoStudent = {
  student_id: number;
  name: string;
  email: string | null;
};

export const studentService = {
  getStudents: () => apiRequest<DemoStudent[]>('/api/students'),
};
