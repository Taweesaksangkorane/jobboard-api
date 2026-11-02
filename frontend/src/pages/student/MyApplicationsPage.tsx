import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types';
import { ApplicationStatusBadge } from '../../components/common/StatusBadge';
import { Tooltip } from '../../components/common/Tooltip';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../components/common/FeedbackStates';
import { formatDate } from '../../utils/dateFormatter';
import {
  FileText,
  Search,
  Building2,
  MapPin,
  Calendar,
  Filter,
  Eye,
} from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const { t } = useTranslation(['student', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadApplications();
  }, [user?.id]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentId = user?.id;
      if (!studentId) {
        setLoading(false);
        return;
      }
      const data = await applicationService.getMyApplications(studentId);
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !searchTerm.trim() ||
        app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const statusOptions: { value: string; label: string; count: number }[] = [
    { value: 'all', label: t('student:applications.allStatuses'), count: applications.length },
    { value: 'submitted', label: t('common:status.submitted'), count: applications.filter((a) => a.status === 'submitted').length },
    { value: 'reviewing', label: t('common:status.reviewing'), count: applications.filter((a) => a.status === 'reviewing').length },
    { value: 'shortlisted', label: t('common:status.shortlisted'), count: applications.filter((a) => a.status === 'shortlisted').length },
    { value: 'interview', label: t('common:status.interview'), count: applications.filter((a) => a.status === 'interview').length },
    { value: 'accepted', label: t('common:status.accepted'), count: applications.filter((a) => a.status === 'accepted').length },
    { value: 'rejected', label: t('common:status.rejected'), count: applications.filter((a) => a.status === 'rejected').length },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#25243A]">{t('student:applications.title')}</h1>
        <p className="mt-1 text-xs text-[#73758A]">
          {t('student:applications.subtitle')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#E9EAF1] bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A2B3]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('student:applications.searchPlaceholder')}
              className="w-full rounded-xl border border-[#E9EAF1] bg-gray-50 py-2 pl-10 pr-3 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#73758A] shrink-0" />
            <Tooltip content={t('common:tooltips.filter')}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label={t('student:applications.filterStatus')}
                className="rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-xs text-[#25243A] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 cursor-pointer"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.count})
                  </option>
                ))}
              </select>
            </Tooltip>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                statusFilter === opt.value
                  ? 'bg-[#6C4CE3] text-white shadow-xs'
                  : 'bg-gray-100 text-[#73758A] hover:bg-gray-200 hover:text-[#25243A]'
              }`}
            >
              {opt.label} ({opt.count})
            </button>
          ))}
        </div>
      </div>

      {/* Applications Content */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadApplications} />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title={t('student:applications.emptyTitle')}
          description={t('student:applications.emptyDesc')}
          actionText={t('student:applications.applyFirstJob')}
          onAction={() => navigate('/jobs')}
          icon={<FileText className="h-8 w-8 text-[#6C4CE3]" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const formattedDate = formatDate(app.created_at);

            return (
              <div
                key={app.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E9EAF1] bg-white p-5 shadow-xs transition hover:border-[#6C4CE3]/40 hover:shadow-md"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#EDF3FF] px-2 py-0.5 text-[11px] font-medium text-[#4776E6]">
                      {app.category || 'Role'}
                    </span>
                    <ApplicationStatusBadge status={app.status} size="sm" />
                    <span className="text-[11px] text-[#A0A2B3]">
                      ID: {app.id}
                    </span>
                  </div>

                  <Link to={`/student/applications/${app.id}`}>
                    <h3 className="text-base font-bold text-[#25243A] group-hover:text-[#6C4CE3] transition">
                      {app.job_title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#73758A]">
                    <span className="flex items-center gap-1 font-medium text-[#6C4CE3]">
                      <Building2 className="h-3.5 w-3.5" />
                      {app.company_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {app.province} • {app.location}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#A0A2B3]">
                      <Calendar className="h-3.5 w-3.5" />
                      {t('student:dashboard.appliedOn')}: {formattedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Tooltip content={t('common:tooltips.viewJob')}>
                    <Link
                      to={`/student/applications/${app.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9EAF1] bg-white px-4 py-2 text-xs font-semibold text-[#6C4CE3] hover:bg-[#F0ECFF] hover:border-purple-200 transition shadow-2xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t('student:dashboard.viewDetail')}
                    </Link>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
