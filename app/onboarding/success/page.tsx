'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, ArrowRight, PlayCircle, Check, BrainCircuit, Target, Users } from 'lucide-react';
import { Header } from '../../../components/layout';

// --- Reusable Themed Components ---

const OnboardingStepper = ({ currentStep, totalSteps = 6 }: { currentStep: number; totalSteps?: number }) => (
    <div className="flex items-center">
        {[...Array(totalSteps)].map((_, i) => {
            const step = i + 1;
            const isCompleted = step <= currentStep;
            return (
                <React.Fragment key={i}>
                    <div className="flex items-center flex-col">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white`}>
                           <Check size={16} />
                        </div>
                    </div>
                    {i < totalSteps - 1 && <div className={`h-0.5 flex-1 rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF]`}></div>}
                </React.Fragment>
            );
        })}
    </div>
);

const FeatureHighlight = ({ icon: Icon, title, description }: any) => (
    <motion.div 
        className="flex items-start gap-4"
        variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
        }}
    >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 text-[#1E1E1E] flex items-center justify-center">
            <Icon size={20}/>
        </div>
        <div>
            <h3 className="font-semibold text-base text-[#1E1E1E]">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </motion.div>
);


// --- Main Page Component ---
export default function OnboardingAllSetPage() {
    const handlePrimaryAction = () => {
        window.location.href = '/campaigns';
    };

    const handleSecondaryAction = () => {
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
                
                {/* --- Left Educational Panel --- */}
                <motion.div 
                    className="hidden lg:flex flex-col p-8"
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
                >
                    <motion.h1 
                        className="text-4xl font-bold text-[#1E1E1E]"
                        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
                    >
                        Your GTM Foundation is Set
                    </motion.h1>
                    <motion.div 
                        className="mt-6"
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    >
                        <OnboardingStepper currentStep={6} totalSteps={6} />
                    </motion.div>
                    
                    <motion.div 
                        className="mt-8 border-t border-gray-200 pt-8 space-y-6"
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    >
                        <h2 className="text-xl font-semibold text-[#1E1E1E]">What You&apos;ve Unlocked:</h2>
                        <FeatureHighlight
                            icon={Users}
                            title="A High-Value Customer Profile"
                            description="Your ICP now acts as a blueprint for our AI to find and verify high-intent leads across our data network."
                        />
                        <FeatureHighlight
                            icon={Target}
                            title="A Strategic GTM Goal"
                            description="Your goal provides the 'North Star' for the AI, ensuring every message and sequence is optimized to hit your targets."
                        />
                         <FeatureHighlight
                            icon={BrainCircuit}
                            title="AI-Powered Personalization"
                            description="With your context, our AI is ready to generate hyper-personalized content that resonates with your ideal customers."
                        />
                    </motion.div>
                </motion.div>

                {/* --- Right Celebratory Panel --- */}
                <motion.div
                    className="w-full rounded-2xl bg-white shadow-lg p-10 md:p-14 text-center border border-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
                >
                    <motion.div
                        className="inline-block"
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.4 }}
                    >
                        <PartyPopper
                            strokeWidth={1.5}
                            className="h-20 w-20 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-transparent bg-clip-text"
                        />
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] mt-4">
                        You&apos;re All Set 🎉
                    </h1>

                    <p className="text-base text-gray-600 max-w-md mx-auto mt-3">
                        You are now ready to launch your first AI-powered campaign and start generating pipeline.
                    </p>

                    <div className="aspect-video w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-md mt-8 border border-gray-200 group relative">
                        <img src="https://placehold.co/1280x720/1E1E1E/FFFFFF?text=AlphaGrowth+Intro" alt="Onboarding video thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer">
                            <PlayCircle className="text-white/80 h-16 w-16 group-hover:scale-110 group-hover:text-white transition-transform duration-300" />
                        </div>
                    </div>
                     <p className="text-sm font-semibold text-gray-700 mt-2">Watch how to create a campaign with AlphaGrowth (2 min)</p>

                    <div className="mt-8">
                        <button
                            onClick={handlePrimaryAction}
                            className="h-12 w-full md:w-auto px-8 rounded-xl text-white font-semibold shadow-md bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B2C] transition-opacity flex items-center justify-center gap-2 mx-auto"
                        >
                            Start My First Campaign
                            <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={handleSecondaryAction}
                            className="mt-4 text-sm font-semibold text-gray-500 hover:text-gray-800"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </motion.div>
            </div>
            </div>
        </div>
    );
}
