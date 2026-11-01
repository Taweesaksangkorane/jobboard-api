import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../contexts/AuthContext';
import { Job, JobCategory, JobWorkType } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { LoadingSkeleton, EmptyState, ErrorState, Pagination } from '../../components/common/FeedbackStates';
import { Button } from '../../components/common/Button';
import { ProvinceSelect } from '../../components/common/ProvinceSelect';
import { Tooltip } from '../../components/common/Tooltip';
import {
  PRIMARY_JOB_CATEGORIES,
  getCategoryTranslationKeys,
  getWorkTypeTranslationKey,
} from '../../utils/jobLocalization';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';

function normalizeUrlCategory(cat: string): string {
  if (cat === 'Marketing') return 'Marketing & Communications';
  if (cat === 'Business') return 'Business & Administration';
  if (cat === 'Design') return 'Graphic Design & Creative Media';
  return cat;
}

export const JobSearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isStudent } = useAuth();

  // Filter states initialized from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get('province') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(
    normalizeUrlCategory(searchParams.get('category') || 'all')
  );
  const [selectedWorkType, setSelectedWorkType] = useState(searchParams.get('work_type') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'open');
  const [selectedLang, setSelectedLang] = useState(searchParams.get('lang') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data states
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories: { key: JobCategory; titleKey: string }[] = [
    ...PRIMARY_JOB_CATEGORIES.map((cat) => ({
      key: cat,
      titleKey: getCategoryTranslationKeys(cat).titleKey,
    })),
    { key: 'Other', titleKey: 'common:categories.other' },
  ];

  const workTypes: JobWorkType[] = ['Internship', 'Co-op', 'Full-time', 'Part-time', 'Contract'];

  useEffect(() => {
    if (user?.id && isStudent) {
      applicationService
        .getMyApplications(user.id)
        .then((apps) => {
          setAppliedJobIds(new Set(apps.map((a) => a.job_id)));
        })
        .catch(() => {});
    }
  }, [user?.id, isStudent]);

  // Sync state when URL params change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const prov = searchParams.get('province') || 'all';
    const cat = normalizeUrlCategory(searchParams.get('category') || 'all');
    const workType = searchParams.get('work_type') || 'all';
    const stat = searchParams.get('status') || 'open';
    const lang = searchParams.get('lang') || 'all';
    const sort = searchParams.get('sort') || 'newest';

    setSearchTerm(q);
    setSelectedProvince(prov);
    setSelectedCategory(cat);
    setSelectedWorkType(workType);
    setSelectedStatus(stat);
    setSelectedLang(lang);
    setSortBy(sort);

    fetchJobs({
      q,
      province: prov,
      category: cat,
      work_type: workType,
      status: stat,
      lang,
      sort,
    });
  }, [searchParams]);

  const fetchJobs = async (filters?: {
    q?: string;
    province?: string;
    category?: string;
    work_type?: string;
    status?: string;
    lang?: string;
    sort?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};
      const q = filters?.q ?? searchTerm;
      const prov = filters?.province ?? selectedProvince;
      const cat = filters?.category ?? selectedCategory;
      const workType = filters?.work_type ?? selectedWorkType;
      const stat = filters?.status ?? selectedStatus;
      const lang = filters?.lang ?? selectedLang;
      const sort = filters?.sort ?? sortBy;

      if (q.trim()) params.q = q.trim();
      if (prov && prov !== 'all') params.province = prov;
      if (cat && cat !== 'all') params.category = cat;
      if (workType && workType !== 'all') params.work_type = workType;
      if (stat && stat !== 'all') params.status = stat;
      if (lang && lang !== 'all') params.lang = lang;
      if (sort && sort !== 'newest') params.sort = sort;

      const data = await jobService.getJobs(params);
      setJobs(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const buildSearchParams = (nextSort?: string) => {
    const newParams = new URLSearchParams();
    if (searchTerm.trim()) newParams.append('q', searchTerm.trim());
    if (selectedProvince !== 'all') newParams.append('province', selectedProvince);
    if (selectedCategory !== 'all') newParams.append('category', selectedCategory);
    if (selectedWorkType !== 'all') newParams.append('work_type', selectedWorkType);
    if (selectedStatus !== 'all') newParams.append('status', selectedStatus);
    if (selectedLang !== 'all') newParams.append('lang', selectedLang);
    const effectiveSort = nextSort ?? sortBy;
    if (effectiveSort !== 'newest') newParams.append('sort', effectiveSort);
    return newParams;
  };

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchParams(buildSearchParams());
    setMobileFilterOpen(false);
  };

  const handleSortChange = (nextSort: string) => {
    setSortBy(nextSort);
    setSearchParams(buildSearchParams(nextSort));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProvince('all');
    setSelectedCategory('all');
    setSelectedWorkType('all');
    setSelectedStatus('open');
    setSelectedLang('all');
    setSortBy('newest');
    setSearchParams(new URLSearchParams());
    setMobileFilterOpen(false);
  };

  // Pagination calculation
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const displayedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return jobs.slice(start, start + itemsPerPage);
  }, [jobs, currentPage]);

  const activeFilterCount =
    (selectedProvince !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedWorkType !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' && selectedStatus !== 'open' ? 1 : 0) +
    (selectedLang !== 'all' ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      {/* Province Filter */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#25243A]">
          {t('jobSearch.provinceFilter')}
        </label>
        <ProvinceSelect
          value={selectedProvince}
          onChange={setSelectedProvince}
          variant="filter"
          showAllOption={true}
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#25243A]">
          {t('jobSearch.categoryFilter')}
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-[#25243A] cursor-pointer hover:text-[#6C4CE3]">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'all'}
              onChange={() => setSelectedCategory('all')}
              className="text-[#6C4CE3] focus:ring-[#6C4CE3]"
            />
            <span>{t('categories.all')}</span>
          </label>
          {categories.map((cat) => (
            <label
              key={cat.key}
              className="flex items-center gap-2 text-xs text-[#25243A] cursor-pointer hover:text-[#6C4CE3]"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.key}
                onChange={() => setSelectedCategory(cat.key)}
                className="text-[#6C4CE3] focus:ring-[#6C4CE3]"
              />
              <span>{t(cat.titleKey)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Employment Type Filter */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#25243A]">
          {t('jobSearch.workTypeFilter')}
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-[#25243A] cursor-pointer hover:text-[#6C4CE3]">
            <input
              type="radio"
              name="work_type"
              checked={selectedWorkType === 'all'}
              onChange={() => setSelectedWorkType('all')}
              className="text-[#6C4CE3] focus:ring-[#6C4CE3]"
            />
            <span>{t('workType.all')}</span>
          </label>
          {workTypes.map((wt) => (
            <label
              key={wt}
              className="flex items-center gap-2 text-xs text-[#25243A] cursor-pointer hover:text-[#6C4CE3]"
            >
              <input
                type="radio"
                name="work_type"
                checked={selectedWorkType === wt}
                onChange={() => setSelectedWorkType(wt)}
                className="text-[#6C4CE3] focus:ring-[#6C4CE3]"
              />
              <span>{t(getWorkTypeTranslationKey(wt))}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Posting Language Filter */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#25243A]">
          {t('jobSearch.languageFilter')}
        </label>
        <div className="space-y-1.5">
          {[
            { val: 'all', label: t('jobLanguage.allLanguages') },
            { val: 'both', label: t('jobLanguage.bilingual') },
            { val: 'th', label: t('jobLanguage.thaiOnly') },
            { val: 'en', label: t('jobLanguage.englishOnly') },
          ].map((item) => (
            <label
              key={item.val}
              className="flex items-center gap-2 text-xs text-[#25243A] cursor-pointer hover:text-[#6C4CE3]"
            >
              <input
                type="radio"
                name="posting_lang"
                checked={selectedLang === item.val}
                onChange={() => setSelectedLang(item.val)}
                className="text-[#6C4CE3] focus:ring-[#6C4CE3]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#25243A]">
          {t('jobSearch.statusFilter')}
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-[#25243A] cursor-pointer hover:text-[#6C4CE3]">
            <input
              type="radio"
              name="status"
              checked={selectedStatus === 'open'}
              onChange={() => setSelectedStatus('open')}
              className="text-[#6C4CE3] focus:ring-[#6C4CE3]"
            />
            <span>{t('jobSearch.openOnly')}</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-[#25243A] cursor-pointer hover:text-[#6C4CE3]">
            <input
              type="radio"
              name="status"
              checked={selectedStatus === 'all'}
              onChange={() => setSelectedStatus('all')}
              className="text-[#6C4CE3] focus:ring-[#6C4CE3]"
            />
            <span>{t('jobSearch.allStatus')}</span>
          </label>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#E9EAF1]">
        <Tooltip content={t('common:tooltips.filter')}>
          <Button variant="primary" size="sm" onClick={() => handleApplyFilter()} className="w-full">
            {t('actions.filter')}
          </Button>
        </Tooltip>
        {activeFilterCount > 0 && (
          <Tooltip content={t('common:tooltips.clearFilters')}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              className="w-full text-xs"
            >
              {t('actions.clearFilters')} ({activeFilterCount})
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#25243A]">{t('jobSearch.title')}</h1>
        <p className="mt-1 text-xs text-[#73758A]">
          {t('jobSearch.resultsCount', { count: jobs.length })}
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="mb-8 rounded-2xl border border-[#E9EAF1] bg-white p-3 shadow-xs">
        <form onSubmit={handleApplyFilter} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A2B3]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('jobSearch.searchPlaceholder')}
              className="w-full rounded-xl border border-transparent bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
            />
          </div>
          <div className="flex gap-2">
            <Tooltip content={t('common:tooltips.filter')}>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-initial"
                leftIcon={<SlidersHorizontal className="h-4 w-4 text-[#6C4CE3]" />}
              >
                {t('actions.filter')} {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </Tooltip>
            <Tooltip content={t('common:tooltips.search')}>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="flex-1 sm:flex-initial"
                leftIcon={<Search className="h-4 w-4" />}
              >
                {t('actions.search')}
              </Button>
            </Tooltip>
          </div>
        </form>
      </div>

      {/* Layout Grid: Filters Left + Jobs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[#E9EAF1] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E9EAF1] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#6C4CE3]" />
                <h3 className="text-sm font-bold text-[#25243A]">{t('jobSearch.filterTitle')}</h3>
              </div>
              {activeFilterCount > 0 && (
                <Tooltip content={t('common:tooltips.clearFilters')}>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[11px] text-[#6C4CE3] hover:underline cursor-pointer"
                  >
                    {t('actions.clearFilters')}
                  </button>
                </Tooltip>
              )}
            </div>
            {filterContent}
          </div>
        </div>

        {/* Mobile Filter Drawer / Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
            <div
              className="fixed inset-0 bg-[#25243A]/40 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E9EAF1] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E9EAF1] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#6C4CE3]" />
                  <h3 className="text-base font-bold text-[#25243A]">{t('jobSearch.filterTitle')}</h3>
                </div>
                <Tooltip content={t('common:tooltips.close')}>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    aria-label={t('common:tooltips.close')}
                    className="rounded-lg p-1 text-[#73758A] hover:bg-gray-100 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Tooltip>
              </div>
              {filterContent}
            </div>
          </div>
        )}

        {/* Jobs Listing Right */}
        <div className="lg:col-span-3">
          {/* Results count & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="text-xs text-[#73758A]">
              {t('jobSearch.resultsCount', { count: jobs.length })}
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#73758A] shrink-0" />
              <span className="text-xs font-medium text-[#73758A]">{t('jobSearch.sortBy')}:</span>
              <Tooltip content={t('common:tooltips.filter')}>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  aria-label={t('jobSearch.sortBy')}
                  className="rounded-xl border border-[#E9EAF1] bg-white px-3 py-1.5 text-xs font-medium text-[#25243A] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 cursor-pointer"
                >
                  <option value="newest">{t('jobSearch.sortNewest')}</option>
                  <option value="salary_desc">{t('jobSearch.sortSalaryHigh')}</option>
                  <option value="salary_asc">{t('jobSearch.sortSalaryLow')}</option>
                </select>
              </Tooltip>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchJobs()} />
          ) : displayedJobs.length === 0 ? (
            <EmptyState
              title={t('jobSearch.noResultsTitle')}
              description={t('jobSearch.noResultsDesc')}
              actionText={t('jobSearch.clearAll')}
              onAction={handleClearFilters}
            />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    hasApplied={appliedJobIds.has(job.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
