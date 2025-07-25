import { connectDB } from '@/lib/db';
import Registration from '@/models/Registration';

export default async function SuccessPage({ params }: any) {
  await connectDB();
  const registration = await Registration.findOne({ orderId: params.orderId });

  if (!registration)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 px-4 py-12">
        <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 border border-red-200 text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Invalid Order ID</h1>
          <p className="text-neutral-700">We couldn&apos;t find your registration. Please check your link or contact support.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 py-12">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 border border-emerald-200 text-center">
        <h1 className="text-3xl font-extrabold text-emerald-800 mb-4">Registration Successful</h1>
        <p className="text-lg text-neutral-700 mb-2">
          Thank you, <span className="font-semibold text-emerald-700">{registration.name}</span>!
        </p>
        <p className="text-neutral-600 mb-4">
          Your payment was received. We&apos;ll contact you at <span className="font-medium text-emerald-700">{registration.email}</span>.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block px-6 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}