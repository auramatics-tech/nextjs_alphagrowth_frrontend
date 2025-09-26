'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Users, BarChart3, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '../components/common';
import { HomeLayout } from '../components/layout';
import { ROUTES } from '../utils';

// --- Hero Section Component ---
const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                    AI-Powered
                    <span className="block bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] bg-clip-text text-transparent">
                        Growth Platform
                    </span>
                </h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
                >
                    Transform your business with intelligent automation, data-driven insights, and multi-channel growth strategies.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Button
                        href={ROUTES.LOGIN}
                        className="px-8 py-4 text-lg bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Get Started
                        <ArrowRight className="ml-2" size={20} />
                    </Button>
                    
                    <Button
                        href="#features"
                        variant="outline"
                        className="px-8 py-4 text-lg border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Learn More
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    </section>
);

// --- Features Section Component ---
const FeaturesSection = () => {
    const features = [
        {
            icon: <Zap className="w-8 h-8 text-[#FF6B2C]" />,
            title: "AI-Powered Automation",
            description: "Automate your outreach with intelligent content generation and personalized messaging."
        },
        {
            icon: <BarChart3 className="w-8 h-8 text-[#3AA3FF]" />,
            title: "Advanced Analytics",
            description: "Get deep insights into your campaigns with real-time analytics and performance tracking."
        },
        {
            icon: <Users className="w-8 h-8 text-[#FF6B2C]" />,
            title: "Multi-Channel Outreach",
            description: "Reach prospects across LinkedIn, Email, and other channels with unified campaign management."
        },
        {
            icon: <Shield className="w-8 h-8 text-[#3AA3FF]" />,
            title: "Enterprise Security",
            description: "Bank-level security with SOC 2 compliance and advanced data protection."
        },
        {
            icon: <Globe className="w-8 h-8 text-[#FF6B2C]" />,
            title: "Global Scale",
            description: "Scale your operations globally with support for multiple languages and time zones."
        },
        {
            icon: <CheckCircle className="w-8 h-8 text-[#3AA3FF]" />,
            title: "Proven Results",
            description: "Join thousands of companies achieving 3x faster growth with our platform."
        }
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Everything you need to
                        <span className="block text-[#FF6B2C]">scale your business</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Our comprehensive platform provides all the tools and insights you need to accelerate growth and achieve your business goals.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Stats Section Component ---
const StatsSection = () => {
    const stats = [
        { number: "10,000+", label: "Active Users" },
        { number: "50M+", label: "Messages Sent" },
        { number: "95%", label: "Customer Satisfaction" },
        { number: "3x", label: "Average Growth" }
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Trusted by growing businesses
                    </h2>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto">
                        Join thousands of companies that have transformed their growth with AlphaGrowth.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
            <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                {stat.number}
                            </div>
                            <div className="text-white/90 text-lg">
                                {stat.label}
                    </div>
                        </motion.div>
                    ))}
                </div>
                    </div>
        </section>
    );
};

// --- CTA Section Component ---
const CTASection = () => (
    <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Ready to accelerate your growth?
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Start your free trial today and see the difference AI-powered growth can make for your business.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        href={ROUTES.SIGNUP}
                        className="px-8 py-4 text-lg bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Start Free Trial
                        <ArrowRight className="ml-2" size={20} />
                    </Button>
                    
                    <Button
                        href={ROUTES.LOGIN}
                        variant="outline"
                        className="px-8 py-4 text-lg border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Sign In
                    </Button>
                </div>
            </motion.div>
        </div>
    </section>
);

// --- Main Home Page Component ---
const HomePage = () => {
    return (
        <HomeLayout>
            <HeroSection />
            <FeaturesSection />
            <StatsSection />
            <CTASection />
        </HomeLayout>
    );
};

export default HomePage;