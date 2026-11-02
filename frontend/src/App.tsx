import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { EmployerLayout } from './layouts/EmployerLayout';

// Public pages
import { HomePage } from './pages/public/HomePage';
import { JobSearchPage } from './pages/public/JobSearchPage';
import { JobDetailsPage } from './pages/public/JobDetailsPage';
import { DemoAccessPage } from './pages/public/DemoAccessPage';

// Student pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { MyApplicationsPage } from './pages/student/MyApplicationsPage';
import { ApplicationDetailsPage } from './pages/student/ApplicationDetailsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { MySkillsPage } from './pages/student/MySkillsPage';
import { NotificationsPage } from './pages/student/NotificationsPage';

// Employer pages
import { EmployerDashboardPage } from './pages/employer/EmployerDashboardPage';
import { ManageJobsPage } from './pages/employer/ManageJobsPage';
import { CreateJobPage } from './pages/employer/CreateJobPage';
import { EditJobPage } from './pages/employer/EditJobPage';
import { ApplicantsPage } from './pages/employer/ApplicantsPage';
import { ApplicantReviewPage } from './pages/employer/ApplicantReviewPage';
import { CompanyProfilePage } from './pages/employer/CompanyProfilePage';

// 404 NotFound
const NotFoundPage = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
    <div className="rounded-3xl border border-[#E9EAF1] bg-white p-12 shadow-sm max-w-md">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl font-bold text-[#6C4CE3]">
        404
      </div>
      <h1 className="text-xl font-bold text-[#25243A] mb-2">ไม่พบหน้าที่คุณต้องการ</h1>
      <p className="text-xs text-[#73758A] mb-6 leading-relaxed">
        หน้านี้อาจถูกย้าย ลบ หรือที่อยู่ URL ไม่ถูกต้อง กรุณากลับสู่หน้าหลัก
      </p>
      <Link
        to="/"
        className="inline-flex rounded-xl bg-[#6C4CE3] px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5638C5]"
      >
        กลับสู่หน้าแรก
      </Link>
    </div>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobSearchPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/login" element={<DemoAccessPage />} />
              <Route path="/register" element={<DemoAccessPage />} />
            </Route>

            {/* Student Protected Routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboardPage />} />
              <Route path="applications" element={<MyApplicationsPage />} />
              <Route path="applications/:id" element={<ApplicationDetailsPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
              <Route path="skills" element={<MySkillsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            {/* Employer Protected Routes */}
            <Route path="/employer" element={<EmployerLayout />}>
              <Route index element={<Navigate to="/employer/dashboard" replace />} />
              <Route path="dashboard" element={<EmployerDashboardPage />} />
              <Route path="jobs" element={<ManageJobsPage />} />
              <Route path="jobs/create" element={<CreateJobPage />} />
              <Route path="jobs/:id/edit" element={<EditJobPage />} />
              <Route path="applicants" element={<ApplicantsPage />} />
              <Route path="applicants/:applicationId" element={<ApplicantReviewPage />} />
              <Route path="profile" element={<CompanyProfilePage />} />
            </Route>

            {/* Catch-all */}
            <Route element={<PublicLayout />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </ErrorBoundary>
  );
}
