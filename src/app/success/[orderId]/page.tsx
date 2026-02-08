import { connectDB } from '@/lib/db';
import Registration from '@/models/Registration';
import Link from 'next/link';

interface SuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  await connectDB();
  const { orderId } = await params;
  const registration = await Registration.findOne({ orderId });

  if (!registration)
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4 py-12 dark:bg-teal-950">
        <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 border border-teal-200 text-center dark:bg-teal-950 dark:border-teal-800">
          <h1 className="text-2xl font-bold text-teal-700 mb-2 dark:text-teal-400">Invalid Order ID</h1>
          <p className="text-teal-800 dark:text-teal-300">We couldn&apos;t find your registration. Please check your link or contact support.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4 py-12 dark:bg-teal-950">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 border border-teal-200 text-center dark:bg-teal-950 dark:border-teal-800">
        <h1 className="text-3xl font-extrabold text-teal-800 mb-4 dark:text-teal-300">Registration Successful</h1>
        <p className="text-lg text-teal-900 mb-2 dark:text-teal-200">
          Thank you, <span className="font-semibold text-teal-700 dark:text-teal-400">{registration.studentName}</span>!
        </p>
        <p className="text-teal-800 mb-4 dark:text-teal-300">
          Your payment was received. We&apos;ll contact you at <span className="font-medium text-teal-700 dark:text-teal-400">{registration.phone}</span>.
        </p>
        {registration.hallTicket && (
          <div className="mt-4 rounded-lg bg-teal-50 p-4 dark:bg-teal-900/20">
            <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">Hall Ticket Number:</p>
            <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">{registration.hallTicket}</p>
          </div>
        )}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-lg bg-teal-600 text-white font-semibold shadow hover:bg-teal-700 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}