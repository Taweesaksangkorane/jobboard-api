import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';
import { Application, ApplicationStatus } from '../../types';
import { ApplicationStatusBadge } from '../../components/common/StatusBadge';
import { Tooltip } from '../../components/common/Tooltip';
import { LoadingSkeleton, ErrorState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/dateFormatter';
import {
  ChevronLeft,
  Building2,
  Check,
  XCircle,
} from 'lucide-react';

export const ApplicationDetailsPage: React.FC = () => {
  const { t } = useTranslation(['student', 'common']);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadApplication(id);
    }
  }, [id, user?.id]);

  const loadApplication = async (appId: string) => {
    try {
      setLoading(true);
      setError(null);
      let found: Application | undefined;
      if (user?.id) {
        const myApps = await applicationService.getMyApplications(user.id);
        found = myApps.find((a) => a.id === appId);
      }

      if (found) {
        setApplication(found);
      } else {
        const integrationData = await applicationService.getIntegrationApplication(appId);
        setApplication(integrationData.application);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error || !application) {
    return (
      <div className="space-y-4">
        <Link
          to="/student/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4CE3]"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('student:applicationDetails.back')}
        </Link>
        <ErrorState message={error || t('common:feedback.noDataTitle')} onRetry={() => id && loadApplication(id)} />
      </div>
    );
  }

  const createdDate = formatDate(application.created_at, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const updatedDate = formatDate(application.updated_at, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Timeline Stages
  const steps: {
    statusKey: ApplicationStatus;
    title: string;
    description: string;
  }[] = [
    {
      statusKey: 'submitted',
      title: t('student:applicationDetails.timelineStep.submitted'),
      description: t('student:applicationDetails.timelineStepDesc.submitted'),
    },
    {
      statusKey: 'reviewing',
      title: t('student:applicationDetails.timelineStep.reviewing'),
      description: t('student:applicationDetails.timelineStepDesc.reviewing'),
    },
    {
      statusKey: 'shortlisted',
      title: t('student:applicationDetails.timelineStep.shortlisted'),
      description: t('student:applicationDetails.timelineStepDesc.shortlisted'),
    },
    {
      statusKey: 'interview',
      title: t('student:applicationDetails.timelineStep.interview'),
      description: t('student:applicationDetails.timelineStepDesc.interview'),
    },
    {
      statusKey: application.status === 'rejected' ? 'rejected' : 'accepted',
      title:
        application.status === 'rejected'
          ? t('student:applicationDetails.timelineStep.rejected')
          : t('student:applicationDetails.timelineStep.accepted'),
      description:
        application.status === 'rejected'
          ? t('student:applicationDetails.timelineStepDesc.rejected')
          : t('student:applicationDetails.timelineStepDesc.accepted'),
    },
  ];

  const getStepState = (stepIndex: number) => {
    const statusOrder: ApplicationStatus[] = ['submitted', 'reviewing', 'shortlisted', 'interview'];
    const currentStatus = application.status;

    if (currentStatus === 'rejected') {
      if (stepIndex === 4) return 'rejected';
      return 'completed';
    }

    if (currentStatus === 'accepted') {
      return 'completed';
    }

    const currentIndex = statusOrder.indexOf(currentStatus);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Header & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/student/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73758A] hover:text-[#6C4CE3] transition"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('student:applicationDetails.back')}
        </Link>
        <span className="text-xs text-[#A0A2B3]">
          {t('student:applicationDetails.refId', { id: application.id })}
        </span>
      </div>

      {/* Main Info Card */}
      <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9EAF1] pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ApplicationStatusBadge status={application.status} size="md" />
              <span className="text-xs text-[#73758A]">
                {t('student:applicationDetails.categoryLabel')}: {application.category || '-'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#25243A]">{application.job_title}</h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#6C4CE3] mt-1">
              <Building2 className="h-4 w-4" />
              <span>{application.company_name}</span>
            </div>
          </div>

          <Tooltip content={t('common:tooltips.viewJob')}>
            <Link
              to={`/jobs/${application.job_id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EAF1] px-4 py-2 text-xs font-semibold text-[#25243A] hover:bg-gray-50 self-start md:self-center transition"
            >
              {t('student:applicationDetails.viewOriginalJob')}
            </Link>
          </Tooltip>
        </div>

        {/* Timestamps & Info Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4 text-xs mb-8">
          <div>
            <span className="text-[11px] text-[#73758A]">{t('student:applicationDetails.submittedOnLabel')}</span>
            <div className="font-semibold text-[#25243A] mt-0.5">{createdDate}</div>
          </div>
          <div>
            <span className="text-[11px] text-[#73758A]">{t('student:applicationDetails.lastUpdatedLabel')}</span>
            <div className="font-semibold text-[#25243A] mt-0.5">{updatedDate}</div>
          </div>
          <div>
            <span className="text-[11px] text-[#73758A]">{t('student:applicationDetails.currentStatusLabel')}</span>
            <div className="font-semibold text-[#6C4CE3] mt-0.5">
              {t(`common:status.${application.status}`)}
            </div>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#25243A]">{t('student:applicationDetails.statusTimeline')}</h2>
          <p className="text-xs text-[#73758A]">
            {t('student:applicationDetails.timelineDesc')}
          </p>

          <div className="relative pl-6 pt-2 space-y-8 before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E9EAF1]">
            {steps.map((step, idx) => {
              const state = getStepState(idx);

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step Icon Indicator */}
                  <div
                    className={`absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                      state === 'completed'
                        ? 'bg-[#16A36A] text-white ring-4 ring-emerald-50'
                        : state === 'current'
                        ? 'bg-[#6C4CE3] text-white ring-4 ring-purple-100 animate-pulse'
                        : state === 'rejected'
                        ? 'bg-[#E05252] text-white ring-4 ring-red-100'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    {state === 'completed' ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : state === 'rejected' ? (
                      <XCircle className="h-3.5 w-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-sm font-bold ${
                          state === 'current'
                            ? 'text-[#6C4CE3]'
                            : state === 'rejected'
                            ? 'text-[#E05252]'
                            : state === 'completed'
                            ? 'text-[#16A36A]'
                            : 'text-[#73758A]'
                        }`}
                      >
                        {step.title}
                      </h3>
                      {state === 'current' && (
                        <span className="rounded-full bg-[#6C4CE3] px-2 py-0.5 text-[10px] font-semibold text-white">
                          {t('student:applicationDetails.currentBadge')}
                        </span>
                      )}
                      {state === 'completed' && idx === 0 && (
                        <span className="text-[11px] text-[#A0A2B3]">{createdDate}</span>
                      )}
                      {state === 'current' && idx > 0 && (
                        <span className="text-[11px] text-[#A0A2B3]">{updatedDate}</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#73758A] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employer Feedback if provided */}
        {application.employer_feedback && (
          <div className="border-t border-[#E9EAF1] pt-6 mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6C4CE3] mb-2">
              {t('student:applicationDetails.employerFeedback')}
            </h3>
            <p className="rounded-xl border border-purple-200 bg-[#F0ECFF]/50 p-4 text-xs text-[#25243A] leading-relaxed">
              {application.employer_feedback}
            </p>
          </div>
        )}

        {/* Notes Submitted */}
        {application.notes && (
          <div className="border-t border-[#E9EAF1] pt-6 mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#25243A] mb-2">
              {t('student:applicationDetails.coverLetter')}
            </h3>
            <p className="rounded-xl border border-[#E9EAF1] bg-gray-50/50 p-4 text-xs text-[#25243A] italic">
              "{application.notes}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
