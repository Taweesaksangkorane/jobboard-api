import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Tooltip } from '../../components/common/Tooltip';
import {
  Mail,
  Phone,
  GraduationCap,
  Building,
  Edit2,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { t } = useTranslation(['student', 'common']);
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [faculty, setFaculty] = useState(user?.faculty || '');
  const [major, setMajor] = useState(user?.major || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      studentId,
      phone,
      university,
      faculty,
      major,
      bio,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setStudentId(user?.studentId || '');
    setPhone(user?.phone || '');
    setUniversity(user?.university || '');
    setFaculty(user?.faculty || '');
    setMajor(user?.major || '');
    setBio(user?.bio || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#25243A]">{t('student:profile.title')}</h1>
        <p className="mt-1 text-xs text-[#73758A]">
          {t('student:profile.subtitle')}
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-[#16A36A]">
          <CheckCircle2 className="h-4 w-4" />
          <span>{t('student:profile.savedSuccess')}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 sm:p-8 shadow-xs">
        {/* Header with Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9EAF1] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 rounded-2xl border border-[#E9EAF1] object-cover shadow-md shadow-purple-200"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6C4CE3] text-2xl font-bold text-white shadow-md shadow-purple-200">
                  {name.charAt(0) || 'S'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white text-[10px] text-white">
                ✓
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#25243A]">{name}</h2>
              <div className="flex items-center gap-2 text-xs text-[#73758A] mt-0.5">
                <span>{t('student:profile.studentId')}: {studentId || '-'}</span>
                {faculty && (
                  <>
                    <span>•</span>
                    <span className="text-[#6C4CE3] font-medium">{faculty}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <Tooltip content={t('common:tooltips.edit')}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                leftIcon={<Edit2 className="h-3.5 w-3.5 text-[#6C4CE3]" />}
              >
                {t('student:profile.editBtn')}
              </Button>
            </Tooltip>
          )}
        </div>

        {/* Profile Content */}
        {!isEditing ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#73758A] mb-2">
                {t('student:profile.bio')}
              </h3>
              <p className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-4 text-xs text-[#25243A] leading-relaxed">
                {bio || t('student:profile.noBio')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E9EAF1] p-4">
                <span className="text-[11px] text-[#73758A] block mb-1">{t('student:profile.email')}:</span>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#25243A]">
                  <Mail className="h-4 w-4 text-[#6C4CE3]" />
                  <span>{user?.email}</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#E9EAF1] p-4">
                <span className="text-[11px] text-[#73758A] block mb-1">{t('student:profile.phone')}:</span>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#25243A]">
                  <Phone className="h-4 w-4 text-[#16A36A]" />
                  <span>{phone || '-'}</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#E9EAF1] p-4">
                <span className="text-[11px] text-[#73758A] block mb-1">{t('student:profile.university')}:</span>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#25243A]">
                  <GraduationCap className="h-4 w-4 text-[#4776E6]" />
                  <span>{university || '-'}</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#E9EAF1] p-4">
                <span className="text-[11px] text-[#73758A] block mb-1">{t('student:profile.facultyAndMajor')}:</span>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#25243A]">
                  <Building className="h-4 w-4 text-[#F0A43A]" />
                  <span>{[faculty, major].filter(Boolean).join(' • ') || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('student:profile.fullName')}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label={t('student:profile.studentId')}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <Input
                label={t('student:profile.phone')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label={t('student:profile.university')}
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
              <Input
                label={t('student:profile.faculty')}
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
              />
              <Input
                label={t('student:profile.major')}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                {t('student:profile.bio')}
              </label>
              <textarea
                rows={3}
                value={bio}
                placeholder={t('student:profile.bioPlaceholder')}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E9EAF1]">
              <Tooltip content={t('common:tooltips.cancel')}>
                <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                  {t('student:profile.cancelBtn')}
                </Button>
              </Tooltip>
              <Tooltip content={t('common:tooltips.save')}>
                <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="h-4 w-4" />}>
                  {t('student:profile.saveBtn')}
                </Button>
              </Tooltip>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
