import React from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationStatus, JobStatus } from '../../types';
import { CheckCircle2, Clock, Eye, XCircle, Award, CalendarCheck } from 'lucide-react';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const { t } = useTranslation();

  const configs: Record<
    ApplicationStatus,
    { labelKey: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    submitted: {
      labelKey: 'status.submitted',
      bg: 'bg-blue-50',
      text: 'text-[#4776E6]',
      border: 'border-blue-200',
      icon: <Clock className="h-3.5 w-3.5" />,
    },
    reviewing: {
      labelKey: 'status.reviewing',
      bg: 'bg-amber-50',
      text: 'text-[#D97706]',
      border: 'border-amber-200',
      icon: <Eye className="h-3.5 w-3.5" />,
    },
    shortlisted: {
      labelKey: 'status.shortlisted',
      bg: 'bg-purple-50',
      text: 'text-[#6C4CE3]',
      border: 'border-purple-200',
      icon: <Award className="h-3.5 w-3.5" />,
    },
    interview: {
      labelKey: 'status.interview',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <CalendarCheck className="h-3.5 w-3.5" />,
    },
    accepted: {
      labelKey: 'status.accepted',
      bg: 'bg-emerald-50',
      text: 'text-[#16A36A]',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
    rejected: {
      labelKey: 'status.rejected',
      bg: 'bg-red-50',
      text: 'text-[#E05252]',
      border: 'border-red-200',
      icon: <XCircle className="h-3.5 w-3.5" />,
    },
  };

  const config = configs[status] || configs.submitted;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-3 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.icon}
      <span>{t(config.labelKey)}</span>
    </span>
  );
};

interface JobStatusBadgeProps {
  status: JobStatus;
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();

  if (status === 'open') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-[#16A36A]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#16A36A]"></span>
        {t('status.open')}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
      {t('status.closed')}
    </span>
  );
};
