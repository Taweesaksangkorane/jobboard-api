import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Job } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Tooltip } from '../common/Tooltip';
import { JobLanguageBadge } from '../jobs/JobLanguageBadge';
import { getLocalizedJobTitle } from '../../utils/jobLocalization';
import { Building2, MapPin, Upload, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();
  const localizedTitle = getLocalizedJobTitle(job, i18n.language);

  const [studentName, setStudentName] = useState(user?.name || '');
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [studentPhone, setStudentPhone] = useState(user?.phone?.replace(/\D/g, '').slice(0, 10) || '');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [agreeConsent, setAgreeConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setErrorMessage(t('applyModal.loginRequired'));
      return;
    }
    if (!agreeConsent) {
      setErrorMessage(t('applyModal.consentRequired'));
      return;
    }
    if (!/^0\d{9}$/.test(studentPhone)) {
      setErrorMessage('Please enter a Thai contact phone number with exactly 10 digits, starting with 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const currentUser = await refreshSession();
      if (!currentUser || currentUser.role !== 'student') {
        setErrorMessage('Please sign in again with the Student demo account before applying.');
        return;
      }

      await applicationService.applyForJob(job.id, {
        student_id: user.id,
        student_name: studentName,
        student_email: studentEmail,
        student_phone: studentPhone,
        notes: notes.trim(),
        resume_url: selectedFile ? selectedFile.name : undefined,
      });

      onSuccess();
      onClose();
      navigate('/student/applications');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : t('feedback.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('applyModal.title')} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Job Summary Banner */}
        <div className="rounded-xl border border-purple-100 bg-[#F0ECFF]/60 p-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-[#25243A]">{localizedTitle}</h4>
            <JobLanguageBadge job={job} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#73758A]">
            <span className="flex items-center gap-1 font-medium text-[#6C4CE3]">
              <Building2 className="h-3.5 w-3.5" />
              {job.company_name}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.province} • {job.location}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-[#E05252]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Applicant Information */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-[#25243A]">
            {t('student:profile.personalInfo')}
          </h5>

          <Input
            label={t('applyModal.nameLabel')}
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="John Doe"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t('applyModal.emailLabel')}
              type="email"
              required
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="example@university.ac.th"
            />
            <Input
              label={t('applyModal.phoneLabel')}
              type="tel"
              required
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
              maxLength={10}
              pattern="0[0-9]{9}"
              helperText="10 digits, for example 0854565589"
              placeholder="08XXXXXXXX"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
              {t('applyModal.notesLabel')}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('applyModal.notesPlaceholder')}
              className="w-full rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
            />
          </div>
        </div>

        {/* Resume Attachment UI */}
        <div className="rounded-xl border border-dashed border-[#E9EAF1] bg-gray-50/70 p-4">
          <div className="flex items-start gap-3">
            <Upload className="mt-0.5 h-5 w-5 text-[#6C4CE3]" />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#25243A]">
                {t('applyModal.resumeUploadLabel')}
              </label>
              <p className="text-[11px] text-[#73758A] mt-0.5">
                PDF, DOCX (Max 5MB)
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-[#E9EAF1] bg-white px-3 py-1.5 text-xs font-medium text-[#25243A] hover:bg-gray-50"
                >
                  {t('applyModal.resumeChoose')}
                </label>
                {selectedFile ? (
                  <span className="flex items-center gap-1 text-xs text-[#16A36A] font-medium truncate max-w-[200px]">
                    <FileCheck className="h-4 w-4" />
                    {selectedFile.name}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <label className="flex items-start gap-2 text-xs text-[#73758A] cursor-pointer">
          <input
            type="checkbox"
            checked={agreeConsent}
            onChange={(e) => setAgreeConsent(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-[#6C4CE3] focus:ring-[#6C4CE3]"
          />
          <span>{t('applyModal.consentText')}</span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9EAF1]">
          <Tooltip content={t('common:tooltips.cancel')}>
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              {t('common:applyModal.cancelBtn')}
            </Button>
          </Tooltip>
          <Tooltip content={t('common:tooltips.save')}>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              {t('common:applyModal.submitBtn')}
            </Button>
          </Tooltip>
        </div>
      </form>
    </Modal>
  );
};
