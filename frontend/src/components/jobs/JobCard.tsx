import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Job } from '../../types';
import { JobStatusBadge } from '../common/StatusBadge';
import { Tooltip } from '../common/Tooltip';
import { JobLanguageBadge } from './JobLanguageBadge';
import { formatDate } from '../../utils/dateFormatter';
import {
  getLocalizedJobContent,
  parseSkillTags,
  getCategoryTranslationKeys,
  getWorkTypeTranslationKey,
  getLocalizedProvinceName,
  getCompanyInitials,
} from '../../utils/jobLocalization';
import { MapPin, Calendar, Banknote, ArrowRight } from 'lucide-react';

interface JobCardProps {
  job: Job;
  hasApplied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, hasApplied }) => {
  const { t, i18n } = useTranslation();
  const formattedDate = formatDate(job.created_at);
  const localized = getLocalizedJobContent(job, i18n.language);
  const skillTags = parseSkillTags(localized.requiredSkills).slice(0, 3);
  const categoryLabel = t(getCategoryTranslationKeys(job.category).titleKey);
  const provinceLabel = getLocalizedProvinceName(job.province, i18n.language);
  const companyInitials = getCompanyInitials(job.company_name, job.company_logo);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#E9EAF1] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6C4CE3]/40 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="rounded-lg bg-[#EDF3FF] px-2.5 py-1 text-xs font-medium text-[#4776E6]">
              {categoryLabel}
            </span>
            {job.work_type && (
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-[#73758A]">
                {t(getWorkTypeTranslationKey(job.work_type))}
              </span>
            )}
            <JobLanguageBadge job={job} />
            {hasApplied && (
              <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-semibold text-[#6C4CE3]">
                ✓ {t('actions.applied')}
              </span>
            )}
          </div>
          <JobStatusBadge status={job.status} />
        </div>

        <Link to={`/jobs/${job.id}`}>
          <h3 className="text-base font-semibold text-[#25243A] group-hover:text-[#6C4CE3] transition-colors line-clamp-2 mb-1.5">
            {localized.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-xs font-medium text-[#73758A] mb-3">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#F0ECFF] text-[10px] font-bold text-[#6C4CE3]">
            {companyInitials}
          </span>
          <span className="truncate">{job.company_name}</span>
        </div>

        <p className="text-xs text-[#73758A] line-clamp-2 leading-relaxed mb-3">
          {localized.description}
        </p>

        {skillTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {skillTags.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-[#E9EAF1] bg-[#F8F9FC] px-2 py-0.5 text-[11px] font-medium text-[#25243A]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#E9EAF1] pt-3 mt-1">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#73758A] mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#A0A2B3] shrink-0" />
            <span className="truncate max-w-[180px]">{provinceLabel} • {job.location}</span>
          </div>
          {job.salary_range && (
            <div className="flex items-center gap-1 font-medium text-[#16A36A]">
              <Banknote className="h-3.5 w-3.5 shrink-0" />
              <span>{job.salary_range}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-[11px] text-[#A0A2B3]">
            <Calendar className="h-3.5 w-3.5" />
            <span>{t('jobDetails.postedOn')} {formattedDate}</span>
          </div>

          <Tooltip content={t('common:tooltips.viewJob')}>
            <Link
              to={`/jobs/${job.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6C4CE3] hover:text-[#5638C5] transition"
            >
              {t('common:actions.viewDetails')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
