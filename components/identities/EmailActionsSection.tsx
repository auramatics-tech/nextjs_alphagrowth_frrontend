'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ActionSlider from './ActionSlider';
import { actionLimitsService } from '@/services/actionLimitsService';

interface EmailActionsSectionProps {
    actionLimits: Record<string, number>;
    onUpdate: (key: string, value: number) => void;
    saving: Record<string, boolean>;
    disabled?: boolean;
    identityId: string;
    onSavingChange: (key: string, saving: boolean) => void;
}

const EmailActionsSection: React.FC<EmailActionsSectionProps> = ({
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

    const emailActions = [
        {
            key: 'action_send_email',
            label: 'Emails',
            min: 0,
            max: 100,
            safeRange: [0, 46] as [number, number],
            fastRange: [46, 90] as [number, number],
            riskyRange: [90, 100] as [number, number],
            tooltip: 'If you send too many emails too quickly, your email provider may flag your account as spam. To remain safe, stay under the risky zone!'
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Mail size={20} className="text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Email Actions</h3>
                        <p className="text-sm text-gray-500">Configure daily limits for email activities</p>
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
                        {emailActions.map((action) => (
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
                                    className="progressbar_emailrange"
                                />
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmailActionsSection;
