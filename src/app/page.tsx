import Link from 'next/link';
import Image from 'next/image';
import { Hero3D, FeatureCard3D } from '@/components/Landing3D';
import { Reveal, Stagger } from '@/components/Reveal';
import { connectDB } from '@/lib/db';
import SiteStats from '@/models/SiteStats';
import TalentTestConfig from '@/models/TalentTestConfig';
import Testimonial from '@/models/Testimonial';
import FAQ from '@/models/FAQ';

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
      const [statsDoc, testConfig, testimonials, faqDocs]: [any, any, any[], any[]] = await Promise.all([
        SiteStats.findOne({ section: 'homepage' }).lean(),
        TalentTestConfig.findOne().lean(),
        Testimonial.find({ section: 'homepage', isActive: true }).sort({ displayOrder: 1 }).lean(),
        FAQ.find({ page: 'homepage', isActive: true }).sort({ displayOrder: 1 }).lean(),
      ]);
      /* eslint-enable @typescript-eslint/no-explicit-any */
      return {
        stats: statsDoc?.stats ?? [],
        testConfig: testConfig ?? null,
        testimonials: testimonials.map((t: any) => ({  // eslint-disable-line @typescript-eslint/no-explicit-any
          quote: t.quote, author: t.author,
          role: [t.role, t.school, t.location].filter(Boolean).join(', '),
          rating: t.rating ?? 5, image: t.image || null,
        })),
        faqs: faqDocs.map((f: any) => ({ question: f.question, answer: f.answer })), // eslint-disable-line @typescript-eslint/no-explicit-any
      };
    })();

    const timeoutPromise = new Promise<{ stats: never[]; testConfig: null; testimonials: never[]; faqs: never[] }>((resolve) =>
      setTimeout(() => resolve({ stats: [], testConfig: null, testimonials: [], faqs: [] }), 2000)
    );

    return await Promise.race([dataPromise, timeoutPromise]);
  } catch {
    return { stats: [], testConfig: null, testimonials: [], faqs: [] };
  }
}

export default async function HomePage() {
  const { stats, testConfig, testimonials, faqs } = await getHomePageData();
  
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
      <Hero3D />
      
      {/* Logos Strip */}
      <div className="border-b border-slate-200 bg-slate-50 py-10 dark:border-white/5 dark:bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-6 text-sm font-medium text-slate-500 uppercase tracking-widest">
            Trusted by forward-thinking institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
             {/* Simple Logo Boxes for "Professional" look */}
             {['Cambridge', 'Delhi Public School', 'Ryan International', 'VIBGYOR', 'Kendriya Vidyalaya'].map((name) => (
                <span key={name} className="text-base md:text-xl font-bold text-slate-400 dark:text-slate-300 transition-colors">{name}</span>
             ))}
          </div>
        </div>
      </div>

      {/* Main Feature Grid (Bento Style) */}
      <section className="relative z-10 py-16 md:py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="mb-12 md:mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Intelligence, Not Just Information.
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-400">
              Traditional report cards are dead data. We bring your school&apos;s performance metrics to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <FeatureCard3D 
              title="Deep Diagnostics" 
              description="Identify the exact concept gaps holding students back. It's like an MRI for education."
              icon="🧬"
            />
            <FeatureCard3D 
              title="Predictive ERP" 
              description="Manage your entire campus with a system that learns and adapts to your workflows."
              icon="⚡"
            />
             <FeatureCard3D 
              title="Alumni Network" 
              description="Turn your graduating class into your strongest asset with automated engagement."
              icon="🌐"
            />
            <FeatureCard3D 
              title="OMR Digitization" 
              description="Scan thousands of papers in minutes with 99.9% accuracy using just a smartphone."
              icon="📱"
            />
            <FeatureCard3D 
              title="Growth Analytics" 
              description="Visualize the trajectory of every student with beautiful, actionable charts."
              icon="📈"
            />
             <FeatureCard3D 
              title="Parent Connect" 
              description="Keep stakeholders in the loop without the chaos of WhatsApp groups."
              icon="💬"
            />
          </div>
        </div>
      </section>
      
      {/* Interactive Stat Band */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/5">
        <div className="container mx-auto px-4">
           <div className={`grid grid-cols-2 ${homeStats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-8 md:gap-12 text-center`}>
              {homeStats.map((stat) => (
                <div key={stat.key} className="py-4">
                   {stat.icon && <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>}
                   <div className="text-4xl md:text-6xl font-black text-white mb-2">{stat.value}</div>
                   <div className="text-emerald-400 font-mono text-xs md:text-sm tracking-wider">{stat.label.toUpperCase()}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-4">What Educators & Parents Say</h2>
              <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">Real feedback from schools and families using Alyra Tech.</p>
            </Reveal>
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((t: { quote: string; author: string; role: string; rating: number; image: string | null }, i: number) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => <span key={j} className="text-amber-500">⭐</span>)}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">&quot;{t.quote}&quot;</p>
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    {t.image ? (
                      <Image src={t.image} alt={t.author} width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">{t.author.charAt(0)}</div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{t.author}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
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
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-white/5">
          <div className="container mx-auto px-4 max-w-4xl">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>
            </Reveal>
            <Stagger className="space-y-6">
              {faqs.map((faq: { question: string; answer: string }, i: number) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{faq.question}</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 to-slate-950"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 sm:mb-8">
            Ready to upgrade your OS?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-8 md:mb-10 max-w-2xl mx-auto">
             Join the elite schools using data to drive decisions. <br />
             Pricing starts at just <span className="text-emerald-400 font-bold">{testPrice} INR</span> per assessment.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Link 
              href="/register" 
              className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 dark:text-slate-950 px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)]"
            >
              Start Now
             </Link>
             <Link
               href="/contact"
               className="rounded-full border-2 border-white/60 hover:bg-white hover:text-slate-900 text-white px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-medium transition-all hover:scale-105"
             >
               Contact Sales
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
