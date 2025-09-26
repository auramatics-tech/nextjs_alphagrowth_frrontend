'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, UserPlus, CalendarDays, ThumbsUp, Linkedin, Compass } from 'lucide-react';

const LinkedInImportPage = () => {
  const handleOptionClick = (option: string) => {
    console.log('Selected option:', option);
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          {/* Section 1: Import People Who... */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1E1E1E]">
              Import People Who...
            </h2>
            
            <div className="space-y-3">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleOptionClick('commented-post')}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <MessageSquare size={20} className="text-blue-500" />
                </div>
                <span className="text-[#1E1E1E] font-medium">Commented a Post</span>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleOptionClick('my-followers')}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <UserPlus size={20} className="text-blue-500" />
                </div>
                <span className="text-[#1E1E1E] font-medium">My Followers</span>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleOptionClick('attended-event')}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <CalendarDays size={20} className="text-blue-500" />
                </div>
                <span className="text-[#1E1E1E] font-medium">Attended An Event</span>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleOptionClick('liked-post')}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <ThumbsUp size={20} className="text-blue-500" />
                </div>
                <span className="text-[#1E1E1E] font-medium">Liked A Post</span>
              </motion.button>
            </div>
          </div>

          {/* Section 2: Import from a LinkedIn Search */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1E1E1E]">
              Import from a LinkedIn Search
            </h2>
            
            <div className="space-y-3">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleOptionClick('linkedin-basic-search')}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Linkedin size={20} className="text-white" />
                </div>
                <span className="text-[#1E1E1E] font-medium">LinkedIn Basic Search</span>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleOptionClick('linkedin-sales-navigator')}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Compass size={20} className="text-white" />
                </div>
                <span className="text-[#1E1E1E] font-medium">LinkedIn Sales Navigator</span>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleOptionClick('sales-navigator-list')}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Compass size={20} className="text-white" />
                </div>
                <span className="text-[#1E1E1E] font-medium">Sales Navigator List</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LinkedInImportPage;
