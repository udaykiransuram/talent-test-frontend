'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

type Stat = {
  key: string;
  label: string;
  value: string | number;
  icon?: string;
};

type Section = 'homepage' | 'about' | 'casestudy' | 'benefits';

const SECTION_REFLECTS: Record<Section, string> = {
  homepage: '/ (Homepage) — stats band, /product — trust band, /talent-test — hero stats',
  about: '/about — stats grid (Founded, Students, States, Schools)',
  casestudy: '/case-study — header stats band',
  benefits: '/benefits — ROI stats band at top',
};

const sections = [
  { value: 'homepage', label: 'Homepage Stats' },
  { value: 'about', label: 'About Page Stats' },
  { value: 'casestudy', label: 'Case Study Header' },
  { value: 'benefits', label: 'Benefits ROI Stats' },
];

export default function StatsManagementPage() {
  const [selectedSection, setSelectedSection] = useState<Section>('homepage');
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast} = useToast();

  useEffect(() => {
    fetchStats();
  }, [selectedSection]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?section=${selectedSection}`);
      const data = await res.json();
      
      if (data.success && data.data) {
        setStats(data.data.stats || []);
      } else {
        // Initialize with default stats if none exist
        setStats(getDefaultStats(selectedSection));
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch stats',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultStats = (section: Section): Stat[] => {
    const defaults: Record<Section, Stat[]> = {
      homepage: [
        { key: 'tested', label: 'Students Tested', value: '50,000+', icon: '👨‍🎓' },
        { key: 'schools', label: 'Schools', value: '500+', icon: '🏫' },
        { key: 'gradeUplift', label: 'Avg. Grade Uplift', value: '35%', icon: '📈' },
        { key: 'renewalRate', label: 'Renewal Rate', value: '98%', icon: '🔄' },
      ],
      about: [
        { key: 'founded', label: 'Founded', value: '2020', icon: '📅' },
        { key: 'schools', label: 'Schools', value: '500+', icon: '🏫' },
        { key: 'students', label: 'Students', value: '50K+', icon: '👨‍🎓' },
        { key: 'states', label: 'States', value: '15', icon: '📍' },
      ],
      casestudy: [
        { key: 'schools', label: 'Schools Served', value: '500+', icon: '🏫' },
        { key: 'improvement', label: 'Avg. Improvement', value: '85%', icon: '📈' },
        { key: 'students', label: 'Students Impacted', value: '2M+', icon: '👨‍🎓' },
        { key: 'satisfaction', label: 'Satisfaction Rate', value: '95%', icon: '⭐' },
      ],
      benefits: [
        { key: 'timeSaved', label: 'Time Saved', value: '40%', icon: '⏱️' },
        { key: 'betterResults', label: 'Better Results', value: '25%', icon: '📈' },
        { key: 'parentSatisfaction', label: 'Parent Satisfaction', value: '60%', icon: '😊' },
        { key: 'efficiency', label: 'Efficiency Gain', value: '80%', icon: '📋' },
      ],
    };
    return defaults[section];
  };

  const handleStatChange = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  const addNewStat = () => {
    setStats([...stats, { key: '', label: '', value: '', icon: '' }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const saveStats = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: selectedSection,
          stats,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Stats updated successfully',
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to save stats',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-teal-950 dark:text-teal-50">Site Stats Management</h2>
        <p className="mt-2 text-teal-700 dark:text-teal-300">
          Update statistics displayed across different pages
        </p>
      </div>

      {/* Section Selector */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-teal-950 dark:text-teal-50">
          Select Section
        </label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value as Section)}
          className="w-full max-w-md rounded-lg border border-teal-200 bg-white px-4 py-2 text-teal-950 dark:border-teal-700 dark:bg-teal-800 dark:text-teal-50"
        >
          {sections.map((section) => (
            <option key={section.value} value={section.value}>
              {section.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reflects On */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
          📍 <strong>Reflects on:</strong> {SECTION_REFLECTS[selectedSection]}
        </p>
      </div>

      {/* Stats Form */}
      {loading ? (
        <div className="py-12 text-center text-teal-700 dark:text-teal-300">Loading...</div>
      ) : (
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-700 dark:bg-teal-800 md:grid-cols-4"
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-teal-800 dark:text-teal-200">
                  Key (unique identifier)
                </label>
                <input
                  type="text"
                  value={stat.key}
                  onChange={(e) => handleStatChange(index, 'key', e.target.value)}
                  placeholder="e.g., students_tested"
                  className="w-full rounded border border-teal-200 bg-white px-3 py-2 text-sm text-teal-950 dark:border-teal-600 dark:bg-teal-900 dark:text-teal-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-teal-800 dark:text-teal-200">
                  Label (displayed text)
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                  placeholder="e.g., Students Tested"
                  className="w-full rounded border border-teal-200 bg-white px-3 py-2 text-sm text-teal-950 dark:border-teal-600 dark:bg-teal-900 dark:text-teal-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-teal-800 dark:text-teal-200">
                  Value
                </label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                  placeholder="e.g., 50,000+ or 99.5%"
                  className="w-full rounded border border-teal-200 bg-white px-3 py-2 text-sm text-teal-950 dark:border-teal-600 dark:bg-teal-900 dark:text-teal-50"
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-teal-800 dark:text-teal-200">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={stat.icon || ''}
                    onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
                    placeholder="📊"
                    className="w-full rounded border border-teal-200 bg-white px-3 py-2 text-sm text-teal-950 dark:border-teal-600 dark:bg-teal-900 dark:text-teal-50"
                  />
                </div>
                <button
                  onClick={() => removeStat(index)}
                  className="rounded bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addNewStat}
            className="rounded-lg border-2 border-dashed border-teal-300 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:border-teal-600 hover:bg-teal-100 dark:border-teal-600 dark:bg-teal-800 dark:text-teal-200 dark:hover:bg-teal-700"
          >
            + Add New Stat
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={saveStats}
          disabled={saving}
          className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={fetchStats}
          className="rounded-lg border border-teal-600 px-6 py-3 font-semibold text-teal-600 transition hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-800"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
