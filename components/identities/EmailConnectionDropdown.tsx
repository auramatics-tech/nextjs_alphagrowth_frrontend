'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, ChevronDown, Loader2, AlertCircle, X } from 'lucide-react';
import { Identity } from '../../types/identity.types';
import { identityService } from '../../services/identityService';

interface EmailConnectionDropdownProps {
  identity: Identity;
  onSmtpConnect: (identityId: string) => void;
  onRefresh: () => void;
}

export default function EmailConnectionDropdown({ 
  identity, 
  onSmtpConnect, 
  onRefresh 
}: EmailConnectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailStatus = identity.email_detail?.connection_status;
  const isConnected = emailStatus === 'loggedin';
  const providerType = identity.email_detail?.provider_type || identity.email_detail?.provider || identity.email_detail?.type;

  const handleGmailConnect = () => {
    try {
      // Store identity ID for callback (same as frontend_old)
      localStorage.setItem('gmail_identity_id', identity.id);
      
      // Direct redirect to backend OAuth endpoint with identity_id (same as frontend_old)
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7001';
      const oauthUrl = `${apiBaseUrl}/pub/v1/identities/auth?identity_id=${identity.id}`;
      
      console.log('Gmail OAuth Initiation:', {
        identityId: identity.id,
        apiBaseUrl,
        oauthUrl,
        redirectTo: oauthUrl
      });
      
      window.location.href = oauthUrl;
      setIsOpen(false);
    } catch (error) {
      console.error('Gmail connection failed:', error);
      setError('Failed to initiate Gmail OAuth');
    }
  };

  const handleSmtpConnect = () => {
    onSmtpConnect(identity.id);
    setIsOpen(false);
  };

  const handleSignout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const providerType = identity?.email_detail?.provider_type || 'GMAIL';
      await (identityService as any).signout(identity.id, { type: providerType });
      
      onRefresh();
      setIsOpen(false);
    } catch (error) {
      console.error('Email signout failed:', error);
      setError('Failed to sign out from email');
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderDisplayName = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'gmail': return 'Gmail';
      case 'smtp': return 'SMTP';
      case 'outlook': return 'Outlook';
      default: return 'Email';
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        <CheckCircle size={14} className="text-green-600" />
        <span>{getProviderDisplayName(providerType || 'GMAIL')} Connected</span>
        <button
          onClick={handleSignout}
          disabled={isLoading}
          className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
        >
          <X size={12} className="text-green-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isConnecting || isLoading}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        <Mail size={14} />
        <span>Connect Email</span>
        <ChevronDown 
          size={12} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-2">
              {error && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-500" />
                  <span className="text-xs text-red-700">{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <button
                  onClick={handleGmailConnect}
                  disabled={isConnecting || isLoading}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <img src="/images/google.png" alt="Gmail" className="w-5 h-5" />
                  <span>Sign in with Gmail</span>
                  {isConnecting && <Loader2 size={14} className="animate-spin ml-auto" />}
                </button>

                <button
                  onClick={handleSmtpConnect}
                  disabled={isConnecting || isLoading}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Mail size={16} className="text-gray-600" />
                  <span>Other provider (SMTP)</span>
                </button>

                
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
