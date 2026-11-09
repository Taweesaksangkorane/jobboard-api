import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { Application, Job } from '../../types';
import { ApplicationStatusBadge } from '../../components/common/StatusBadge';
import { Tooltip } from '../../components/common/Tooltip';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/dateFormatter';
import { Users, Search, Eye, GraduationCap } from 'lucide-react';

export const ApplicantsPage: React.FC = () => {
  const { t, i18n } = useTranslation(['employer', 'common']);
  const { user } = useAuth();

  const [applicants, setApplicants] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const employerId = user?.id;
      if (!employerId) {
        setLoading(false);
        return;
      }

      const [applicantList, jobList] = await Promise.all([
        applicationService.getEmployerApplicants(employerId),
        jobService.getJobs(),
      ]);

      const employerJobs = jobList.filter(
        (j) =>
          !j.employer_id ||
          j.employer_id === employerId ||
          ((employerId === 'emp-1' || employerId === '1') && Boolean(j.is_demo))
      );
      setApplicants(applicantList);
      setJobs(employerJobs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('common:feedback.errorMessage')
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        app.student_name?.toLowerCase().includes(q) ||
        app.job_title?.toLowerCase().includes(q) ||
        app.job_title_th?.toLowerCase().includes(q) ||
        app.job_title_en?.toLowerCase().includes(q) ||
        app.student_email?.toLowerCase().includes(q) ||
        app.university?.toLowerCase().includes(q);

      const matchJob = selectedJobId === 'all' || app.job_id === selectedJobId;
      const matchStatus = selectedStatus === 'all' || app.status === selectedStatus;

      return matchSearch && matchJob && matchStatus;
    });
  }, [applicants, searchTerm, selectedJobId, selectedStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#25243A]">
            {t('employer:applicants.title')}
          </h1>
          <p className="mt-1 text-xs text-[#73758A]">
            {t('employer:applicants.subtitle')}
          </p>
        </div>
        {!loading && !error && (
          <span className="text-xs font-semibold text-[#6C4CE3] bg-[#F0ECFF] px-3 py-1 rounded-full self-start sm:self-auto">
            {t('employer:applicants.count', { count: filteredApplicants.length })}
          </span>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#E9EAF1] bg-white p-4 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A2B3]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('employer:applicants.searchPlaceholder')}
            className="w-full rounded-xl border border-[#E9EAF1] bg-gray-50 py-2 pl-10 pr-3 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter by Job Position */}
          <Tooltip content={t('common:tooltips.filter')}>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              aria-label={t('employer:applicants.filterJob')}
              className="rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-xs text-[#25243A] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 cursor-pointer"
            >
              <option value="all">{t('employer:applicants.allJobs')}</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {i18n.language?.startsWith('en')
                    ? job.title_en || job.title_th || job.title
                    : job.title_th || job.title_en || job.title}
                </option>
              ))}
            </select>
          </Tooltip>

          {/* Filter by Status */}
          <Tooltip content={t('common:tooltips.filter')}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label={t('employer:applicants.filterStatus')}
              className="rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-xs text-[#25243A] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 cursor-pointer"
            >
              <option value="all">{t('employer:applicants.allStatuses')}</option>
              <option value="submitted">{t('common:status.submitted')}</option>
              <option value="reviewing">{t('common:status.reviewing')}</option>
              <option value="shortlisted">{t('common:status.shortlisted')}</option>
              <option value="interview">{t('common:status.interview')}</option>
              <option value="accepted">{t('common:status.accepted')}</option>
              <option value="rejected">{t('common:status.rejected')}</option>
            </select>
          </Tooltip>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filteredApplicants.length === 0 ? (
        <EmptyState
          title={t('employer:applicants.emptyTitle')}
          description={t('employer:applicants.emptyDesc')}
          icon={<Users className="h-8 w-8 text-[#6C4CE3]" />}
        />
      ) : (
        <div className="rounded-2xl border border-[#E9EAF1] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E9EAF1] bg-gray-50/70 text-[11px] font-semibold uppercase tracking-wider text-[#73758A]">
                  <th className="py-3.5 px-4">{t('employer:applicants.table.applicant')}</th>
                  <th className="py-3.5 px-4">{t('employer:applicants.table.job')}</th>
                  <th className="py-3.5 px-4">{t('employer:applicants.table.appliedDate')}</th>
                  <th className="py-3.5 px-4">{t('employer:applicants.table.status')}</th>
                  <th className="py-3.5 px-4 text-right">{t('employer:applicants.table.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EAF1] text-xs">
                {filteredApplicants.map((app) => {
                  const candidateName = app.student_name || t('employer:applicantReview.notProvided');
                  const candidateEmail = app.student_email || t('employer:applicantReview.notProvided');
                  const localizedJobTitle = i18n.language?.startsWith('en')
                    ? app.job_title_en || app.job_title_th || app.job_title
                    : app.job_title_th || app.job_title_en || app.job_title;

                  return (
                    <tr key={app.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0ECFF] text-xs font-bold text-[#6C4CE3]">
                            {candidateName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/employer/applicants/${encodeURIComponent(app.id)}`}
                              className="font-bold text-[#25243A] hover:text-[#6C4CE3] transition block truncate"
                            >
                              {candidateName}
                            </Link>
                            <div className="text-[11px] text-[#73758A] mt-0.5 truncate">
                              {candidateEmail}
                            </div>
                            {app.university && (
                              <div className="inline-flex items-center gap-1 text-[11px] text-[#A0A2B3] mt-0.5">
                                <GraduationCap className="h-3 w-3 shrink-0" />
                                <span className="truncate">{app.university}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#6C4CE3]">{localizedJobTitle}</div>
                        <div className="text-[11px] text-[#A0A2B3]">{app.province}</div>
                      </td>
                      <td className="py-4 px-4 text-[#73758A] whitespace-nowrap">
                        {formatDate(app.created_at)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <ApplicationStatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <Tooltip content={t('common:tooltips.updateStatus')}>
                          <Link
                            to={`/employer/applicants/${encodeURIComponent(app.id)}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2 text-xs font-semibold text-[#6C4CE3] shadow-2xs hover:border-[#6C4CE3]/40 hover:bg-[#F0ECFF]/60 transition"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#6C4CE3]" />
                            <span>{t('employer:applicants.table.viewReview')}</span>
                          </Link>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
