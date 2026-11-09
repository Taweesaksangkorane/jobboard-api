import React, { FormEvent, useState } from 'react';
import { BriefcaseBusiness, LockKeyhole } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function DemoAccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      const requestedPath = (location.state as { from?: string } | null)?.from;
      navigate(requestedPath || (user.role === 'student' ? '/student/dashboard' : '/employer/dashboard'), { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-6 py-12">
      <div className="w-full rounded-3xl border border-[#E9EAF1] bg-white p-8 shadow-sm">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#6C4CE3]"><LockKeyhole className="h-6 w-6" /></div>
        <h1 className="text-2xl font-bold text-[#25243A]">Sign in to JobBoard</h1>
        <p className="mt-2 text-sm leading-6 text-[#73758A]">Use the assigned Student or Employer demo account. Access is verified by the server and expires automatically.</p>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">Demo environment only. Do not enter a personal password, CV, or other personal data.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium text-[#25243A]">Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" className="mt-1.5 w-full rounded-xl border border-[#E9EAF1] px-3 py-2.5 outline-none focus:border-[#6C4CE3]" />
          </label>
          <label className="block text-sm font-medium text-[#25243A]">Password
            <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-[#E9EAF1] px-3 py-2.5 outline-none focus:border-[#6C4CE3]" />
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
          <button disabled={submitting} className="w-full rounded-xl bg-[#6C4CE3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5638C5] disabled:opacity-60">{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <button type="button" onClick={() => navigate('/jobs')} className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#6C4CE3] hover:underline"><BriefcaseBusiness className="h-4 w-4" />Back to public job search</button>
      </div>
    </div>
  );
}
