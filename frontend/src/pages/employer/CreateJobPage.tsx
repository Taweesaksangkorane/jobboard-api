import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import { JobCategory, JobStatus, JobWorkType } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ProvinceSelect } from '../../components/common/ProvinceSelect';
import { Tooltip } from '../../components/common/Tooltip';
import {
  PRIMARY_JOB_CATEGORIES,
  getCategoryTranslationKeys,
} from '../../utils/jobLocalization';
import {
  BilingualJobContentFields,
  BilingualJobFieldsState,
} from '../../components/jobs/BilingualJobContentFields';
import { ChevronLeft, Save, AlertCircle } from 'lucide-react';

export const CreateJobPage: React.FC = () => {
  const { t } = useTranslation(['employer', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bilingualFields, setBilingualFields] = useState<BilingualJobFieldsState>({
    content_language: 'th', // Default: Thai Only
    title_th: '',
    description_th: '',
    responsibilities_th: '',
    qualifications_th: '',
    required_skills_th: '',
    benefits_th: '',
    title_en: '',
    description_en: '',
    responsibilities_en: '',
    qualifications_en: '',
    required_skills_en: '',
    benefits_en: '',
  });

  const [category, setCategory] = useState<JobCategory>('IT & Software');
  const [location, setLocation] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [status, setStatus] = useState<JobStatus>('open');
  const [workType, setWorkType] = useState<JobWorkType>('Internship');
  const [salaryRange, setSalaryRange] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFieldPatch = (patch: Partial<BilingualJobFieldsState>) => {
    setBilingualFields((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { content_language } = bilingualFields;
    const needThai = content_language === 'th' || content_language === 'both';
    const needEnglish = content_language === 'en' || content_language === 'both';

    if (needThai) {
      if (bilingualFields.title_th.trim().length < 3) {
        setError(t('employer:jobForm.validation.titleThMin'));
        return;
      }
      if (bilingualFields.description_th.trim().length < 20) {
        setError(t('employer:jobForm.validation.descThMin'));
        return;
      }
    }

    if (needEnglish) {
      if (bilingualFields.title_en.trim().length < 3) {
        setError(t('employer:jobForm.validation.titleEnMin'));
        return;
      }
      if (bilingualFields.description_en.trim().length < 20) {
        setError(t('employer:jobForm.validation.descEnMin'));
        return;
      }
    }

    if (!location.trim()) {
      setError(t('employer:jobForm.validation.locationReq'));
      return;
    }

    try {
      setIsSubmitting(true);

      const canonicalTitle =
        content_language === 'en'
          ? bilingualFields.title_en.trim()
          : bilingualFields.title_th.trim() || bilingualFields.title_en.trim();

      const canonicalDescription =
        content_language === 'en'
          ? bilingualFields.description_en.trim()
          : bilingualFields.description_th.trim() || bilingualFields.description_en.trim();

      await jobService.createJob({
        title: canonicalTitle,
        description: canonicalDescription,
        content_language,
        title_th: needThai ? bilingualFields.title_th.trim() : undefined,
        description_th: needThai ? bilingualFields.description_th.trim() : undefined,
        responsibilities_th: needThai ? bilingualFields.responsibilities_th.trim() || undefined : undefined,
        qualifications_th: needThai ? bilingualFields.qualifications_th.trim() || undefined : undefined,
        required_skills_th: needThai ? bilingualFields.required_skills_th.trim() || undefined : undefined,
        benefits_th: needThai ? bilingualFields.benefits_th.trim() || undefined : undefined,
        title_en: needEnglish ? bilingualFields.title_en.trim() : undefined,
        description_en: needEnglish ? bilingualFields.description_en.trim() : undefined,
        responsibilities_en: needEnglish ? bilingualFields.responsibilities_en.trim() || undefined : undefined,
        qualifications_en: needEnglish ? bilingualFields.qualifications_en.trim() || undefined : undefined,
        required_skills_en: needEnglish ? bilingualFields.required_skills_en.trim() || undefined : undefined,
        benefits_en: needEnglish ? bilingualFields.benefits_en.trim() || undefined : undefined,
        category,
        location: location.trim(),
        province,
        status,
        company_name: user?.companyName || user?.name || 'บริษัทผู้ลงประกาศ',
        employer_id: user?.id || '',
        work_type: workType,
        salary_range: salaryRange.trim() || (content_language === 'en' ? 'Negotiable' : 'ตามตกลง'),
        application_deadline: applicationDeadline.trim() || undefined,
      });

      navigate('/employer/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-3">
        <Link
          to="/employer/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73758A] hover:text-[#6C4CE3] transition"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('employer:jobForm.backToJobs')}
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-[#25243A]">{t('employer:jobForm.createTitle')}</h1>
          <p className="mt-1 text-xs text-[#73758A]">{t('employer:jobForm.createSubtitle')}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-[#E05252]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl border border-[#E9EAF1] bg-white p-6 sm:p-8 lg:p-10 shadow-xs space-y-8"
      >
        {/* 1. Bilingual Language Selection (Full Width) + 2-Column Job Content Fields */}
        <BilingualJobContentFields
          values={bilingualFields}
          onChange={handleFieldPatch}
          wideLayout
        />

        {/* 2. General Position Metadata (Organized into Clean 2-Column Groups) */}
        <div className="w-full space-y-6 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#6C4CE3] border-b border-purple-100 pb-2.5">
            2. {t('employer:jobForm.generalSettingsSection')}
          </h2>

          {/* Group 2.1: Classification, Compensation & Application Deadline */}
          <div className="rounded-2xl border border-[#E9EAF1] bg-[#F8F9FC]/60 p-5 lg:p-6 space-y-5">
            <h3 className="text-xs font-bold text-[#25243A] border-b border-[#E9EAF1] pb-2.5">
              {t('employer:jobForm.classificationGroupTitle')}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 items-start">
              <Select
                label={t('employer:jobForm.categoryLabel')}
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                options={[
                  ...PRIMARY_JOB_CATEGORIES.map((cat) => ({
                    value: cat,
                    label: t(getCategoryTranslationKeys(cat).titleKey),
                  })),
                  { value: 'Other', label: t('common:categories.other') },
                ]}
              />

              <Select
                label={t('employer:jobForm.typeLabel')}
                value={workType}
                onChange={(e) => setWorkType(e.target.value as JobWorkType)}
                options={[
                  { value: 'Internship', label: t('common:workType.internship') },
                  { value: 'Co-op', label: t('common:workType.coop') },
                  { value: 'Full-time', label: t('common:workType.fulltime') },
                  { value: 'Part-time', label: t('common:workType.parttime') },
                  { value: 'Contract', label: t('common:workType.contract') },
                ]}
              />

              <Input
                label={t('employer:jobForm.salaryLabel')}
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder={t('employer:jobForm.salaryPlaceholder')}
                helperText={t('employer:jobForm.salaryHelper')}
              />

              <Input
                type="date"
                label={t('employer:jobForm.deadlineLabel')}
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
              />
            </div>
          </div>

          {/* Group 2.2: Workplace Location & Posting Status */}
          <div className="rounded-2xl border border-[#E9EAF1] bg-[#F8F9FC]/60 p-5 lg:p-6 space-y-5">
            <h3 className="text-xs font-bold text-[#25243A] border-b border-[#E9EAF1] pb-2.5">
              {t('employer:jobForm.locationStatusGroupTitle')}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 items-start">
              <ProvinceSelect
                label={t('employer:jobForm.provinceLabel')}
                required
                value={province}
                onChange={setProvince}
                showAllOption={false}
                variant="form"
              />

              <Input
                label={t('employer:jobForm.locationLabel')}
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('employer:jobForm.locationPlaceholder')}
              />

              <Select
                label={t('employer:jobForm.statusLabel')}
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                options={[
                  { value: 'open', label: t('employer:jobForm.statusOpen') },
                  { value: 'closed', label: t('employer:jobForm.statusClosed') },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons (Bottom-Right Aligned) */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-[#E9EAF1]">
          <Tooltip content={t('common:tooltips.cancel')}>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/employer/jobs')}
              disabled={isSubmitting}
            >
              {t('employer:jobForm.cancel')}
            </Button>
          </Tooltip>
          <Tooltip content={t('common:tooltips.save')}>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Save className="h-4 w-4" />}
            >
              {t('employer:jobForm.submitCreate')}
            </Button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};
