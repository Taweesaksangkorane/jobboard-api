import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import {
  MapPin,
  ChevronDown,
  Search,
  Check,
  X,
  Globe2,
  ArrowUpDown,
} from 'lucide-react';
import {
  THAI_PROVINCES,
  Province,
  ALL_PROVINCES_VALUE,
  TOTAL_PROVINCES,
} from '../../constants/provinces';
import { Tooltip } from './Tooltip';

export interface ProvinceSelectProps {
  value: string;
  onChange: (value: string) => void;
  showAllOption?: boolean;
  allOptionLabel?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'form' | 'compact' | 'filter';
  id?: string;
}

type SortMode = 'default' | 'en-asc' | 'th-desc';
type PopoverPlacement = 'bottom' | 'top';

const VIEWPORT_MARGIN = 12;
const POPOVER_GAP = 6;
const MAX_POPOVER_HEIGHT = 320;
const MIN_SPACE_BELOW_PREFERRED = 220;

export const ProvinceSelect: React.FC<ProvinceSelectProps> = ({
  value,
  onChange,
  showAllOption = true,
  allOptionLabel,
  placeholder,
  label,
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  variant = 'form',
  id,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('en') ? 'en' : 'th';

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [placement, setPlacement] = useState<PopoverPlacement>('bottom');

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const defaultAllLabel = allOptionLabel || t('provinces.all', 'ทุกจังหวัด');
  const defaultPlaceholder = placeholder || t('provinces.all', 'เลือกจังหวัด...');

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  }, []);

  // Current selected province object
  const selectedProvince = useMemo(() => {
    if (!value || value === ALL_PROVINCES_VALUE) return null;
    return (
      THAI_PROVINCES.find(
        (p) =>
          p.nameTh === value ||
          p.nameEn.toLowerCase() === value.toLowerCase() ||
          p.id.toLowerCase() === value.toLowerCase()
      ) || null
    );
  }, [value]);

  // Filtered and sorted list based on search query & sortMode
  const filteredProvinces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matched = !q
      ? [...THAI_PROVINCES]
      : THAI_PROVINCES.filter(
          (p) =>
            p.nameTh.toLowerCase().includes(q) ||
            p.nameEn.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q)
        );

    if (sortMode === 'en-asc') {
      matched.sort((a, b) => a.nameEn.localeCompare(b.nameEn, 'en'));
    } else if (sortMode === 'th-desc') {
      matched.sort((a, b) => b.nameTh.localeCompare(a.nameTh, 'th'));
    }

    return matched;
  }, [searchQuery, sortMode]);

  // Total items in dropdown (including "All" if applicable)
  const totalOptions = useMemo(() => {
    const list: Array<{ isAll: boolean; province?: Province }> = [];
    if (showAllOption && !searchQuery.trim()) {
      list.push({ isAll: true });
    }
    filteredProvinces.forEach((p) => {
      list.push({ isAll: false, province: p });
    });
    return list;
  }, [showAllOption, searchQuery, filteredProvinces]);

  // Compute floating coordinates from trigger's bounding rect and apply CSS custom properties
  const updatePosition = useCallback(() => {
    const triggerEl = triggerButtonRef.current;
    const dropdownEl = dropdownRef.current;
    if (!triggerEl || !dropdownEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const vh = window.innerHeight;

    // Close if selector scrolled out of visible area (or underneath sticky top navbar)
    if (rect.bottom <= 56 || rect.top >= vh - 24) {
      closeDropdown();
      return;
    }

    // Width: ~320px on desktop (or wider if selector itself is wider), constrained cleanly on mobile
    const desiredWidth =
      vw >= 640
        ? Math.max(rect.width, 320)
        : Math.max(rect.width, Math.min(320, vw - VIEWPORT_MARGIN * 2));
    const finalWidth = Math.min(desiredWidth, vw - VIEWPORT_MARGIN * 2);

    // Align left edge with selector, clamped inside viewport boundaries
    let left = rect.left;
    if (left + finalWidth > vw - VIEWPORT_MARGIN) {
      left = vw - finalWidth - VIEWPORT_MARGIN;
    }
    if (left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN;
    }

    const spaceBelow = vh - rect.bottom - POPOVER_GAP - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - POPOVER_GAP - VIEWPORT_MARGIN;

    const shouldPlaceAbove =
      spaceBelow < MIN_SPACE_BELOW_PREFERRED && spaceAbove > spaceBelow;

    dropdownEl.style.setProperty('--province-popover-left', `${Math.round(left)}px`);
    dropdownEl.style.setProperty('--province-popover-width', `${Math.round(finalWidth)}px`);

    if (shouldPlaceAbove) {
      const bottomOffset = vh - rect.top + POPOVER_GAP;
      const availableMaxH = Math.max(160, Math.min(MAX_POPOVER_HEIGHT, spaceAbove));
      dropdownEl.setAttribute('data-placement', 'top');
      dropdownEl.style.setProperty('--province-popover-bottom', `${Math.round(bottomOffset)}px`);
      dropdownEl.style.setProperty('--province-popover-max-h', `${Math.round(availableMaxH)}px`);
      setPlacement((prev) => (prev === 'top' ? prev : 'top'));
    } else {
      const topOffset = rect.bottom + POPOVER_GAP;
      const availableMaxH = Math.max(160, Math.min(MAX_POPOVER_HEIGHT, spaceBelow));
      dropdownEl.setAttribute('data-placement', 'bottom');
      dropdownEl.style.setProperty('--province-popover-top', `${Math.round(topOffset)}px`);
      dropdownEl.style.setProperty('--province-popover-max-h', `${Math.round(availableMaxH)}px`);
      setPlacement((prev) => (prev === 'bottom' ? prev : 'bottom'));
    }
  }, [closeDropdown]);

  // Synchronously position before paint and subscribe to scroll / resize
  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScroll = (event: Event) => {
      // Ignore internal scrolling inside the province list itself
      if (listRef.current && event.target === listRef.current) {
        return;
      }
      updatePosition();
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Outside click & Escape key listeners (checks both trigger container and portaled dropdown)
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const insideTrigger = containerRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);

      if (!insideTrigger && !insideDropdown) {
        closeDropdown();
      }
    };

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDropdown();
        triggerButtonRef.current?.focus({ preventScroll: true });
      }
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside, { passive: true });
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isOpen, closeDropdown]);

  // Focus search input on open without scrolling the page, and scroll selected option inside list
  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus({ preventScroll: true });

      const listEl = listRef.current;
      if (listEl && selectedProvince) {
        const selectedOption = listEl.querySelector(
          '[aria-selected="true"]'
        ) as HTMLElement | null;
        if (selectedOption) {
          const itemTop = selectedOption.offsetTop;
          const itemHeight = selectedOption.offsetHeight;
          listEl.scrollTop = Math.max(
            0,
            itemTop - listEl.clientHeight / 2 + itemHeight / 2
          );
        }
      }
    }, 20);

    return () => window.clearTimeout(timer);
  }, [isOpen, selectedProvince]);

  // Keep highlighted option visible strictly inside listRef (never scrolling the document)
  useEffect(() => {
    const listEl = listRef.current;
    if (highlightedIndex < 0 || !listEl) return;

    const activeEl = listEl.children[highlightedIndex] as HTMLElement | undefined;
    if (!activeEl) return;

    const itemTop = activeEl.offsetTop;
    const itemBottom = itemTop + activeEl.offsetHeight;
    const viewTop = listEl.scrollTop;
    const viewBottom = viewTop + listEl.clientHeight;

    if (itemTop < viewTop) {
      listEl.scrollTop = itemTop;
    } else if (itemBottom > viewBottom) {
      listEl.scrollTop = itemBottom - listEl.clientHeight;
    }
  }, [highlightedIndex]);

  const handleSelect = (provNameTh: string, e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onChange(provNameTh);
    closeDropdown();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      setHighlightedIndex((prev) =>
        prev < totalOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : totalOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (highlightedIndex >= 0 && highlightedIndex < totalOptions.length) {
        const item = totalOptions[highlightedIndex];
        if (item.isAll) {
          handleSelect(ALL_PROVINCES_VALUE);
        } else if (item.province) {
          handleSelect(item.province.nameTh);
        }
      } else if (totalOptions.length === 1) {
        const onlyItem = totalOptions[0];
        if (onlyItem.isAll) {
          handleSelect(ALL_PROVINCES_VALUE);
        } else if (onlyItem.province) {
          handleSelect(onlyItem.province.nameTh);
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeDropdown();
    }
  };

  const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showAllOption) {
      onChange(ALL_PROVINCES_VALUE);
    } else {
      onChange('');
    }
  };

  const handleToggleSort = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSortMode((prev) => {
      if (prev === 'default') return 'en-asc';
      if (prev === 'en-asc') return 'th-desc';
      return 'default';
    });
  };

  const getSortLabel = () => {
    if (sortMode === 'en-asc') return 'A–Z';
    if (sortMode === 'th-desc') return 'ฮ–ก';
    return currentLang === 'en' ? 'Default (ก–ฮ)' : 'ก–ฮ';
  };

  // Display label on trigger button
  const getTriggerDisplay = () => {
    if (value === ALL_PROVINCES_VALUE || (!value && showAllOption)) {
      return (
        <span className="flex items-center gap-2 text-[#25243A] font-medium truncate">
          <Globe2 className="h-3.5 w-3.5 text-[#6C4CE3] shrink-0" />
          <span className="truncate">{defaultAllLabel}</span>
        </span>
      );
    }

    if (selectedProvince) {
      return (
        <span className="flex items-center gap-1.5 text-[#25243A] font-medium truncate">
          <span className="truncate">
            {currentLang === 'en'
              ? selectedProvince.nameEn
              : selectedProvince.nameTh}
          </span>
          <span className="text-xs text-[#A0A2B3] hidden sm:inline">
            ({currentLang === 'en'
              ? selectedProvince.nameTh
              : selectedProvince.nameEn})
          </span>
        </span>
      );
    }

    if (value) {
      return <span className="text-[#25243A] font-medium truncate">{value}</span>;
    }

    return (
      <span className="text-[#A0A2B3] truncate">{defaultPlaceholder}</span>
    );
  };

  const isSelectedActive = (provTh: string): boolean => {
    return Boolean(
      value === provTh ||
        (selectedProvince && selectedProvince.nameTh === provTh)
    );
  };

  const hasSpecificSelection = Boolean(
    value && value !== ALL_PROVINCES_VALUE && value !== ''
  );

  // Trigger button styling depending on variant
  const getButtonStyles = () => {
    if (variant === 'compact') {
      return `w-full flex items-center justify-between gap-2 rounded-xl border border-transparent bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-left transition hover:bg-gray-100/80 focus:border-[#6C4CE3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 ${
        isOpen ? '!border-[#6C4CE3] !bg-white ring-2 ring-[#6C4CE3]/20' : ''
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`;
    }

    if (variant === 'filter') {
      return `w-full flex items-center justify-between gap-2 rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-xs text-left transition hover:border-purple-200 focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 ${
        isOpen ? '!border-[#6C4CE3] ring-2 ring-[#6C4CE3]/20' : ''
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`;
    }

    // Default 'form' variant
    return `w-full flex items-center justify-between gap-2 rounded-xl border ${
      error
        ? 'border-[#E05252] bg-red-50/20'
        : isOpen
          ? 'border-[#6C4CE3] ring-2 ring-[#6C4CE3]/20'
          : 'border-[#E9EAF1] hover:border-purple-300'
    } bg-white px-3.5 py-2.5 text-sm text-left transition focus:outline-none ${
      disabled ? 'bg-gray-100 cursor-not-allowed text-[#A0A2B3]' : 'cursor-pointer'
    }`;
  };

  const dropdownOverlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          data-placement={placement}
          initial={{
            opacity: 0,
            scale: 0.98,
            y: placement === 'top' ? 6 : -6,
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: 0.98,
            y: placement === 'top' ? 4 : -4,
          }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          className="province-popover-floating flex flex-col overflow-hidden rounded-[14px] border border-[#6C4CE3]/25 bg-white shadow-[0_14px_38px_-6px_rgba(37,36,58,0.16),0_4px_14px_-2px_rgba(108,76,227,0.1)] ring-1 ring-[#6C4CE3]/10"
        >
          {/* Search & Controls Header */}
          <div className="shrink-0 border-b border-[#E9EAF1] bg-[#F8F9FC]/85 p-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A2B3]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={t(
                  'provinces.searchPlaceholder',
                  'พิมพ์ค้นหาจังหวัด (เช่น กรุงเทพ, เชียงใหม่)...'
                )}
                className="w-full rounded-xl border border-[#E9EAF1] bg-white py-2 pl-9 pr-8 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
              />
              {searchQuery && (
                <Tooltip content={t('common:tooltips.clearSelection')}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSearchQuery('');
                      searchInputRef.current?.focus({ preventScroll: true });
                    }}
                    aria-label={t('common:tooltips.clearSelection')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#A0A2B3] hover:text-[#25243A] cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Tooltip>
              )}
            </div>

            {/* Province count & sorting controls */}
            <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[11px] text-[#73758A]">
              <span className="truncate">
                {searchQuery.trim()
                  ? `${t('provinces.found', 'พบ')} ${filteredProvinces.length} ${t('provinces.unit', 'จังหวัด')}`
                  : `${t('provinces.allProvincesCount', 'ทั้งหมด')} ${TOTAL_PROVINCES} ${t('provinces.unit', 'จังหวัด')}`}
              </span>

              <button
                type="button"
                onClick={handleToggleSort}
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#E9EAF1] bg-white px-2 py-0.5 text-[10px] font-medium text-[#25243A] transition hover:border-[#6C4CE3]/40 hover:text-[#6C4CE3] cursor-pointer"
              >
                <ArrowUpDown className="h-2.5 w-2.5 text-[#6C4CE3]" />
                <span>{getSortLabel()}</span>
              </button>
            </div>
          </div>

          {/* Scrollable Province List */}
          <ul
            ref={listRef}
            role="listbox"
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-1.5 space-y-0.5 text-xs focus:outline-none"
          >
            {/* "All Provinces" option if enabled and no query */}
            {showAllOption && !searchQuery.trim() && (
              <li
                role="option"
                aria-selected={value === ALL_PROVINCES_VALUE || !value}
                onClick={(e) => handleSelect(ALL_PROVINCES_VALUE, e)}
                onMouseEnter={() => setHighlightedIndex(0)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition ${
                  value === ALL_PROVINCES_VALUE || !value
                    ? 'bg-[#F0ECFF] text-[#6C4CE3] font-semibold'
                    : highlightedIndex === 0
                      ? 'bg-purple-50/70 text-[#25243A]'
                      : 'text-[#25243A] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-[#6C4CE3]">
                    <Globe2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{defaultAllLabel}</div>
                    <div className="text-[10px] text-[#73758A] truncate">
                      {t('common:provinces.allCoverage')}
                    </div>
                  </div>
                </div>
                {(value === ALL_PROVINCES_VALUE || !value) && (
                  <Check className="h-4 w-4 text-[#6C4CE3] shrink-0 ml-2" />
                )}
              </li>
            )}

            {/* All 77 Provinces */}
            {filteredProvinces.map((prov, index) => {
              const optionIndex =
                showAllOption && !searchQuery.trim() ? index + 1 : index;
              const isSelected = isSelectedActive(prov.nameTh);
              const isHighlighted = highlightedIndex === optionIndex;

              return (
                <li
                  key={prov.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={(e) => handleSelect(prov.nameTh, e)}
                  onMouseEnter={() => setHighlightedIndex(optionIndex)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#F0ECFF] text-[#6C4CE3] font-semibold'
                      : isHighlighted
                        ? 'bg-purple-50/70 text-[#25243A]'
                        : 'text-[#25243A] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin
                      className={`h-3.5 w-3.5 shrink-0 ${
                        isSelected ? 'text-[#6C4CE3]' : 'text-[#A0A2B3]'
                      }`}
                    />
                    <div className="min-w-0 truncate">
                      <div className="font-medium truncate">
                        {currentLang === 'en' ? prov.nameEn : prov.nameTh}
                      </div>
                      <div className="text-[10px] text-[#73758A] truncate">
                        {currentLang === 'en' ? prov.nameTh : prov.nameEn}
                        {prov.region && (
                          <span className="ml-1.5 text-[9px] px-1 py-0.2 bg-gray-100 rounded text-[#73758A]">
                            {prov.region}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="h-4 w-4 text-[#6C4CE3] shrink-0 ml-2" />
                  )}
                </li>
              );
            })}

            {/* Empty State */}
            {filteredProvinces.length === 0 && (
              <li className="py-8 px-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#73758A] mb-2">
                  <MapPin className="h-5 w-5 text-[#A0A2B3]" />
                </div>
                <p className="text-xs font-semibold text-[#25243A]">
                  {t('provinces.notFound', 'ไม่พบจังหวัดที่ค้นหา')}
                </p>
                <p className="mt-1 text-[11px] text-[#73758A]">
                  &ldquo;{searchQuery}&rdquo;{' '}
                  {t(
                    'provinces.notFoundDesc',
                    'กรุณาลองพิมพ์ชื่อภาษาไทยหรืออังกฤษ'
                  )}
                </p>
              </li>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Optional Form Label */}
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#25243A]"
        >
          {label}
          {required && <span className="text-[#E05252] ml-1">*</span>}
        </label>
      )}

      {/* Main Trigger Button */}
      <div className="relative">
        {variant === 'compact' && (
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A2B3]" />
        )}

        <button
          ref={triggerButtonRef}
          type="button"
          id={id}
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault();
            if (!disabled) {
              setIsOpen((prev) => !prev);
            }
          }}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={getButtonStyles()}
        >
          <div className="flex items-center gap-2 truncate flex-1 min-w-0">
            {variant !== 'compact' && (
              <MapPin className="h-4 w-4 text-[#6C4CE3] shrink-0" />
            )}
            <div className="truncate flex-1 min-w-0">{getTriggerDisplay()}</div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {hasSpecificSelection && !disabled && (
              <Tooltip content={t('common:tooltips.clearSelection')}>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleClear(e);
                    }
                  }}
                  aria-label={t('common:tooltips.clearSelection')}
                  className="p-1 text-[#A0A2B3] hover:text-[#25243A] hover:bg-gray-200/60 rounded-full transition cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              </Tooltip>
            )}
            <ChevronDown
              className={`h-4 w-4 text-[#73758A] transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#6C4CE3]' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Error or Helper text */}
      {error && <p className="mt-1 text-xs text-[#E05252]">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-[#73758A]">{helperText}</p>
      )}

      {/* Floating Popover via React Portal */}
      {typeof document !== 'undefined' &&
        createPortal(dropdownOverlay, document.body)}
    </div>
  );
};
