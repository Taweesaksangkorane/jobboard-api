import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { Job, Application } from '../../types';
import { JobStatusBadge, ApplicationStatusBadge } from '../../components/common/StatusBadge';
import { JobLanguageBadge } from '../../components/jobs/JobLanguageBadge';
import { Tooltip } from '../../components/common/Tooltip';
import { LoadingSkeleton, ErrorState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/dateFormatter';
import {
  getLocalizedJobContent,
  getJobLanguageAvailability,
  getCategoryTranslationKeys,
  getLocalizedProvinceName,
} from '../../utils/jobLocalization';
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Users,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';

export const EmployerDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation(['employer', 'common']);
  const { user } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const employerId = user?.id;
      if (!employerId) {
        setLoading(false);
        return;
      }

      const [allJobs, allApplicants] = await Promise.all([
        jobService.getJobs().catch(() => []),
        applicationService.getEmployerApplicants(employerId).catch(() => []),
      ]);

      const myJobs = allJobs.filter(
        (j) =>
          !j.employer_id ||
          j.employer_id === employerId ||
          (employerId === 'emp-1' && Boolean(j.is_demo))
      );
      setJobs(myJobs);
      setApplicants(allApplicants);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'open').length;
  const closedJobs = jobs.filter((j) => j.status === 'closed').length;
  const totalApplications = applicants.length;

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-white border border-[#E9EAF1] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#6C4CE3] bg-[#F0ECFF] px-2.5 py-1 rounded-md">
              {t('employer:dashboard.badge')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#25243A]">
              {t('employer:dashboard.welcome')}
            </h1>
            <p className="text-xs sm:text-sm text-[#73758A]">
              {t('employer:dashboard.orgSubtitle', {
                company: user?.companyName || 'TechForward Solutions Co., Ltd.',
                contact: user?.contactPerson || user?.name,
              })}
            </p>
          </div>

          <Tooltip content={t('common:tooltips.createJob')}>
            <Link
              to="/employer/jobs/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6C4CE3] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#5638C5] transition self-start sm:self-center cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              {t('employer:dashboard.postJobBtn')}
            </Link>
          </Tooltip>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <div className="rounded-2xl border border-[#E9EAF1] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#73758A] mb-2">
            <span>{t('employer:dashboard.stats.totalJobs')}</span>
            <Briefcase className="h-4 w-4 text-[#6C4CE3]" />
          </div>
          <div className="text-2xl font-bold text-[#25243A]">{totalJobs}</div>
        </div>

        {/* Active Jobs */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#16A36A] mb-2">
            <span>{t('employer:dashboard.stats.activeJobs')}</span>
            <CheckCircle className="h-4 w-4 text-[#16A36A]" />
          </div>
          <div className="text-2xl font-bold text-[#16A36A]">{activeJobs}</div>
        </div>

        {/* Closed Jobs */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{t('employer:dashboard.stats.closedJobs')}</span>
            <XCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-700">{closedJobs}</div>
        </div>

        {/* Total Applications */}
        <div className="rounded-2xl border border-indigo-100 bg-[#F0ECFF]/60 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#5638C5] mb-2">
            <span>{t('employer:dashboard.stats.totalApplicants')}</span>
            <Users className="h-4 w-4 text-[#6C4CE3]" />
          </div>
          <div className="text-2xl font-bold text-[#5638C5]">{totalApplications}</div>
        </div>
      </div>

      {/* Recent Jobs Management Section */}
      <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#25243A]">{t('employer:dashboard.recentJobs')}</h2>
            <p className="text-xs text-[#73758A]">{t('employer:manageJobs.subtitle')}</p>
          </div>
          <Link
            to="/employer/jobs"
            className="text-xs font-semibold text-[#6C4CE3] hover:underline"
          >
            {t('employer:dashboard.viewAllJobs')} ({jobs.length})
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E9EAF1] p-8 text-center text-xs text-[#73758A]">
            {t('employer:dashboard.noJobsDesc')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E9EAF1] text-[11px] font-semibold uppercase tracking-wider text-[#73758A]">
                  <th className="pb-3 pr-4">{t('employer:manageJobs.table.job')}</th>
                  <th className="pb-3 px-4">{t('employer:manageJobs.table.language')}</th>
                  <th className="pb-3 px-4">{t('common:jobSearch.categoryFilter')}</th>
                  <th className="pb-3 px-4">{t('common:jobDetails.location')}</th>
                  <th className="pb-3 px-4">{t('employer:manageJobs.table.createdAt')}</th>
                  <th className="pb-3 px-4">{t('employer:manageJobs.table.status')}</th>
                  <th className="pb-3 pl-4 text-right">{t('employer:manageJobs.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EAF1] text-xs">
                {jobs.slice(0, 5).map((job) => {
                  const localized = getLocalizedJobContent(job, i18n.language);
                  const { effectiveLanguage } = getJobLanguageAvailability(job);
                  const langSublabel =
                    effectiveLanguage === 'both'
                      ? t('employer:manageJobs.bilingualComplete')
                      : effectiveLanguage === 'en'
                        ? t('employer:manageJobs.englishSingle')
                        : t('employer:manageJobs.thaiSingle');

                  return (
                    <tr key={job.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 pr-4">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="font-bold text-[#25243A] hover:text-[#6C4CE3] transition"
                        >
                          {localized.title}
                        </Link>
                        {localized.secondaryTitle && localized.secondaryTitle !== localized.title && (
                          <div className="text-[11px] text-[#73758A] truncate max-w-[260px]">
                            {localized.secondaryTitle}
                          </div>
                        )}
                        <div className="text-[11px] text-[#A0A2B3] mt-0.5">{job.location}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <JobLanguageBadge job={job} />
                          <span className="text-[10px] text-[#73758A]">{langSublabel}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#73758A]">
                        {t(getCategoryTranslationKeys(job.category).titleKey)}
                      </td>
                      <td className="py-3.5 px-4 text-[#73758A]">
                        {getLocalizedProvinceName(job.province, i18n.language)}
                      </td>
                      <td className="py-3.5 px-4 text-[#73758A]">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="py-3.5 px-4">
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td className="py-3.5 pl-4 text-right space-x-2">
                        <Tooltip content={t('common:tooltips.edit')}>
                          <Link
                            to={`/employer/jobs/${job.id}/edit`}
                            className="font-semibold text-[#6C4CE3] hover:underline"
                          >
                            {t('common:actions.edit')}
                          </Link>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Recruitment Activity */}
      <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#25243A]">{t('employer:dashboard.recentApplicants')}</h2>
            <p className="text-xs text-[#73758A]">{t('employer:applicants.subtitle')}</p>
          </div>
          <Tooltip content={t('common:tooltips.viewApplicants')}>
            <Link
              to="/employer/applicants"
              className="text-xs font-semibold text-[#6C4CE3] hover:underline"
            >
              {t('employer:dashboard.viewAllApplicants')} ({applicants.length})
            </Link>
          </Tooltip>
        </div>

        {applicants.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E9EAF1] p-8 text-center text-xs text-[#73758A]">
            {t('employer:dashboard.noApplicantsDesc')}
          </div>
        ) : (
          <div className="space-y-3">
            {applicants.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#25243A]">
                      {app.student_name || 'Candidate'}
                    </span>
                    <ApplicationStatusBadge status={app.status} size="sm" />
                  </div>
                  <div className="text-xs text-[#73758A]">
                    {t('employer:applicants.table.job')}: <strong className="text-[#25243A]">{app.job_title}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#A0A2B3]">
                    {formatDate(app.created_at)}
                  </span>
                  <Tooltip content={t('common:tooltips.updateStatus')}>
                    <Link
                      to={`/employer/applicants/${encodeURIComponent(app.id)}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#E9EAF1] bg-white px-3 py-1.5 text-xs font-semibold text-[#6C4CE3] hover:bg-gray-50 transition"
                    >
                      {t('employer:applicants.table.viewReview')}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
