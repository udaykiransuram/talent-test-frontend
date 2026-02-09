import Link from 'next/link';
import Image from 'next/image';
import { Hero3D, FeatureCard3D } from '@/components/Landing3D';
import { Reveal, Stagger } from '@/components/Reveal';
import { connectDB } from '@/lib/db';
import SiteStats from '@/models/SiteStats';
import TalentTestConfig from '@/models/TalentTestConfig';
import Testimonial from '@/models/Testimonial';
import FAQ from '@/models/FAQ';
import ContactInfo from '@/models/ContactInfo';

export const revalidate = 60;

export const metadata = {
  title: 'Alyra Tech — The Future of Education Intelligence',
  description: 'AI-driven diagnostics for K-12 education. Identify learning gaps with precision.',
};

async function getHomePageData() {
  try {
    const dataPromise = (async () => {
      await connectDB();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const [statsDoc, testConfig, testimonials, faqDocs, contactInfo]: [any, any, any[], any[], any] = await Promise.all([
        SiteStats.findOne({ section: 'homepage' }).lean(),
        TalentTestConfig.findOne().lean(),
        Testimonial.find({ section: 'homepage', isActive: true }).sort({ displayOrder: 1 }).lean(),
        FAQ.find({ page: 'homepage', isActive: true }).sort({ displayOrder: 1 }).lean(),
        ContactInfo.findOne().lean(),
      ]);
      /* eslint-enable @typescript-eslint/no-explicit-any */
      const rawWa = (contactInfo?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').toString();
      const digits = rawWa.replace(/\D+/g, '');
      const whatsappHref = digits
        ? `https://wa.me/${digits}?text=${encodeURIComponent('Hello! I’d like to know more about Alyra Tech’s diagnostics.')}`
        : '';
      return {
        stats: statsDoc?.stats ?? [],
        testConfig: testConfig ?? null,
        testimonials: testimonials.map((t: any) => ({  // eslint-disable-line @typescript-eslint/no-explicit-any
          quote: t.quote, author: t.author,
          role: [t.role, t.school, t.location].filter(Boolean).join(', '),
          rating: t.rating ?? 5, image: t.image || null,
        })),
        faqs: faqDocs.map((f: any) => ({ question: f.question, answer: f.answer })), // eslint-disable-line @typescript-eslint/no-explicit-any
        whatsappHref,
      };
    })();

    const timeoutPromise = new Promise<{ stats: never[]; testConfig: null; testimonials: never[]; faqs: never[]; whatsappHref: '' }>((resolve) =>
      setTimeout(() => resolve({ stats: [], testConfig: null, testimonials: [], faqs: [], whatsappHref: '' }), 2000)
    );

    return await Promise.race([dataPromise, timeoutPromise]);
  } catch {
    return { stats: [], testConfig: null, testimonials: [], faqs: [], whatsappHref: '' };
  }
}

export default async function HomePage() {
  const { stats, testConfig, testimonials, faqs, whatsappHref } = await getHomePageData();
  
  // All stats from admin (dynamic)
  const homeStats: { key: string; label: string; value: string; icon?: string }[] = stats.length
    ? stats.map((s: { key: string; label: string; value: string | number; icon?: string }) => ({ key: s.key, label: s.label, value: String(s.value), icon: s.icon }))
    : [
        { key: 'tested', label: 'Students Tested', value: '50K+', icon: '👨‍🎓' },
        { key: 'schools', label: 'Schools', value: '500+', icon: '🏫' },
        { key: 'accuracy', label: 'Diagnostic Accuracy', value: '100%', icon: '🎯' },
        { key: 'time', label: 'Teacher Time Saved', value: '40%', icon: '⏱️' },
      ];
  const testPrice = testConfig?.price || 100;
  
  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-emerald-500/30 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500">
      
      {/* 3D Hero Section */}
      <Hero3D whatsappHref={whatsappHref} />
      
      {/* Premium Value Section (immediately after video) */}
      <section className="relative border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                See what’s working. See what’s missing.
              </h2>
              <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400">
                One diagnostic turns performance into clear decisions — from school rollups to individual misconceptions.
              </p>
            </div>
          </Reveal>

          <Stagger className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 items-stretch">
            {[ 
              { icon: '📊', title: 'Performance Snapshot', desc: 'Instant school → class → student rollups with trend context.' },
              { icon: '🧭', title: 'Strengths & Risks', desc: 'Ranked strengths and emerging risks by class and section.' },
              { icon: '🧩', title: 'Misconceptions Map', desc: 'Classify conceptual vs procedural errors per sub‑skill.' },
              { icon: '✅', title: 'Next Actions', desc: 'Printed worksheets and teaching moves mapped to gaps.' },
            ].map((c) => (
              <div
                key={c.title}
                className="group relative h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-1 bg-teal-500"></div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal-500/10 text-2xl text-teal-500">
                      {c.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{c.title}</h3>
                      <p className="mt-1.5 text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Stagger>

          <Reveal>
            <div className="mt-6 text-center">
              <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-600 dark:text-gray-400 italic">
                Outcome: Unified view of school→class→student trends, top strengths, risk areas, and targeted actions.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Feature Grid (Bento Style) */}
      <section className="relative z-10 pt-12 md:pt-16 pb-20 md:pb-28 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 md:mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-wide">
              Empowering Education Through Intelligent Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              At Alyra Tech, we transform traditional education metrics into actionable insights, helping schools, teachers, and students achieve their full potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <FeatureCard3D 
              title="Deep Diagnostics" 
              description="Pinpoint precise learning gaps with AI-powered analysis, enabling targeted interventions for every student."
              icon="🧬"
            />
            <FeatureCard3D 
              title="Predictive ERP" 
              description="Streamline campus management with adaptive systems that forecast needs and optimize operations."
              icon="⚡"
            />
             <FeatureCard3D 
              title="Alumni Network" 
              description="Build lasting connections with graduates through automated engagement tools and community platforms."
              icon="🌐"
            />
            <FeatureCard3D 
              title="OMR Digitization" 
              description="Digitize assessments effortlessly with high-accuracy scanning via mobile devices."
              icon="📱"
            />
            <FeatureCard3D 
              title="Growth Analytics" 
              description="Track student progress with intuitive visualizations and predictive trend analysis."
              icon="📈"
            />
             <FeatureCard3D 
              title="Parent Connect" 
              description="Facilitate seamless communication between schools and families with secure, organized channels."
              icon="💬"
            />
          </div>
        </div>
      </section>
      
      {/* Interactive Stat Band */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700">
        <div className="container mx-auto px-4">
           <div className={`grid grid-cols-2 ${homeStats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-8 md:gap-12 text-center`}>
              {homeStats.map((stat) => (
                <div key={stat.key} className="py-4">
                   {stat.icon && <div className="text-2xl md:text-3xl mb-2 text-primary">{stat.icon}</div>}
                   <div className="text-4xl md:text-6xl font-bold text-white mb-2">{stat.value}</div>
                   <div className="text-gray-400 text-xs md:text-sm tracking-wide uppercase">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">Voices from Our Community</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">Insights from educators and parents transforming education with Alyra Tech.</p>
            </Reveal>
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((t: { quote: string; author: string; role: string; rating: number; image: string | null }, i: number) => (
                <div key={i} className="bg-white dark:bg-gray-700 rounded-lg p-8 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-4 text-primary">
                    {[...Array(t.rating)].map((_, j) => <span key={j}>⭐</span>)}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">&quot;{t.quote}&quot;</p>
                  <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 flex items-center gap-3">
                    {t.image ? (
                      <Image src={t.image} alt={t.author} width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{t.author.charAt(0)}</div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.author}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
          <div className="container mx-auto px-4 max-w-4xl">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Common Questions Answered</h2>
            </Reveal>
            <Stagger className="space-y-6">
              {faqs.map((faq: { question: string; answer: string }, i: number) => (
                <div key={i} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
            Elevate Your Institution Today
          </h2>
          <p className="text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
             Join leading educational institutions leveraging data-driven insights to foster student success. <br />
             Pricing begins at just <span className="font-bold">{testPrice} INR</span> per assessment.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Link 
              href="/register" 
              className="rounded-md bg-white text-primary px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold transition-all hover:shadow-lg hover:-translate-y-1"
            >
              Get Started
             </Link>
             <Link
               href="/contact"
               className="rounded-md border-2 border-white text-white px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold transition-all hover:bg-white hover:text-primary hover:shadow-lg hover:-translate-y-1"
             >
               Schedule a Demo
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
