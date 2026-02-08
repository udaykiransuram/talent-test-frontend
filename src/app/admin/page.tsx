import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Alyra Tech',
  description: 'Manage site content, stats, testimonials, and more',
};

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-teal-950 dark:text-teal-50">Welcome to Admin Dashboard</h2>
      <p className="mt-2 text-teal-700 dark:text-teal-300">
        Use the sidebar to manage different aspects of your website.
      </p>

      {/* Quick Stats */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Site Stats Sections', value: '4', icon: '📈' },
          { label: 'Active Testimonials', value: '—', icon: '💬' },
          { label: 'Case Studies', value: '—', icon: '📚' },
          { label: 'Pricing Plans', value: '—', icon: '💰' },
          { label: 'FAQs', value: '—', icon: '❓' },
          { label: 'Contact Info', value: '1', icon: '📞' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-teal-200 bg-teal-50 p-6 dark:border-teal-700 dark:bg-teal-800"
          >
            <div className="mb-2 text-3xl">{stat.icon}</div>
            <div className="text-3xl font-bold text-teal-600">{stat.value}</div>
            <div className="mt-1 text-sm text-teal-800 dark:text-teal-200">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-teal-950 dark:text-teal-50">Quick Actions</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a
            href="/admin/stats"
            className="flex items-center gap-3 rounded-lg border-2 border-teal-200 bg-white p-4 transition hover:border-teal-600 dark:border-teal-700 dark:bg-teal-900 dark:hover:border-teal-400"
          >
            <span className="text-2xl">📈</span>
            <div>
              <div className="font-semibold text-teal-950 dark:text-teal-50">Update Site Stats</div>
              <div className="text-sm text-teal-700 dark:text-teal-300">
                Modify homepage, about, and case study stats
              </div>
            </div>
          </a>

          <a
            href="/admin/testimonials"
            className="flex items-center gap-3 rounded-lg border-2 border-teal-200 bg-white p-4 transition hover:border-teal-600 dark:border-teal-700 dark:bg-teal-900 dark:hover:border-teal-400"
          >
            <span className="text-2xl">💬</span>
            <div>
              <div className="font-semibold text-teal-950 dark:text-teal-50">Manage Testimonials</div>
              <div className="text-sm text-teal-700 dark:text-teal-300">
                Add, edit, or remove customer reviews
              </div>
            </div>
          </a>

          <a
            href="/admin/case-studies"
            className="flex items-center gap-3 rounded-lg border-2 border-teal-200 bg-white p-4 transition hover:border-teal-600 dark:border-teal-700 dark:bg-teal-900 dark:hover:border-teal-400"
          >
            <span className="text-2xl">📚</span>
            <div>
              <div className="font-semibold text-teal-950 dark:text-teal-50">Update Case Studies</div>
              <div className="text-sm text-teal-700 dark:text-teal-300">
                Manage school success stories and metrics
              </div>
            </div>
          </a>

          <a
            href="/admin/pricing"
            className="flex items-center gap-3 rounded-lg border-2 border-teal-200 bg-white p-4 transition hover:border-teal-600 dark:border-teal-700 dark:bg-teal-900 dark:hover:border-teal-400"
          >
            <span className="text-2xl">💰</span>
            <div>
              <div className="font-semibold text-teal-950 dark:text-teal-50">Manage Pricing</div>
              <div className="text-sm text-teal-700 dark:text-teal-300">
                Update plans, features, and pricing
              </div>
            </div>
          </a>

          <a
            href="/admin/faq"
            className="flex items-center gap-3 rounded-lg border-2 border-teal-200 bg-white p-4 transition hover:border-teal-600 dark:border-teal-700 dark:bg-teal-900 dark:hover:border-teal-400"
          >
            <span className="text-2xl">❓</span>
            <div>
              <div className="font-semibold text-teal-950 dark:text-teal-50">Manage FAQs</div>
              <div className="text-sm text-teal-700 dark:text-teal-300">
                Add, edit, or remove FAQs for each page
              </div>
            </div>
          </a>

          <a
            href="/admin/contact-info"
            className="flex items-center gap-3 rounded-lg border-2 border-teal-200 bg-white p-4 transition hover:border-teal-600 dark:border-teal-700 dark:bg-teal-900 dark:hover:border-teal-400"
          >
            <span className="text-2xl">📞</span>
            <div>
              <div className="font-semibold text-teal-950 dark:text-teal-50">Contact Info</div>
              <div className="text-sm text-teal-700 dark:text-teal-300">
                Update email, phone, address, and response time
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
