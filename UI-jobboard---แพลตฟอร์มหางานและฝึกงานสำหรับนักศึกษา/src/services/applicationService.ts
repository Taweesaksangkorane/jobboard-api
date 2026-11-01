import api from './api';
import { Application, ApplicationStatus } from '../types';

export interface ApplyPayload {
  student_id: string;
  student_name?: string;
  student_email?: string;
  student_phone?: string;
  notes?: string;
  resume_url?: string;
  portfolio_url?: string;
}

export const applicationService = {
  // POST /api/jobs/:jobId/applications
  async applyForJob(jobId: string, payload: ApplyPayload): Promise<Application> {
    const res = await api.post<{ success: boolean; data: Application; message: string }>(
      `/api/jobs/${encodeURIComponent(jobId)}/applications`,
      payload
    );
    return res.data.data;
  },

  // GET /api/applications/me?student_id=STUDENT_ID
  async getMyApplications(studentId: string): Promise<Application[]> {
    const res = await api.get<{ success: boolean; data: Application[]; total: number }>(
      `/api/applications/me?student_id=${encodeURIComponent(studentId)}`
    );
    return res.data.data;
  },

  // PATCH /api/applications/:applicationId/status
  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    employerFeedback?: string
  ): Promise<Application> {
    const payload: { status: ApplicationStatus; employer_feedback?: string } = { status };
    if (employerFeedback !== undefined) {
      payload.employer_feedback = employerFeedback;
    }
    const res = await api.patch<{ success: boolean; data: Application; message: string }>(
      `/api/applications/${encodeURIComponent(applicationId)}/status`,
      payload
    );
    return res.data.data;
  },

  // GET /api/integration/applications/:applicationId
  async getIntegrationApplication(applicationId: string) {
    const res = await api.get<{
      success: boolean;
      data: {
        application: Application;
        job: unknown;
        integration_timestamp: string;
      };
    }>(`/api/integration/applications/${encodeURIComponent(applicationId)}`);
    return res.data.data;
  },

  // GET /api/employer/applicants
  async getEmployerApplicants(employerId?: string): Promise<Application[]> {
    const url = employerId
      ? `/api/employer/applicants?employer_id=${encodeURIComponent(employerId)}`
      : '/api/employer/applicants';
    const res = await api.get<{ success: boolean; data: Application[]; total: number }>(url);
    return res.data.data;
  },

  // GET /api/employer/applicants/:applicationId
  async getEmployerApplicantById(applicationId: string): Promise<Application> {
    const res = await api.get<{ success: boolean; data: Application }>(
      `/api/employer/applicants/${encodeURIComponent(applicationId)}`
    );
    return res.data.data;
  },
};
