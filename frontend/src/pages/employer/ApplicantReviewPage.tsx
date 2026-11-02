import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Application, ApplicationStatus } from '../../types';
import { applicationService } from '../../services/applicationService';
import { ApplicationStatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { Tooltip } from '../../components/common/Tooltip';
import { LoadingSkeleton, ErrorState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/dateFormatter';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Hash,
  GraduationCap,
  BookOpen,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  ExternalLink,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Award,
  CalendarCheck,
  XCircle,
  UserX,
  MessageSquareText,
} from 'lucide-react';

function normalizeExternalUrl(raw?: string): string | null {
  if (!raw || !raw.trim()) return null;
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const ApplicantReviewPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['employer', 'common']);

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);

  // Status & review form state
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('submitted');
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Resume preview modal
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState<boolean>(false);

  const loadApplicant = useCallback(async () => {
    if (!applicationId || !applicationId.trim()) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setNotFound(false);
      setLoadError(null);
      setSaveSuccessMessage(null);
      setSaveErrorMessage(null);
      setAvatarLoadError(false);

      const data = await applicationService.getEmployerApplicantById(applicationId.trim());
      if (!data || !data.id) {
        setNotFound(true);
        setApplication(null);
        return;
      }

      setApplication(data);
      setSelectedStatus(data.status);
      setFeedbackNote(data.employer_feedback || '');
    } catch (err) {
      if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
        setNotFound(true);
        setApplication(null);
      } else {
        setLoadError(
          err instanceof Error ? err.message : t('common:feedback.errorMessage')
        );
      }
    } finally {
      setLoading(false);
    }
  }, [applicationId, t]);

  useEffect(() => {
    loadApplicant();
  }, [loadApplicant]);

  const notProvidedText = t('employer:applicantReview.notProvided');

  const displayValue = (val?: string | null): { text: string; isMissing: boolean } => {
    if (typeof val === 'string' && val.trim().length > 0 && val.trim() !== '-') {
      return { text: val.trim(), isMissing: false };
    }
    return { text: notProvidedText, isMissing: true };
  };

  const statusOptions: {
    value: ApplicationStatus;
    label: string;
    description: string;
    icon: React.ReactNode;
    activeBorder: string;
    activeBg: string;
  }[] = [
    {
      value: 'submitted',
      label: t('common:status.submitted'),
      description: t('employer:applicantReview.statusDesc.submitted'),
      icon: <Clock className="h-4 w-4 text-[#4776E6]" />,
      activeBorder: 'border-blue-300 ring-2 ring-[#4776E6]/20',
      activeBg: 'bg-blue-50/60',
    },
    {
      value: 'reviewing',
      label: t('common:status.reviewing'),
      description: t('employer:applicantReview.statusDesc.reviewing'),
      icon: <Eye className="h-4 w-4 text-[#D97706]" />,
      activeBorder: 'border-amber-300 ring-2 ring-amber-500/20',
      activeBg: 'bg-amber-50/60',
    },
    {
      value: 'shortlisted',
      label: t('common:status.shortlisted'),
      description: t('employer:applicantReview.statusDesc.shortlisted'),
      icon: <Award className="h-4 w-4 text-[#6C4CE3]" />,
      activeBorder: 'border-purple-300 ring-2 ring-[#6C4CE3]/25',
      activeBg: 'bg-[#F0ECFF]/70',
    },
    {
      value: 'interview',
      label: t('common:status.interview'),
      description: t('employer:applicantReview.statusDesc.interview'),
      icon: <CalendarCheck className="h-4 w-4 text-indigo-700" />,
      activeBorder: 'border-indigo-300 ring-2 ring-indigo-500/25',
      activeBg: 'bg-indigo-50/70',
    },
    {
      value: 'accepted',
      label: t('common:status.accepted'),
      description: t('employer:applicantReview.statusDesc.accepted'),
      icon: <CheckCircle2 className="h-4 w-4 text-[#16A36A]" />,
      activeBorder: 'border-emerald-300 ring-2 ring-emerald-500/25',
      activeBg: 'bg-emerald-50/60',
    },
    {
      value: 'rejected',
      label: t('common:status.rejected'),
      description: t('employer:applicantReview.statusDesc.rejected'),
      icon: <XCircle className="h-4 w-4 text-[#E05252]" />,
      activeBorder: 'border-red-300 ring-2 ring-red-500/25',
      activeBg: 'bg-red-50/60',
    },
  ];

  const hasUnsavedChanges = Boolean(
    application &&
      (selectedStatus !== application.status ||
        feedbackNote.trim() !== (application.employer_feedback || '').trim())
  );

  const handleRequestSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!application || !hasUnsavedChanges) return;
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (!application) return;
    try {
      setIsSaving(true);
      setSaveErrorMessage(null);
      setSaveSuccessMessage(null);

      const updated = await applicationService.updateApplicationStatus(
        application.id,
        selectedStatus,
        feedbackNote.trim()
      );

      setApplication(updated);
      setSelectedStatus(updated.status);
      setFeedbackNote(updated.employer_feedback || '');
      setIsConfirmModalOpen(false);

      const statusLabel = t(`common:status.${updated.status}`);
      setSaveSuccessMessage(
        t('employer:applicantReview.updateSuccess', { status: statusLabel })
      );
    } catch (err) {
      setIsConfirmModalOpen(false);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setSaveErrorMessage(String(err.response.data.message));
      } else {
        setSaveErrorMessage(
          err instanceof Error ? err.message : t('employer:applicantReview.updateError')
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelChanges = () => {
    if (!application) {
      navigate('/employer/applicants');
      return;
    }
    if (hasUnsavedChanges) {
      setSelectedStatus(application.status);
      setFeedbackNote(application.employer_feedback || '');
      setSaveErrorMessage(null);
    } else {
      navigate('/employer/applicants');
    }
  };

  const handleDownloadResume = () => {
    if (!application || !application.resume_url) return;
    const rawResume = application.resume_url.trim();
    if (/^https?:\/\//i.test(rawResume) || rawResume.startsWith('/')) {
      const anchor = document.createElement('a');
      anchor.href = rawResume;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.download = '';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      return;
    }

    // Generate clean downloadable CV summary document from verified applicant record
    const resumeSummaryLines = [
      '============================================================',
      'JOBBOARD CANDIDATE RESUME / APPLICATION SUMMARY',
      '============================================================',
      `Document Reference : ${rawResume}`,
      `Application ID     : ${application.id}`,
      `Candidate Name     : ${application.student_name || notProvidedText}`,
      `Email              : ${application.student_email || notProvidedText}`,
      `Phone              : ${application.student_phone || notProvidedText}`,
      `Student ID         : ${application.student_code || notProvidedText}`,
      '',
      '--- EDUCATION ---',
      `University         : ${application.university || notProvidedText}`,
      `Faculty            : ${application.faculty || notProvidedText}`,
      `Major              : ${application.major || notProvidedText}`,
      `Year of Study      : ${application.year_of_study || notProvidedText}`,
      '',
      '--- APPLIED POSITION ---',
      `Position           : ${application.job_title || notProvidedText}`,
      `Company            : ${application.company_name || notProvidedText}`,
      `Applied Date       : ${formatDate(application.created_at)}`,
      `Portfolio URL      : ${application.portfolio_url || notProvidedText}`,
      '',
      '--- COVER LETTER / STATEMENT ---',
      application.notes || notProvidedText,
      '============================================================',
    ];

    const blob = new Blob([resumeSummaryLines.join('\n')], {
      type: 'text/plain;charset=utf-8',
    });
    const blobUrl = URL.createObjectURL(blob);
    const safeBaseName = rawResume.replace(/\.[^.]+$/, '') || `Applicant_${application.id}`;
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = `${safeBaseName}_Summary.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-44 animate-pulse rounded-lg bg-gray-200" />
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <Link
          to="/employer/applicants"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#73758A] hover:text-[#6C4CE3] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('employer:applicantReview.backToApplicants')}
        </Link>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E9EAF1] bg-white p-12 text-center shadow-xs">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#6C4CE3]">
            <UserX className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-[#25243A] mb-2">
            {t('employer:applicantReview.notFoundTitle')}
          </h1>
          <p className="max-w-md text-xs text-[#73758A] leading-relaxed mb-6">
            {t('employer:applicantReview.notFoundDesc')}
          </p>
          <Link
            to="/employer/applicants"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6C4CE3] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5638C5] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('employer:applicantReview.backToApplicants')}
          </Link>
        </div>
      </div>
    );
  }

  if (loadError || !application) {
    return (
      <div className="space-y-6">
        <Link
          to="/employer/applicants"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#73758A] hover:text-[#6C4CE3] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('employer:applicantReview.backToApplicants')}
        </Link>
        <ErrorState
          message={loadError || t('common:feedback.errorMessage')}
          onRetry={loadApplicant}
        />
      </div>
    );
  }

  const candidateName = displayValue(application.student_name);
  const candidateEmail = displayValue(application.student_email);
  const candidateStudentId = displayValue(application.student_code);
  const candidatePhone = displayValue(application.student_phone);
  const candidateUniversity = displayValue(application.university);
  const candidateFaculty = displayValue(application.faculty);
  const candidateMajor = displayValue(application.major);
  const candidateYear = displayValue(application.year_of_study);

  const preferredJobTitle =
    i18n.language?.startsWith('en')
      ? application.job_title_en || application.job_title_th || application.job_title
      : application.job_title_th || application.job_title_en || application.job_title;

  const jobPositionDisplay = displayValue(preferredJobTitle);
  const companyDisplay = displayValue(application.company_name);
  const coverLetterDisplay = displayValue(application.notes);
  const resumeDisplay = displayValue(application.resume_url);
  const portfolioUrlNormalized = normalizeExternalUrl(application.portfolio_url);

  const formattedAppliedDate = formatDate(application.created_at, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedUpdatedDate = formatDate(application.updated_at, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const avatarInitial = (candidateName.isMissing ? 'U' : candidateName.text.charAt(0)).toUpperCase();
  const isExternalResumeUrl = Boolean(
    application.resume_url && /^https?:\/\//i.test(application.resume_url.trim())
  );

  return (
    <div className="space-y-6">
      {/* Top Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/employer/applicants"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2 text-xs font-semibold text-[#25243A] shadow-2xs hover:border-[#6C4CE3]/40 hover:text-[#6C4CE3] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('employer:applicantReview.backToApplicants')}
        </Link>

        <span className="text-xs font-medium text-[#73758A]">
          {t('employer:applicantReview.applicationRef')}:{' '}
          <span className="font-mono font-semibold text-[#25243A]">{application.id}</span>
        </span>
      </div>

      {/* Header Card: Applicant Name & Current Status Badge */}
      <div className="rounded-3xl border border-[#E9EAF1] bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {application.avatar_url && !avatarLoadError ? (
              <img
                src={application.avatar_url}
                alt={candidateName.text}
                referrerPolicy="no-referrer"
                onError={() => setAvatarLoadError(true)}
                className="h-16 w-16 shrink-0 rounded-2xl border border-[#E9EAF1] object-cover shadow-2xs"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C4CE3] to-[#4776E6] text-2xl font-bold text-white shadow-xs">
                {avatarInitial}
              </div>
            )}

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-[#F0ECFF] px-2.5 py-0.5 text-[11px] font-semibold text-[#6C4CE3]">
                {t('employer:applicantReview.pageBadge')}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#25243A]">
                {candidateName.text}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#73758A]">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#6C4CE3]">
                  <Briefcase className="h-3.5 w-3.5" />
                  {jobPositionDisplay.text}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#A0A2B3]" />
                  {formattedAppliedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="self-start sm:self-center">
            <ApplicationStatusBadge status={application.status} size="lg" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Applicant Info, Education, Cover Letter, Resume & Portfolio */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. Applicant Information & Education */}
          <section className="rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs space-y-6">
            <div className="border-b border-[#E9EAF1] pb-4">
              <h2 className="text-base font-bold text-[#25243A]">
                {t('employer:applicantReview.applicantInfoTitle')}
              </h2>
              <p className="text-xs text-[#73758A] mt-0.5">
                {t('employer:applicantReview.applicantInfoSubtitle')}
              </p>
            </div>

            {/* Contact & Identity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4 flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 border border-[#E9EAF1] text-[#6C4CE3] shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium text-[#73758A]">
                    {t('employer:applicantReview.fullName')}
                  </span>
                  <span
                    className={`mt-0.5 block text-sm font-semibold break-words ${
                      candidateName.isMissing ? 'italic text-[#A0A2B3] font-normal' : 'text-[#25243A]'
                    }`}
                  >
                    {candidateName.text}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4 flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 border border-[#E9EAF1] text-[#4776E6] shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium text-[#73758A]">
                    {t('employer:applicantReview.email')}
                  </span>
                  {candidateEmail.isMissing ? (
                    <span className="mt-0.5 block text-sm italic text-[#A0A2B3]">
                      {candidateEmail.text}
                    </span>
                  ) : (
                    <a
                      href={`mailto:${candidateEmail.text}`}
                      className="mt-0.5 block text-sm font-semibold text-[#25243A] hover:text-[#6C4CE3] break-all transition"
                    >
                      {candidateEmail.text}
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4 flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 border border-[#E9EAF1] text-[#6C4CE3] shrink-0">
                  <Hash className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium text-[#73758A]">
                    {t('employer:applicantReview.studentId')}
                  </span>
                  <span
                    className={`mt-0.5 block text-sm font-semibold ${
                      candidateStudentId.isMissing
                        ? 'italic text-[#A0A2B3] font-normal'
                        : 'text-[#25243A]'
                    }`}
                  >
                    {candidateStudentId.text}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4 flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 border border-[#E9EAF1] text-[#16A36A] shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium text-[#73758A]">
                    {t('employer:applicantReview.phone')}
                  </span>
                  {candidatePhone.isMissing ? (
                    <span className="mt-0.5 block text-sm italic text-[#A0A2B3]">
                      {candidatePhone.text}
                    </span>
                  ) : (
                    <a
                      href={`tel:${candidatePhone.text}`}
                      className="mt-0.5 block text-sm font-semibold text-[#25243A] hover:text-[#6C4CE3] transition"
                    >
                      {candidatePhone.text}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Education Details */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#73758A]">
                <GraduationCap className="h-4 w-4 text-[#6C4CE3]" />
                <span>{t('employer:applicantReview.educationHeading')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-[#E9EAF1] p-4">
                <div>
                  <span className="block text-[11px] text-[#73758A]">
                    {t('employer:applicantReview.university')}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs sm:text-sm font-semibold ${
                      candidateUniversity.isMissing
                        ? 'italic text-[#A0A2B3] font-normal'
                        : 'text-[#25243A]'
                    }`}
                  >
                    {candidateUniversity.text}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-[#73758A]">
                    {t('employer:applicantReview.faculty')}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs sm:text-sm font-semibold ${
                      candidateFaculty.isMissing
                        ? 'italic text-[#A0A2B3] font-normal'
                        : 'text-[#25243A]'
                    }`}
                  >
                    {candidateFaculty.text}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-[#73758A]">
                    {t('employer:applicantReview.major')}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs sm:text-sm font-semibold ${
                      candidateMajor.isMissing
                        ? 'italic text-[#A0A2B3] font-normal'
                        : 'text-[#25243A]'
                    }`}
                  >
                    {candidateMajor.text}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-[#73758A]">
                    {t('employer:applicantReview.yearOfStudy')}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs sm:text-sm font-semibold ${
                      candidateYear.isMissing
                        ? 'italic text-[#A0A2B3] font-normal'
                        : 'text-[#25243A]'
                    }`}
                  >
                    {candidateYear.text}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* B. Application Information & Cover Letter */}
          <section className="rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9EAF1] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#25243A]">
                  {t('employer:applicantReview.applicationInfoTitle')}
                </h2>
                <p className="text-xs text-[#73758A] mt-0.5">
                  {t('employer:applicantReview.applicationInfoSubtitle')}
                </p>
              </div>

              {application.job_id && (
                <Tooltip content={t('common:tooltips.viewJob')}>
                  <Link
                    to={`/jobs/${encodeURIComponent(application.job_id)}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] px-3.5 py-2 text-xs font-semibold text-[#6C4CE3] hover:bg-[#F0ECFF] transition self-start sm:self-center"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {t('employer:applicantReview.viewJobPosting')}
                  </Link>
                </Tooltip>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4">
                <span className="block text-[11px] text-[#73758A]">
                  {t('employer:applicantReview.jobPosition')}
                </span>
                <span className="mt-1 block text-sm font-bold text-[#6C4CE3]">
                  {jobPositionDisplay.text}
                </span>
              </div>

              <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4">
                <span className="block text-[11px] text-[#73758A]">
                  {t('employer:applicantReview.companyName')}
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#25243A]">
                  <Building2 className="h-4 w-4 text-[#73758A] shrink-0" />
                  {companyDisplay.text}
                </span>
              </div>

              <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4">
                <span className="block text-[11px] text-[#73758A]">
                  {t('employer:applicantReview.appliedDate')}
                </span>
                <span className="mt-1 block text-xs sm:text-sm font-semibold text-[#25243A]">
                  {formattedAppliedDate}
                </span>
                <span className="mt-0.5 block text-[11px] text-[#A0A2B3]">
                  {t('employer:applicantReview.lastUpdated')}: {formattedUpdatedDate}
                </span>
              </div>

              <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4">
                <span className="block text-[11px] text-[#73758A] mb-1.5">
                  {t('employer:applicantReview.currentStatus')}
                </span>
                <ApplicationStatusBadge status={application.status} size="md" />
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#25243A]">
                <MessageSquareText className="h-4 w-4 text-[#6C4CE3]" />
                <span>{t('employer:applicantReview.coverLetter')}</span>
              </div>
              <div className="rounded-2xl border border-[#E9EAF1] bg-[#F8F9FC] p-4 sm:p-5">
                {coverLetterDisplay.isMissing ? (
                  <p className="text-xs italic text-[#A0A2B3]">{coverLetterDisplay.text}</p>
                ) : (
                  <p className="text-xs sm:text-sm text-[#25243A] leading-relaxed whitespace-pre-line">
                    {coverLetterDisplay.text}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* C. Resume / CV & Portfolio */}
          <section className="rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs space-y-5">
            <div className="border-b border-[#E9EAF1] pb-4">
              <h2 className="text-base font-bold text-[#25243A]">
                {t('employer:applicantReview.documentsTitle')}
              </h2>
              <p className="text-xs text-[#73758A] mt-0.5">
                {t('employer:applicantReview.documentsSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resume Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#E9EAF1] bg-[#F8F9FC] p-5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white p-2.5 border border-[#E9EAF1] text-[#6C4CE3] shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-[#25243A]">
                      {t('employer:applicantReview.resumeLabel')}
                    </span>
                    <span
                      className={`mt-1 block text-xs break-all ${
                        resumeDisplay.isMissing
                          ? 'italic text-[#A0A2B3]'
                          : 'font-medium text-[#6C4CE3]'
                      }`}
                    >
                      {resumeDisplay.text}
                    </span>
                  </div>
                </div>

                {!resumeDisplay.isMissing && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Tooltip content={t('common:tooltips.previewResume')}>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => setIsResumePreviewOpen(true)}
                        leftIcon={<Eye className="h-3.5 w-3.5" />}
                      >
                        {t('employer:applicantReview.previewResume')}
                      </Button>
                    </Tooltip>
                    <Tooltip content={t('common:tooltips.downloadResume')}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadResume}
                        leftIcon={<Download className="h-3.5 w-3.5" />}
                      >
                        {t('employer:applicantReview.downloadResume')}
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </div>

              {/* Portfolio Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#E9EAF1] bg-[#F8F9FC] p-5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white p-2.5 border border-[#E9EAF1] text-[#4776E6] shrink-0">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-[#25243A]">
                      {t('employer:applicantReview.portfolioLabel')}
                    </span>
                    {portfolioUrlNormalized ? (
                      <span className="mt-1 block text-xs font-medium text-[#4776E6] break-all">
                        {portfolioUrlNormalized}
                      </span>
                    ) : (
                      <span className="mt-1 block text-xs italic text-[#A0A2B3]">
                        {notProvidedText}
                      </span>
                    )}
                  </div>
                </div>

                {portfolioUrlNormalized && (
                  <div className="pt-1">
                    <Tooltip content={t('common:tooltips.openPortfolio')}>
                      <a
                        href={portfolioUrlNormalized}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2 text-xs font-semibold text-[#4776E6] shadow-2xs hover:border-[#4776E6]/40 hover:bg-[#EDF3FF]/50 transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t('employer:applicantReview.openPortfolio')}
                      </a>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Application Status Management & Review Actions */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <form
            onSubmit={handleRequestSave}
            className="rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs space-y-5"
          >
            <div className="border-b border-[#E9EAF1] pb-4">
              <h2 className="text-base font-bold text-[#25243A]">
                {t('employer:applicantReview.statusManagementTitle')}
              </h2>
              <p className="text-xs text-[#73758A] mt-0.5">
                {t('employer:applicantReview.statusManagementSubtitle')}
              </p>
            </div>

            {/* Real API Success Notification */}
            {saveSuccessMessage && (
              <div
                role="status"
                className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-[#16A36A]"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{saveSuccessMessage}</span>
              </div>
            )}

            {/* Real API Error Notification */}
            {saveErrorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-[#E05252]"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{saveErrorMessage}</span>
              </div>
            )}

            {/* Status Dropdown Selector */}
            <div className="space-y-1.5">
              <label
                htmlFor="application-status-select"
                className="block text-xs font-semibold text-[#25243A]"
              >
                {t('employer:applicantReview.statusDropdownLabel')}
              </label>
              <select
                id="application-status-select"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as ApplicationStatus);
                  setSaveSuccessMessage(null);
                  setSaveErrorMessage(null);
                }}
                disabled={isSaving}
                className="w-full rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] px-3.5 py-2.5 text-xs font-semibold text-[#25243A] focus:border-[#6C4CE3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 cursor-pointer"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Status Selection Controls */}
            <div className="space-y-2">
              {statusOptions.map((opt) => {
                const isSelected = selectedStatus === opt.value;
                const isCurrentSaved = application.status === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      setSelectedStatus(opt.value);
                      setSaveSuccessMessage(null);
                      setSaveErrorMessage(null);
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition cursor-pointer ${
                      isSelected
                        ? `${opt.activeBorder} ${opt.activeBg}`
                        : 'border-[#E9EAF1] bg-white hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{opt.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#25243A]">{opt.label}</span>
                        {isCurrentSaved && (
                          <span className="rounded-md bg-white/90 border border-[#E9EAF1] px-1.5 py-0.5 text-[10px] font-semibold text-[#73758A]">
                            {t('employer:applicantReview.currentBadge')}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-[#73758A] leading-snug">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Employer Review Feedback / Notes */}
            <div className="space-y-1.5 pt-1">
              <label
                htmlFor="employer-feedback-note"
                className="block text-xs font-semibold text-[#25243A]"
              >
                {t('employer:applicantReview.feedbackLabel')}
              </label>
              <textarea
                id="employer-feedback-note"
                rows={3}
                value={feedbackNote}
                onChange={(e) => {
                  setFeedbackNote(e.target.value);
                  setSaveSuccessMessage(null);
                }}
                disabled={isSaving}
                placeholder={t('employer:applicantReview.feedbackPlaceholder')}
                className="w-full rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-3 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
              />
            </div>

            {/* Helper State Hint */}
            <p
              className={`text-[11px] ${
                hasUnsavedChanges ? 'font-medium text-[#6C4CE3]' : 'text-[#A0A2B3]'
              }`}
            >
              {hasUnsavedChanges
                ? t('employer:applicantReview.unsavedHint')
                : t('employer:applicantReview.noChangesHint')}
            </p>

            {/* Save & Cancel Action Buttons */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#E9EAF1]">
              <Tooltip content={t('common:tooltips.cancel')}>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleCancelChanges}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {t('employer:applicantReview.cancel')}
                </Button>
              </Tooltip>
              <Tooltip content={t('common:tooltips.updateStatus')} disabled={!hasUnsavedChanges || isSaving}>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!hasUnsavedChanges || isSaving}
                  isLoading={isSaving}
                  className="flex-1"
                >
                  {isSaving
                    ? t('employer:applicantReview.savingChanges')
                    : t('employer:applicantReview.saveChanges')}
                </Button>
              </Tooltip>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog before Updating Status */}
      <ConfirmDialog
        isOpen={isConfirmModalOpen}
        onClose={() => !isSaving && setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusUpdate}
        title={t('employer:applicantReview.confirmTitle')}
        message={t('employer:applicantReview.confirmMessage', {
          name: candidateName.text,
          status: t(`common:status.${selectedStatus}`),
        })}
        confirmLabel={t('employer:applicantReview.confirmBtn')}
        cancelLabel={t('employer:applicantReview.cancelBtn')}
        isDestructive={selectedStatus === 'rejected'}
        isLoading={isSaving}
      />

      {/* Resume Preview Modal */}
      <Modal
        isOpen={isResumePreviewOpen}
        onClose={() => setIsResumePreviewOpen(false)}
        title={t('employer:applicantReview.resumeModalTitle', { name: candidateName.text })}
        maxWidth="2xl"
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6C4CE3]">
              <FileText className="h-4 w-4" />
              <span>{resumeDisplay.text}</span>
            </div>
            <span className="rounded-md bg-[#F0ECFF] px-2.5 py-1 text-[11px] font-semibold text-[#6C4CE3]">
              {t('employer:applicantReview.resumePreviewSheetBadge')}
            </span>
          </div>

          {isExternalResumeUrl && application.resume_url ? (
            <div className="rounded-2xl border border-[#E9EAF1] overflow-hidden bg-gray-50">
              <iframe
                src={application.resume_url}
                title={resumeDisplay.text}
                className="h-96 w-full border-0"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 space-y-5 shadow-2xs">
              <div className="border-b border-[#E9EAF1] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold text-[#25243A]">{candidateName.text}</h4>
                  <p className="text-xs text-[#6C4CE3] font-medium">{jobPositionDisplay.text}</p>
                </div>
                <div className="text-xs text-[#73758A] sm:text-right">
                  <div>{candidateEmail.text}</div>
                  <div>{candidatePhone.text}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-[#F8F9FC] p-3 border border-[#E9EAF1]">
                  <span className="text-[#73758A] block">
                    {t('employer:applicantReview.university')}
                  </span>
                  <strong className="text-[#25243A]">{candidateUniversity.text}</strong>
                </div>
                <div className="rounded-xl bg-[#F8F9FC] p-3 border border-[#E9EAF1]">
                  <span className="text-[#73758A] block">
                    {t('employer:applicantReview.faculty')} / {t('employer:applicantReview.major')}
                  </span>
                  <strong className="text-[#25243A]">
                    {candidateFaculty.text} • {candidateMajor.text}
                  </strong>
                </div>
                <div className="rounded-xl bg-[#F8F9FC] p-3 border border-[#E9EAF1]">
                  <span className="text-[#73758A] block">
                    {t('employer:applicantReview.studentId')}
                  </span>
                  <strong className="text-[#25243A]">{candidateStudentId.text}</strong>
                </div>
                <div className="rounded-xl bg-[#F8F9FC] p-3 border border-[#E9EAF1]">
                  <span className="text-[#73758A] block">
                    {t('employer:applicantReview.yearOfStudy')}
                  </span>
                  <strong className="text-[#25243A]">{candidateYear.text}</strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#73758A]">
                  {t('employer:applicantReview.coverLetter')}
                </h5>
                <p className="rounded-xl bg-[#F8F9FC] p-4 text-xs text-[#25243A] leading-relaxed border border-[#E9EAF1] whitespace-pre-line">
                  {coverLetterDisplay.text}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E9EAF1]">
            <Tooltip content={t('common:tooltips.close')}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsResumePreviewOpen(false)}
              >
                {t('common:actions.close')}
              </Button>
            </Tooltip>
            <Tooltip content={t('common:tooltips.downloadResume')}>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleDownloadResume}
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                {t('employer:applicantReview.downloadResume')}
              </Button>
            </Tooltip>
          </div>
        </div>
      </Modal>
    </div>
  );
};
