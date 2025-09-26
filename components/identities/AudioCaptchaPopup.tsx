'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, Loader2, AlertCircle } from 'lucide-react';
import { identityService } from '../../services/identityService';

interface AudioCaptchaPopupProps {
    connectionStatusId: string;
    onClose: () => void;
    onSuccess: () => void;
    onFailure: (error: string) => void;
}

export default function AudioCaptchaPopup({ 
    connectionStatusId, 
    onClose, 
    onSuccess,
    onFailure 
}: AudioCaptchaPopupProps) {
    const [audioUrl, setAudioUrl] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);

    // Fetch captcha data on mount
    useEffect(() => {
        const fetchCaptcha = async () => {
            try {
                setIsLoading(true);
                const response = await identityService.checkConnectionStatus(connectionStatusId);
                const { mp3Url, questionText } = response.capcha_data || {};
                setAudioUrl(mp3Url || '');
                setQuestionText(questionText || '');
                console.log('Captcha data:', { mp3Url, questionText });
            } catch (error) {
                console.error('Failed to fetch captcha:', error);
                setError('Failed to load captcha. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        if (connectionStatusId) {
            fetchCaptcha();
        }
    }, [connectionStatusId]);

    const handlePlayAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!code.trim()) {
            setError('Please enter a number before submitting.');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const response = await identityService.verifyLinkedInCaptcha({
                code: code.trim(),
                type: 'capcha',
                connection_id: connectionStatusId
            });

            console.log('Captcha response:', response);
            
            if (response.success) {
                onSuccess();
            } else {
                const errorMsg = response.message || 'Invalid answer. Please try again.';
                setError(errorMsg);
                onFailure(errorMsg);
            }
        } catch (err: any) {
            console.error('Captcha error:', err);
            const errorMsg = err.response?.data?.message || 'Failed to submit captcha. Please try again.';
            setError(errorMsg);
            onFailure(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        if (error) setError(''); // Clear error when user starts typing
    };

    return (
        <AnimatePresence>
            <motion.div 
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div 
                    className="bg-white w-full max-w-lg rounded-2xl shadow-xl"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 relative">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <Volume2 size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Audio Challenge</h2>
                                <p className="text-sm text-gray-500">Complete the security check</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Let's do a quick security check</h3>
                            <p className="text-gray-600">
                                Listen to the audio and enter the number you hear.
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Loader2 size={24} className="animate-spin" />
                                    Loading challenge...
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Audio Challenge */}
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                                    <h4 className="font-medium text-gray-900 mb-4">Audio Challenge</h4>
                                    
                                    {questionText && (
                                        <p className="text-gray-700 mb-4">{questionText}</p>
                                    )}
                                    
                                    <p className="text-sm text-gray-600 mb-4">
                                        Type your answer as a number, then press Enter or the Done button below.
                                    </p>

                                    {/* Play Button */}
                                    <button
                                        onClick={handlePlayAudio}
                                        disabled={!audioUrl}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isPlaying ? (
                                            <>
                                                <Pause size={16} />
                                                Pause
                                            </>
                                        ) : (
                                            <>
                                                <Play size={16} />
                                                Play
                                            </>
                                        )}
                                    </button>

                                    {/* Audio Element */}
                                    {audioUrl && (
                                        <audio
                                            ref={audioRef}
                                            src={audioUrl}
                                            preload="auto"
                                            onEnded={() => setIsPlaying(false)}
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                        />
                                    )}
                                </div>

                                {/* Input Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Answer *
                                        </label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={handleCodeChange}
                                            placeholder="Type here..."
                                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                            }`}
                                            required
                                        />
                                        {error && (
                                            <div className="flex items-center gap-2 mt-2 text-red-600">
                                                <AlertCircle size={16} />
                                                <span className="text-sm">{error}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-3 text-gray-700 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !code.trim()}
                                            className="flex-1 px-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Done'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

