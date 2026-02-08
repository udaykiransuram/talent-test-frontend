import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Reveal, Stagger } from '@/components/Reveal';
import { connectDB } from '@/lib/db';
import TalentTestConfig from '@/models/TalentTestConfig';
import Testimonial from '@/models/Testimonial';
import SiteStats from '@/models/SiteStats';
import FAQ from '@/models/FAQ';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Talent Test — Alyra Tech | National STEM Assessment for Classes 1-12',
  description: 'Experience precision diagnostics firsthand. A comprehensive STEM talent assessment with AI-powered analytics, personalized insights, and recognition for young achievers.',
};

const benefits = [
  { icon: '🌟', title: 'Holistic STEM Assessment', description: 'Comprehensive evaluation in Mathematics, Physics, and Chemistry designed for all-round cognitive growth.' },
  { icon: '💡', title: 'AI-Powered Analytics', description: 'Detailed performance reports with error-type analysis, learning pace insights, and comparative benchmarking.' },
  { icon: '🏆', title: 'Recognition & Awards', description: 'Certificates of excellence, medals, scholarships, and national/district/school-level rankings for top performers.' },
];

const uniqueFeatures = [
  {
    icon: '🔬',
    title: 'Deep Conceptual Testing',
    description: 'Beyond rote memorization — our questions assess conceptual understanding, application ability, and analytical reasoning in core STEM subjects aligned with NEP 2020.',
    border: 'border-teal-500'
  },
  {
    icon: '📊',
    title: 'Personalized Insights',
    description: 'Get AI-driven diagnostic reports showing exact skill gaps, topic-wise strengths, error patterns, and comparative performance — a true learning diagnostic tool.',
    border: 'border-teal-500'
  },
  {
    icon: '🧑‍🔬',
    title: 'Future-Ready Skills',
    description: 'Crafted to foster critical thinking, problem-solving, and scientific temper — preparing young minds for careers in science, technology, engineering, and mathematics.',
    border: 'border-teal-500'
  },
  {
    icon: '📚',
    title: 'Free Learning Resources',
    description: 'All registered students receive complimentary access to study materials, previous year papers, curated practice sets, and topic-wise revision guides.',
    border: 'border-teal-500'
  },
  {
    icon: '🏫',
    title: 'Multi-Level Recognition',
    description: 'Rankings at national, state, district, and school levels ensure more students get motivated and rewarded — not just the top 1%.',
    border: 'border-teal-500'
  },
  {
    icon: '📞',
    title: 'Expert Mentorship',
    description: 'Top performers receive one-on-one mentorship sessions with STEM educators and industry experts to guide their learning journey and career planning.',
    border: 'border-teal-500'
  },
];

const importantDates = [
  { label: 'Registrations Open', date: 'Jul 10', year: '2025', color: 'border-teal-500', bgColor: 'bg-teal-50 dark:bg-teal-900/20', textColor: 'text-teal-700 dark:text-teal-300' },
  { label: 'Last Day to Register', date: 'Aug 15', year: '2025', color: 'border-teal-500', bgColor: 'bg-teal-50 dark:bg-teal-900/20', textColor: 'text-teal-700 dark:text-teal-300' },
  { label: 'Test Week', date: 'Sept 1-7', year: '2025', color: 'border-teal-500', bgColor: 'bg-teal-50 dark:bg-teal-900/20', textColor: 'text-teal-700 dark:text-teal-300' },
  { label: 'Results Declaration', date: 'Sept 20', year: '2025', color: 'border-teal-500', bgColor: 'bg-teal-50 dark:bg-teal-900/20', textColor: 'text-teal-700 dark:text-teal-300' },
];

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Class 10 Student, Delhi',
    quote: 'The diagnostic report helped me understand exactly where I was making mistakes in physics. I improved my score by 35% in just 3 months!',
    rating: 5
  },
  {
    name: 'Rajesh Kumar',
    role: 'Parent, Mumbai',
    quote: 'Best investment for my child\'s education. The personalized insights were more valuable than months of generic tuition classes.',
    rating: 5
  },
  {
    name: 'Anita Deshmukh',
    role: 'Mathematics Teacher, Pune',
    quote: 'As an educator, I appreciated how the test goes beyond scores to show learning patterns. Highly recommended for students serious about STEM.',
    rating: 5
  },
];

