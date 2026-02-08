'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const adminMenuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/stats', label: 'Site Stats', icon: '📈' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/case-studies', label: 'Case Studies', icon: '📚' },
  { href: '/admin/pricing', label: 'Pricing Plans', icon: '💰' },
  { href: '/admin/talent-test', label: 'Talent Test', icon: '🎯' },
  { href: '/admin/faq', label: 'FAQs', icon: '❓' },
  { href: '/admin/contact-info', label: 'Contact Info', icon: '📞' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-teal-50 dark:bg-teal-950">
      {/* Header */}
      <header className="border-b border-teal-200 bg-white dark:border-teal-800 dark:bg-teal-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-teal-950 dark:text-teal-50">Admin Dashboard</h1>
            <p className="text-sm text-teal-700 dark:text-teal-300">Manage site content</p>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            ← Back to Site
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <nav className="rounded-lg border border-teal-200 bg-white p-4 dark:border-teal-800 dark:bg-teal-900">
            <ul className="space-y-2">
              {adminMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-teal-600 text-white'
                          : 'text-teal-950 hover:bg-teal-100 dark:text-teal-50 dark:hover:bg-teal-800'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="rounded-lg border border-teal-200 bg-white p-6 dark:border-teal-800 dark:bg-teal-900">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
