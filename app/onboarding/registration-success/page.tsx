'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../utils';

export default function RegistrationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('_token');
    if (!token) {
      router.push('/signup');
    }
  }, [router]);

  const handleRedirect = () => {
    router.push(ROUTES.ONBOARDING.BUSINESS_OVERVIEW);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="container px-5 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="flex flex-col justify-center">
              <div className="title mt-5 text-4xl font-bold text-gray-900">
                Welcome to Alphagrowth.ai
              </div>
              <div className="flex items-center justify-center mt-8">
                <img
                  src="/images/registration.png"
                  className="registration_img img-fluid max-w-md"
                  alt="Registration success"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-center">
              {/* Progress Stepper */}
              <div className="flex items-center mb-8">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= 2 ? 'btn-primary' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step <= 2 ? '✓' : step}
                    </div>
                    {step < 6 && (
                      <div className={`w-8 h-0.5 mx-2 ${
                        step < 2 ? 'btn-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-2xl font-bold text-gray-900 mb-4">
                Sign up Completed
              </div>
              <div className="text-gray-600 mb-6">
                You&apos;re just a few steps away from streamlining your Go-to-Market
                strategy, finding verified leads, personalizing outreach with
                AI, and automating your campaigns across LinkedIn & Email – all
                in one place. To get the best results, let&apos;s quickly understand
                your business.
              </div>

              <div className="mb-6">
                <iframe
                  width="100%"
                  height="307"
                  src="https://www.youtube.com/embed/ytWhBHJTxo0?si=j-PMo4CkJCrhb5sZ"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  onClick={handleRedirect}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Let&apos;s Personalize Your Experience
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









