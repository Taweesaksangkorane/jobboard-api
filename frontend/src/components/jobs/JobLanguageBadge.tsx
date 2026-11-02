import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Job } from '../../types';
import { getJobLanguageAvailability } from '../../utils/jobLocalization';
import { Tooltip } from '../common/Tooltip';

interface JobLanguageBadgeProps {
  job: Job;
  showFullLabel?: boolean;
  className?: string;
}

export const JobLanguageBadge: React.FC<JobLanguageBadgeProps> = ({
  job,
  showFullLabel = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const { effectiveLanguage, badgeText } = getJobLanguageAvailability(job);

  const styleByLang =
    effectiveLanguage === 'both'
      ? 'border-purple-200 bg-[#F0ECFF] text-[#6C4CE3]'
      : effectiveLanguage === 'en'
        ? 'border-blue-200 bg-[#EDF3FF] text-[#4776E6]'
        : 'border-[#E9EAF1] bg-[#F8F9FC] text-[#25243A]';

  const fullText =
    effectiveLanguage === 'both'
      ? t('common:jobLanguage.bilingualShort')
      : effectiveLanguage === 'en'
        ? t('common:jobLanguage.englishShort')
        : t('common:jobLanguage.thaiShort');

  return (
    <Tooltip content={fullText} disabled={showFullLabel}>
      <span
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${styleByLang} ${className}`}
      >
        {showFullLabel && <Globe className="h-3 w-3 shrink-0" />}
        <span>{showFullLabel ? fullText : badgeText}</span>
      </span>
    </Tooltip>
  );
};
