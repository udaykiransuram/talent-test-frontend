'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

type Page = 'homepage' | 'product' | 'about' | 'benefits' | 'talent-test' | 'case-study' | 'contact';

interface FAQItem {
  _id?: string;
  page: Page;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}

const pages: { value: Page; label: string }[] = [
  { value: 'homepage', label: 'Homepage' },
  { value: 'product', label: 'Product' },
  { value: 'about', label: 'About' },
  { value: 'benefits', label: 'Benefits' },
  { value: 'talent-test', label: 'Talent Test' },
  { value: 'case-study', label: 'Case Study' },
  { value: 'contact', label: 'Contact' },
];

const PAGE_REFLECTS: Record<Page, string> = {
  homepage: '/ (Homepage) — FAQ section below testimonials',
  product: '/product — FAQ section (not yet wired)',
  about: '/about — FAQ section (not yet wired)',
  benefits: '/benefits — FAQ section (not yet wired)',
  'talent-test': '/talent-test — FAQ accordion section',
  'case-study': '/case-study — FAQ section (not yet wired)',
  contact: '/contact — FAQ section at bottom',
};

export default function FAQManagementPage() {
  const [selectedPage, setSelectedPage] = useState<Page>('homepage');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/faq?page=${selectedPage}`);
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data || []);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch FAQs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [selectedPage, toast]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const addNew = () => {
    setFaqs(prev => [
      ...prev,
      { page: selectedPage, question: '', answer: '', displayOrder: prev.length, isActive: true },
    ]);
  };

  const handleChange = (index: number, field: keyof FAQItem, value: string | number | boolean) => {
    setFaqs(prev => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  const saveFaq = async (index: number) => {
    const faq = faqs[index];
    if (!faq.question.trim() || !faq.answer.trim()) {
      toast({ title: 'Validation', description: 'Question and answer are required', variant: 'destructive' });
      return;
    }
    setSaving(String(index));
    try {
      if (faq._id) {
        // Update
        const res = await fetch(`/api/admin/faq/${faq._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faq),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        toast({ title: 'Saved', description: 'FAQ updated' });
      } else {
        // Create
        const res = await fetch('/api/admin/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faq),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        // Update local state with server-assigned _id
        setFaqs(prev => prev.map((f, i) => (i === index ? { ...f, _id: data.data._id } : f)));
        toast({ title: 'Created', description: 'FAQ added' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save FAQ', variant: 'destructive' });
    } finally {
      setSaving(null);
    }
  };

  const deleteFaq = async (index: number) => {
    const faq = faqs[index];
    if (!faq._id) {
      // Not saved yet, just remove locally
      setFaqs(prev => prev.filter((_, i) => i !== index));
      return;
    }
    if (!confirm('Delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/admin/faq/${faq._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFaqs(prev => prev.filter((_, i) => i !== index));
        toast({ title: 'Deleted', description: 'FAQ removed' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-teal-950 dark:text-teal-50">FAQ Management</h2>
          <p className="mt-1 text-teal-700 dark:text-teal-300">
            Manage frequently asked questions for each page.
          </p>
        </div>
        <button
          onClick={addNew}
          className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
        >
          + Add FAQ
        </button>
      </div>

      {/* Page selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {pages.map(p => (
          <button
            key={p.value}
            onClick={() => setSelectedPage(p.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedPage === p.value
                ? 'bg-teal-600 text-white'
                : 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 dark:bg-teal-900 dark:text-teal-300 dark:border-teal-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Reflects On */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
          📍 <strong>Reflects on:</strong> {PAGE_REFLECTS[selectedPage]}
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-teal-600">Loading...</div>
      ) : faqs.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-teal-200 p-12 text-center dark:border-teal-700">
          <p className="text-teal-600 dark:text-teal-400">No FAQs for this page yet.</p>
          <button onClick={addNew} className="mt-4 text-sm font-medium text-teal-700 underline hover:text-teal-800">
            Add your first FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={faq._id || `new-${index}`} className="rounded-lg border border-teal-200 bg-white p-6 dark:border-teal-800 dark:bg-teal-900">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-teal-600">FAQ #{index + 1}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={faq.isActive}
                      onChange={e => handleChange(index, 'isActive', e.target.checked)}
                      className="rounded border-teal-300"
                    />
                    Active
                  </label>
                  <input
                    type="number"
                    value={faq.displayOrder}
                    onChange={e => handleChange(index, 'displayOrder', parseInt(e.target.value) || 0)}
                    className="w-16 rounded border border-teal-200 px-2 py-1 text-sm dark:border-teal-700 dark:bg-teal-800 dark:text-white"
                    placeholder="Order"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-teal-900 dark:text-teal-200">Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={e => handleChange(index, 'question', e.target.value)}
                    placeholder="Enter the question..."
                    className="w-full rounded-lg border border-teal-200 bg-white px-4 py-3 text-teal-950 placeholder-teal-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-teal-700 dark:bg-teal-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-teal-900 dark:text-teal-200">Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={e => handleChange(index, 'answer', e.target.value)}
                    placeholder="Enter the answer..."
                    rows={3}
                    className="w-full rounded-lg border border-teal-200 bg-white px-4 py-3 text-teal-950 placeholder-teal-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-teal-700 dark:bg-teal-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => deleteFaq(index)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                >
                  Delete
                </button>
                <button
                  onClick={() => saveFaq(index)}
                  disabled={saving === String(index)}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                >
                  {saving === String(index) ? 'Saving...' : faq._id ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
