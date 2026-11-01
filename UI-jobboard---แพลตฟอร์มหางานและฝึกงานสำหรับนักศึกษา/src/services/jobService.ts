import api from './api';
import { Job, JobCategory, JobContentLanguage, JobStatus, JobWorkType } from '../types';

export interface JobFilters {
  province?: string;
  category?: string;
  work_type?: string;
  status?: string;
  lang?: string;
  q?: string;
  sort?: string;
}

export interface CreateJobPayload {
  title?: string;
  description?: string;
  content_language?: JobContentLanguage;
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
}

export const jobService = {
  // GET /api/jobs (Query filters: province, category, work_type, status, lang, q, sort)
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters?.province && filters.province !== 'all') {
      params.append('province', filters.province);
    }
    if (filters?.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters?.work_type && filters.work_type !== 'all') {
      params.append('work_type', filters.work_type);
    }
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.lang && filters.lang !== 'all') {
      params.append('lang', filters.lang);
    }
    if (filters?.q?.trim()) {
      params.append('q', filters.q.trim());
    }
    if (filters?.sort && filters.sort !== 'newest') {
      params.append('sort', filters.sort);
    }

    const res = await api.get<{ success: boolean; data: Job[]; total: number }>(
      `/api/jobs${params.toString() ? `?${params.toString()}` : ''}`
    );
    return res.data.data;
  },

  // GET /api/jobs/:id
  async getJobById(id: string): Promise<Job> {
    const res = await api.get<{ success: boolean; data: Job }>(`/api/jobs/${id}`);
    return res.data.data;
  },

  // POST /api/jobs
  async createJob(payload: CreateJobPayload): Promise<Job> {
    const res = await api.post<{ success: boolean; data: Job; message: string }>('/api/jobs', payload);
    return res.data.data;
  },

  // PATCH /api/jobs/:id
  async updateJob(id: string, payload: Partial<Job>): Promise<Job> {
    const res = await api.patch<{ success: boolean; data: Job; message: string }>(`/api/jobs/${id}`, payload);
    return res.data.data;
  },

  // DELETE /api/jobs/:id
  async deleteJob(id: string): Promise<Job> {
    const res = await api.delete<{ success: boolean; data: Job; message: string }>(`/api/jobs/${id}`);
    return res.data.data;
  },
};
