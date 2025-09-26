'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Eye, EyeOff, Loader2, CheckCircle, XCircle, 
    Zap, BarChart3, Target, User, Mail, Lock, ArrowRight 
} from 'lucide-react';
import { AuthLayout, Input, Button, ProgressStepper } from '../../components';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ROUTES } from '../../utils';
import { validateSignupForm, validateField, FormErrors } from '../../utils/validation';
import * as yup from 'yup';

// --- SVGs for Logos ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z" />
        <path fill="#34A853" d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98,.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.96,20.98,7.72,23,12,23Z" />
        <path fill="#FBBC05" d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43,.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z" />
        <path fill="#EA4335" d="M12,5.16c1.62,0,3.08,.56,4.22,1.66l3.15-3.15C17.46,1.83,14.97,1,12,1,7.72,1,3.96,3.02,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z" />
    </svg>
);

// --- Reusable & Improved Components ---
const FeatureHighlight = ({ icon: Icon, title, description }: { 
    icon: React.ElementType; 
    title: string; 
    description: string; 
}) => (
    <motion.div 
        className="flex items-start gap-4"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
    >
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] flex items-center justify-center text-white shadow-md">
            <Icon size={20}/>
        </div>
        <div>
            <h3 className="font-semibold text-base text-[#111113]">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </motion.div>
);

const PasswordChecklist = ({ validation }: { 
    validation: { hasLength: boolean; hasNumber: boolean; hasSymbol: boolean; }; 
}) => (
    <ul className="space-y-1.5 mt-2">
        {[
            { name: 'At least 8 characters', valid: validation.hasLength }, 
            { name: 'Contains a number', valid: validation.hasNumber }, 
            { name: 'Contains a symbol', valid: validation.hasSymbol }
        ].map(check => (
            <li key={check.name} className={`flex items-center text-xs transition-colors ${check.valid ? 'text-green-600' : 'text-gray-500'}`}>
                {check.valid ? <CheckCircle size={14} className="mr-2" /> : <XCircle size={14} className="mr-2 text-gray-400" />}
                {check.name}
            </li>
        ))}
    </ul>
);

// Yup validation schema
const signupSchema = yup.object({
    name: yup.string()
        .required('Full name is required')
        .min(2, 'Full name must be at least 2 characters')
        .max(50, 'Full name must be less than 50 characters'),
    email: yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    tosAccepted: yup.boolean()
        .oneOf([true], 'You must accept the Terms of Service and Privacy Policy')
});

