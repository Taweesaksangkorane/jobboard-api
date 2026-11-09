import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import { Job, JobStatus } from '../../types';
import { JobStatusBadge } from '../../components/common/StatusBadge';
import { JobLanguageBadge } from '../../components/jobs/JobLanguageBadge';
import { ConfirmDialog } from '../../components/common/Modal';
import { Tooltip } from '../../components/common/Tooltip';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/dateFormatter';
import {
  getLocalizedJobContent,
  getJobLanguageAvailability,
  getLocalizedJobTitle,
  PRIMARY_JOB_CATEGORIES,
  getCategoryTranslationKeys,
  getWorkTypeTranslationKey,
  getLocalizedProvinceName,
} from '../../utils/jobLocalization';
import {
  Briefcase,
  Building2,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Power,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
} from 'lucide-react';

export const ManageJobsPage: React.FC = () => {
  const { t, i18n } = useTranslation(['employer', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDemoEmployer = user?.id === 'emp-1' || user?.id === '1';

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'mine'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  // Deletion modal & inline feedback state
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, [user?.id]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobs();
      const visibleJobs = user?.id
        ? data.filter(
            (j) =>
              !j.employer_id ||
              j.employer_id === user.id ||
              ((user.id === 'emp-1' || user.id === '1') && Boolean(j.is_demo))
          )
        : data;
      setJobs(visibleJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const matchesSelectedCategory = (jobCat: string, selectedCat: string) => {
    if (selectedCat === 'all' || jobCat === selectedCat) return true;
    if (selectedCat === 'Marketing & Communications' && jobCat === 'Marketing') return true;
    if (selectedCat === 'Business & Administration' && jobCat === 'Business') return true;
    if (selectedCat === 'Graphic Design & Creative Media' && jobCat === 'Design') return true;
    return false;
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (isDemoEmployer && scopeFilter === 'mine' && job.employer_id !== user?.id) {
        return false;
      }

      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        (job.title_th && job.title_th.toLowerCase().includes(q)) ||
        (job.title_en && job.title_en.toLowerCase().includes(q)) ||
        job.company_name.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.province.toLowerCase().includes(q);

      const matchCat = matchesSelectedCategory(job.category, categoryFilter);
      const matchStatus = statusFilter === 'all' || job.status === statusFilter;
      const { effectiveLanguage } = getJobLanguageAvailability(job);
      const matchLang = languageFilter === 'all' || effectiveLanguage === languageFilter;

      return matchSearch && matchCat && matchStatus && matchLang;
    });
  }, [jobs, isDemoEmployer, scopeFilter, user?.id, searchTerm, categoryFilter, statusFilter, languageFilter]);

  // Quick Toggle Open / Closed
  const handleToggleStatus = async (job: Job) => {
    const newStatus: JobStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      setActionError(null);
      const updated = await jobService.updateJob(job.id, { status: newStatus });
      setJobs(jobs.map((j) => (j.id === job.id ? updated : j)));
      setFeedbackMessage(
        newStatus === 'open'
          ? t('employer:manageJobs.confirmReopenTitle')
          : t('employer:manageJobs.confirmCloseTitle')
      );
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    }
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      setIsDeleting(true);
      setActionError(null);
      await jobService.deleteJob(jobToDelete.id);
      setJobs(jobs.filter((j) => j.id !== jobToDelete.id));
      const deletedTitle = getLocalizedJobTitle(jobToDelete, i18n.language);
      setJobToDelete(null);
      setFeedbackMessage(`${t('common:actions.delete')}: "${deletedTitle}"`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#25243A]">{t('employer:manageJobs.title')}</h1>
          <p className="mt-1 text-xs text-[#73758A]">{t('employer:manageJobs.subtitle')}</p>
        </div>

        <Tooltip content={t('common:tooltips.createJob')}>
          <Link
            to="/employer/jobs/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6C4CE3] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#5638C5] transition self-start sm:self-center"
          >
            <PlusCircle className="h-4 w-4" />
            {t('employer:manageJobs.postNewJob')}
          </Link>
        </Tooltip>
      </div>

      {feedbackMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-[#16A36A]">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-[#E05252]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-[#E9EAF1] bg-white p-4 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A2B3]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('employer:manageJobs.searchPlaceholder')}
            className="w-full rounded-xl border border-[#E9EAF1] bg-gray-50 py-2 pl-10 pr-3 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isDemoEmployer && (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-[#6C4CE3] shrink-0" />
              <Tooltip content={t('common:tooltips.filter')}>
                <select
                  value={scopeFilter}
                  onChange={(e) => setScopeFilter(e.target.value as 'all' | 'mine')}
                  aria-label={t('employer:manageJobs.filterScope')}
                  className="rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-xs text-[#25243A] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 cursor-pointer"
                >
                  <option value="all">{t('employer:manageJobs.scopeAllDemo')}</option>
                  <option value="mine">{t('employer:manageJobs.scopeMyCompany')}</option>
                </select>
              </Tooltip>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-[#73758A] shrink-0" />
            <Tooltip content={t('common:tooltips.filter')}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label={t('employer:manageJobs.filterCategory')}
                className="rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-xs text-[#25243A] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 cursor-pointer"
              >
                <option value="all">{t('common:categories.all')}</option>
                {PRIMARY_JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(getCategoryTranslationKeys(cat).titleKey)}
                  </option>
                ))}
                <option value="Other">{t('common:categories.other')}</option>
              </select>
            </Tooltip>
          </div>

          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-[#6C4CE3] shrink-0" />
            <Tooltip content={t('common:tooltips.filter')}>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                aria-label={t('employer:manageJobs.filterLanguage')}
                className="rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-xs text-[#25243A] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 cursor-pointer"
              >
                <option value="all">{t('employer:manageJobs.allLanguages')}</option>
                <option value="both">{t('employer:manageJobs.langBoth')}</option>
                <option value="th">{t('employer:manageJobs.langTh')}</option>
                <option value="en">{t('employer:manageJobs.langEn')}</option>
              </select>
            </Tooltip>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-[#73758A] shrink-0" />
            <Tooltip content={t('common:tooltips.filter')}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label={t('employer:manageJobs.filterStatus')}
                className="rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-xs text-[#25243A] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 cursor-pointer"
              >
                <option value="all">{t('employer:manageJobs.allStatuses')}</option>
                <option value="open">{t('common:status.open')}</option>
                <option value="closed">{t('common:status.closed')}</option>
              </select>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadJobs} />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title={t('employer:manageJobs.emptyTitle')}
          description={t('employer:manageJobs.emptyDesc')}
          actionText={t('employer:manageJobs.postNewJob')}
          onAction={() => navigate('/employer/jobs/create')}
          icon={<Briefcase className="h-8 w-8 text-[#6C4CE3]" />}
        />
      ) : (
        <div className="rounded-2xl border border-[#E9EAF1] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E9EAF1] bg-gray-50/70 text-[11px] font-semibold uppercase tracking-wider text-[#73758A]">
                  <th className="py-3.5 px-4">{t('employer:manageJobs.table.job')}</th>
                  <th className="py-3.5 px-4">{t('employer:manageJobs.table.language')}</th>
                  <th className="py-3.5 px-4">{t('common:jobSearch.categoryFilter')}</th>
                  <th className="py-3.5 px-4">{t('common:jobDetails.location')}</th>
                  <th className="py-3.5 px-4">{t('employer:manageJobs.table.createdAt')}</th>
                  <th className="py-3.5 px-4">{t('employer:manageJobs.table.status')}</th>
                  <th className="py-3.5 px-4 text-right">{t('employer:manageJobs.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EAF1] text-xs">
                {filteredJobs.map((job) => {
                  const localized = getLocalizedJobContent(job, i18n.language);
                  const { effectiveLanguage } = getJobLanguageAvailability(job);
                  const langSublabel =
                    effectiveLanguage === 'both'
                      ? t('employer:manageJobs.bilingualComplete')
                      : effectiveLanguage === 'en'
                        ? t('employer:manageJobs.englishSingle')
                        : t('employer:manageJobs.thaiSingle');

                  return (
                    <tr key={job.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#25243A]">{localized.title}</div>
                        {localized.secondaryTitle && localized.secondaryTitle !== localized.title && (
                          <div className="text-[11px] text-[#73758A] mt-0.5 truncate max-w-[260px]">
                            {localized.secondaryTitle}
                          </div>
                        )}
                        <div className="text-[11px] text-[#A0A2B3] mt-0.5">{job.company_name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <JobLanguageBadge job={job} />
                          <span className="text-[10px] text-[#73758A]">{langSublabel}</span>
                          {effectiveLanguage === 'both' && (
                            <div className="flex items-center gap-2 text-[10px] font-semibold">
                              <Tooltip content={t('common:tooltips.edit')}>
                                <Link
                                  to={`/employer/jobs/${job.id}/edit?focus=th`}
                                  className="text-[#6C4CE3] hover:underline"
                                >
                                  {t('employer:manageJobs.table.editTh')}
                                </Link>
                              </Tooltip>
                              <span className="text-gray-300">•</span>
                              <Tooltip content={t('common:tooltips.edit')}>
                                <Link
                                  to={`/employer/jobs/${job.id}/edit?focus=en`}
                                  className="text-[#4776E6] hover:underline"
                                >
                                  {t('employer:manageJobs.table.editEn')}
                                </Link>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#73758A]">
                        <div className="flex flex-col items-start gap-1">
                          <span className="rounded bg-[#EDF3FF] px-2 py-0.5 text-[11px] font-medium text-[#4776E6]">
                            {t(getCategoryTranslationKeys(job.category).titleKey)}
                          </span>
                          {job.work_type && (
                            <span className="text-[10px] text-[#73758A]">
                              {t(getWorkTypeTranslationKey(job.work_type))}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#73758A]">
                        <div>{getLocalizedProvinceName(job.province, i18n.language)}</div>
                        <div className="text-[11px] text-[#A0A2B3] truncate max-w-[150px]">
                          {job.location}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#73758A]">{formatDate(job.created_at)}</td>
                      <td className="py-4 px-4">
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Tooltip content={t('common:tooltips.viewJob')}>
                            <Link
                              to={`/jobs/${job.id}`}
                              aria-label={t('common:tooltips.viewJob')}
                              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#25243A] transition"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Tooltip>
                          <Tooltip content={t('common:tooltips.edit')}>
                            <Link
                              to={`/employer/jobs/${job.id}/edit`}
                              aria-label={t('common:tooltips.edit')}
                              className="rounded-lg p-1.5 text-[#6C4CE3] hover:bg-purple-50 transition"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Tooltip>
                          <Tooltip
                            content={
                              job.status === 'open'
                                ? t('common:tooltips.closeApplications')
                                : t('common:tooltips.reopenApplications')
                            }
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(job)}
                              aria-label={
                                job.status === 'open'
                                  ? t('common:tooltips.closeApplications')
                                  : t('common:tooltips.reopenApplications')
                              }
                              className={`rounded-lg p-1.5 transition cursor-pointer ${
                                job.status === 'open'
                                  ? 'text-amber-600 hover:bg-amber-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              <Power className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content={t('common:tooltips.delete')}>
                            <button
                              type="button"
                              onClick={() => setJobToDelete(job)}
                              aria-label={t('common:tooltips.delete')}
                              className="rounded-lg p-1.5 text-[#E05252] hover:bg-red-50 transition cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deleting */}
      <ConfirmDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t('employer:manageJobs.confirmDeleteTitle')}
        message={`${t('employer:manageJobs.confirmDeleteDesc')} (${jobToDelete ? getLocalizedJobTitle(jobToDelete, i18n.language) : ''})`}
        confirmLabel={t('common:actions.delete')}
        cancelLabel={t('common:actions.cancel')}
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};
