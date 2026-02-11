import Link from 'next/link';
import Image from 'next/image';
import { Hero3D } from '@/components/Landing3D';
import { ProCard } from '@/components/ProCard';
import Parallax from '@/components/Parallax';
import GlassPanel from '@/components/GlassPanel';
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
      // Mirror Contact page behavior: fallback to phone if whatsappNumber is not set
      const rawWa = (contactInfo?.whatsappNumber || contactInfo?.phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').toString();
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
    <div className="relative min-h-screen text-slate-900 selection:bg-teal-500/30 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500">
      {/* Ambient background gradients for glassy feel */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
      
      {/* 3D Hero Section with subtle rotating light rays */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -top-32 h-[520px] opacity-40 [mask-image:radial-gradient(60%_50%_at_50%_40%,black,transparent)]"
        >
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(59,130,246,0.15),_rgba(16,185,129,0.12),_rgba(6,182,212,0.12),_rgba(59,130,246,0.15))] blur-2xl animate-spin-slow" />
        </div>
        <Hero3D whatsappHref={whatsappHref} />
      </div>
      
      {/* Premium Value Section (immediately after video) */}
      <section className="relative border-t border-gray-200/50 dark:border-gray-800/60 bg-transparent text-gray-900 dark:text-gray-100">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                See what’s working. See what’s missing.
              </h2>
              <p className="mt-4 text-lg md:text-xl text-slate-900/90">
                One diagnostic turns performance into clear decisions — from school rollups to individual misconceptions.
              </p>
            </div>
          </Reveal>

          {/* Cards wrapper (full-bleed, sharp edges touching page) */}
          <Parallax className="relative mt-8 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen" speed={0.05}>
            <GlassPanel
              className="rounded-none shadow-[0_20px_80px_rgba(0,0,0,0.15)] transition-shadow duration-500 hover:ring-1 hover:ring-white/10"
              bgClassName="bg-[#00ff09]"
              blurClassName="backdrop-blur-xl backdrop-saturate-150"
              borderClassName="border-white/30 dark:border-white/10"
              veilClassName="bg-white/20"
              textureUrl="https://www.transparenttextures.com/patterns/black-linen-2.png"
              textureOpacityClass="opacity-100"
              radiusClassName="rounded-none"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
                <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 items-stretch">
                  {[
                    { icon: '📊', title: 'Performance Snapshot', desc: 'Instant school → class → student rollups with trend context.' },
                    { icon: '🧭', title: 'Strengths & Risks', desc: 'Ranked strengths and emerging risks by class and section.' },
                    { icon: '🧩', title: 'Misconceptions Map', desc: 'Classify conceptual vs procedural errors per sub‑skill.' },
                    { icon: '✅', title: 'Next Actions', desc: 'Printed worksheets and teaching moves mapped to gaps.' },
                  ].map((c) => (
                    <ProCard key={c.title} icon={c.icon} title={c.title} description={c.desc} accent="teal" />
                  ))}
                </Stagger>
              </div>
            </GlassPanel>
          </Parallax>

          <Reveal>
            <div className="mt-6 text-center">
              <p className="mx-auto max-w-3xl text-sm md:text-base text-slate-900/80 italic">
                Outcome: Unified view of school→class→student trends, top strengths, risk areas, and targeted actions.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Feature Grid (Bento Style) */}
      <section className="relative z-10 pt-12 md:pt-16 pb-20 md:pb-28 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="mb-12 md:mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-wide">
              Empowering Education Through Intelligent Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-900/90">
              At Alyra Tech, we transform traditional education metrics into actionable insights, helping schools, teachers, and students achieve their full potential.
            </p>
          </div>

          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
            <GlassPanel
              className="rounded-none shadow-[0_20px_80px_rgba(0,0,0,0.15)] transition-shadow duration-500 hover:ring-1 hover:ring-white/10"
              bgClassName="bg-[#00ff09]"
              blurClassName="backdrop-blur-xl backdrop-saturate-150"
              borderClassName="border-white/30 dark:border-white/10"
              veilClassName="bg-white/20"
              textureUrl="https://www.transparenttextures.com/patterns/black-linen-2.png"
              textureOpacityClass="opacity-100"
              radiusClassName="rounded-none"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {[
                    { title: 'Deep Diagnostics', description: 'Pinpoint precise learning gaps with AI-powered analysis, enabling targeted interventions for every student.', icon: '🧬' },
                    { title: 'Predictive ERP', description: 'Streamline campus management with adaptive systems that forecast needs and optimize operations.', icon: '⚡' },
                    { title: 'Alumni Network', description: 'Build lasting connections with graduates through automated engagement tools and community platforms.', icon: '🌐' },
                    { title: 'OMR Digitization', description: 'Digitize assessments effortlessly with high-accuracy scanning via mobile devices.', icon: '📱' },
                    { title: 'Growth Analytics', description: 'Track student progress with intuitive visualizations and predictive trend analysis.', icon: '📈' },
                    { title: 'Parent Connect', description: 'Facilitate seamless communication between schools and families with secure, organized channels.', icon: '💬' },
                  ].map((f) => (
                    <ProCard key={f.title} icon={f.icon} title={f.title} description={f.description} accent="teal" />
                  ))}
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>
      
      {/* Interactive Stat Band (glassy) */}
      <section className="py-16 md:py-24 bg-transparent border-t border-gray-200/50 dark:border-gray-800/60 relative">
        <Parallax className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen" speed={0.04}>
          <GlassPanel
            className="rounded-none shadow-[0_20px_80px_rgba(0,0,0,0.15)] transition-shadow duration-500 hover:ring-1 hover:ring-white/10"
            bgClassName="bg-[#0b1220]"
            blurClassName="backdrop-blur-none"
            borderClassName="border-white/20"
            noHighlight
            radiusClassName="rounded-none"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-8 md:py-12">
              <div className={`grid grid-cols-2 ${homeStats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-6 md:gap-8 text-center`}>
                {homeStats.map((stat) => (
                  <div key={stat.key} className="py-1">
                    <div className="rounded-2xl border border-white/30 bg-[#0b1220]/40 backdrop-blur-md px-4 py-5 flex flex-col items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)] hover:border-white/50 hover:bg-white/10 sheen-card">
                      {stat.icon && <div className="text-2xl md:text-3xl text-white">{stat.icon}</div>}
                      <div className="text-4xl md:text-6xl font-bold text-white tracking-tight">{stat.value}</div>
                      <div className="text-white/80 text-[10px] md:text-xs tracking-wide uppercase">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </Parallax>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-transparent relative">
          <div className="container mx-auto px-4">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">Voices from Our Community</h2>
              <p className="text-center text-slate-900/85 max-w-2xl mx-auto mb-12">Insights from educators and parents transforming education with Alyra Tech.</p>
            </Reveal>
            <Parallax className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen" speed={0.03}>
              <GlassPanel
                className="rounded-none shadow-[0_20px_80px_rgba(0,0,0,0.15)] transition-shadow duration-500 hover:ring-1 hover:ring-white/10"
                bgClassName="bg-[#00ff09]"
                blurClassName="backdrop-blur-xl backdrop-saturate-150"
                borderClassName="border-white/30 dark:border-white/10"
                veilClassName="bg-white/15"
                textureUrl="https://www.transparenttextures.com/patterns/black-linen-2.png"
                textureOpacityClass="opacity-100"
                radiusClassName="rounded-none"
              >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
                  <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((t: { quote: string; author: string; role: string; rating: number; image: string | null }, i: number) => (
                      <div key={i} className="rounded-2xl p-6 md:p-7 border border-white/30 bg-white/60 backdrop-blur-sm text-slate-900 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)] hover:bg-white/70 hover:border-white/50">
                        <div className="flex gap-1 mb-4 text-teal-500">
                          {[...Array(t.rating)].map((_, j) => <span key={j}>⭐</span>)}
                        </div>
                        <p className="text-slate-900 leading-relaxed">&quot;{t.quote}&quot;</p>
                        <div className="mt-6 pt-4 border-t border-white/20 dark:border-white/10 flex items-center gap-3">
                          {t.image ? (
                            <Image src={t.image} alt={t.author} width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">{t.author.charAt(0)}</div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{t.author}</p>
                            <p className="text-xs text-slate-700/80">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Stagger>
                </div>
              </GlassPanel>
            </Parallax>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-transparent border-t border-gray-200/50 dark:border-gray-800/60 relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Common Questions Answered</h2>
            </Reveal>
            <Parallax className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen" speed={0.025}>
              <GlassPanel
                className="rounded-none shadow-[0_20px_80px_rgba(0,0,0,0.15)] transition-shadow duration-500 hover:ring-1 hover:ring-white/10"
                bgClassName="bg-[#00ff09]"
                blurClassName="backdrop-blur-xl backdrop-saturate-150"
                borderClassName="border-white/30 dark:border-white/10"
                veilClassName="bg-white/15"
                textureUrl="https://www.transparenttextures.com/patterns/black-linen-2.png"
                textureOpacityClass="opacity-100"
                radiusClassName="rounded-none"
              >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
                  <Stagger className="space-y-4 md:space-y-6">
                    {faqs.map((faq: { question: string; answer: string }, i: number) => (
                      <div key={i} className="rounded-2xl border border-teal-500/15 bg-white/20 backdrop-blur-sm p-5 md:p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/30 hover:border-teal-500/30 shadow-sm hover:shadow-md">
                        <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
                        <p className="mt-3 text-slate-800/90 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </Stagger>
                </div>
              </GlassPanel>
            </Parallax>
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
              className="rounded-md bg-white text-primary px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold transition-all hover:shadow-lg hover:-translate-y-1 sheen-btn"
            >
              Get Started
             </Link>
             <Link
               href="/contact"
               className="rounded-md border-2 border-white text-white px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold transition-all hover:bg-white hover:text-primary hover:shadow-lg hover:-translate-y-1 sheen-btn"
             >
               Schedule a Demo
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
