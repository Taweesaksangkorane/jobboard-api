import React from 'react';
import { useTranslation } from 'react-i18next';
import { Inbox, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-5 w-1/3 rounded-lg bg-gray-200"></div>
              <div className="h-4 w-1/4 rounded-md bg-gray-150"></div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-20 rounded-full bg-gray-100"></div>
                <div className="h-6 w-24 rounded-full bg-gray-100"></div>
                <div className="h-6 w-16 rounded-full bg-gray-100"></div>
              </div>
            </div>
            <div className="h-9 w-24 rounded-xl bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  const { t } = useTranslation();
  const resolvedTitle = title || t('common:feedback.noDataTitle');
  const resolvedDescription = description || t('common:feedback.noDataDesc');

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E9EAF1] bg-white p-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#6C4CE3]">
        {icon || <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-[#25243A] mb-1">{resolvedTitle}</h3>
      <p className="max-w-md text-xs text-[#73758A] leading-relaxed mb-6">{resolvedDescription}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title,
  message,
  onRetry,
}) => {
  const { t } = useTranslation();
  const resolvedTitle = title || t('common:feedback.errorTitle');
  const resolvedMessage = message || t('common:feedback.errorMessage');

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-[#E05252]">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-red-900 mb-1">{resolvedTitle}</h3>
      <p className="max-w-md text-xs text-red-700 leading-relaxed mb-4">{resolvedMessage}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          {t('common:feedback.retry')}
        </Button>
      )}
    </div>
  );
};

export const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Tooltip content={t('common:tooltips.previousPage')} disabled={currentPage === 1}>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9EAF1] bg-white text-[#73758A] transition hover:bg-gray-50 hover:text-[#25243A] disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={t('common:tooltips.previousPage')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </Tooltip>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-medium transition ${
            currentPage === page
              ? 'bg-[#6C4CE3] text-white shadow-xs'
              : 'border border-[#E9EAF1] bg-white text-[#73758A] hover:bg-gray-50 hover:text-[#25243A]'
          }`}
        >
          {page}
        </button>
      ))}

      <Tooltip content={t('common:tooltips.nextPage')} disabled={currentPage === totalPages}>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9EAF1] bg-white text-[#73758A] transition hover:bg-gray-50 hover:text-[#25243A] disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={t('common:tooltips.nextPage')}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </Tooltip>
    </div>
  );
};
