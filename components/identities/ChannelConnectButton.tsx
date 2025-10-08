'use client';

import React  from 'react';
 
import {
    Linkedin, Mail, Phone, CheckCircle,
    
    Loader2 
} from 'lucide-react';
 

const ChannelConnectButton = ({
    channel,
    status,
    onClick,
    isLoading = false
}: {
    channel: 'linkedin' | 'email' | 'phone';
    status: 'connected' | 'disconnected' | 'verified' | 'unverified';
    onClick: () => void;
    isLoading?: boolean;
}) => {
    const isConnected = status === 'connected' || status === 'verified';
    const channelConfig = {
        linkedin: { icon: Linkedin, label: "LinkedIn", color: "blue" },
        email: { icon: Mail, label: "Email", color: "red" },
        phone: { icon: Phone, label: "Phone", color: "green" },
    };
    const config = channelConfig[channel];

    if (isConnected) {
        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                <CheckCircle size={14} className="text-green-600" />
                Connected
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <config.icon size={14} className={`text-${config.color}-500`} />
            )}
            Connect {config.label}
        </button>
    );
};


export default ChannelConnectButton