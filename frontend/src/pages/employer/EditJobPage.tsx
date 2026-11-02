import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jobService } from '../../services/jobService';
import { Job, JobCategory, JobStatus, JobWorkType } from '../../types';
import {
  getJobLanguageAvailability,
  PRIMARY_JOB_CATEGORIES,
  getCategoryTranslationKeys,
} from '../../utils/jobLocalization';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ProvinceSelect } from '../../components/common/ProvinceSelect';
import { Tooltip } from '../../components/common/Tooltip';
import {
  BilingualJobContentFields,
  BilingualJobFieldsState,
} from '../../components/jobs/BilingualJobContentFields';
import { LoadingSkeleton, ErrorState } from '../../components/common/FeedbackStates';
import { ChevronLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export const EditJobPage: React.FC = () => {
  const { t } = useTranslation(['employer', 'common']);
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const focusParam = searchParams.get('focus');
  const initialFocusLang: 'all' | 'th' | 'en' =
    focusParam === 'th' || focusParam === 'en' ? focusParam : 'all';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [bilingualFields, setBilingualFields] = useState<BilingualJobFieldsState>({
    content_language: 'th',
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadJob(id);
    }
  }, [id]);

  const loadJob = async (jobId: string) => {
    try {
      setLoading(true);
      setLoadError(null);
      const job: Job = await jobService.getJobById(jobId);
      const { effectiveLanguage, hasThai, hasEnglish } = getJobLanguageAvailability(job);

      setBilingualFields({
        content_language: job.content_language || effectiveLanguage,
        title_th: job.title_th || (!hasEnglish ? job.title : ''),
        description_th: job.description_th || (!hasEnglish ? job.description : ''),
        responsibilities_th: job.responsibilities_th || '',
        qualifications_th: job.qualifications_th || '',
        required_skills_th: job.required_skills_th || '',
        benefits_th: job.benefits_th || '',
        title_en: job.title_en || (!hasThai && hasEnglish ? job.title : ''),
        description_en: job.description_en || (!hasThai && hasEnglish ? job.description : ''),
        responsibilities_en: job.responsibilities_en || '',
        qualifications_en: job.qualifications_en || '',
        required_skills_en: job.required_skills_en || '',
        benefits_en: job.benefits_en || '',
      });

      setCategory(job.category);
      setLocation(job.location);
      setProvince(job.province);
      setStatus(job.status);
      if (job.work_type) setWorkType(job.work_type);
      if (job.salary_range) setSalaryRange(job.salary_range);
      if (job.application_deadline) {
        setApplicationDeadline(job.application_deadline.slice(0, 10));
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleFieldPatch = (patch: Partial<BilingualJobFieldsState>) => {
    setBilingualFields((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaveError(null);

    const { content_language } = bilingualFields;
    const needThai = content_language === 'th' || content_language === 'both';
    const needEnglish = content_language === 'en' || content_language === 'both';

    if (needThai) {
      if (bilingualFields.title_th.trim().length < 3) {
        setSaveError(t('employer:jobForm.validation.titleThMin'));
        return;
      }
      if (bilingualFields.description_th.trim().length < 20) {
        setSaveError(t('employer:jobForm.validation.descThMin'));
        return;
      }
    }

    if (needEnglish) {
      if (bilingualFields.title_en.trim().length < 3) {
        setSaveError(t('employer:jobForm.validation.titleEnMin'));
        return;
      }
      if (bilingualFields.description_en.trim().length < 20) {
        setSaveError(t('employer:jobForm.validation.descEnMin'));
        return;
      }
    }

    if (!location.trim()) {
      setSaveError(t('employer:jobForm.validation.locationReq'));
      return;
    }

    try {
      setIsSubmitting(true);

      // Build update payload carefully: only include language fields for active language(s)
      // so existing translations in the other language are never erased!
      const updatePayload: Partial<Job> = {
        content_language,
        category,
        location: location.trim(),
        province,
        status,
        work_type: workType,
        salary_range: salaryRange.trim(),
        application_deadline: applicationDeadline.trim() || undefined,
      };

      if (needThai) {
        updatePayload.title_th = bilingualFields.title_th.trim();
        updatePayload.description_th = bilingualFields.description_th.trim();
        updatePayload.responsibilities_th = bilingualFields.responsibilities_th.trim();
        updatePayload.qualifications_th = bilingualFields.qualifications_th.trim();
        updatePayload.required_skills_th = bilingualFields.required_skills_th.trim();
        updatePayload.benefits_th = bilingualFields.benefits_th.trim();
      }

      if (needEnglish) {
        updatePayload.title_en = bilingualFields.title_en.trim();
        updatePayload.description_en = bilingualFields.description_en.trim();
        updatePayload.responsibilities_en = bilingualFields.responsibilities_en.trim();
        updatePayload.qualifications_en = bilingualFields.qualifications_en.trim();
        updatePayload.required_skills_en = bilingualFields.required_skills_en.trim();
        updatePayload.benefits_en = bilingualFields.benefits_en.trim();
      }

      await jobService.updateJob(id, updatePayload);

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/employer/jobs');
      }, 900);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <Link
          to="/employer/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73758A]"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('employer:jobForm.backToJobs')}
        </Link>
        <ErrorState message={loadError} onRetry={() => id && loadJob(id)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Link
        to="/employer/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#73758A] hover:text-[#6C4CE3] transition"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('employer:jobForm.backToJobs')}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#25243A]">{t('employer:jobForm.editTitle')}</h1>
        <p className="mt-1 text-xs text-[#73758A]">{t('employer:jobForm.editSubtitle')}</p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-[#16A36A]">
          <CheckCircle2 className="h-4 w-4" />
          <span>{t('employer:jobForm.successUpdated')}</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-[#E05252]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#E9EAF1] bg-white p-6 sm:p-8 shadow-xs space-y-8"
      >
        <BilingualJobContentFields
          values={bilingualFields}
          onChange={handleFieldPatch}
          isEditMode
          initialFocusLang={initialFocusLang}
        />

        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#6C4CE3] border-b border-purple-100 pb-2">
            2. {t('employer:jobForm.generalSettingsSection')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label={t('employer:jobForm.categoryLabel')}
              value={category}
              onChange={(e) => setCategory(e.target.value as JobCategory)}
              options={[
                ...(!PRIMARY_JOB_CATEGORIES.includes(category) && category !== 'Other'
                  ? [{ value: category, label: t(getCategoryTranslationKeys(category).titleKey) }]
                  : []),
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('employer:jobForm.salaryLabel')}
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder={t('employer:jobForm.salaryPlaceholder')}
            />

            <Input
              type="date"
              label={t('employer:jobForm.deadlineLabel')}
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9EAF1]">
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
              {t('employer:jobForm.submitUpdate')}
            </Button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};
