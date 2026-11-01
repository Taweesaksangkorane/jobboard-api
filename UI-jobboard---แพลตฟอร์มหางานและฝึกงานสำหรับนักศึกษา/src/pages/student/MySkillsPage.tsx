import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Tooltip } from '../../components/common/Tooltip';
import {
  Search,
  Plus,
  X,
  Tag,
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
}

const PRESET_SKILLS: Skill[] = [
  { id: '1', name: 'React.js', category: 'Frontend' },
  { id: '2', name: 'TypeScript', category: 'Programming Language' },
  { id: '3', name: 'Tailwind CSS', category: 'Frontend' },
  { id: '4', name: 'Node.js', category: 'Backend' },
  { id: '5', name: 'SQL / PostgreSQL', category: 'Database' },
  { id: '6', name: 'Figma', category: 'Design' },
  { id: '7', name: 'Git & GitHub', category: 'DevOps & Tools' },
  { id: '8', name: 'Next.js', category: 'Frontend' },
  { id: '9', name: 'Python', category: 'Data & AI' },
  { id: '10', name: 'UI/UX Research', category: 'Design' },
  { id: '11', name: 'Docker', category: 'DevOps & Tools' },
  { id: '12', name: 'Digital Marketing', category: 'Marketing' },
  { id: '13', name: 'Power BI', category: 'Data & AI' },
  { id: '14', name: 'RESTful API', category: 'Backend' },
];

export const MySkillsPage: React.FC = () => {
  const { t } = useTranslation(['student', 'common']);

  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([
    { id: '1', name: 'React.js', category: 'Frontend' },
    { id: '2', name: 'TypeScript', category: 'Programming Language' },
    { id: '3', name: 'Tailwind CSS', category: 'Frontend' },
    { id: '5', name: 'SQL / PostgreSQL', category: 'Database' },
    { id: '7', name: 'Git & GitHub', category: 'DevOps & Tools' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [customCategory, setCustomCategory] = useState('Frontend');

  const handleAddSkill = (skill: Skill) => {
    if (!selectedSkills.some((s) => s.id === skill.id || s.name.toLowerCase() === skill.name.toLowerCase())) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
  };

  const handleCreateCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;

    const newSkill: Skill = {
      id: `custom-${Date.now()}`,
      name: customSkillName.trim(),
      category: customCategory,
    };

    handleAddSkill(newSkill);
    setCustomSkillName('');
  };

  const filteredPreset = PRESET_SKILLS.filter(
    (s) =>
      !selectedSkills.some((sel) => sel.name.toLowerCase() === s.name.toLowerCase()) &&
      (searchTerm.trim() === '' ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#25243A]">{t('student:skills.title')}</h1>
        <p className="mt-1 text-xs text-[#73758A]">
          {t('student:skills.subtitle')}
        </p>
      </div>

      {/* Selected Skills Card */}
      <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E9EAF1] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#6C4CE3]" />
            <h2 className="text-base font-bold text-[#25243A]">
              {t('student:skills.selectedTitle', { count: selectedSkills.length })}
            </h2>
          </div>
          <span className="text-[11px] text-[#73758A]">{t('student:skills.removeHint')}</span>
        </div>

        {selectedSkills.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E9EAF1] p-6 text-center text-xs text-[#73758A]">
            {t('student:skills.noSkills')}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill.id}
                className="group inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-[#F0ECFF] px-3.5 py-1.5 text-xs font-semibold text-[#6C4CE3] transition hover:bg-purple-100"
              >
                <span>{skill.name}</span>
                <span className="text-[10px] text-[#5638C5]/70 font-normal">
                  ({skill.category})
                </span>
                <Tooltip content={t('common:tooltips.delete')}>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="rounded-full p-0.5 text-[#6C4CE3] hover:bg-[#6C4CE3] hover:text-white transition cursor-pointer"
                    aria-label={t('common:tooltips.removeSkill', { name: skill.name })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Tooltip>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add Skills & Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Presets List */}
        <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#25243A]">{t('student:skills.recommendedTitle')}</h3>
            <span className="text-[11px] text-[#A0A2B3]">{t('student:skills.clickToAddHint')}</span>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A2B3]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('student:skills.searchRecommendedPlaceholder')}
              className="w-full rounded-xl border border-[#E9EAF1] bg-gray-50 py-2 pl-9 pr-3 text-xs text-[#25243A] focus:border-[#6C4CE3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
            />
          </div>

          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pt-1">
            {filteredPreset.map((skill) => (
              <Tooltip key={skill.id} content={t('common:tooltips.addSkill')}>
                <button
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E9EAF1] bg-white px-2.5 py-1 text-xs text-[#25243A] hover:border-[#6C4CE3] hover:bg-[#F0ECFF] hover:text-[#6C4CE3] transition cursor-pointer"
                >
                  <Plus className="h-3 w-3 text-[#6C4CE3]" />
                  <span>{skill.name}</span>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Custom Skill Creator */}
        <div className="rounded-2xl border border-[#E9EAF1] bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#25243A]">{t('student:skills.customTitle')}</h3>
          <p className="text-xs text-[#73758A]">
            {t('student:skills.customSubtitle')}
          </p>

          <form onSubmit={handleCreateCustomSkill} className="space-y-3">
            <Input
              label={t('student:skills.skillNameLabel')}
              placeholder={t('student:skills.skillNamePlaceholder')}
              value={customSkillName}
              onChange={(e) => setCustomSkillName(e.target.value)}
            />

            <div>
              <label className="mb-1 block text-xs font-medium text-[#25243A]">
                {t('student:skills.skillCategoryLabel')}
              </label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                aria-label={t('student:skills.skillCategoryLabel')}
                className="w-full rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-xs text-[#25243A] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Design">Design</option>
                <option value="Data & AI">Data & AI</option>
                <option value="DevOps & Tools">DevOps & Tools</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>

            <Tooltip content={t('common:tooltips.save')}>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                className="w-full mt-2"
              >
                {t('student:skills.addToProfileBtn')}
              </Button>
            </Tooltip>
          </form>
        </div>
      </div>
    </div>
  );
};