// --- Main SignUp Page Component ---
const SignUpPage = () => {
    // formData - ONLY field values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        tosAccepted: false
    });

    // Separate state for UI-related data
    const [uiState, setUiState] = useState({
        showPassword: false,
        status: 'idle' as 'idle' | 'loading',
        error: null as string | null,
        passwordValidation: { 
            hasLength: false, 
            hasNumber: false, 
            hasSymbol: false 
        }
    });

    // Separate state for field errors
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

    const { signup, isLoading: authLoading, error: authError, clearError } = useAuth();

    // Form validation using Yup
    const validateForm = async () => {
        try {
            await signupSchema.validate(formData, { abortEarly: false });
            setFieldErrors({});
            return true;
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors = error.inner.reduce((acc, err) => {
                    if (err.path) {
                        acc[err.path as keyof FormErrors] = err.message;
                    }
                    return acc;
                }, {} as FormErrors);
                setFieldErrors(errors);
                return false;
            }
            throw error;
        }
    };

    const isFormValid = formData.tosAccepted && 
                       Object.values(uiState.passwordValidation).every(Boolean) && 
                       formData.name && 
                       formData.email &&
                       Object.keys(fieldErrors).length === 0;
    const isLoading = uiState.status === 'loading' || authLoading;
    const displayError = uiState.error || authError;

    useEffect(() => {
        setUiState(prev => ({
            ...prev,
            passwordValidation: {
                hasLength: formData.password.length >= 8,
                hasNumber: /\d/.test(formData.password),
                hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
            }
        }));
    }, [formData.password]);

    // Simple input change handler - only updates formData
    const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        
        setFormData(prev => ({ 
            ...prev, 
            [field]: value
        }));

        // Clear field error when user starts typing
        if (fieldErrors[field as keyof FormErrors]) {
            setFieldErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleCheckboxChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ 
            ...prev, 
            [field]: e.target.checked
        }));

        // Clear field error when user changes checkbox
        if (fieldErrors[field as keyof FormErrors]) {
            setFieldErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form using Yup
        const isValid = await validateForm();
        if (!isValid) {
            return;
        }

        setUiState(prev => ({ ...prev, error: null, status: 'loading' }));
        clearError();
        
        try {
            await signup({ 
                name: formData.name, 
                email: formData.email, 
                password: formData.password 
            });
             setUiState(prev => ({ 
                ...prev, 
                status: 'idle' 
            }));
            // Redirect will be handled by useAuth hook based on user status
        } catch (error: any) {
            console.log("error---",error);
            
            setUiState(prev => ({ 
                ...prev, 
                status: 'idle',
                error: error.message || 'Signup failed. Please try again.'
            }));
        }

           
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="grid lg:grid-cols-2 min-h-screen">
                {/* --- Left Value Proposition Column --- */}
                <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-[#F9FAFB] relative">
                    <div className="absolute top-8 left-8 flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                        <span className="font-semibold text-lg">AlphaGrowth</span>
                    </div>
                    <div className="max-w-md w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-semibold text-[#111113]">Unlock Your GTM Potential</h1>
                            <p className="mt-4 text-lg text-[#6B7280]">
                                Join thousands of businesses scaling their growth with AlphaGrowth.
                            </p>
                        </motion.div>
                        <motion.div 
                            className="mt-10 space-y-6"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.2,
                                        delayChildren: 0.4,
                                    }
                                }
                            }}
                        >
                            <FeatureHighlight
                                icon={Zap}
                                title="AI-Powered Automation"
                                description="Automate your outreach to generate more leads, book more meetings, and fill your pipeline."
                            />
                            <FeatureHighlight
                                icon={BarChart3}
                                title="Advanced Analytics"
                                description="Stop guessing. Get clear dashboards that prove which campaigns are generating leads, meetings, and revenue."
                            />
                            <FeatureHighlight
                                icon={Target}
                                title="Smart Targeting"
                                description="Generate high-quality leads that actually convert by defining and targeting your ideal customers with precision."
                            />
                        </motion.div>
                    </div>
                </div>

                {/* --- Right Form Column --- */}
                <div className="flex flex-col justify-center items-center p-8 lg:p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-semibold text-[#111113]">Create your account</h1>
                            <p className="text-[#6B7280] mt-2">Start your journey to smarter growth.</p>
                            
                            {/* Progress Stepper */}
                            <div className="mt-6">
                                <ProgressStepper 
                                    currentStep={0}
                                    totalSteps={4}
                                    steps={['Account', 'Business', 'Profile', 'Complete']}
                                    className="justify-center"
                                />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                id="name"
                                label="Full Name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                icon={<User className="h-5 w-5 text-gray-400" />}
                                required
                                error={fieldErrors.name}
                            />
                            
                            <Input
                                id="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                icon={<Mail className="h-5 w-5 text-gray-400" />}
                                required
                                error={fieldErrors.email}
                            />
                            
                            <div>
                                <Input
                                    id="password"
                                    label="Password"
                                    type={uiState.showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    icon={<Lock className="h-5 w-5 text-gray-400" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            {uiState.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    }
                                    required
                                    error={fieldErrors.password}
                                />
                                <PasswordChecklist validation={uiState.passwordValidation} />
                            </div>

                            <div className="flex items-start pt-2">
                                <input 
                                    id="tosAccepted" 
                                    type="checkbox" 
                                    checked={formData.tosAccepted} 
                                    onChange={handleCheckboxChange('tosAccepted')} 
                                    className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-0.5" 
                                />
                                <label htmlFor="tosAccepted" className="ml-2 block text-sm text-gray-700">
                                    I agree to the <a href="#" className="font-medium text-orange-600 hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-orange-600 hover:underline">Privacy Policy</a>.
                                </label>
                            </div>
                            {fieldErrors.tosAccepted && (
                                <p className="text-red-600 text-sm mt-1">{fieldErrors.tosAccepted}</p>
                            )}

                            {/* General Error Display */}
                            {displayError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                                >
                                    <p className="text-red-600 text-sm">{displayError}</p>
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                isLoading={isLoading}
                                className="w-full h-12 flex items-center justify-center gap-2"
                            >
                                Create Account <ArrowRight size={18} />
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">or</span>
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            disabled={isLoading}
                            onClick={async () => {
                                setUiState(prev => ({ ...prev, status: 'loading' }));
                                await new Promise(resolve => setTimeout(resolve, 1500));
                                setUiState(prev => ({ ...prev, status: 'idle' }));
                                console.log("Google signup successful!");
                                window.location.href = ROUTES.ONBOARDING.BUSINESS_OVERVIEW;
                            }}
                            className="w-full h-12 flex items-center justify-center gap-3"
                        >
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </Button>
                        
                        <p className="mt-8 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href={ROUTES.LOGIN} className="font-medium text-orange-600 hover:underline">
                                Sign in
                            </a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;