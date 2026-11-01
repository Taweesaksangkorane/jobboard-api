import { Job, JobCategory, JobContentLanguage } from '../types';
import { findProvince, getProvinceLabel } from '../constants/provinces';

function cleanText(val?: string | null): string {
  return typeof val === 'string' ? val.trim() : '';
}

/**
 * Determines whether a job has meaningful Thai and/or English content.
 */
export function getJobLanguageAvailability(job: Job): {
  hasThai: boolean;
  hasEnglish: boolean;
  effectiveLanguage: JobContentLanguage;
  badgeText: 'TH' | 'EN' | 'TH / EN';
} {
  const thTitle = cleanText(job.title_th);
  const thDesc = cleanText(job.description_th);
  const enTitle = cleanText(job.title_en);
  const enDesc = cleanText(job.description_en);

  let hasThai = Boolean(thTitle || thDesc);
  let hasEnglish = Boolean(enTitle || enDesc);

  // Backward compatibility for legacy records that only set `title` / `description`
  if (!hasThai && !hasEnglish) {
    if (job.content_language === 'en') {
      hasEnglish = true;
    } else if (job.content_language === 'both') {
      hasThai = true;
      hasEnglish = true;
    } else {
      hasThai = true;
    }
  }

  let effectiveLanguage: JobContentLanguage = 'th';
  if (job.content_language === 'both' || (hasThai && hasEnglish)) {
    effectiveLanguage = hasThai && hasEnglish ? 'both' : hasEnglish ? 'en' : 'th';
  } else if (job.content_language === 'en' || (!hasThai && hasEnglish)) {
    effectiveLanguage = 'en';
  } else {
    effectiveLanguage = 'th';
  }

  const badgeText: 'TH' | 'EN' | 'TH / EN' =
    effectiveLanguage === 'both'
      ? 'TH / EN'
      : effectiveLanguage === 'en'
        ? 'EN'
        : 'TH';

  return {
    hasThai,
    hasEnglish,
    effectiveLanguage,
    badgeText,
  };
}

export interface LocalizedJobContent {
  title: string;
  secondaryTitle: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  requiredSkills: string;
  benefits: string;
  displayedLanguage: 'th' | 'en';
  isFallbackLanguage: boolean;
  badgeText: 'TH' | 'EN' | 'TH / EN';
  effectiveLanguage: JobContentLanguage;
}

/**
 * Resolves localized job title for the active UI language ('th' or 'en'),
 * falling back to the original available language when a translation does not exist.
 */
export function getLocalizedJobTitle(job: Job, uiLanguage: string): string {
  const preferEn = uiLanguage.toLowerCase().startsWith('en');
  const thTitle = cleanText(job.title_th);
  const enTitle = cleanText(job.title_en);
  const legacyTitle = cleanText(job.title);

  if (preferEn) {
    return enTitle || thTitle || legacyTitle;
  }
  return thTitle || enTitle || legacyTitle;
}

/**
 * Resolves all localized job content sections for the active UI language ('th' or 'en'),
 * strictly preserving employer-written text without auto-translation and hiding empty sections.
 */
export function getLocalizedJobContent(
  job: Job,
  uiLanguage: string
): LocalizedJobContent {
  const preferEn = uiLanguage.toLowerCase().startsWith('en');
  const { hasThai, hasEnglish, effectiveLanguage, badgeText } =
    getJobLanguageAvailability(job);

  // Determine which language version to display primarily so sections stay coherent
  let useEnVersion = false;
  if (preferEn) {
    useEnVersion = hasEnglish;
  } else {
    useEnVersion = !hasThai && hasEnglish;
  }

  const thTitle =
    cleanText(job.title_th) ||
    (!hasEnglish ? cleanText(job.title) : '');
  const enTitle =
    cleanText(job.title_en) ||
    (!hasThai && hasEnglish ? cleanText(job.title) : '');

  const thDesc =
    cleanText(job.description_th) ||
    (!hasEnglish ? cleanText(job.description) : '');
  const enDesc =
    cleanText(job.description_en) ||
    (!hasThai && hasEnglish ? cleanText(job.description) : '');

  const pickField = (thVal?: string, enVal?: string): string => {
    const t = cleanText(thVal);
    const e = cleanText(enVal);
    return useEnVersion ? e || t : t || e;
  };

  const title = useEnVersion
    ? enTitle || thTitle || cleanText(job.title)
    : thTitle || enTitle || cleanText(job.title);

  const secondaryTitle =
    hasThai && hasEnglish
      ? useEnVersion
        ? thTitle
        : enTitle
      : '';

  const description = useEnVersion
    ? enDesc || thDesc || cleanText(job.description)
    : thDesc || enDesc || cleanText(job.description);

  const isFallbackLanguage =
    (preferEn && !useEnVersion) || (!preferEn && useEnVersion);

  return {
    title,
    secondaryTitle,
    description,
    responsibilities: pickField(job.responsibilities_th, job.responsibilities_en),
    qualifications: pickField(job.qualifications_th, job.qualifications_en),
    requiredSkills: pickField(job.required_skills_th, job.required_skills_en),
    benefits: pickField(job.benefits_th, job.benefits_en),
    displayedLanguage: useEnVersion ? 'en' : 'th',
    isFallbackLanguage,
    badgeText,
    effectiveLanguage,
  };
}

