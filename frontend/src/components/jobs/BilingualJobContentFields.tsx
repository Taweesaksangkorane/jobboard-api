import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, CheckCircle2, Info } from 'lucide-react';
import { JobContentLanguage } from '../../types';
import { Input } from '../common/Input';

export interface BilingualJobFieldsState {
  content_language: JobContentLanguage;
  title_th: string;
  description_th: string;
  responsibilities_th: string;
  qualifications_th: string;
  required_skills_th: string;
  benefits_th: string;
  title_en: string;
  description_en: string;
  responsibilities_en: string;
  qualifications_en: string;
  required_skills_en: string;
  benefits_en: string;
}

interface BilingualJobContentFieldsProps {
  values: BilingualJobFieldsState;
  onChange: (patch: Partial<BilingualJobFieldsState>) => void;
  isEditMode?: boolean;
  initialFocusLang?: 'all' | 'th' | 'en';
  wideLayout?: boolean;
}

export const BilingualJobContentFields: React.FC<BilingualJobContentFieldsProps> = ({
  values,
  onChange,
  isEditMode = false,
  initialFocusLang = 'all',
  wideLayout = false,
}) => {
  const { t } = useTranslation(['employer', 'common']);
  const [bilingualFocus, setBilingualFocus] = useState<'all' | 'th' | 'en'>(initialFocusLang);

  useEffect(() => {
    setBilingualFocus(initialFocusLang);
  }, [initialFocusLang]);

  const hasStoredThai = Boolean(
    values.title_th.trim() ||
      values.description_th.trim() ||
      values.responsibilities_th.trim() ||
      values.qualifications_th.trim()
  );
  const hasStoredEnglish = Boolean(
    values.title_en.trim() ||
      values.description_en.trim() ||
      values.responsibilities_en.trim() ||
      values.qualifications_en.trim()
  );

  const showThaiFields =
    values.content_language === 'th' ||
    (values.content_language === 'both' && (bilingualFocus === 'all' || bilingualFocus === 'th'));

  const showEnglishFields =
    values.content_language === 'en' ||
    (values.content_language === 'both' && (bilingualFocus === 'all' || bilingualFocus === 'en'));

  const isSideBySideBilingual =
    values.content_language === 'both' && bilingualFocus === 'all';

  const useTwoColSinglePanel = wideLayout && !isSideBySideBilingual;

  const showPreservedNotice =
    isEditMode &&
    ((values.content_language === 'th' && hasStoredEnglish) ||
      (values.content_language === 'en' && hasStoredThai));

  const languageOptions: {
    value: JobContentLanguage;
    badge: string;
    label: string;
    desc: string;
  }[] = [
    {
      value: 'th',
      badge: 'TH',
      label: t('employer:jobForm.langOptionTh', 'Thai Only (ภาษาไทย)'),
      desc: t('employer:jobForm.langOptionThDesc'),
    },
    {
      value: 'en',
      badge: 'EN',
      label: t('employer:jobForm.langOptionEn', 'English Only (ภาษาอังกฤษ)'),
      desc: t('employer:jobForm.langOptionEnDesc'),
    },
    {
      value: 'both',
      badge: 'TH / EN',
      label: t('employer:jobForm.langOptionBoth', 'Thai and English (สองภาษา)'),
      desc: t('employer:jobForm.langOptionBothDesc'),
    },
  ];

  const textareaClassName =
    'w-full rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2.5 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 transition';

  return (
    <div className="w-full space-y-6">
      {/* 1. Job Posting Language Selection (Full Width) */}
      <div className="w-full space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 border-b border-purple-100 pb-2.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#6C4CE3] flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#6C4CE3]" />
            <span>{t('employer:jobForm.postingLanguageHeading')}</span>
          </h2>
        </div>

        <div className="w-full">
          <label
            htmlFor="job-posting-language-select"
            className="mb-2.5 block text-xs font-semibold text-[#25243A]"
          >
            {t('employer:jobForm.postingLanguageLabel')} <span className="text-[#E05252]">*</span>
          </label>

          {/* Accessible select + interactive visual cards synchronized together */}
          <select
            id="job-posting-language-select"
            value={values.content_language}
            onChange={(e) => {
              const nextLang = e.target.value as JobContentLanguage;
              onChange({ content_language: nextLang });
              if (nextLang !== 'both') {
                setBilingualFocus('all');
              }
            }}
            className="sr-only"
            aria-label={t('employer:jobForm.postingLanguageLabel')}
          >
            <option value="th">Thai Only (ภาษาไทย)</option>
            <option value="en">English Only (ภาษาอังกฤษ)</option>
            <option value="both">Thai and English (สองภาษา)</option>
          </select>

          <div
            className={
              wideLayout
                ? 'w-full grid grid-cols-1 lg:grid-cols-3 gap-4'
                : 'w-full grid grid-cols-1 sm:grid-cols-3 gap-3'
            }
          >
            {languageOptions.map((opt) => {
              const active = values.content_language === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange({ content_language: opt.value });
                    if (opt.value !== 'both') {
                      setBilingualFocus('all');
                    }
                  }}
                  className={`flex w-full flex-col items-start rounded-xl border p-4 text-left transition cursor-pointer ${
                    active
                      ? 'border-[#6C4CE3] bg-[#F0ECFF]/60 ring-2 ring-[#6C4CE3]/15'
                      : 'border-[#E9EAF1] bg-[#F8F9FC] hover:border-[#6C4CE3]/40 hover:bg-white'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                        active
                          ? 'bg-[#6C4CE3] text-white'
                          : 'border border-[#E9EAF1] bg-white text-[#25243A]'
                      }`}
                    >
                      {opt.badge}
                    </span>
                    {active && <CheckCircle2 className="h-4 w-4 text-[#6C4CE3]" />}
                  </div>
                  <span className="text-xs font-bold text-[#25243A]">{opt.label}</span>
                  <span className="mt-0.5 text-[11px] text-[#73758A] leading-snug">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-2.5 text-[11px] text-[#73758A]">
            {t('employer:jobForm.postingLanguageHint')}
          </p>
        </div>

        {showPreservedNotice && (
          <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-[#EDF3FF]/80 p-3 text-xs text-[#25243A]">
            <Info className="h-4 w-4 text-[#4776E6] shrink-0 mt-0.5" />
            <span>{t('employer:jobForm.preservedLanguageNotice')}</span>
          </div>
        )}

        {/* Independent Thai / English focus switcher when editing bilingual jobs */}
        {isEditMode && values.content_language === 'both' && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(['all', 'th', 'en'] as const).map((tab) => {
              const isSelected = bilingualFocus === tab;
              const label =
                tab === 'all'
                  ? t('employer:jobForm.editFocusTabAll')
                  : tab === 'th'
                    ? t('employer:jobForm.editFocusTabTh')
                    : t('employer:jobForm.editFocusTabEn');
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setBilingualFocus(tab)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#6C4CE3] text-white shadow-2xs'
                      : 'border border-[#E9EAF1] bg-white text-[#73758A] hover:text-[#25243A]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Conditional Thai / English / Bilingual Content Sections */}
      <div
        className={
          isSideBySideBilingual
            ? 'w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'
            : 'w-full space-y-6'
        }
      >
        {/* THAI CONTENT PANEL */}
        {showThaiFields && (
          <div className="w-full rounded-2xl border border-[#E9EAF1] bg-[#F8F9FC]/80 p-5 lg:p-6 space-y-5">
            <div className="border-b border-[#E9EAF1] pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-purple-200 bg-[#F0ECFF] px-2 py-0.5 text-[10px] font-bold text-[#6C4CE3]">
                  TH
                </span>
                <h3 className="text-sm font-bold text-[#25243A]">
                  {t('employer:jobForm.thaiSectionTitle')}
                </h3>
              </div>
              <p className="mt-1 text-[11px] text-[#73758A]">
                {t('employer:jobForm.thaiSectionSubtitle')}
              </p>
            </div>

            <div
              className={
                useTwoColSinglePanel
                  ? 'grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5'
                  : 'space-y-4'
              }
            >
              <div className={useTwoColSinglePanel ? 'lg:col-span-2' : ''}>
                <Input
                  label={t('employer:jobForm.titleThLabel')}
                  required={values.content_language === 'th' || values.content_language === 'both'}
                  value={values.title_th}
                  onChange={(e) => onChange({ title_th: e.target.value })}
                  placeholder={t('employer:jobForm.titleThPlaceholder')}
                />
              </div>

              <div className={useTwoColSinglePanel ? 'lg:col-span-2' : ''}>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.descriptionThLabel')}{' '}
                  {(values.content_language === 'th' || values.content_language === 'both') && (
                    <span className="text-[#E05252]">*</span>
                  )}
                </label>
                <textarea
                  rows={4}
                  required={values.content_language === 'th' || values.content_language === 'both'}
                  value={values.description_th}
                  onChange={(e) => onChange({ description_th: e.target.value })}
                  placeholder={t('employer:jobForm.descriptionThPlaceholder')}
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.responsibilitiesThLabel')}
                </label>
                <textarea
                  rows={4}
                  value={values.responsibilities_th}
                  onChange={(e) => onChange({ responsibilities_th: e.target.value })}
                  placeholder={t('employer:jobForm.responsibilitiesThPlaceholder')}
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.qualificationsThLabel')}
                </label>
                <textarea
                  rows={useTwoColSinglePanel ? 4 : 3}
                  value={values.qualifications_th}
                  onChange={(e) => onChange({ qualifications_th: e.target.value })}
                  placeholder={t('employer:jobForm.qualificationsThPlaceholder')}
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.skillsThLabel')}
                </label>
                <textarea
                  rows={3}
                  value={values.required_skills_th}
                  onChange={(e) => onChange({ required_skills_th: e.target.value })}
                  placeholder={t('employer:jobForm.skillsThPlaceholder')}
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.benefitsThLabel')}
                </label>
                <textarea
                  rows={3}
                  value={values.benefits_th}
                  onChange={(e) => onChange({ benefits_th: e.target.value })}
                  placeholder={t('employer:jobForm.benefitsThPlaceholder')}
                  className={textareaClassName}
                />
              </div>
            </div>
          </div>
        )}

        {/* ENGLISH CONTENT PANEL */}
        {showEnglishFields && (
          <div className="w-full rounded-2xl border border-blue-100 bg-[#EDF3FF]/35 p-5 lg:p-6 space-y-5">
            <div className="border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-blue-200 bg-[#EDF3FF] px-2 py-0.5 text-[10px] font-bold text-[#4776E6]">
                  EN
                </span>
                <h3 className="text-sm font-bold text-[#25243A]">
                  {t('employer:jobForm.englishSectionTitle')}
                </h3>
              </div>
              <p className="mt-1 text-[11px] text-[#73758A]">
                {t('employer:jobForm.englishSectionSubtitle')}
              </p>
            </div>

            <div
              className={
                useTwoColSinglePanel
                  ? 'grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5'
                  : 'space-y-4'
              }
            >
              <div className={useTwoColSinglePanel ? 'lg:col-span-2' : ''}>
                <Input
                  label={t('employer:jobForm.titleEnLabel')}
                  required={values.content_language === 'en' || values.content_language === 'both'}
                  value={values.title_en}
                  onChange={(e) => onChange({ title_en: e.target.value })}
                  placeholder={t('employer:jobForm.titleEnPlaceholder')}
                />
              </div>

              <div className={useTwoColSinglePanel ? 'lg:col-span-2' : ''}>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.descriptionEnLabel')}{' '}
                  {(values.content_language === 'en' || values.content_language === 'both') && (
                    <span className="text-[#E05252]">*</span>
                  )}
                </label>
                <textarea
                  rows={4}
                  required={values.content_language === 'en' || values.content_language === 'both'}
                  value={values.description_en}
                  onChange={(e) => onChange({ description_en: e.target.value })}
                  placeholder={t('employer:jobForm.descriptionEnPlaceholder')}
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.responsibilitiesEnLabel')}
                </label>
                <textarea
                  rows={4}
                  value={values.responsibilities_en}
                  onChange={(e) => onChange({ responsibilities_en: e.target.value })}
                  placeholder={t('employer:jobForm.responsibilitiesEnPlaceholder')}
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.qualificationsEnLabel')}
                </label>
                <textarea
                  rows={useTwoColSinglePanel ? 4 : 3}
                  value={values.qualifications_en}
                  onChange={(e) => onChange({ qualifications_en: e.target.value })}
                  placeholder={t('employer:jobForm.qualificationsEnPlaceholder')}
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.skillsEnLabel')}
                </label>
                <textarea
                  rows={3}
                  value={values.required_skills_en}
                  onChange={(e) => onChange({ required_skills_en: e.target.value })}
                  placeholder={t('employer:jobForm.skillsEnPlaceholder')}
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:jobForm.benefitsEnLabel')}
                </label>
                <textarea
                  rows={3}
                  value={values.benefits_en}
                  onChange={(e) => onChange({ benefits_en: e.target.value })}
                  placeholder={t('employer:jobForm.benefitsEnPlaceholder')}
                  className={textareaClassName}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