interface HeroStat { value: string; label: string }
const DEFAULT_HERO_STATS: HeroStat[] = [
  { value: '50K+', label: 'Students Tested' },
  { value: '250+', label: 'Partner Schools' },
  { value: '98%', label: 'Parent Satisfaction' },
  { value: '20+', label: 'States Covered' },
];

async function getTalentTestData() {
  try {
    const work = (async () => {
      await connectDB();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const [config, testimonials, statsDoc, faqDocs]: [any, any[], any, any[]] = await Promise.all([
        TalentTestConfig.findOne().lean(),
        Testimonial.find({ section: 'homepage', isActive: true }).sort({ displayOrder: 1 }).lean(),
        SiteStats.findOne({ section: 'homepage' }).lean(),
        FAQ.find({ page: 'talent-test', isActive: true }).sort({ displayOrder: 1 }).lean(),
      ]);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const heroStats: HeroStat[] = (statsDoc?.stats ?? []).length
        ? (statsDoc.stats as any[]).map((s: any) => ({ value: String(s.value), label: s.label || s.key }))
        : DEFAULT_HERO_STATS;

      /* eslint-enable @typescript-eslint/no-explicit-any */
      return {
        name: config?.name ?? 'Precision Baseline Assessment',
        description: config?.description ?? 'Comprehensive diagnostic test to identify student strengths and areas for improvement',
        price: config?.price ?? 100,
        currency: config?.currency ?? 'INR',
        duration: config?.duration ?? '45 minutes',
        subjects: config?.subjects ?? ['Mathematics', 'Science', 'English'],
        features: config?.features ?? ['Detailed diagnostic report', 'Personalized learning recommendations', 'Subject-wise performance analysis', 'Instant results delivery via email'],
        isActive: config?.isActive ?? true,
        heroStats,
        testimonials: testimonials.length
          ? testimonials.map((t: any) => ({  // eslint-disable-line @typescript-eslint/no-explicit-any
              name: t.author,
              role: [t.role, t.school, t.location].filter(Boolean).join(', '),
              quote: t.quote,
              rating: t.rating ?? 5,
            }))
          : DEFAULT_TESTIMONIALS,
        faqs: faqDocs.length
          ? faqDocs.map((f: any) => ({ question: f.question, answer: f.answer })) // eslint-disable-line @typescript-eslint/no-explicit-any
          : DEFAULT_FAQS,
      };
    })();
    const timeout = new Promise<ReturnType<typeof getDefaults>>((r) =>
      setTimeout(() => r(getDefaults()), 3000),
    );
    return await Promise.race([work, timeout]);
  } catch {
    return getDefaults();
  }
}

function getDefaults() {
  return {
    name: 'Precision Baseline Assessment',
    description: 'Comprehensive diagnostic test to identify student strengths and areas for improvement',
    price: 100,
    currency: 'INR',
    duration: '45 minutes',
    subjects: ['Mathematics', 'Science', 'English'],
    features: ['Detailed diagnostic report', 'Personalized learning recommendations', 'Subject-wise performance analysis', 'Instant results delivery via email'],
    isActive: true,
    heroStats: DEFAULT_HERO_STATS,
    testimonials: DEFAULT_TESTIMONIALS,
    faqs: DEFAULT_FAQS,
  };
}

const DEFAULT_FAQS = [
  {
    question: 'Who can take the Talent Test?',
    answer: 'Students from Class 1 to Class 12 across India can register. The test is designed with age-appropriate questions for each class level.'
  },
  {
    question: 'Is this a one-time test or subscription?',
    answer: 'It\'s a one-time talent assessment. Pay {{PRICE}} once, take the test during the test week, and receive your comprehensive diagnostic report.'
  },
  {
    question: 'How is this different from school exams?',
    answer: 'Unlike school exams that test memory, our assessment evaluates conceptual understanding, application skills, and problem-solving abilities with detailed error-type analysis.'
  },
  {
    question: 'When will I receive my results?',
    answer: 'Results are typically declared within 10-15 days after the test window closes. You\'ll receive your hall ticket, detailed report, and rank certificate via WhatsApp and email.'
  },
  {
    question: 'What happens after I register?',
    answer: 'You\'ll immediately receive a hall ticket on WhatsApp with your test credentials, date/time slot, and instructions. You can take the test from home during the test week.'
  },
  {
    question: 'Are there any scholarships available?',
    answer: 'Yes! Top 10% performers in each category are eligible for scholarships ranging from 10-50% on our full diagnostic programs. District and national toppers receive special awards.'
  },
];

