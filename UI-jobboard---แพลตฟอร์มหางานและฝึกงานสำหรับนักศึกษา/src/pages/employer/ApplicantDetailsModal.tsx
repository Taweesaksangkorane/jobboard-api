import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Application, ApplicationStatus } from '../../types';
import { applicationService } from '../../services/applicationService';
import { ApplicationStatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Tooltip } from '../../components/common/Tooltip';
import { formatDate } from '../../utils/dateFormatter';
import {
  Mail,
  Phone,
  Calendar,
  CalendarCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  Award,
  XCircle,
  Clock,
} from 'lucide-react';

interface ApplicantDetailsModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (updatedApp: Application) => void;
}

export const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
  application,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const { t } = useTranslation(['employer', 'common']);
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(
    application?.status || 'submitted'
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (application) {
      setCurrentStatus(application.status);
      setStatusMessage(null);
      setErrorMessage(null);
    }
  }, [application]);

  if (!application) return null;

  const statuses: {
    status: ApplicationStatus;
    label: string;
    description: string;
    icon: React.ReactNode;
    colorClasses: string;
  }[] = [
    {
      status: 'submitted',
      label: t('common:status.submitted'),
      description: t('employer:applicantReview.statusDesc.submitted'),
      icon: <Clock className="h-4 w-4" />,
      colorClasses: 'hover:bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      status: 'reviewing',
      label: t('common:status.reviewing'),
      description: t('employer:applicantReview.statusDesc.reviewing'),
      icon: <Eye className="h-4 w-4" />,
      colorClasses: 'hover:bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      status: 'shortlisted',
      label: t('common:status.shortlisted'),
      description: t('employer:applicantReview.statusDesc.shortlisted'),
      icon: <Award className="h-4 w-4" />,
      colorClasses: 'hover:bg-purple-50 text-[#6C4CE3] border-purple-200',
    },
    {
      status: 'interview',
      label: t('common:status.interview'),
      description: t('employer:applicantReview.statusDesc.interview'),
      icon: <CalendarCheck className="h-4 w-4 text-indigo-700" />,
      colorClasses: 'hover:bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      status: 'accepted',
      label: t('common:status.accepted'),
      description: t('employer:applicantReview.statusDesc.accepted'),
      icon: <CheckCircle2 className="h-4 w-4 text-[#16A36A]" />,
      colorClasses: 'hover:bg-emerald-50 text-emerald-800 border-emerald-300',
    },
    {
      status: 'rejected',
      label: t('common:status.rejected'),
      description: t('employer:applicantReview.statusDesc.rejected'),
      icon: <XCircle className="h-4 w-4 text-[#E05252]" />,
      colorClasses: 'hover:bg-red-50 text-red-700 border-red-200',
    },
  ];

  const handleUpdateStatus = async (newStatus: ApplicationStatus) => {
    try {
      setIsUpdating(true);
      setErrorMessage(null);
      const updated = await applicationService.updateApplicationStatus(application.id, newStatus);
      setCurrentStatus(newStatus);
      setStatusMessage(t('employer:applicantModal.successUpdate'));
      onStatusUpdated(updated);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setIsUpdating(false);
    }
  };

  const createdDate = formatDate(application.created_at, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('employer:applicantModal.title')} maxWidth="xl">
      <div className="space-y-6">
        {statusMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-[#16A36A]">
            <CheckCircle2 className="h-4 w-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-[#E05252]">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Applicant Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4CE3] text-lg font-bold text-white shadow-xs">
              {application.student_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#25243A]">
                {application.student_name || 'Student Candidate'}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#73758A] mt-0.5">
                <span>ID: {application.student_id}</span>
                <span>•</span>
                <span>{t('employer:applicants.table.job')}: <strong className="text-[#6C4CE3]">{application.job_title}</strong></span>
              </div>
            </div>
          </div>

          <div>
            <ApplicationStatusBadge status={currentStatus} size="lg" />
          </div>
        </div>

        {/* Contact and Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-[#E9EAF1] p-3 flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-[#6C4CE3] shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[10px] text-[#73758A] block">{t('employer:applicantModal.email')}:</span>
              <span className="font-semibold text-[#25243A] truncate block">
                {application.student_email || 'student@university.ac.th'}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#E9EAF1] p-3 flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-[#16A36A] shrink-0" />
            <div>
              <span className="text-[10px] text-[#73758A] block">{t('employer:applicantModal.phone')}:</span>
              <span className="font-semibold text-[#25243A]">
                {application.student_phone || '089-123-4567'}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#E9EAF1] p-3 flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-[#4776E6] shrink-0" />
            <div>
              <span className="text-[10px] text-[#73758A] block">{t('employer:applicantModal.appliedOn')}:</span>
              <span className="font-semibold text-[#25243A]">{createdDate}</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#E9EAF1] p-3 flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-[#F0A43A] shrink-0" />
            <div>
              <span className="text-[10px] text-[#73758A] block">{t('employer:applicantModal.resumeSection')}:</span>
              <span className="font-semibold text-[#6C4CE3]">
                {application.resume_url || 'Resume_Portfolio.pdf'}
              </span>
            </div>
          </div>
        </div>

        {/* Applicant Statement */}
        {application.notes && (
          <div className="rounded-xl border border-[#E9EAF1] bg-white p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#73758A] mb-1.5">
              {t('employer:applicantModal.coverLetterSection')}
            </h4>
            <p className="text-xs text-[#25243A] leading-relaxed italic bg-[#F8F9FC] p-3 rounded-lg border border-[#E9EAF1]">
              "{application.notes}"
            </p>
          </div>
        )}

        {/* Status Management Buttons */}
        <div className="border-t border-[#E9EAF1] pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#25243A]">
              {t('employer:applicantModal.changeStatusSection')}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {statuses.map((item) => (
              <button
                key={item.status}
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus(item.status)}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition cursor-pointer ${
                  item.colorClasses
                } ${
                  currentStatus === item.status
                    ? 'ring-2 ring-[#6C4CE3] bg-purple-50/50 font-semibold'
                    : 'bg-white'
                }`}
              >
                <div className="mt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-[#73758A] mt-0.5">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#E9EAF1]">
          <Tooltip content={t('common:tooltips.close')}>
            <Button variant="outline" size="sm" onClick={onClose}>
              {t('employer:applicantModal.close')}
            </Button>
          </Tooltip>
        </div>
      </div>
    </Modal>
  );
};
