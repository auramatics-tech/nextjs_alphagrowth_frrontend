import { useState, useCallback } from 'react';
import { identityService } from '../services/identityService';

export type LinkedInConnectionStatus = 
    | 'idle'
    | 'connecting'
    | 'requested' 
    | 'linkedinapprequest' 
    | 'verification_email' 
    | 'verification_capcha' 
    | 'loggedin' 
    | 'failed' 
    | 'verificationCodeFailed';

export interface LinkedInLoginState {
    status: LinkedInConnectionStatus;
    connectionStatusId: string | null;
    error: string | null;
    isPolling: boolean;
    captchaData: {
        mp3Url?: string;
        questionText?: string;
    } | null;
}

export interface LinkedInCredentials {
    email: string;
    password: string;
    location: string;
}

export const useLinkedInLogin = () => {
    const [state, setState] = useState<LinkedInLoginState>({
        status: 'idle',
        connectionStatusId: null,
        error: null,
        isPolling: false,
        captchaData: null
    });

    const startConnection = useCallback(async (identityId: string, credentials: LinkedInCredentials) => {
        try {
            setState(prev => ({
                ...prev,
                status: 'connecting',
                error: null
            }));

            const response = await identityService.connectLinkedIn({
                identity_id: identityId,
                data: credentials,
                type: 'LINKEDIN'
            });

            console.log('LinkedIn connection response:', response);

            if (response.data?.id) {
                setState(prev => ({
                    ...prev,
                    status: 'requested',
                    connectionStatusId: response.data.id,
                    isPolling: true
                }));
                return response.data.id;
            } else {
                throw new Error(response.message || 'Failed to connect LinkedIn account');
            }
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                status: 'failed',
                error: error.message || 'Failed to connect LinkedIn account',
                isPolling: false
            }));
            throw error;
        }
    }, []);

    const checkConnectionStatus = useCallback(async (connectionStatusId: string) => {
        try {
            const response = await identityService.checkConnectionStatus(connectionStatusId);
            console.log('Connection status response:', response);
            
            const connectionStatus = response?.connection_status as LinkedInConnectionStatus;
            
            setState(prev => ({
                ...prev,
                status: connectionStatus,
                captchaData: response?.capcha_data || null
            }));

            return connectionStatus;
        } catch (error: any) {
            console.error('Error checking connection status:', error);
            setState(prev => ({
                ...prev,
                error: 'Failed to check connection status',
                isPolling: false
            }));
            return 'failed';
        }
    }, []);

    const submitVerification = useCallback(async (code: string, type: 'email' | 'capcha') => {
        if (!state.connectionStatusId) {
            throw new Error('No active connection');
        }

        try {
            const response = await identityService.verifyLinkedInCaptcha({
                code,
                type,
                connection_id: state.connectionStatusId
            });

            if (!response.success) {
                throw new Error(response.message || 'Verification failed');
            }

            return response;
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.message || 'Verification failed'
            }));
            throw error;
        }
    }, [state.connectionStatusId]);

    const reset = useCallback(() => {
        setState({
            status: 'idle',
            connectionStatusId: null,
            error: null,
            isPolling: false,
            captchaData: null
        });
    }, []);

    const stopPolling = useCallback(() => {
        setState(prev => ({
            ...prev,
            isPolling: false
        }));
    }, []);

    return {
        ...state,
        startConnection,
        checkConnectionStatus,
        submitVerification,
        reset,
        stopPolling
    };
};
