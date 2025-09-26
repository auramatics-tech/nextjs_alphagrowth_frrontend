import { useState, useCallback } from 'react';
import { emailService } from '../services/emailService';
import { identityService } from '../services/identityService';
import { SmtpCredentialsRequest } from '../services/identityService';

export interface EmailConnection {
  provider: 'GMAIL' | 'SMTP' | 'OUTLOOK';
  status: 'connected' | 'disconnected' | 'requested';
  provider_type?: string;
  provider_data?: any;
  connected_at?: string;
}

export interface EmailConnectionState {
  connections: EmailConnection[];
  isLoading: boolean;
  error: string | null;
  isConnecting: boolean;
}

export const useEmailConnection = () => {
  const [state, setState] = useState<EmailConnectionState>({
    connections: [],
    isLoading: false,
    error: null,
    isConnecting: false
  });

  const connectGmail = useCallback(async (identityId: string) => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      // Store identity ID for callback (same as frontend_old)
      localStorage.setItem('gmail_identity_id', identityId);
      
      // Direct redirect to backend OAuth endpoint (same as frontend_old)
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7001';
      window.location.href = `${apiBaseUrl}/pub/v1/identities/auth`;
      
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to initiate Gmail OAuth',
        isConnecting: false
      }));
      throw error;
    }
  }, []);

  const handleGmailCallback = useCallback(async (code: string, identityId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await emailService.handleGmailCallback(code, identityId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null
        }));
        
        // Clean up
        localStorage.removeItem('gmail_identity_id');
        
        return response;
      } else {
        throw new Error(response.message || 'Gmail connection failed');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to complete Gmail connection',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  const connectSmtp = useCallback(async (identityId: string, credentials: SmtpCredentialsRequest['data']) => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      const requestData: SmtpCredentialsRequest = {
        identity_id: identityId,
        data: credentials,
        type: 'SMTP/IMAP'
      };
      
      const response = await identityService.saveSmtpCredentials(requestData);
      
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: null
      }));
      
      return response;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to connect SMTP',
        isConnecting: false
      }));
      throw error;
    }
  }, []);

  const signoutEmail = useCallback(async (identityId: string, type: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await emailService.signoutEmail(identityId, type);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));
      
      return response;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to sign out from email',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  const testSmtpConnection = useCallback(async (credentials: any) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await emailService.testSmtpConnection(credentials);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));
      
      return response;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'SMTP connection test failed',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    connectGmail,
    handleGmailCallback,
    connectSmtp,
    signoutEmail,
    testSmtpConnection,
    clearError
  };
};