export default async function TalentTestLandingPage() {
  const { price, currency, testimonials, name, description, duration, subjects, features, isActive, heroStats, faqs } = await getTalentTestData();
  const priceLabel = currency === 'INR' ? `\u20b9${price}` : `${currency} ${price}`;
  return (
    <div className="bg-white text-teal-950 dark:bg-teal-950 dark:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-teal-200 bg-teal-50 px-4 py-20 dark:border-teal-800 dark:bg-teal-950 md:py-28">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <Reveal>
              <div className="mb-6 inline-block rounded-full bg-teal-600 px-6 py-2 text-sm font-bold text-white shadow-lg">
                🎯 Try Before You Buy — Free Trial of Our Diagnostic System
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
                <span className="bg-teal-600 bg-clip-text text-transparent">Ignite Brilliance.</span>
                <br />
                <span className="bg-teal-600 bg-clip-text text-transparent">Master Tomorrow.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-teal-800 dark:text-teal-300 md:text-2xl">
                A national-level STEM talent assessment for Classes <strong>1-12</strong>. 
                Experience our precision diagnostic framework with personalized insights, AI-powered analytics, and recognition for young achievers.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/register" prefetch>
                  <button className="rounded-full bg-teal-600 px-10 py-4 text-xl font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-300">
                    Enroll Now for {priceLabel} ✨
                  </button>
                </Link>
                <Link href="#features">
                  <button className="rounded-full border-2 border-teal-600 px-10 py-4 text-xl font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-900/20">
                    Learn More
                  </button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
                {heroStats.map((stat, i) => (
                  <div key={i} className="rounded-xl bg-white p-6 shadow-lg dark:bg-teal-900">
                    <div className="text-4xl font-bold text-teal-600">{stat.value}</div>
                    <div className="mt-2 text-sm text-teal-700 dark:text-teal-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="relative mx-auto mt-16 aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
              <Image 
                src="/images/students-laptop.jpg" 
                alt="Students preparing for STEM talent test" 
                fill 
                className="object-cover" 
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Test Details from Admin Config */}
      <section className="border-b border-teal-200 bg-white px-4 py-16 dark:border-teal-800 dark:bg-teal-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-teal-900 dark:text-teal-50">{name}</h2>
              <p className="mt-4 text-lg text-teal-700 dark:text-teal-300 max-w-2xl mx-auto">{description}</p>
            </div>
          </Reveal>
          <Stagger className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-6 text-center dark:border-teal-800 dark:bg-teal-900/30">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-teal-900 dark:text-teal-50">{duration}</div>
              <div className="text-sm text-teal-600 dark:text-teal-400 mt-1">Test Duration</div>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-6 text-center dark:border-teal-800 dark:bg-teal-900/30">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-lg font-bold text-teal-900 dark:text-teal-50">{subjects.join(', ')}</div>
              <div className="text-sm text-teal-600 dark:text-teal-400 mt-1">Subjects Covered</div>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-6 text-center dark:border-teal-800 dark:bg-teal-900/30">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-teal-900 dark:text-teal-50">{priceLabel}</div>
              <div className="text-sm text-teal-600 dark:text-teal-400 mt-1">One-time Fee</div>
            </div>
          </Stagger>
          {features.length > 0 && (
            <Reveal delay={0.1}>
              <div className="mt-10 rounded-2xl border border-teal-200 bg-white p-6 dark:border-teal-800 dark:bg-teal-950">
                <h3 className="text-lg font-bold text-teal-900 dark:text-teal-50 mb-4">What You Get</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {features.map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs dark:bg-teal-900/30 dark:text-teal-400">✓</span>
                      <span className="text-teal-800 dark:text-teal-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
          {!isActive && (
            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-center text-amber-800 font-semibold dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300">
              ⚠️ Registrations are currently closed. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* What Makes This Unique */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20">
        <Reveal>
          <h2 className="text-center text-3xl md:text-4xl font-extrabold">What Makes Our Talent Test Unique?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-teal-800 dark:text-teal-300">
            This isn&apos;t just another exam. It&apos;s a comprehensive diagnostic tool that reveals how your child thinks, learns, and solves problems.
          </p>
        </Reveal>
        <Stagger className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {uniqueFeatures.map((item, idx) => (
            <div key={idx} className={`rounded-2xl border bg-white p-8 shadow-lg transition hover:shadow-xl dark:border-teal-800 dark:bg-teal-950 border-l-4 ${item.border}`}>
              <div className="mb-4 text-5xl">{item.icon}</div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-teal-800 dark:text-teal-300">{item.description}</p>
            </div>
          ))}
        </Stagger>
      </section>

      {/* Core Benefits */}
      <section className="border-y border-teal-200 bg-teal-50/30 px-4 py-20 dark:border-teal-800 dark:bg-teal-900/20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-center text-3xl md:text-4xl font-extrabold">Core Benefits</h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-teal-800 dark:text-teal-300">
              More than just a test score — get actionable insights that drive real improvement.
            </p>
          </Reveal>
          <Stagger className="mt-12 grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="rounded-2xl border border-teal-200 bg-white p-8 shadow-lg transition hover:shadow-xl dark:border-teal-800 dark:bg-teal-950">
                <div className="mb-4 text-5xl">{benefit.icon}</div>
                <h3 className="text-2xl font-bold">{benefit.title}</h3>
                <p className="mt-3 text-teal-800 dark:text-teal-300">{benefit.description}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <div className="mb-4 inline-block rounded-full bg-teal-100 px-4 py-1 text-sm font-medium text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                Diagnostic Report Preview
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-3xl md:text-4xl font-bold">See Exactly Where Your Child Excels & Struggles</h2>
              <p className="mt-4 text-lg text-teal-800 dark:text-teal-300">
                Our AI-powered diagnostic report goes beyond simple right/wrong answers. Get detailed insights into:
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">✓</span>
                  <div>
                    <div className="font-semibold">Error Type Classification</div>
                    <p className="text-sm text-teal-700 dark:text-teal-300">Procedural vs. conceptual mistakes identified for targeted remediation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">✓</span>
                  <div>
                    <div className="font-semibold">Topic-Wise Heatmaps</div>
                    <p className="text-sm text-teal-700 dark:text-teal-300">Visual representation of strengths and weaknesses across subjects</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">✓</span>
                  <div>
                    <div className="font-semibold">Comparative Analysis</div>
                    <p className="text-sm text-teal-700 dark:text-teal-300">Benchmarking against school, district, state, and national averages</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">✓</span>
                  <div>
                    <div className="font-semibold">Personalized Action Plan</div>
                    <p className="text-sm text-teal-700 dark:text-teal-300">Customized practice recommendations and learning resources</p>
                  </div>
                </li>
              </ul>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8">
                <Link href="/case-study" className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400">
                  See Real Student Success Stories →
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-xl dark:border-teal-800 dark:bg-teal-950">
                <h3 className="mb-4 text-lg font-bold">Sample Diagnostic Insight</h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-red-900 dark:text-red-300">Algebraic Simplification</span>
                      <span className="text-2xl font-bold text-red-700 dark:text-red-400">45%</span>
                    </div>
                    <p className="mt-2 text-xs text-red-800 dark:text-red-200">⚠️ Weak Area: Procedural errors with parentheses and sign changes</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-900 dark:text-amber-300">Fraction Operations</span>
                      <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">68%</span>
                    </div>
                    <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">⚡ Improving: LCM concepts need reinforcement</p>
                  </div>
                  <div className="rounded-lg bg-teal-50 p-4 dark:bg-teal-900/20">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-teal-900 dark:text-teal-300">Coordinate Geometry</span>
                      <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">92%</span>
                    </div>
                    <p className="mt-2 text-xs text-teal-800 dark:text-teal-200">✅ Strong: Excellent visualization and application skills</p>
                  </div>
                </div>
                <div className="mt-6 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-900">
                  <p className="text-sm font-semibold">📋 Recommended Action:</p>
                  <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300">
                    Focus next 2 weeks on step-by-step algebra practice with verification checklists. 
                    Continue coordinate geometry to maintain strength.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="rounded-xl bg-teal-50 p-6 text-center dark:bg-teal-900/20">
                <p className="font-semibold text-teal-950 dark:text-teal-50">
                  This level of detail is what sets Alyra Tech apart from generic assessments.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="border-y border-neutral-200 bg-neutral-50 px-4 py-20 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-center text-3xl md:text-4xl font-extrabold">Key Dates — Don&apos;t Miss Out!</h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-teal-800 dark:text-teal-200">
              Mark your calendar and ensure your child doesn&apos;t miss this opportunity.
            </p>
          </Reveal>
          <Stagger className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {importantDates.map((item, index) => (
              <div key={index} className={`rounded-2xl ${item.bgColor} border-t-4 p-8 shadow-lg ${item.color}`}>
                <p className={`text-sm font-bold uppercase tracking-wide ${item.textColor}`}>{item.label}</p>
                <p className={`mt-3 text-3xl md:text-5xl font-extrabold ${item.textColor}`}>{item.date}</p>
                <p className={`mt-2 text-lg font-medium ${item.textColor}`}>{item.year}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Reveal>
          <h2 className="text-center text-3xl md:text-4xl font-extrabold">What Students & Parents Say</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-neutral-700 dark:text-neutral-300">
            Real experiences from families who&apos;ve taken the Talent Test.
          </p>
        </Reveal>
        <Stagger className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-2xl text-amber-500">⭐</span>
                ))}
              </div>
              <p className="italic text-neutral-700 dark:text-neutral-300">&quot;{testimonial.quote}&quot;</p>
              <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </Stagger>
      </section>

      {/* FAQ Section */}
      <section className="border-y border-neutral-200 bg-neutral-50 px-4 py-20 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="text-center text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
          </Reveal>
          <Stagger className="mt-12 space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{faq.question}</h3>
                <p className="mt-3 text-neutral-700 dark:text-neutral-300">{faq.answer.replace('{{PRICE}}', priceLabel)}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Sample Papers CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-12 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="text-center">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-extrabold">Free Sample Papers & Study Materials</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700 dark:text-neutral-300">
                Download previous year question papers and prepare with confidence. 
                More resources unlock after registration!
              </p>
            </Reveal>
          </div>
          
          <Reveal delay={0.08}>
            <div className="mx-auto mt-10 max-w-2xl space-y-4">
              {[
                { title: 'Grade 5 — Sample Paper (Math + Science)', href: '/papers/sample-grade-5.pdf', badge: 'Free' },
                { title: 'Grade 8 — Science + Mathematics', href: '/papers/sample-grade-8.pdf', badge: 'Free' },
                { title: 'Grade 10 — Talent Assessment Paper', href: '/papers/sample-grade-10.pdf', badge: 'Free' },
              ].map((paper, idx) => (
                <a
                  key={idx}
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-white px-4 py-4 md:px-6 md:py-5 font-medium shadow-md transition hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5 dark:border-blue-800 dark:bg-blue-950"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <span className="text-neutral-800 dark:text-neutral-200">{paper.title}</span>
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {paper.badge} ⬇️
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/register" className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl hover:opacity-95">
                Register Now for Full Access
              </Link>
              <Link href="/contact" className="rounded-full border-2 border-blue-600 px-8 py-4 font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20">
                Request More Papers
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 md:p-12 text-white shadow-2xl">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="text-3xl font-bold md:text-5xl">Ready to Discover Your Child&apos;s True Potential?</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 text-xl opacity-95">
                Join 50,000+ students who&apos;ve already experienced the power of precision diagnostics. 
                For just {priceLabel}, get comprehensive insights that traditional exams can&apos;t provide.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link 
                  href="/register" 
                  className="rounded-full bg-white px-10 py-4 text-xl font-semibold text-teal-700 shadow-xl transition hover:shadow-2xl hover:opacity-95"
                >
                  Enroll Now — {priceLabel} Only
                </Link>
                <Link 
                  href="/product" 
                  className="rounded-full border-2 border-white px-10 py-4 text-xl font-semibold text-white transition hover:bg-white/10"
                >
                  See Full Product Suite
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">✅ Instant Confirmation</div>
                  <p className="mt-1 text-sm opacity-90">Hall ticket via WhatsApp immediately after payment</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">🏠 Test from Home</div>
                  <p className="mt-1 text-sm opacity-90">Online proctored test during Sept 1-7 window</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">📊 Detailed Report</div>
                  <p className="mt-1 text-sm opacity-90">Complete diagnostic analysis within 2 weeks</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <p className="mt-8 text-sm opacity-80">
                💬 Questions? Call <strong>+91-98765-43210</strong> or WhatsApp for instant support
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
