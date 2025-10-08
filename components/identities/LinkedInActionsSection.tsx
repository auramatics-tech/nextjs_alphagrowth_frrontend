'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Linkedin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ActionSlider from './ActionSlider';
import { actionLimitsService } from '@/services/actionLimitsService';

interface LinkedInActionsSectionProps {
    actionLimits: Record<string, number>;
    onUpdate: (key: string, value: number) => void;
    saving: Record<string, boolean>;
    disabled?: boolean;
    identityId: string;
    onSavingChange: (key: string, saving: boolean) => void;
}

const LinkedInActionsSection: React.FC<LinkedInActionsSectionProps> = ({
    actionLimits,
    onUpdate,
    saving,
    disabled = false,
    identityId,
    onSavingChange
}) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleSave = async (key: string, value: number) => {
        try {
            onSavingChange(key, true);
            await actionLimitsService.setActionLimit({
                identity_id: identityId,
                key,
                value
            });
            toast.success(`${key.replace('action_', '').replace('_', ' ')} limit updated successfully`);
        } catch (error) {
            console.error(`Error saving ${key} limit:`, error);
            toast.error(`Failed to save ${key.replace('action_', '').replace('_', ' ')} limit`);
        } finally {
            onSavingChange(key, false);
        }
    };

    const linkedInActions = [
        {
            key: 'action_invitation',
            label: 'Connection Requests',
            min: 0,
            max: 160,
            safeRange: [0, 80] as [number, number],
            fastRange: [80, 120] as [number, number],
            riskyRange: [120, 160] as [number, number],
            tooltip: 'If you go too fast, LinkedIn may disconnect your identity: you\'ll need to reconnect manually. If this occurs too frequently, you\'ll be temporarily banned from LinkedIn. To remain safe, stay under the risky zone!'
        },
        {
            key: 'action_send_message',
            label: 'Messages',
            min: 0,
            max: 200,
            safeRange: [0, 103] as [number, number],
            fastRange: [103, 140] as [number, number],
            riskyRange: [140, 200] as [number, number],
            tooltip: 'If you go too fast, LinkedIn may disconnect your identity: you\'ll need to reconnect manually. If this occurs too frequently, you\'ll be temporarily banned from LinkedIn. To remain safe, stay under the risky zone!'
        },
        {
            key: 'action_visit_profile',
            label: 'Profile Views',
            min: 0,
            max: 300,
            safeRange: [0, 84] as [number, number],
            fastRange: [84, 167] as [number, number],
            riskyRange: [167, 300] as [number, number],
            tooltip: 'If you go too fast, LinkedIn may disconnect your identity: you\'ll need to reconnect manually. If this occurs too frequently, you\'ll be temporarily banned from LinkedIn. To remain safe, stay under the risky zone!'
        },
        {
            key: 'action_follow',
            label: 'Follows',
            min: 0,
            max: 300,
            safeRange: [0, 163] as [number, number],
            fastRange: [163, 240] as [number, number],
            riskyRange: [240, 300] as [number, number],
            tooltip: 'If you go too fast, LinkedIn may disconnect your identity: you\'ll need to reconnect manually. If this occurs too frequently, you\'ll be temporarily banned from LinkedIn. To remain safe, stay under the risky zone!'
        },
        {
            key: 'action_list_post',
            label: 'Post Likes',
            min: 0,
            max: 200,
            safeRange: [0, 129] as [number, number],
            fastRange: [129, 180] as [number, number],
            riskyRange: [180, 200] as [number, number],
            tooltip: 'If you go too fast, LinkedIn may disconnect your identity: you\'ll need to reconnect manually. If this occurs too frequently, you\'ll be temporarily banned from LinkedIn. To remain safe, stay under the risky zone!'
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Linkedin size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">LinkedIn Actions</h3>
                        <p className="text-sm text-gray-500">Configure daily limits for LinkedIn activities</p>
                    </div>
                </div>
                <button
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={disabled}
                >
                    {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* Actions List */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {linkedInActions.map((action, index) => (
                            <div key={action.key} className="space-y-3">
                                <ActionSlider
                                    value={actionLimits[action.key] || 0}
                                    min={action.min}
                                    max={action.max}
                                    safeRange={action.safeRange}
                                    fastRange={action.fastRange}
                                    riskyRange={action.riskyRange}
                                    onChange={(value) => onUpdate(action.key, value)}
                                    onSave={(value) => handleSave(action.key, value)}
                                    disabled={disabled || saving[action.key]}
                                    tooltip={action.tooltip}
                                    label={action.label}
                                    unit="per day"
                                    saving={saving[action.key]}
                                    className={`progressbar_${action.key.replace('action_', '')}`}
                                />
                                {index < linkedInActions.length - 1 && (
                                    <hr className="border-gray-100" />
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LinkedInActionsSection;
