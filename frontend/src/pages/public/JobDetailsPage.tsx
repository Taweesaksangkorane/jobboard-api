import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../contexts/AuthContext';
import { Job } from '../../types';
import { JobStatusBadge } from '../../components/common/StatusBadge';
import { JobLanguageBadge } from '../../components/jobs/JobLanguageBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Tooltip } from '../../components/common/Tooltip';
import { ApplyModal } from '../../components/applications/ApplyModal';
import { ErrorState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/dateFormatter';
import {
  getLocalizedJobContent,
  parseTextListItems,
  parseSkillTags,
  getCategoryTranslationKeys,
  getWorkTypeTranslationKey,
  getLocalizedProvinceName,
  getCompanyInitials,
} from '../../utils/jobLocalization';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  Banknote,
  Briefcase,
  Share2,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  LogIn,
  UserPlus,
  Globe,
  Wrench,
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isStudent, refreshSession } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isGuestLoginModalOpen, setIsGuestLoginModalOpen] = useState(false);
  const [employerNotice, setEmployerNotice] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (id) {
      loadJobDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (id && user?.id && isStudent) {
      applicationService
        .getMyApplications()
        .then((apps) => {
          const found = apps.some((a) => a.job_id === id);
          setHasApplied(found);
        })
        .catch(() => {});
    }
  }, [id, user?.id, isStudent]);

  const loadJobDetails = async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobById(jobId);
      setJob(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = async () => {
    const currentUser = await refreshSession();
    if (!currentUser) {
      setIsGuestLoginModalOpen(true);
      return;
    }
    if (currentUser.role !== 'student') {
      setEmployerNotice(t('jobDetails.employerCannotApply'));
      return;
    }
    setEmployerNotice(null);
    setIsApplyModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 rounded bg-gray-200"></div>
          <div className="h-10 w-2/3 rounded-xl bg-gray-200"></div>
          <div className="h-6 w-1/3 rounded bg-gray-150"></div>
          <div className="h-48 rounded-2xl bg-gray-100"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4CE3] mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('jobDetails.backToSearch')}
        </Link>
        <ErrorState
          message={error || t('feedback.noDataTitle')}
          onRetry={() => id && loadJobDetails(id)}
        />
      </div>
    );
  }

  const formattedDate = formatDate(job.created_at);
  const formattedDeadline = job.application_deadline ? formatDate(job.application_deadline) : '';
  const isClosed = job.status === 'closed';
  const localized = getLocalizedJobContent(job, i18n.language);
  const categoryLabel = t(getCategoryTranslationKeys(job.category).titleKey);
  const provinceLabel = getLocalizedProvinceName(job.province, i18n.language);
  const companyInitials = getCompanyInitials(job.company_name, job.company_logo);

  const responsibilityItems = parseTextListItems(localized.responsibilities);
  const qualificationItems = parseTextListItems(localized.qualifications);
  const skillTags = parseSkillTags(localized.requiredSkills);
  const benefitItems = parseTextListItems(localized.benefits);

  const getWorkTypeDisplay = (workType?: string) => {
    return t(getWorkTypeTranslationKey(workType));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73758A] hover:text-[#6C4CE3] transition"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('jobDetails.backToSearch')}
        </Link>

        <Tooltip content={copiedLink ? t('common:actions.copied') : t('common:tooltips.share')}>
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={t('common:tooltips.share')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EAF1] bg-white px-3 py-1.5 text-xs font-medium text-[#73758A] hover:bg-gray-50 transition shadow-2xs cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copiedLink ? t('jobDetails.shareCopied') : t('jobDetails.shareJob')}</span>
          </button>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-lg bg-[#EDF3FF] px-3 py-1 text-xs font-semibold text-[#4776E6]">
                {categoryLabel}
              </span>
              <JobStatusBadge status={job.status} />
              {job.work_type && (
                <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-[#73758A]">
                  {getWorkTypeDisplay(job.work_type)}
                </span>
              )}
              <JobLanguageBadge job={job} showFullLabel />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#25243A] leading-snug mb-1.5">
              {localized.title}
            </h1>

            {localized.secondaryTitle && localized.secondaryTitle !== localized.title && (
              <p className="text-xs font-medium text-[#73758A] mb-3">{localized.secondaryTitle}</p>
            )}

            <div className="flex items-center gap-2 text-sm font-medium text-[#6C4CE3] mb-5">
              <Building2 className="h-4 w-4 shrink-0 text-[#6C4CE3]" />
              <span>{job.company_name}</span>
            </div>

            {/* Subtle fallback language banner when translation is unavailable */}
            {localized.isFallbackLanguage && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] px-3.5 py-2.5 text-xs text-[#73758A]">
                <Globe className="h-4 w-4 text-[#6C4CE3] shrink-0" />
                <span>
                  {localized.displayedLanguage === 'en'
                    ? t('jobLanguage.showingOriginalEn')
                    : t('jobLanguage.showingOriginalTh')}
                </span>
              </div>
            )}

            {/* Quick Metadata Grid (Consistent across languages) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4 text-xs text-[#25243A]">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#6C4CE3] shrink-0" />
                <div>
                  <div className="text-[11px] text-[#73758A]">{t('jobDetails.location')}:</div>
                  <div className="font-semibold">
                    {provinceLabel} • {job.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Banknote className="h-4 w-4 text-[#16A36A] shrink-0" />
                <div>
                  <div className="text-[11px] text-[#73758A]">{t('jobDetails.salary')}:</div>
                  <div className="font-semibold text-[#16A36A]">
                    {job.salary_range || t('common:jobDetails.negotiable')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-[#4776E6] shrink-0" />
                <div>
                  <div className="text-[11px] text-[#73758A]">{t('jobDetails.postedOn')}:</div>
                  <div className="font-semibold">{formattedDate}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Briefcase className="h-4 w-4 text-[#F0A43A] shrink-0" />
                <div>
                  <div className="text-[11px] text-[#73758A]">{t('jobDetails.jobType')}:</div>
                  <div className="font-semibold">{getWorkTypeDisplay(job.work_type)}</div>
                </div>
              </div>

              {formattedDeadline && (
                <div className="flex items-center gap-2.5 sm:col-span-2 pt-2 border-t border-[#E9EAF1]">
                  <Clock className="h-4 w-4 text-[#E05252] shrink-0" />
                  <div>
                    <div className="text-[11px] text-[#73758A]">{t('jobDetails.deadline')}:</div>
                    <div className="font-semibold text-[#25243A]">{formattedDeadline}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Localized Job Content Card — Never renders empty sections */}
          <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            {/* 1. Job Description */}
            {localized.description && (
              <div>
                <h2 className="text-lg font-bold text-[#25243A] mb-3">
                  {responsibilityItems.length > 0
                    ? t('jobDetails.descriptionOnly')
                    : t('jobDetails.description')}
                </h2>
                <div className="text-sm text-[#25243A] leading-relaxed whitespace-pre-line break-words">
                  {localized.description}
                </div>
              </div>
            )}

            {/* 2. Responsibilities */}
            {responsibilityItems.length > 0 && (
              <div className="border-t border-[#E9EAF1] pt-6">
                <h3 className="text-base font-bold text-[#25243A] mb-3">
                  {t('jobDetails.responsibilities')}
                </h3>
                <ul className="space-y-2 text-sm text-[#25243A] list-disc list-inside leading-relaxed">
                  {responsibilityItems.map((item, idx) => (
                    <li key={idx} className="break-words">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. Qualifications */}
            {qualificationItems.length > 0 && (
              <div className="border-t border-[#E9EAF1] pt-6">
                <h3 className="text-base font-bold text-[#25243A] mb-3">
                  {t('jobDetails.qualifications')}
                </h3>
                <ul className="space-y-2 text-sm text-[#25243A] list-disc list-inside leading-relaxed">
                  {qualificationItems.map((item, idx) => (
                    <li key={idx} className="break-words">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Required Skills */}
            {skillTags.length > 0 && (
              <div className="border-t border-[#E9EAF1] pt-6">
                <h3 className="text-base font-bold text-[#25243A] mb-3 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-[#6C4CE3]" />
                  <span>{t('jobDetails.requiredSkills')}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillTags.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-purple-100 bg-[#F0ECFF]/70 px-3 py-1.5 text-xs font-semibold text-[#6C4CE3]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Benefits */}
            {benefitItems.length > 0 && (
              <div className="border-t border-[#E9EAF1] pt-6">
                <h3 className="text-base font-bold text-[#25243A] mb-3">
                  {t('jobDetails.benefits')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#25243A]">
                  {benefitItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#16A36A] shrink-0 mt-0.5" />
                      <span className="break-words">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Company Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Action Card */}
          <div className="sticky top-24 rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#25243A]">{t('actions.applyNow')}?</h3>

            {employerNotice && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{employerNotice}</span>
              </div>
            )}

            {hasApplied ? (
              <div className="rounded-xl border border-purple-200 bg-[#F0ECFF] p-4 text-center">
                <CheckCircle2 className="mx-auto h-7 w-7 text-[#6C4CE3] mb-1.5" />
                <p className="text-sm font-bold text-[#5638C5]">{t('jobDetails.appliedBtn')}</p>
                <p className="text-xs text-[#73758A] mt-1 mb-3">
                  {t('student:applications.subtitle')}
                </p>
                <Link
                  to="/student/applications"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4CE3] hover:underline"
                >
                  {t('student:applications.title')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : isClosed ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                <AlertCircle className="mx-auto h-7 w-7 text-gray-400 mb-1.5" />
                <p className="text-sm font-semibold text-gray-700">{t('jobDetails.closedBtn')}</p>
              </div>
            ) : (
              <div>
                <Tooltip content={t('common:tooltips.applyNow')}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleApplyClick}
                    className="w-full shadow-md"
                    leftIcon={<FileText className="h-5 w-5" />}
                  >
                    {t('jobDetails.applyBtn')}
                  </Button>
                </Tooltip>
              </div>
            )}

            {/* Company Info Box */}
            <div className="border-t border-[#E9EAF1] pt-4 mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#6C4CE3] font-bold text-sm">
                  {companyInitials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#25243A]">{job.company_name}</h4>
                  <p className="text-[11px] text-[#73758A]">{provinceLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Apply Modal */}
      {job && (
        <ApplyModal
          job={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            setHasApplied(true);
            setIsApplyModalOpen(false);
          }}
        />
      )}

      {/* Guest Login Required Modal */}
      <Modal
        isOpen={isGuestLoginModalOpen}
        onClose={() => setIsGuestLoginModalOpen(false)}
        title={t('guestModal.subtitle')}
        maxWidth="md"
      >
        <div className="space-y-4 text-center py-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-[#6C4CE3]">
            <LogIn className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#25243A]">{t('guestModal.title')}</h3>
            <p className="mt-2 text-xs text-[#73758A] leading-relaxed">{t('guestModal.desc')}</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              to={`/login?redirect=/jobs/${job.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C4CE3] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#5638C5]"
            >
              <LogIn className="h-4 w-4" />
              {t('guestModal.loginBtn')}
            </Link>
            <Link
              to={`/register?role=student&redirect=/jobs/${job.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E9EAF1] bg-white px-4 py-2.5 text-sm font-semibold text-[#25243A] hover:bg-gray-50"
            >
              <UserPlus className="h-4 w-4 text-[#6C4CE3]" />
              {t('guestModal.registerBtn')}
            </Link>
            <Tooltip content={t('common:tooltips.cancel')}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsGuestLoginModalOpen(false)}
                className="text-xs text-[#A0A2B3]"
              >
                {t('guestModal.cancelBtn')}
              </Button>
            </Tooltip>
          </div>
        </div>
      </Modal>
    </div>
  );
};
