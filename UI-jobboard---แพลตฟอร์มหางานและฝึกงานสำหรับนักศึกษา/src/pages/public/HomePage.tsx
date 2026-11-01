import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jobService } from '../../services/jobService';
import { Job, JobCategory } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { LoadingSkeleton, ErrorState } from '../../components/common/FeedbackStates';
import { ProvinceSelect } from '../../components/common/ProvinceSelect';
import { Tooltip } from '../../components/common/Tooltip';
import { getCategoryTranslationKeys } from '../../utils/jobLocalization';
import {
  Search,
  Briefcase,
  Code2,
  Cpu,
  Megaphone,
  Calculator,
  Palette,
  HeartPulse,
  Compass,
  Truck,
  Headset,
  CheckCircle,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [totalOpenJobs, setTotalOpenJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobs({ status: 'open' });
      setTotalOpenJobs(data.length);
      setFeaturedJobs(data.slice(0, 9));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('q', searchTerm.trim());
    if (selectedProvince !== 'all') params.append('province', selectedProvince);
    navigate(`/jobs?${params.toString()}`);
  };

  const categories: { name: JobCategory; icon: React.ReactNode }[] = [
    { name: 'IT & Software', icon: <Code2 className="h-6 w-6" /> },
    { name: 'Marketing & Communications', icon: <Megaphone className="h-6 w-6" /> },
    { name: 'Business & Administration', icon: <Briefcase className="h-6 w-6" /> },
    { name: 'Finance & Accounting', icon: <Calculator className="h-6 w-6" /> },
    { name: 'Graphic Design & Creative Media', icon: <Palette className="h-6 w-6" /> },
    { name: 'Engineering', icon: <Cpu className="h-6 w-6" /> },
    { name: 'Healthcare & Medical Administration', icon: <HeartPulse className="h-6 w-6" /> },
    { name: 'Hospitality & Tourism', icon: <Compass className="h-6 w-6" /> },
    { name: 'Logistics & Supply Chain', icon: <Truck className="h-6 w-6" /> },
    { name: 'Education', icon: <GraduationCap className="h-6 w-6" /> },
    { name: 'Sales & Customer Service', icon: <Headset className="h-6 w-6" /> },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-[#F0ECFF]/30 to-[#F8F9FC] pt-12 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Search Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-[#F0ECFF] px-3.5 py-1 text-xs font-semibold text-[#6C4CE3]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t('home.badge')}</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#25243A] sm:text-4xl lg:text-5xl leading-tight">
                {t('home.heroTitleLine1')} <br />
                <span className="text-[#6C4CE3]">{t('home.heroTitleLine2')}</span>
              </h1>

              <p className="text-base text-[#73758A] leading-relaxed max-w-2xl">
                {t('home.heroSubtitle')}
              </p>

              {/* Search Bar Card */}
              <div className="rounded-2xl border border-[#E9EAF1] bg-white p-3 shadow-lg shadow-purple-900/5">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A2B3]" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('home.searchPlaceholder')}
                      className="w-full rounded-xl border border-transparent bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
                    />
                  </div>

                  <div className="sm:w-60">
                    <ProvinceSelect
                      value={selectedProvince}
                      onChange={setSelectedProvince}
                      variant="compact"
                      showAllOption={true}
                    />
                  </div>

                  <Tooltip content={t('common:tooltips.search')}>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6C4CE3] px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#5638C5] transition cursor-pointer"
                    >
                      <Search className="h-4 w-4" />
                      {t('actions.search')}
                    </button>
                  </Tooltip>
                </form>
              </div>

              {/* Quick Popular Keywords */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#73758A]">
                <span className="font-medium text-[#25243A]">{t('home.popularSearches')}</span>
                {['React', 'UX/UI', 'Marketing', 'Data Analyst', 'Internship'].map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => {
                      setSearchTerm(keyword);
                      navigate(`/jobs?q=${encodeURIComponent(keyword)}`);
                    }}
                    className="rounded-lg bg-white border border-[#E9EAF1] px-2.5 py-1 text-xs text-[#73758A] hover:border-[#6C4CE3] hover:text-[#6C4CE3] transition cursor-pointer"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Visual Illustration Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="overflow-hidden rounded-3xl border border-[#E9EAF1] bg-white p-6 shadow-xl">
                  {/* Visual UI mockup */}
                  <div className="flex items-center justify-between border-b border-[#E9EAF1] pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C4CE3] text-white">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#25243A]">JobBoard Campus Portal</h4>
                        <p className="text-[11px] text-[#73758A]">Connect Students & Top Employers</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-[#16A36A]">
                      Live
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-indigo-100 bg-[#F0ECFF]/60 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#5638C5]">Recent Application Status</span>
                        <span className="text-[11px] font-medium text-[#6C4CE3]">Today</span>
                      </div>
                      <p className="mt-1 text-xs text-[#25243A] font-medium">
                        TechForward Solutions updated your application to Shortlisted
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-3 text-center">
                        <div className="text-lg font-bold text-[#6C4CE3]">500+</div>
                        <div className="text-[11px] text-[#73758A]">Active Positions</div>
                      </div>
                      <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-3 text-center">
                        <div className="text-lg font-bold text-[#4776E6]">150+</div>
                        <div className="text-[11px] text-[#73758A]">Verified Employers</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                      <CheckCircle className="h-5 w-5 text-[#16A36A] shrink-0" />
                      <div className="text-xs text-emerald-900">
                        <span className="font-semibold">Free for all students:</span>{' '}
                        Apply to unlimited job openings with real-time tracking
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#25243A]">{t('home.categoriesTitle')}</h2>
            <p className="mt-1 text-sm text-[#73758A]">{t('home.categoriesSubtitle')}</p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4CE3] hover:text-[#5638C5]"
          >
            {t('home.viewAllJobs')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const { titleKey, descKey } = getCategoryTranslationKeys(cat.name);
            return (
              <Link
                key={cat.name}
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center rounded-2xl border border-[#E9EAF1] bg-white p-5 text-center transition-all duration-150 hover:-translate-y-1 hover:border-[#6C4CE3]/50 hover:shadow-md"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6C4CE3] transition group-hover:bg-[#6C4CE3] group-hover:text-white">
                  {cat.icon}
                </div>
                <h3 className="text-xs font-bold text-[#25243A] group-hover:text-[#6C4CE3] transition">
                  {t(titleKey)}
                </h3>
                <p className="mt-1 text-[11px] text-[#73758A] line-clamp-1">{t(descKey)}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4CE3] mb-1">
              <Briefcase className="h-4 w-4" />
              <span>{t('home.featuredJobsTitle')}</span>
            </div>
            <h2 className="text-2xl font-bold text-[#25243A]">{t('home.featuredJobsSubtitle')}</h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EAF1] bg-white px-4 py-2 text-xs font-semibold text-[#25243A] hover:bg-gray-50 transition shadow-2xs"
          >
            {t('home.viewAllJobs')} ({totalOpenJobs || featuredJobs.length})
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadJobs} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="border-y border-[#E9EAF1] bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-[#25243A]">{t('home.howItWorksTitle')}</h2>
            <p className="mt-2 text-sm text-[#73758A]">
              {t('home.howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: t('home.step1Title'),
                description: t('home.step1Desc'),
              },
              {
                step: '02',
                title: t('home.step2Title'),
                description: t('home.step2Desc'),
              },
              {
                step: '03',
                title: t('home.step3Title'),
                description: t('home.step3Desc'),
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-[#E9EAF1] bg-[#F8F9FC] p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4CE3] text-base font-bold text-white shadow-xs">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-[#25243A] mb-2">{item.title}</h3>
                <p className="text-xs text-[#73758A] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#6C4CE3] to-[#4776E6] p-8 sm:p-12 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold">{t('home.employerCtaTitle')}</h2>
              <p className="text-purple-100 text-sm max-w-xl">
                {t('home.employerCtaSubtitle')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#6C4CE3] shadow-md hover:bg-gray-50 transition"
              >
                {t('nav.register')}
              </Link>
              <Link
                to="/employer/dashboard"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition backdrop-blur-xs"
              >
                {t('home.employerCtaBtn')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
