import { connectDB } from '@/lib/db';
import SiteStats from '@/models/SiteStats';
import Testimonial from '@/models/Testimonial';
import CaseStudy from '@/models/CaseStudy';
import PricingPlan from '@/models/PricingPlan';
import TalentTestConfig from '@/models/TalentTestConfig';

export async function seedDatabase() {
  await connectDB();

  // Site Stats
  const statsData = [
    {
      section: 'homepage',
      stats: [
        { key: 'tested', label: 'Students Tested', value: '50,000+', icon: '👨‍🎓' },
        { key: 'schools', label: 'Schools', value: '500+', icon: '🏫' },
        { key: 'accuracy', label: 'Diagnostic Accuracy', value: '99.5%', icon: '🎯' },
        { key: 'time', label: 'Teacher Time Saved', value: '40%', icon: '⏱️' },
      ],
    },
    {
      section: 'about',
      stats: [
        { key: 'founded', label: 'Founded', value: '2020', icon: '📅' },
        { key: 'schools', label: 'Schools Served', value: '500+', icon: '🏫' },
        { key: 'students', label: 'Students Impacted', value: '50K+', icon: '👨‍🎓' },
        { key: 'states', label: 'States Covered', value: '15', icon: '📍' },
      ],
    },
    {
      section: 'casestudy',
      stats: [
        { key: 'schools', label: 'Schools Served', value: '500+', icon: '🏫' },
        { key: 'improvement', label: 'Avg. Score Improvement', value: '26%', icon: '📈' },
        { key: 'students', label: 'Students Impacted', value: '50,000+', icon: '👨‍🎓' },
        { key: 'satisfaction', label: 'Parent Satisfaction', value: '95%', icon: '⭐' },
      ],
    },
    {
      section: 'benefits',
      stats: [
        { key: 'timeSaved', label: 'Time Saved', value: '40%', icon: '⏱️' },
        { key: 'betterResults', label: 'Avg. Score Improvement', value: '26%', icon: '📈' },
        { key: 'parentSatisfaction', label: 'Parent Engagement', value: '60%', icon: '😊' },
        { key: 'efficiency', label: 'Admin Efficiency', value: '80%', icon: '📋' },
      ],
    },
  ];

  for (const stats of statsData) {
    await SiteStats.findOneAndUpdate(
      { section: stats.section },
      stats,
      { upsert: true }
    );
  }

  console.log('✅ Stats seeded');

  // Testimonials
  const testimonialsData = [
    {
      section: 'homepage',
      quote: 'Alyra Tech transformed how we understand student learning. The diagnostic reports are incredibly detailed and actionable.',
      author: 'Dr. Rajesh Kumar',
      role: 'Principal',
      school: 'Delhi Public School',
      location: 'New Delhi',
      rating: 5,
      isActive: true,
      displayOrder: 1,
    },
    {
      section: 'homepage',
      quote: 'As a parent, I finally understand exactly where my child needs help. The transparency is amazing!',
      author: 'Priya Sharma',
      role: 'Parent',
      school: 'St. Xavier\'s High School',
      location: 'Mumbai',
      rating: 5,
      isActive: true,
      displayOrder: 2,
    },
    {
      section: 'benefits',
      quote: 'Our teachers finally have the data they need to personalize learning. Student engagement has never been higher.',
      author: 'Anita Desai',
      role: 'Academic Coordinator',
      school: 'Bangalore International School',
      location: 'Bangalore',
      rating: 5,
      isActive: true,
      displayOrder: 1,
    },
    {
      section: 'benefits',
      quote: 'The diagnostic reports helped us identify and address learning gaps we didn\'t even know existed. Game changer!',
      author: 'Suresh Menon',
      role: 'Vice Principal',
      school: 'Kendriya Vidyalaya',
      location: 'Pune',
      rating: 5,
      isActive: true,
      displayOrder: 2,
    },
    {
      section: 'benefits',
      quote: 'Parents love the transparency. They can see exactly what their children are working on and how to help at home.',
      author: 'Kavita Singh',
      role: 'School Director',
      school: 'Global Indian International School',
      location: 'Hyderabad',
      rating: 5,
      isActive: true,
      displayOrder: 3,
    },
  ];

  await Testimonial.deleteMany({});
  await Testimonial.insertMany(testimonialsData);

  console.log('✅ Testimonials seeded');

  // Case Studies
  const caseStudiesData = [
    {
      schoolName: 'St. Xavier\'s High School',
      location: 'Mumbai, Maharashtra',
      studentCount: 1200,
      challenge: 'Despite dedicated teachers, Class 8 math results stagnated at 62% average. Teachers felt overwhelmed trying to address individual gaps with 40-student classes. No systematic way to identify who needed what type of help.',
      solution: 'Implemented Alyra Tech Precision Diagnostic System across all 4 Class 8 sections (160 students). Baseline testing identified 12 core error types across algebra, geometry, and arithmetic. Generated personalized remediation plans with targeted worksheets.',
      results: [
        'Average score increased from 62% to 78% in 6 months (+26% improvement)',
        'Bottom quartile students improved by 35% on average',
        'Teacher satisfaction increased — focused interventions vs. generic tutoring',
        '90% of parents reported visible improvement in student confidence',
      ],
      metrics: [
        { label: 'Average Math Score', before: '62%', after: '78%', improvement: '+26%' },
        { label: 'Students Below 50%', before: '45', after: '12', improvement: '-73%' },
        { label: 'Teacher Prep Time', before: '8 hrs/week', after: '5 hrs/week', improvement: '-38%' },
      ],
      testimonial: {
        quote: 'Alyra Tech gave us the insights we needed to help every single student. The transformation has been remarkable.',
        author: 'Sr. Mary George',
        role: 'Principal',
      },
      isFeatured: true,
      isActive: true,
      displayOrder: 1,
    },
    {
      schoolName: 'Bangalore International School',
      location: 'Bangalore, Karnataka',
      studentCount: 2400,
      challenge: 'Large school with diverse student population struggled to maintain consistent quality across 80+ sections. Parent complaints about lack of personalized attention were increasing.',
      solution: 'Deployed complete ERP system with integrated diagnostic testing across grades 6-12. Automated attendance, fee management, and parent communication. Set up data dashboards for leadership team.',
      results: [
        'Reduced administrative overhead by 60%',
        'Parent satisfaction score increased from 72% to 91%',
        'Identified and addressed 200+ at-risk students proactively',
        'Saved ₹15 lakhs annually on paper and manual processes',
      ],
      metrics: [
        { label: 'Admin Time Saved', before: '40 hrs/week', after: '16 hrs/week', improvement: '60%' },
        { label: 'Parent Satisfaction', before: '72%', after: '91%', improvement: '+19pts' },
        { label: 'Paper Cost', before: '₹25L/yr', after: '₹10L/yr', improvement: '-60%' },
      ],
      isFeatured: false,
      isActive: true,
      displayOrder: 2,
    },
    {
      schoolName: 'Delhi Public School Sector 45',
      location: 'Gurgaon, Haryana',
      studentCount: 3200,
      challenge: 'Top-tier school wanted to move beyond traditional ranking to truly understand student learning patterns. Needed data to justify curriculum changes to board.',
      solution: 'Implemented comprehensive diagnostic framework with custom question banks aligned to CBSE curriculum. Created topic-wise and skill-wise analytics for entire secondary section.',
      results: [
        'Identified 15 critical curriculum gaps that were affecting 60%+ students',
        'Revised teaching sequence based on data — prerequisite skills taught first',
        'Board exam results improved by 12% year-over-year',
        'Featured in 3 education magazines for data-driven approach',
      ],
      metrics: [
        { label: 'Board Exam Pass %', before: '87%', after: '94%', improvement: '+7pts' },
        { label: 'Students 90%+', before: '45%', after: '62%', improvement: '+17pts' },
        { label: 'Teacher Turnover', before: '18%', after: '8%', improvement: '-56%' },
      ],
      isFeatured: false,
      isActive: true,
      displayOrder: 3,
    },
  ];

  await CaseStudy.deleteMany({});
  await CaseStudy.insertMany(caseStudiesData);

  console.log('✅ Case studies seeded');

  // Pricing Plans
  const pricingData = [
    {
      name: 'Starter',
      description: 'Perfect for small schools getting started with data-driven education',
      price: 50000,
      currency: 'INR',
      billingPeriod: 'yearly',
      features: [
        'Up to 200 students',
        'Core diagnostic testing (Math & Science)',
        'Basic analytics dashboard',
        'Email support',
        'Parent portal access',
        '1 admin user',
      ],
      studentLimit: 200,
      isPopular: false,
      isActive: true,
      displayOrder: 1,
    },
    {
      name: 'Professional',
      description: 'Most popular choice for medium-sized schools',
      price: 150000,
      currency: 'INR',
      billingPeriod: 'yearly',
      features: [
        'Up to 1000 students',
        'Full diagnostic suite (all subjects)',
        'Complete ERP system',
        'Advanced analytics & custom reports',
        'OMR scanning (500 sheets/month)',
        'Priority support',
        '5 admin users',
        'Teacher training included',
      ],
      studentLimit: 1000,
      isPopular: true,
      isActive: true,
      displayOrder: 2,
    },
    {
      name: 'Enterprise',
      description: 'For large institutions needing full customization',
      price: 400000,
      currency: 'INR',
      billingPeriod: 'yearly',
      features: [
        'Unlimited students',
        'All features included',
        'Alumni management system',
        'Unlimited OMR scanning',
        'Custom integrations (LMS, accounting)',
        'Dedicated account manager',
        'On-site implementation',
        'Unlimited admin users',
        '24/7 priority support',
        'Custom white-labeling',
      ],
      isPopular: false,
      isActive: true,
      displayOrder: 3,
    },
  ];

  await PricingPlan.deleteMany({});
  await PricingPlan.insertMany(pricingData);

  console.log('✅ Pricing plans seeded');

  // Talent Test Configuration
  const talentTestConfig = {
    name: 'Precision Baseline Assessment',
    description: 'Comprehensive diagnostic test to identify student strengths and areas for improvement across Mathematics, Science, and English',
    price: 100,
    currency: 'INR',
    duration: '45 minutes',
    subjects: ['Mathematics', 'Science', 'English'],
    features: [
      'Detailed diagnostic report with error analysis',
      'Personalized learning recommendations',
      'Subject-wise performance breakdown',
      'Instant results delivery via email',
      'Comparison with peer group performance',
    ],
    isActive: true,
  };

  await TalentTestConfig.deleteMany({});
  await TalentTestConfig.create(talentTestConfig);

  console.log('✅ Talent test configuration seeded');

  console.log('\n🎉 Database seeded successfully!\n');
}
