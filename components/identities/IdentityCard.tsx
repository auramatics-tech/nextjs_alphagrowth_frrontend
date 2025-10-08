'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {

    MoreHorizontal,
    Edit3, Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';


import { EmailConnectionDropdown } from '@/components/identities';

import { Identity } from '@/types/identity.types';
import ChannelConnectButton from './ChannelConnectButton';
import { identityService } from '@/services/identityService';


const IdentityCard = ({
    identity,
    onLinkedInConnect,
    onEmailConnect,
 


    onEdit,

    onRefresh,
   
    isLoading
}: {
    identity: Identity;
    onLinkedInConnect: (id: string) => void;
    onEmailConnect: (id: string) => void;
  


    onEdit: (id: string) => void;

    onRefresh: () => void;
 
    isLoading: boolean;
}) => {
    const [showDropdown, setShowDropdown] = useState(false);



    const getPhoneStatus = () => {
        console.log('Phone status for', identity.name, ':', identity.phone_detail);
        if (identity.phone_detail?.connection_status === 'verified') return 'verified';
        return 'unverified';
    };

    const handleLinkedInAction = () => {
        if (identity.linkedin_sign === 'loggedin') {


        } else {
            onLinkedInConnect(identity.id);
        }
    };

    const onPhoneConnect = (data:any) =>{

    }



    return (
        <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img
                        src={identity.image || `https://placehold.co/40x40/FF6B2C/FFFFFF?text=${identity.name.charAt(0)}`}
                        alt={identity.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">{identity.name}</h3>
                        <p className="text-sm text-gray-500">{identity.email || 'No email provided'}</p>
                        <p className="text-xs text-gray-400">{identity.company_name || 'No company provided'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                        <ChannelConnectButton
                            channel="linkedin"
                            status={identity.linkedin_sign === 'loggedin' ? "connected" : "disconnected"}
                            onClick={handleLinkedInAction}

                        />
                        <EmailConnectionDropdown
                            identity={identity}
                            onSmtpConnect={onEmailConnect}
                            onRefresh={onRefresh}
                        />
                        <ChannelConnectButton
                            channel="phone"
                            status={getPhoneStatus()}
                            onClick={() => onPhoneConnect(identity.id)}
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                                >
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                onEdit(identity.id);
                                                setShowDropdown(false);
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Edit3 size={16} />
                                            Edit Identity
                                        </button>
                                      

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {identity.created_at && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Created {formatDistanceToNow(new Date(identity.created_at), { addSuffix: true })}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default IdentityCard