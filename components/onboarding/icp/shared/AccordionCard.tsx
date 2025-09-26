"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Props {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const AccordionCard: React.FC<Props> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left font-semibold text-[#1E1E1E]" aria-expanded={isOpen}>
                {title}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={20} /></motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div key="content" initial="collapsed" animate="open" exit="collapsed"
                        variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                        <div className="p-4 pt-0 text-gray-600 text-sm">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccordionCard;









