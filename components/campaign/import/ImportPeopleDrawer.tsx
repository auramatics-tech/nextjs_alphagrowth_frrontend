"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, MessageCircle, UserPlus, CalendarDays, ThumbsUp, Linkedin, Compass } from 'lucide-react';

type ImportView = 'main' | 'comment' | 'followers' | 'event' | 'like' | 'basic-search' | 'sales-navigator' | 'sales-navigator-list';

interface ImportPeopleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportPeopleDrawer: React.FC<ImportPeopleDrawerProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<ImportView>('main');

  const backToMain = () => setView('main');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
        >
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button onClick={backToMain} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-500" />
              </button>
              <h3 className="text-lg font-bold text-gray-900">Import People Who...</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {view === 'main' ? (
              <>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Import People Who...</h2>
                  <div className="space-y-3">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer" onClick={() => setView('comment')}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><MessageCircle size={20} className="text-blue-600" /></div>
                      <span className="font-medium text-gray-900">Commented a Post</span>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer" onClick={() => setView('followers')}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><UserPlus size={20} className="text-blue-600" /></div>
                      <span className="font-medium text-gray-900">My Followers</span>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer" onClick={() => setView('event')}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><CalendarDays size={20} className="text-blue-600" /></div>
                      <span className="font-medium text-gray-900">Attended An Event</span>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer" onClick={() => setView('like')}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><ThumbsUp size={20} className="text-blue-600" /></div>
                      <span className="font-medium text-gray-900">Liked A Post</span>
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Import from a LinkedIn Search</h2>
                  <div className="space-y-3">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer" onClick={() => setView('basic-search')}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Linkedin size={20} className="text-blue-600" /></div>
                      <span className="font-medium text-gray-900">LinkedIn Basic Search</span>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer" onClick={() => setView('sales-navigator')}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Compass size={20} className="text-blue-600" /></div>
                      <span className="font-medium text-gray-900">LinkedIn Sales Navigator</span>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer" onClick={() => setView('sales-navigator-list')}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Compass size={20} className="text-blue-600" /></div>
                      <span className="font-medium text-gray-900">Sales Navigator List</span>
                    </motion.div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <button onClick={backToMain} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"><ArrowLeft size={16} /><span className="font-medium">Back</span></button>
                <h2 className="text-xl font-bold text-gray-900">{view === 'comment' ? 'People who Commented a Post' : view === 'followers' ? 'My Followers' : view === 'event' ? 'Attended An Event' : view === 'like' ? 'Liked A Post' : view === 'basic-search' ? 'LinkedIn Basic Search' : view === 'sales-navigator' ? 'LinkedIn Sales Navigator' : 'Sales Navigator List'}</h2>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Paste the URL here</label>
                  <input type="url" placeholder="Paste URL here" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <button className="w-full py-2 px-4 btn-primary rounded-lg font-medium">Import</button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImportPeopleDrawer;


