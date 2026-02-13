'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { load, CashfreeSDK } from '@cashfreepayments/cashfree-js';
import { useToast } from '@/components/ui/use-toast';

const classLevels = [
	{ value: '', label: 'Select Class' },
	{ value: '1', label: 'Class 1' },
	{ value: '2', label: 'Class 2' },
	{ value: '3', label: 'Class 3' },
	{ value: '4', label: 'Class 4' },
	{ value: '5', label: 'Class 5' },
	{ value: '6', label: 'Class 6' },
	{ value: '7', label: 'Class 7' },
	{ value: '8', label: 'Class 8' },
	{ value: '9', label: 'Class 9' },
	{ value: '10', label: 'Class 10' },
	{ value: '11', label: 'Class 11' },
	{ value: '12', label: 'Class 12' },
];

export default function TalentTestRegisterPage() {
    const [cashfreeSDK, setCashfreeSDK] = useState<CashfreeSDK | null>(null);
    const [loading, setLoading] = useState(false);
    const [testConfig, setTestConfig] = useState<{
        name?: string;
        price?: number;
        currency?: string;
        duration?: string;
        subjects?: string[];
        features?: string[];
        isActive?: boolean;
        registrationsOpen?: string | Date | null;
        registrationDeadline?: string | Date | null;
    } | null>(null);
	const [formData, setFormData] = useState({
		studentName: '',
		guardianName: '',
		phone: '',
		classLevel: '',
		aadhar: '',
		amount: '',
		careerAspiration: '',
		rollNumber: '',
	});
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const { toast } = useToast();

    // Determine if registration window is currently active
    const isRegistrationActive = (() => {
        if (!testConfig || testConfig.isActive === false) return false;
        const start = testConfig.registrationsOpen ? new Date(testConfig.registrationsOpen) : null;
        const end = testConfig.registrationDeadline ? new Date(testConfig.registrationDeadline) : null;
        if (!start || !end) return false;
        const now = new Date();
        return now >= start && now <= end;
    })();

	useEffect(() => {
    // Fetch public test configuration (avoid admin auth prompt)
    fetch('/api/talent-test-config')
			.then(res => res.json())
			.then(data => {
        if (data?.success && data?.data) {
          type PublicConfig = {
            name?: string;
            price?: number;
            currency?: string;
            duration?: string;
            subjects?: string[];
            features?: string[];
            isActive?: boolean;
            registrationsOpen?: string | Date | null;
            registrationDeadline?: string | Date | null;
          };
          const cfg = data.data as PublicConfig;
          setTestConfig(cfg);
          setFormData(prev => ({ ...prev, amount: String(cfg.price ?? '') }));
				}
			})
			.catch(err => console.error('Failed to fetch test config:', err));

		// Load Cashfree SDK
		load({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || 'sandbox' })
			.then(setCashfreeSDK)
			.catch(() => {
				toast({
					title: 'Error',
					description: 'Failed to load payment module. Please refresh.',
					variant: 'destructive',
				});
			});
	}, [toast]);

	const formatAadhar = (value: string) =>
		value.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		if (name === 'aadhar') {
			// Only allow digits and format with spaces
			const digits = value.replace(/\D/g, '').slice(0, 12);
			setFormData(prev => ({ ...prev, aadhar: formatAadhar(digits) }));
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const { studentName, guardianName, phone, classLevel, aadhar, careerAspiration, rollNumber } = formData;
		const aadharDigits = aadhar.replace(/\s+/g, '');

		if (!studentName || !guardianName || !phone || !classLevel || !aadharDigits || !careerAspiration || !rollNumber) {
			toast({
				title: 'Validation Error',
				description: 'Please fill in all required fields.',
				variant: 'destructive',
			});
			setLoading(false);
			return;
		}

		if (!/^[0-9]{10}$/.test(phone)) {
			toast({
				title: 'Validation Error',
				description: 'Enter a valid 10-digit phone number.',
				variant: 'destructive',
			});
			setLoading(false);
			return;
		}

		if (!/^\d{12}$/.test(aadharDigits)) {
			toast({
				title: 'Validation Error',
				description: 'Enter a valid 12-digit Aadhar number.',
				variant: 'destructive',
			});
			setLoading(false);
			return;
		}

    try {
      if (!isRegistrationActive) {
        toast({
          title: 'Registration not available',
          description: 'Registration window is currently closed. Please check back soon.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
			const res = await fetch('/api/cashfree/register-pay', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					aadhar: aadharDigits,
					role: 'student',
				}),
			});

			const data = await res.json();

			if (!res.ok || !data.payment_session_id) {
				throw new Error(data.message || 'Payment session error.');
			}

			await cashfreeSDK?.checkout({ paymentSessionId: data.payment_session_id });

			setFormData({
				studentName: '',
				guardianName: '',
				phone: '',
				classLevel: '',
				aadhar: '',
				amount: String(testConfig?.price ?? ''),
				careerAspiration: '',
				rollNumber: '',
			});
			toast({
				title: 'Success',
				description: 'Registration successful! Proceeding to payment.',
				variant: 'default',
			});
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast({
					title: 'Error',
					description: err.message || 'Something went wrong.',
					variant: 'destructive',
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-teal-50 px-4 py-12 dark:bg-teal-950">
			<div className="mx-auto max-w-4xl">
				{/* Registration window notice */}
				{!isRegistrationActive && (
					<div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
						<strong>Registration will be available soon.</strong> Please check back when the registration window opens.
					</div>
				)}
				{/* Header Section */}
				<div className="mb-10 text-center">
					<div className="mb-4 inline-block rounded-full bg-teal-100 px-4 py-1 text-sm font-medium text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
						Step 1 of 1
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight text-teal-950 dark:text-white md:text-5xl">
						{testConfig?.name || 'Talent Test'} Registration
					</h1>
					<p className="mt-4 text-lg text-teal-800 dark:text-teal-300">
						Fill in the details below to secure your spot in the national-level STEM assessment.
					{testConfig?.duration && <span className="block mt-1 text-sm font-medium text-teal-600 dark:text-teal-400">⏱ Duration: {testConfig.duration} &bull; Subjects: {(testConfig.subjects || ['Mathematics', 'Science', 'English']).join(', ')}</span>}
					</p>
					<div className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-lg font-bold text-white shadow-lg">
					<span className="text-2xl">
						{testConfig?.currency === 'INR' ? '₹' : testConfig?.currency === 'USD' ? '$' : testConfig?.currency ? '€' : ''}
						{typeof testConfig?.price === 'number' ? testConfig.price : ''}
					</span>
						<span className="text-sm font-normal opacity-90">Registration Fee</span>
					</div>
				</div>

				{/* Main Form Card */}
				<div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-teal-200 dark:bg-teal-950 dark:ring-teal-800 md:p-10">
					<fieldset disabled={!isRegistrationActive} className="space-y-6 disabled:opacity-75">
						<form onSubmit={handleSubmit} className="space-y-6">
						{/* Student Details Section */}
						<div className="space-y-6">
							<h2 className="flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
								<span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">1</span>
								Student Information
							</h2>

							{/* Student Name */}
							<div>
									<label className="mb-2 block text-sm font-semibold text-teal-800 dark:text-teal-300" htmlFor="studentName">
										Student Full Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="studentName"
										id="studentName"
										value={formData.studentName}
										onChange={handleChange}
										placeholder="Enter student's full name as per Aadhar"
									className="w-full rounded-lg border border-teal-200 bg-white px-4 py-3 text-teal-950 placeholder-teal-600 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-teal-800 dark:bg-teal-900 dark:text-white dark:placeholder-teal-400"
									required
								/>
							</div>

							{/* Roll Number */}
							<div>
									<label className="mb-2 block text-sm font-semibold text-teal-800 dark:text-teal-300" htmlFor="rollNumber">
										School Roll Number <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="rollNumber"
										id="rollNumber"
										value={formData.rollNumber}
										onChange={handleChange}
										placeholder="Current school roll number"
										className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
									required
								/>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								{/* Class */}
								<div>
									<label className="mb-2 block text-sm font-semibold text-teal-800 dark:text-teal-300" htmlFor="classLevel">
										Current Class <span className="text-red-500">*</span>
									</label>
									<select
										name="classLevel"
										id="classLevel"
										value={formData.classLevel}
										onChange={handleChange}
										className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
										required
									>
										{classLevels.map(level => (
											<option key={level.value} value={level.value} disabled={level.value === ''}>
												{level.label}
											</option>
										))}
									</select>
								</div>

								{/* Phone */}
								<div>
									<label className="mb-2 block text-sm font-semibold text-teal-800 dark:text-teal-300" htmlFor="phone">
										Mobile Number <span className="text-red-500">*</span>
									</label>
									<input
										type="tel"
										name="phone"
										id="phone"
										value={formData.phone}
										onChange={handleChange}
										placeholder="10-digit mobile number"
										pattern="[0-9]{10}"
										className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
										required
									/>
									<p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
										Hall ticket will be sent via WhatsApp to this number
									</p>
								</div>
							</div>

							{/* Aadhar */}
							<div>
									<label className="mb-2 block text-sm font-semibold text-teal-800 dark:text-teal-300" htmlFor="aadhar">
										Aadhar Number <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="aadhar"
										id="aadhar"
										value={formData.aadhar}
										onChange={handleChange}
										placeholder="1234 5678 9012"
										maxLength={14} // 12 digits + 2 spaces
										className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
									required
								/>
								<p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
									Required for identity verification and hall ticket generation
								</p>
							</div>

							{/* Career Aspiration */}
							<div>
									<label className="mb-2 block text-sm font-semibold text-teal-800 dark:text-teal-300" htmlFor="careerAspiration">
										Career Aspiration <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="careerAspiration"
										id="careerAspiration"
										value={formData.careerAspiration}
										onChange={handleChange}
										placeholder="e.g., Doctor, Engineer, Scientist, Artist, etc."
										className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
									required
								/>
								<p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
									What does the student want to be when they grow up?
								</p>
							</div>
						</div>

						{/* Guardian Details Section */}
						<div className="space-y-6 border-t border-teal-200 pt-6 dark:border-teal-800">
							<h2 className="flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
								<span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">2</span>
								Guardian Information
							</h2>

							{/* Guardian Name */}
							<div>
								<label className="mb-2 block text-sm font-semibold text-teal-800 dark:text-teal-300" htmlFor="guardianName">
									Parent/Guardian Full Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="guardianName"
									id="guardianName"
									value={formData.guardianName}
									onChange={handleChange}
									placeholder="Enter parent or guardian's full name"
									className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
									required
								/>
							</div>
						</div>

						{/* Terms & Conditions */}
						<div className="space-y-4 border-t border-teal-200 pt-6 dark:border-teal-800">
							<div className="rounded-lg bg-teal-50 p-4 ring-1 ring-teal-200 dark:bg-teal-900/10 dark:ring-teal-800">
								<div className="flex items-start gap-3">
									<input
										type="checkbox"
										id="terms"
										checked={acceptedTerms}
										onChange={e => setAcceptedTerms(e.target.checked)}
										className="mt-1 h-5 w-5 rounded border-neutral-300 text-teal-600 transition focus:ring-2 focus:ring-teal-500/20"
										required
									/>
									<label htmlFor="terms" className="text-sm text-teal-900 dark:text-teal-200">
										I accept the{' '}
										<Link
											href="/terms"
											target="_blank"
											rel="noopener noreferrer"
											className="font-semibold text-teal-700 underline hover:text-teal-800 dark:text-teal-400"
										>
											Terms & Conditions
										</Link>{' '}
										and confirm that all information provided is accurate. I understand that the registration fee is non-refundable once payment is completed.
									</label>
								</div>
							</div>

							{!acceptedTerms && (
								<p className="text-sm font-medium text-teal-700 dark:text-teal-400">
									⚠️ Please accept the terms and conditions to proceed
								</p>
							)}
						</div>

						{/* Submit Button */}
						<div className="space-y-4 border-t border-teal-200 pt-6 dark:border-teal-800">
							<button
								type="submit"
								disabled={loading || !cashfreeSDK || !acceptedTerms}
								className={`w-full rounded-lg py-4 text-lg font-semibold transition-all ${
									loading || !cashfreeSDK || !acceptedTerms
										? 'cursor-not-allowed bg-neutral-300 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-600'
										: 'bg-teal-600 text-white shadow-lg hover:shadow-xl hover:opacity-95'
								}`}
							>
								{loading
									? '⏳ Processing...'
									: !cashfreeSDK
									? '⏳ Loading Payment Gateway...'
								: `💳 Pay ${testConfig?.currency === 'INR' ? '₹' : testConfig?.currency === 'USD' ? '$' : testConfig?.currency ? '€' : ''}${typeof testConfig?.price === 'number' ? testConfig.price : ''} & Complete Registration`}
							</button>

							<p className="text-center text-xs text-neutral-600 dark:text-neutral-400">
								🔒 Secure payment powered by Cashfree • Your data is encrypted and safe
							</p>
						</div>
                    </form>
					</fieldset>
					{/* Benefits Reminder */}
					<div className="mt-8 space-y-3 rounded-lg bg-teal-50 p-6 dark:bg-teal-900/10">
						<h3 className="font-semibold text-teal-900 dark:text-teal-300">What you&apos;ll get:</h3>
						<ul className="space-y-2 text-sm text-teal-800 dark:text-teal-200">
							{(testConfig?.features && testConfig.features.length > 0
								? testConfig.features
								: [
									'Instant hall ticket generation via WhatsApp',
									'Comprehensive STEM assessment for your class level',
									'Detailed performance report with error-type analysis',
									'Study materials and previous year papers',
									'Certificates and awards for top performers',
									'Eligibility for mentorship programs with STEM experts',
								]
							).map((item, idx) => (
								<li key={idx} className="flex items-start gap-2">
									<span className="mt-0.5">✓</span>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Help Section */}
				<div className="mt-8 text-center">
					<p className="text-sm text-teal-800 dark:text-teal-300">
						Need help? Contact us at{' '}
						<a href="tel:+919876543210" className="font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400">
							+91-98765-43210
						</a>{' '}
						or WhatsApp us for instant support.
					</p>
					<Link
						href="/talent-test"
						className="mt-3 inline-block text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-400"
					>
						← Back to Talent Test Details
					</Link>
				</div>
			</div>
		</div>
	);
}
