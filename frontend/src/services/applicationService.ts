import { apiRequest } from './apiClient';
import { Application, ApplicationStatus } from '../types';

type BackendApplication = Partial<Application> & {
  application_id: string | number;
  job_id: string | number;
  student_id: string | number;
  applied_at?: string;
  jobs?: {
    title?: string;
    category?: Application['category'];
    province?: string;
    location?: string;
    employers?: { company_name?: string } | null;
  } | null;
};

function normalizeApplication(app: BackendApplication): Application {
  return {
    ...app,
    id: String(app.application_id),
    job_id: String(app.job_id),
    student_id: String(app.student_id),
    status: app.status || 'submitted',
    created_at: app.created_at || app.applied_at || new Date(0).toISOString(),
    updated_at: app.updated_at || app.applied_at || new Date(0).toISOString(),
    job_title: app.job_title || app.jobs?.title,
    company_name: app.company_name || app.jobs?.employers?.company_name,
    category: app.category || app.jobs?.category,
    province: app.province || app.jobs?.province,
    location: app.location || app.jobs?.location,
  };
}

export const applicationService = {
  async applyForJob(jobId: string, input: Partial<Application> & { student_id: string }): Promise<Application> {
    return normalizeApplication(await apiRequest<BackendApplication>(`/api/jobs/${jobId}/applications`, {
      method: 'POST',
      body: JSON.stringify(input),
    }));
  },

  async getMyApplications(studentId: string): Promise<Application[]> {
    const data = await apiRequest<BackendApplication[]>(`/api/applications/me?student_id=${encodeURIComponent(studentId)}`);
    return data.map(normalizeApplication);
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus, _feedback?: string): Promise<Application> {
    return normalizeApplication(await apiRequest<BackendApplication>(`/api/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, employer_feedback: _feedback || undefined }),
    }));
  },

  async getIntegrationApplication(id: string): Promise<{ application: Application }> {
    const application = normalizeApplication(await apiRequest<BackendApplication>(`/api/integration/applications/${id}`));
    return { application };
  },

  async getEmployerApplicantById(id: string): Promise<Application> {
    const result = await this.getIntegrationApplication(id);
    return result.application;
  },

  async getEmployerApplicants(employerId?: string): Promise<Application[]> {
    if (!employerId) return [];
    const data = await apiRequest<BackendApplication[]>(`/api/employers/${encodeURIComponent(employerId)}/applications`);
    return data.map(normalizeApplication);
  },
};
