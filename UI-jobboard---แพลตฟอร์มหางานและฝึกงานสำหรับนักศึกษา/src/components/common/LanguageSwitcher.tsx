import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'segmented' | 'compact';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'th';

  const languages = [
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('jobboard_language', code);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeOption = languages.find((l) => l.code === currentLang) || languages[0];

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center rounded-xl bg-gray-100 p-1 border border-gray-200/80 ${className}`}
        role="group"
        aria-label={t('common:tooltips.selectLanguage')}
      >
        {languages.map((lang) => {
          const isActive = lang.code === currentLang;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-[#6C4CE3] shadow-xs'
                  : 'text-[#73758A] hover:text-[#25243A]'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <Tooltip content={t('common:tooltips.selectLanguage')} disabled={isOpen}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={t('common:tooltips.selectLanguage')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EAF1] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#25243A] hover:border-[#6C4CE3]/40 hover:bg-[#F0ECFF]/40 focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 transition shadow-2xs"
        >
          <span className="text-sm leading-none">{activeOption.flag}</span>
          <span className="hidden sm:inline font-medium">{activeOption.label}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-[#73758A] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#6C4CE3]' : ''
            }`}
          />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-36 origin-top-right rounded-xl border border-[#E9EAF1] bg-white p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#A0A2B3] uppercase tracking-wider">
            {t('common:nav.language')}
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-[#F0ECFF] text-[#6C4CE3] font-semibold'
                    : 'text-[#25243A] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-[#6C4CE3]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
