import { apiRequest } from './apiClient';
import { Job } from '../types';

type BackendJob = Omit<Job, 'id' | 'company_name'> & {
  job_id: string | number;
  employer_id: string | number;
  company_name?: string;
};

type JobInput = Partial<Job> & Pick<Job, 'title' | 'description' | 'category' | 'location' | 'province' | 'employer_id'>;

function normalizeJob(job: BackendJob): Job {
  return {
    ...job,
    id: String(job.job_id),
    employer_id: String(job.employer_id),
    company_name: job.company_name || `Employer #${job.employer_id}`,
  };
}

export const jobService = {
  async getJobs(filters: Record<string, string> = {}): Promise<Job[]> {
    const supported = new URLSearchParams();
    for (const key of ['province', 'category', 'status']) {
      if (filters[key]) supported.set(key, filters[key]);
    }
    const suffix = supported.size ? `?${supported.toString()}` : '';
    let jobs = (await apiRequest<BackendJob[]>(`/api/jobs${suffix}`)).map(normalizeJob);

    const q = filters.q?.toLocaleLowerCase();
    if (q) {
      jobs = jobs.filter((job) =>
        [job.title, job.description, job.location, job.province, job.category]
          .some((value) => String(value || '').toLocaleLowerCase().includes(q))
      );
    }
    if (filters.work_type) jobs = jobs.filter((job) => job.work_type === filters.work_type);
    if (filters.lang) jobs = jobs.filter((job) => job.content_language === filters.lang);
    if (filters.sort === 'salary_asc') jobs.sort((a, b) => (a.salary_range || '').localeCompare(b.salary_range || ''));
    if (filters.sort === 'salary_desc') jobs.sort((a, b) => (b.salary_range || '').localeCompare(a.salary_range || ''));
    return jobs;
  },

  async getJobById(id: string): Promise<Job> {
    return normalizeJob(await apiRequest<BackendJob>(`/api/jobs/${id}`));
  },

  async createJob(input: JobInput): Promise<Job> {
    const data = await apiRequest<BackendJob>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return normalizeJob(data);
  },

  async updateJob(id: string, input: Partial<Job>): Promise<Job> {
    const data = await apiRequest<BackendJob>(`/api/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    return normalizeJob(data);
  },

  async deleteJob(id: string): Promise<void> {
    await apiRequest<unknown>(`/api/jobs/${id}`, { method: 'DELETE' });
  },
};
