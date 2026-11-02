import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#25243A]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClasses} overflow-hidden rounded-2xl bg-white shadow-xl transition-all border border-[#E9EAF1]`}
      >
        <div className="flex items-center justify-between border-b border-[#E9EAF1] px-6 py-4">
          <h3 className="text-lg font-semibold text-[#25243A]">{title}</h3>
          <Tooltip content={t('common:tooltips.close')}>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#73758A] hover:bg-gray-100 hover:text-[#25243A] transition"
              aria-label={t('common:tooltips.close')}
            >
              <X className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
        <div className="p-6 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDestructive = false,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const resolvedConfirmLabel = confirmLabel || t('common:actions.confirm');
  const resolvedCancelLabel = cancelLabel || t('common:actions.cancel');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        {isDestructive && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-[#E05252]">
            <AlertTriangle className="h-6 w-6" />
          </div>
        )}
        <p className="text-sm text-[#73758A] leading-relaxed mb-6">{message}</p>
        <div className="flex w-full gap-3 justify-end">
          <Tooltip content={t('common:tooltips.cancel')}>
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
              {resolvedCancelLabel}
            </Button>
          </Tooltip>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {resolvedConfirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
