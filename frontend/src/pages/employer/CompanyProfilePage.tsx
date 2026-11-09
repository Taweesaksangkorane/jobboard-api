import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ConfirmDialog } from '../../components/common/Modal';
import { Tooltip } from '../../components/common/Tooltip';
import { isValidThaiPhone, thaiPhoneHelp } from '../../utils/phoneValidation';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Edit2,
  ShieldCheck,
} from 'lucide-react';

interface CompanyProfileValues {
  companyName: string;
  contactPerson: string;
  phone: string;
  website: string;
  address: string;
  bio: string;
}

export const CompanyProfilePage: React.FC = () => {
  const { t } = useTranslation(['employer', 'common']);
  const { user, updateProfile } = useAuth();

  const getSavedSnapshot = (): CompanyProfileValues => ({
    companyName: user?.companyName || '',
    contactPerson: user?.contactPerson || user?.name || '',
    phone: user?.phone || '',
    website: user?.website || 'https://www.company.co.th',
    address: user?.address || 'กรุงเทพมหานคร',
    bio: user?.bio || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savedValues, setSavedValues] = useState<CompanyProfileValues>(getSavedSnapshot);

  const [companyName, setCompanyName] = useState(savedValues.companyName);
  const [contactPerson, setContactPerson] = useState(savedValues.contactPerson);
  const [phone, setPhone] = useState(savedValues.phone);
  const [website, setWebsite] = useState(savedValues.website);
  const [address, setAddress] = useState(savedValues.address);
  const [bio, setBio] = useState(savedValues.bio);

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CompanyProfileValues, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);

  // Sync saved snapshot when authenticated user loads/updates while not actively editing
  useEffect(() => {
    const nextSaved = {
      companyName: user?.companyName || '',
      contactPerson: user?.contactPerson || user?.name || '',
      phone: user?.phone || '',
      website: user?.website || 'https://www.company.co.th',
      address: user?.address || 'กรุงเทพมหานคร',
      bio: user?.bio || '',
    };
    setSavedValues(nextSaved);
    if (!isEditing) {
      setCompanyName(nextSaved.companyName);
      setContactPerson(nextSaved.contactPerson);
      setPhone(nextSaved.phone);
      setWebsite(nextSaved.website);
      setAddress(nextSaved.address);
      setBio(nextSaved.bio);
    }
  }, [
    user?.id,
    user?.companyName,
    user?.contactPerson,
    user?.name,
    user?.phone,
    user?.website,
    user?.address,
    user?.bio,
    isEditing,
  ]);

  const hasUnsavedChanges =
    companyName !== savedValues.companyName ||
    contactPerson !== savedValues.contactPerson ||
    phone !== savedValues.phone ||
    website !== savedValues.website ||
    address !== savedValues.address ||
    bio !== savedValues.bio;

  const restoreSavedValues = () => {
    setCompanyName(savedValues.companyName);
    setContactPerson(savedValues.contactPerson);
    setPhone(savedValues.phone);
    setWebsite(savedValues.website);
    setAddress(savedValues.address);
    setBio(savedValues.bio);
    setFieldErrors({});
    setSaveError(null);
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof CompanyProfileValues, string>> = {};

    if (!companyName.trim()) {
      nextErrors.companyName = t('employer:profile.validation.companyNameReq');
    } else if (companyName.trim().length < 2) {
      nextErrors.companyName = t('employer:profile.validation.companyNameMin');
    }

    if (!contactPerson.trim()) {
      nextErrors.contactPerson = t('employer:profile.validation.contactPersonReq');
    }

    if (phone.trim() && !isValidThaiPhone(phone)) {
      nextErrors.phone = 'Please enter a Thai contact phone number with exactly 10 digits, starting with 0.';
    }

    if (website.trim()) {
      const normalized = /^https?:\/\//i.test(website.trim())
        ? website.trim()
        : `https://${website.trim()}`;
      try {
        const parsed = new URL(normalized);
        if (!parsed.hostname.includes('.')) {
          nextErrors.website = t('employer:profile.validation.websiteInvalid');
        }
      } catch {
        nextErrors.website = t('employer:profile.validation.websiteInvalid');
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setSavedSuccess(false);
    setSaveError(null);

    if (!validateForm()) {
      setSaveError(t('employer:profile.validation.formInvalid'));
      return;
    }

    const normalizedWebsite = website.trim()
      ? /^https?:\/\//i.test(website.trim())
        ? website.trim()
        : `https://${website.trim()}`
      : '';

    try {
      setIsSaving(true);
      const updatedUser = await updateProfile({
        companyName: companyName.trim(),
        contactPerson: contactPerson.trim(),
        name: contactPerson.trim(),
        phone: phone.trim(),
        website: normalizedWebsite,
        address: address.trim(),
        bio: bio.trim(),
      });

      const nextSaved: CompanyProfileValues = {
        companyName: updatedUser.companyName || companyName.trim(),
        contactPerson: updatedUser.contactPerson || updatedUser.name || contactPerson.trim(),
        phone: updatedUser.phone || '',
        website: updatedUser.website || normalizedWebsite,
        address: updatedUser.address || '',
        bio: updatedUser.bio || '',
      };

      setSavedValues(nextSaved);
      setCompanyName(nextSaved.companyName);
      setContactPerson(nextSaved.contactPerson);
      setPhone(nextSaved.phone);
      setWebsite(nextSaved.website);
      setAddress(nextSaved.address);
      setBio(nextSaved.bio);
      setFieldErrors({});
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setSaveError(String(err.response.data.message));
      } else {
        setSaveError(
          err instanceof Error
            ? err.message
            : t('employer:profile.validation.saveFailed')
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    if (isSaving) return;
    if (hasUnsavedChanges) {
      setIsDiscardConfirmOpen(true);
      return;
    }
    restoreSavedValues();
    setIsEditing(false);
  };

  const handleConfirmDiscard = () => {
    restoreSavedValues();
    setIsDiscardConfirmOpen(false);
    setIsEditing(false);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#25243A]">{t('employer:profile.title')}</h1>
        <p className="mt-1 text-xs sm:text-sm text-[#73758A]">
          {t('employer:profile.subtitle')}
        </p>
      </div>

      {savedSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-[#16A36A]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{t('employer:profile.savedSuccess')}</span>
        </div>
      )}

      {saveError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-[#E05252]"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="w-full rounded-2xl border border-[#E9EAF1] bg-white p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Company Profile Identity Header (no duplicate Save/Cancel action buttons) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-[#E9EAF1] pb-6 mb-8">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={savedValues.companyName}
                referrerPolicy="no-referrer"
                className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl border border-[#E9EAF1] object-cover shadow-xs"
              />
            ) : (
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F0ECFF] text-2xl font-bold text-[#6C4CE3] border border-purple-100 shadow-xs">
                {(savedValues.companyName || 'CO').substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#25243A] leading-snug break-words">
                  {savedValues.companyName || t('employer:profile.defaultCompanyName')}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-[11px] font-semibold text-emerald-700 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t('employer:profile.verifiedBadge')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#73758A]">
                {t('employer:profile.adminLabel')}{' '}
                <span className="text-[#6C4CE3] font-semibold">{savedValues.contactPerson}</span>
              </p>
            </div>
          </div>

          {!isEditing && (
            <div className="shrink-0 sm:self-center">
              <Tooltip content={t('common:tooltips.edit')}>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setSavedSuccess(false);
                    setSaveError(null);
                    setIsEditing(true);
                  }}
                  leftIcon={<Edit2 className="h-4 w-4 text-[#6C4CE3]" />}
                >
                  {t('employer:profile.editProfileBtn')}
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-8">
            {/* Organization Overview */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C4CE3] mb-3">
                {t('employer:profile.aboutHeading')}
              </h3>
              <div className="rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] p-5 sm:p-6">
                <p className="text-xs sm:text-sm text-[#25243A] leading-relaxed whitespace-pre-line">
                  {savedValues.bio || t('employer:profile.noAbout')}
                </p>
              </div>
            </div>

            {/* Contact & Location Details (2-Column Responsive Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex items-start gap-3.5 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC]/50 p-4 sm:p-5 h-full">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6C4CE3]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-[#73758A] block mb-1">
                    {t('employer:profile.email')}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#25243A] break-all">
                    {user?.email || 'recruitment@techforward.co.th'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC]/50 p-4 sm:p-5 h-full">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#16A36A]">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-[#73758A] block mb-1">
                    {t('employer:profile.phone')}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#25243A]">
                    {savedValues.phone || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC]/50 p-4 sm:p-5 h-full">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#4776E6]">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-[#73758A] block mb-1">
                    {t('employer:profile.website')}
                  </span>
                  {savedValues.website ? (
                    <a
                      href={savedValues.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-[#4776E6] hover:underline break-all"
                    >
                      {savedValues.website}
                    </a>
                  ) : (
                    <span className="text-xs sm:text-sm text-[#73758A] font-normal">-</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC]/50 p-4 sm:p-5 h-full">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#F0A43A]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-[#73758A] block mb-1">
                    {t('employer:profile.address')}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#25243A] leading-relaxed">
                    {savedValues.address || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 items-start">
              <Input
                label={t('employer:profile.companyName')}
                required
                disabled={isSaving}
                value={companyName}
                error={fieldErrors.companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (fieldErrors.companyName) {
                    setFieldErrors((prev) => ({ ...prev, companyName: undefined }));
                  }
                }}
              />
              <Input
                label={t('employer:profile.contactPerson')}
                required
                disabled={isSaving}
                value={contactPerson}
                error={fieldErrors.contactPerson}
                onChange={(e) => {
                  setContactPerson(e.target.value);
                  if (fieldErrors.contactPerson) {
                    setFieldErrors((prev) => ({ ...prev, contactPerson: undefined }));
                  }
                }}
              />
              <Input
                label={t('employer:profile.phone')}
                type="tel"
                disabled={isSaving}
                value={phone}
                inputMode="numeric"
                maxLength={12}
                pattern="0[0-9 -]{9,11}"
                helperText={thaiPhoneHelp}
                error={fieldErrors.phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                }}
              />
              <Input
                label={t('employer:profile.website')}
                disabled={isSaving}
                value={website}
                placeholder={t('employer:profile.websitePlaceholder')}
                error={fieldErrors.website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                  if (fieldErrors.website) {
                    setFieldErrors((prev) => ({ ...prev, website: undefined }));
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 items-start">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:profile.address')}
                </label>
                <textarea
                  rows={4}
                  disabled={isSaving}
                  value={address}
                  placeholder={t('employer:profile.addressPlaceholder')}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2.5 text-sm text-[#25243A] placeholder-[#A0A2B3] transition-colors focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                  {t('employer:profile.about')}
                </label>
                <textarea
                  rows={4}
                  disabled={isSaving}
                  value={bio}
                  placeholder={t('employer:profile.aboutPlaceholder')}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2.5 text-sm text-[#25243A] placeholder-[#A0A2B3] transition-colors focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Single Form Footer Action Bar */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-[#E9EAF1]">
              <Tooltip content={t('common:tooltips.cancel')}>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={isSaving}
                  onClick={handleCancelClick}
                >
                  {t('employer:profile.cancelBtn')}
                </Button>
              </Tooltip>
              <Tooltip content={t('common:tooltips.save')}>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSaving}
                  isLoading={isSaving}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  {t('employer:profile.saveChangesBtn')}
                </Button>
              </Tooltip>
            </div>
          </form>
        )}
      </div>

      {/* Confirmation Dialog when Cancelling Unsaved Changes */}
      <ConfirmDialog
        isOpen={isDiscardConfirmOpen}
        onClose={() => setIsDiscardConfirmOpen(false)}
        onConfirm={handleConfirmDiscard}
        title={t('employer:profile.discardTitle')}
        message={t('employer:profile.discardMessage')}
        confirmLabel={t('employer:profile.discardConfirmBtn')}
        cancelLabel={t('employer:profile.discardCancelBtn')}
        isDestructive
      />
    </div>
  );
};
