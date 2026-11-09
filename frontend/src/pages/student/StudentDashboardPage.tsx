import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { Application, Job } from '../../types';
import { ApplicationStatusBadge } from '../../components/common/StatusBadge';
import { JobCard } from '../../components/jobs/JobCard';
import { Tooltip } from '../../components/common/Tooltip';
import { LoadingSkeleton, ErrorState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/dateFormatter';
import {
  FileText,
  Clock,
  Eye,
  Award,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  MapPin,
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { t } = useTranslation(['student', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentId = user?.id;
      if (!studentId) {
        setLoading(false);
        return;
      }

      const [userApps, allJobs] = await Promise.all([
        applicationService.getMyApplications().catch(() => []),
        jobService.getJobs({ status: 'open' }).catch(() => []),
      ]);

      setApplications(userApps);
      const appliedIds = new Set(userApps.map((a) => a.job_id));
      const unapplied = allJobs.filter((j) => !appliedIds.has(j.id));
      setRecommendedJobs(unapplied.slice(0, 4));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  // Compute Statistics
  const totalApplications = applications.length;
  const submittedCount = applications.filter((a) => a.status === 'submitted').length;
  const reviewingCount = applications.filter((a) => a.status === 'reviewing').length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'shortlisted' || a.status === 'interview'
  ).length;
  const acceptedCount = applications.filter((a) => a.status === 'accepted').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6C4CE3] to-[#4776E6] p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span>{t('student:dashboard.badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {t('student:dashboard.welcome', { name: user?.name || 'Student' })}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
            {t('student:dashboard.subtitle')}
          </p>

          {/* Quick Search inside banner */}
          <form onSubmit={handleQuickSearch} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder={t('student:dashboard.searchPlaceholder')}
                className="w-full rounded-xl bg-white/95 py-2.5 pl-10 pr-3 text-xs text-[#25243A] placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <Tooltip content={t('common:tooltips.search')}>
              <button
                type="submit"
                className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#6C4CE3] hover:bg-purple-50 transition cursor-pointer"
              >
                {t('student:dashboard.searchBtn')}
              </button>
            </Tooltip>
          </form>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#25243A]">{t('student:dashboard.recentApplications')}</h2>
          <Link
            to="/student/applications"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6C4CE3] hover:underline"
          >
            {t('student:dashboard.viewAll')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Total */}
          <div className="rounded-2xl border border-[#E9EAF1] bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#73758A] mb-2">
              <span>{t('student:dashboard.stats.all')}</span>
              <FileText className="h-4 w-4 text-[#6C4CE3]" />
            </div>
            <div className="text-2xl font-bold text-[#25243A]">{totalApplications}</div>
          </div>

          {/* Submitted */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#4776E6] mb-2">
              <span>{t('student:dashboard.stats.submitted')}</span>
              <Clock className="h-4 w-4 text-[#4776E6]" />
            </div>
            <div className="text-2xl font-bold text-[#4776E6]">{submittedCount}</div>
          </div>

          {/* Reviewing */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#D97706] mb-2">
              <span>{t('student:dashboard.stats.reviewing')}</span>
              <Eye className="h-4 w-4 text-[#D97706]" />
            </div>
            <div className="text-2xl font-bold text-[#D97706]">{reviewingCount}</div>
          </div>

          {/* Shortlisted */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#6C4CE3] mb-2">
              <span>{t('student:dashboard.stats.shortlisted')}</span>
              <Award className="h-4 w-4 text-[#6C4CE3]" />
            </div>
            <div className="text-2xl font-bold text-[#6C4CE3]">{shortlistedCount}</div>
          </div>

          {/* Accepted / Rejected */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#16A36A] mb-2">
              <span>{t('student:dashboard.stats.accepted')}</span>
              <CheckCircle2 className="h-4 w-4 text-[#16A36A]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#16A36A]">{acceptedCount}</span>
              {rejectedCount > 0 && (
                <span className="text-xs text-[#E05252]">/ {rejectedCount}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Applications Quick Table / List */}
      {applications.length > 0 && (
        <div className="rounded-2xl border border-[#E9EAF1] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#25243A]">{t('student:dashboard.recentApplications')}</h3>
            </div>
            <Link
              to="/student/applications"
              className="text-xs font-semibold text-[#6C4CE3] hover:underline"
            >
              {t('student:dashboard.viewAll')} ({applications.length})
            </Link>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4 transition hover:bg-purple-50/30"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#25243A]">
                      {app.job_title || 'Position'}
                    </span>
                    <ApplicationStatusBadge status={app.status} size="sm" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#73758A]">
                    <span className="flex items-center gap-1 font-medium text-[#6C4CE3]">
                      <Building2 className="h-3 w-3" />
                      {app.company_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {app.province}
                    </span>
                    <span className="text-[11px] text-[#A0A2B3]">
                      {t('student:dashboard.appliedOn')}: {formatDate(app.created_at)}
                    </span>
                  </div>
                </div>

                <Tooltip content={t('common:tooltips.viewJob')}>
                  <Link
                    to={`/student/applications/${app.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E9EAF1] bg-white px-3 py-1.5 text-xs font-semibold text-[#6C4CE3] hover:bg-gray-50 self-start sm:self-center transition"
                  >
                    {t('student:dashboard.viewDetail')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Jobs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4CE3] mb-0.5">
              <TrendingUp className="h-4 w-4" />
              <span>{t('student:dashboard.recommendedJobs')}</span>
            </div>
            <h2 className="text-lg font-bold text-[#25243A]">{t('student:dashboard.recommendedSubtitle')}</h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4CE3] hover:underline"
          >
            {t('student:dashboard.exploreMore')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};