/**
 * Splits a multi-line or comma-separated text block into clean items for display.
 */
export function parseTextListItems(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-*–]+/, '').trim())
    .filter(Boolean);
}

/**
 * Splits skills text (newline or comma separated) into clean individual tags.
 */
export function parseSkillTags(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(/[\r\n,•]+/)
    .map((item) => item.replace(/^[\s\-*]+/, '').trim())
    .filter(Boolean);
}

export const PRIMARY_JOB_CATEGORIES: JobCategory[] = [
  'IT & Software',
  'Marketing & Communications',
  'Business & Administration',
  'Finance & Accounting',
  'Graphic Design & Creative Media',
  'Engineering',
  'Healthcare & Medical Administration',
  'Hospitality & Tourism',
  'Logistics & Supply Chain',
  'Education',
  'Sales & Customer Service',
];

export function getCategoryTranslationKeys(category: string): {
  titleKey: string;
  descKey: string;
} {
  switch (category) {
    case 'IT & Software':
      return { titleKey: 'common:categories.it', descKey: 'common:categories.itDesc' };
    case 'Marketing & Communications':
    case 'Marketing':
      return {
        titleKey: 'common:categories.marketingComm',
        descKey: 'common:categories.mktDesc',
      };
    case 'Business & Administration':
    case 'Business':
      return {
        titleKey: 'common:categories.businessAdmin',
        descKey: 'common:categories.bizDesc',
      };
    case 'Finance & Accounting':
      return {
        titleKey: 'common:categories.finance',
        descKey: 'common:categories.finDesc',
      };
    case 'Graphic Design & Creative Media':
    case 'Design':
      return {
        titleKey: 'common:categories.graphicDesign',
        descKey: 'common:categories.desDesc',
      };
    case 'Engineering':
      return {
        titleKey: 'common:categories.engineering',
        descKey: 'common:categories.engDesc',
      };
    case 'Healthcare & Medical Administration':
      return {
        titleKey: 'common:categories.healthcare',
        descKey: 'common:categories.hlthDesc',
      };
    case 'Hospitality & Tourism':
      return {
        titleKey: 'common:categories.hospitality',
        descKey: 'common:categories.hospDesc',
      };
    case 'Logistics & Supply Chain':
      return {
        titleKey: 'common:categories.logistics',
        descKey: 'common:categories.logDesc',
      };
    case 'Education':
      return {
        titleKey: 'common:categories.education',
        descKey: 'common:categories.eduDesc',
      };
    case 'Sales & Customer Service':
      return {
        titleKey: 'common:categories.sales',
        descKey: 'common:categories.salesDesc',
      };
    default:
      return { titleKey: 'common:categories.other', descKey: 'common:categories.othDesc' };
  }
}

export function getWorkTypeTranslationKey(workType?: string): string {
  if (!workType) return 'common:workType.fulltime';
  const lower = workType.toLowerCase();
  if (lower.includes('co-op') || lower.includes('coop') || lower.includes('cooperative')) {
    return 'common:workType.coop';
  }
  if (lower.includes('intern')) return 'common:workType.internship';
  if (lower.includes('part')) return 'common:workType.parttime';
  if (lower.includes('contract')) return 'common:workType.contract';
  return 'common:workType.fulltime';
}

export function getLocalizedProvinceName(province: string, uiLanguage: string): string {
  if (!province) return '';
  const found = findProvince(province);
  if (!found) return province;
  return getProvinceLabel(found, uiLanguage.toLowerCase().startsWith('en') ? 'en' : 'th');
}

export function getCompanyInitials(companyName?: string, companyLogo?: string): string {
  if (companyLogo && companyLogo.trim().length > 0 && companyLogo.trim().length <= 4) {
    return companyLogo.trim().toUpperCase();
  }
  if (!companyName || !companyName.trim()) return 'JB';
  const cleaned = companyName
    .replace(/\(demo\)/gi, '')
    .replace(/\b(co\.?,?\s*ltd\.?|pcl|corp\.?|inc\.?|company|บริษัท|จำกัด)\b/gi, '')
    .trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }
  return (cleaned.slice(0, 2) || companyName.charAt(0)).toUpperCase();
}
