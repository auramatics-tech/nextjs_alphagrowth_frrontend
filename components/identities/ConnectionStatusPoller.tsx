'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { identityService } from '../../services/identityService';
import EmailVerificationPopup from './EmailVerificationPopup';
import VerificationCodePopup from './VerificationCodePopup';
import AudioCaptchaPopup from './AudioCaptchaPopup';

interface ConnectionStatusPollerProps {
    connectionStatusId: string;
    onSuccess: () => void;
    onClose: () => void;
}

type ConnectionStatus = 
    | 'requested' 
    | 'linkedinapprequest' 
    | 'verification_email' 
    | 'verification_capcha' 
    | 'loggedin' 
    | 'failed' 
    | 'verificationCodeFailed';

export default function ConnectionStatusPoller({ 
    connectionStatusId, 
    onSuccess, 
    onClose 
}: ConnectionStatusPollerProps) {
    console.log('ConnectionStatusPoller rendered with connectionStatusId:', connectionStatusId);
    
    const [status, setStatus] = useState<ConnectionStatus>('requested');
    const [isVisible, setIsVisible] = useState(true);
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [showVerificationPopup, setShowVerificationPopup] = useState(false);
    const [showAudioCaptchaPopup, setShowAudioCaptchaPopup] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [lastPopup, setLastPopup] = useState<string | null>(null);
    const [requestedStartTime, setRequestedStartTime] = useState<number | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Polling effect
    useEffect(() => {
        if (!connectionStatusId) return;

        const pollConnectionStatus = async () => {
            console.log('Polling connection status for ID:', connectionStatusId);
            
            try {
                const response = await (identityService as any).checkConnectionStatus(connectionStatusId);
                console.log('Polling response:', response);
                
                const connectionStatus = response?.connection_status as ConnectionStatus;
                console.log('Current status:', connectionStatus);
                setStatus(connectionStatus);

                // Handle different statuses
                switch (connectionStatus) {
                    case 'requested':
                        if (!requestedStartTime) {
                            setRequestedStartTime(Date.now());
                        } else {
                            const elapsedTime = Date.now() - requestedStartTime;
                            if (elapsedTime >= 180000) { // 3 minutes timeout
                                console.log('Timeout reached: Closing polling');
                                setIsVisible(false);
                                onClose();
                                return;
                            }
                        }
                        break;

                    case 'linkedinapprequest':
                        setRequestedStartTime(null);
                        setIsVisible(false);
                        setShowVerificationPopup(false);
                        setShowAudioCaptchaPopup(false);
                        setLastPopup('email');
                        setShowEmailPopup(true);
                        break;

                    case 'verification_email':
                        setRequestedStartTime(null);
                        setShowEmailPopup(false);
                        setShowAudioCaptchaPopup(false);
                        setLastPopup('verification');
                        setShowVerificationPopup(true);
                        break;

                    case 'verification_capcha':
                        setRequestedStartTime(null);
                        setShowEmailPopup(false);
                        setShowVerificationPopup(false);
                        setLastPopup('captcha');
                        setShowAudioCaptchaPopup(true);
                        break;

                    case 'failed':
                        // Reopen last shown popup
                        setShowEmailPopup(false);
                        setShowVerificationPopup(false);
                        setShowAudioCaptchaPopup(false);
                        setIsVisible(false);
                        
                        if (lastPopup === 'email') {
                            setShowEmailPopup(true);
                        } else if (lastPopup === 'verification') {
                            setShowVerificationPopup(true);
                        } else if (lastPopup === 'captcha') {
                            setShowAudioCaptchaPopup(true);
                        }
                        break;

                    case 'verificationCodeFailed':
                        setIsVisible(false);
                        setVerificationError('Invalid verification code');
                        break;

                    case 'loggedin':
                        setVerificationError('');
                        setIsVisible(false);
                        setShowEmailPopup(false);
                        setShowVerificationPopup(false);
                        setShowAudioCaptchaPopup(false);
                        
                        // Show success message and close
                        setTimeout(() => {
                            onSuccess();
                        }, 1000);
                        break;
                }
            } catch (error) {
                console.error('Error checking connection status:', error);
            }
        };

        // Start polling every 3 seconds
        intervalRef.current = setInterval(pollConnectionStatus, 3000);

        // Initial poll
        pollConnectionStatus();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [connectionStatusId, requestedStartTime, lastPopup, onSuccess, onClose]);

    // Hide main popup when verification popups are shown
    useEffect(() => {
        if (showEmailPopup || showVerificationPopup || showAudioCaptchaPopup) {
            setIsVisible(false);
        }
    }, [showEmailPopup, showVerificationPopup, showAudioCaptchaPopup]);

    const handleVerificationSuccess = () => {
        setShowVerificationPopup(false);
        setShowAudioCaptchaPopup(false);
        setVerificationError('');
        // Continue polling
        setIsVisible(true);
    };

    const handleVerificationFailure = (error: string) => {
        setVerificationError(error);
        // Continue polling to retry
        setIsVisible(true);
    };

    const handleEmailApproval = () => {
        setShowEmailPopup(false);
        // Continue polling
        setIsVisible(true);
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'requested':
                return 'Connecting to LinkedIn...';
            case 'linkedinapprequest':
                return 'Please check your LinkedIn app';
            case 'verification_email':
                return 'Enter verification code';
            case 'verification_capcha':
                return 'Complete audio challenge';
            case 'loggedin':
                return 'Successfully connected!';
            case 'failed':
                return 'Connection failed';
            case 'verificationCodeFailed':
                return 'Invalid verification code';
            default:
                return 'Checking connection...';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'loggedin':
                return <CheckCircle size={24} className="text-green-600" />;
            case 'failed':
            case 'verificationCodeFailed':
                return <AlertCircle size={24} className="text-red-600" />;
            default:
                return <Loader2 size={24} className="text-blue-600 animate-spin" />;
        }
    };

    return (
        <>
            {/* Main Loading Popup */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div 
                        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div 
                            className="bg-white w-full max-w-md rounded-2xl shadow-xl"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-200 relative">
                                <h2 className="text-xl font-semibold text-gray-900">Connecting to LinkedIn</h2>
                                <button 
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {getStatusIcon()}
                                </div>
                                
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {getStatusMessage()}
                                </h3>
                                
                                <p className="text-gray-600">
                                    {status === 'requested' && 'Please wait while we establish the connection...'}
                                    {status === 'linkedinapprequest' && 'Check your LinkedIn mobile app for a connection request.'}
                                    {status === 'verification_email' && 'We\'ll show you a verification form shortly.'}
                                    {status === 'verification_capcha' && 'We\'ll show you an audio challenge shortly.'}
                                    {status === 'loggedin' && 'Your LinkedIn account has been successfully connected!'}
                                    {status === 'failed' && 'Something went wrong. Please try again.'}
                                    {status === 'verificationCodeFailed' && 'The verification code was incorrect.'}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Verification Popups */}
            {showEmailPopup && (
                <EmailVerificationPopup onClose={handleEmailApproval} />
            )}

            {showVerificationPopup && (
                <VerificationCodePopup
                    connectionStatusId={connectionStatusId}
                    onClose={handleVerificationSuccess}
                    onSuccess={handleVerificationSuccess}
                    onFailure={handleVerificationFailure}
                    error={verificationError}
                />
            )}

            {showAudioCaptchaPopup && (
                <AudioCaptchaPopup
                    connectionStatusId={connectionStatusId}
                    onClose={handleVerificationSuccess}
                    onSuccess={handleVerificationSuccess}
                    onFailure={handleVerificationFailure}
                />
            )}
        </>
    );
}

