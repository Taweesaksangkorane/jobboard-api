import i18n from '../i18n';

/**
 * Format a date string or Date object according to the active language:
 * - 'th': Thai calendar with Buddhist Era (พ.ศ.)
 * - 'en': Gregorian calendar (AD / CE)
 */
export const formatDate = (
  dateInput: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateInput) return '-';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'th';
  const locale = currentLang === 'en' ? 'en-US' : 'th-TH';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  };

  return date.toLocaleDateString(locale, defaultOptions);
};

export const formatFullDate = (dateInput: string | number | Date | null | undefined): string => {
  return formatDate(dateInput, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatRelativeTime = (dateInput: string | number | Date | null | undefined): string => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  const isEn = i18n.language?.startsWith('en');
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return isEn ? 'just now' : 'เมื่อสักครู่';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return isEn ? `${diffInMinutes}m ago` : `${diffInMinutes} นาทีที่แล้ว`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return isEn ? `${diffInHours}h ago` : `${diffInHours} ชั่วโมงที่แล้ว`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return isEn ? `${diffInDays}d ago` : `${diffInDays} วันที่แล้ว`;
  }

  return formatDate(date);
};
