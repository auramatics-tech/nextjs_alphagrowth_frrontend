'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { AuthLayout } from '../../components/layout';
import { Input, Button } from '../../components/common';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ROUTES } from '../../utils';

// --- SVGs for Logos ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z" />
        <path fill="#34A853" d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98,.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.96,20.98,7.72,23,12,23Z" />
        <path fill="#FBBC05" d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43,.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z" />
        <path fill="#EA4335" d="M12,5.16c1.62,0,3.08,.56,4.22,1.66l3.15-3.15C17.46,1.83,14.97,1,12,1,7.72,1,3.96,3.02,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z" />
    </svg>
);

const OutlookIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M21.6 8.35v7.3c0 .82-.67 1.5-1.5 1.5H12v-10h8.1c.83 0 1.5.67 1.5 1.5z" fill="#0072C6" />
        <path d="M12 7.15v10.5l-8.4-6.3v-7.8L12 7.15z" fill="#0072C6" />
        <path d="M12 7.15L3.6 3.45v7.8l8.4 6.3V7.15z" fill="#0072C6" />
    </svg>
);

// --- Main Login Page Component ---
const LoginPage = () => {
    // Component state management - Single state object for better practice
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        showPassword: false,
        status: 'idle' as 'idle' | 'loading' | 'error' | 'disabled',
        error: null as string | null
    });

    const { login, isLoading: authLoading, error: authError, clearError } = useAuth();

    const isLoading = formData.status === 'loading' || authLoading;
    const isDisabled = formData.status === 'disabled' || isLoading;
    const displayError = formData.error || authError;

    // --- Form Submission Handler ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormData(prev => ({ ...prev, error: null }));
        clearError();
        setFormData(prev => ({ ...prev, status: 'loading' }));
        
        try {
            await login({ email: formData.email, password: formData.password });
            setFormData(prev => ({ ...prev, status: 'idle' }));
        } catch (err: any) {
            setFormData(prev => ({ 
                ...prev, 
                error: err.message || 'Login failed. Please try again.',
                status: 'error'
            }));
        }
    };

    // --- Input Change Handlers ---
    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ 
            ...prev, 
            [field]: e.target.value,
            status: prev.status === 'error' ? 'idle' : prev.status
        }));
    };

    const togglePasswordVisibility = () => {
        setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }));
    };

    // --- Social Login Handlers ---
    const handleGoogleLogin = () => {
        setFormData(prev => ({ ...prev, status: 'loading' }));
        // TODO: Implement Google OAuth
        setTimeout(() => setFormData(prev => ({ ...prev, status: 'idle' })), 2000);
    };

    const handleOutlookLogin = () => {
        setFormData(prev => ({ ...prev, status: 'loading' }));
        // TODO: Implement Outlook OAuth
        setTimeout(() => setFormData(prev => ({ ...prev, status: 'idle' })), 2000);
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-3xl font-bold text-[#1E1E1E] mb-2"
                    >
                        Welcome back
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-gray-600"
                    >
                        Sign in to your AlphaGrowth account
                    </motion.p>
                </div>

                {/* Social Login Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-3 mb-6"
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={isDisabled}
                        className="w-full h-12 flex items-center justify-center gap-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </Button>
                    
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleOutlookLogin}
                        disabled={isDisabled}
                        className="w-full h-12 flex items-center justify-center gap-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                        <OutlookIcon />
                        Continue with Outlook
                    </Button>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="relative my-6"
                >
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </motion.div>

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Email Input */}
                    <div>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            disabled={isDisabled}
                            required
                            className="h-12"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <Input
                            type={formData.showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            disabled={isDisabled}
                            required
                            className="h-12 pr-12"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            disabled={isDisabled}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {formData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Error Message */}
                    {displayError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                        >
                            <AlertTriangle size={16} />
                            <span className="text-sm">{displayError}</span>
                        </motion.div>
                    )}

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <a
                            href="#"
                            className="text-sm text-[#FF6B2C] hover:text-[#E55A1F] transition-colors"
                        >
                            Forgot your password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isDisabled}
                        className="w-full h-12 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={20} className="animate-spin" />
                                Signing in...
                            </div>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </motion.form>

                {/* Sign Up Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-center mt-6"
                >
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <a
                            href={ROUTES.SIGNUP}
                            className="text-[#FF6B2C] hover:text-[#E55A1F] font-semibold transition-colors"
                        >
                            Sign up
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </AuthLayout>
    );
};

export default LoginPage;
