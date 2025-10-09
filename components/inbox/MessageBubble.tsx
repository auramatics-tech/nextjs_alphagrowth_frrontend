'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message }: any) {

  // Parse message JSON
  let parsedData: any = {};
  try {
    if (message.message) {
      parsedData = JSON.parse(message.message);
    }
  } catch (e) {
    parsedData = {};
  }

  // Message direction
  const isOutgoing = message.type !== 'reply_message';

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOutgoing ? 'ml-12' : 'mr-12'}`}>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mb-1 ${isOutgoing ? 'text-right' : 'text-left'}`}>
          {isOutgoing ? 'You' : 'Contact'}, {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Message Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`rounded-xl px-4 py-3 ${isOutgoing
              ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white'
              : 'bg-gray-100 text-gray-900'
            }`}
        >

          {/* EMAIL MESSAGE */}
          {(message.type === 'action_send_email' || message.type === 'inbox_email_message') && parsedData.subject && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-sm">Email</span>
              </div>
              <div className="text-sm opacity-90">
                <div className="font-medium">Subject: {parsedData.subject}</div>
                <div className="mt-1">{parsedData.message || parsedData.body}</div>
                                                            {/* <div dangerouslySetInnerHTML={{ __html: (parsedData?.body  )?.replace(/&lt;/g, '<')?.replace(/&gt;/g, '>') }} /> */}

              </div>
            </div>
          )}

          {/* VOICE CALL RECORDING */}
          {message.type === 'voice_call_recording' && parsedData.recordingUrl && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-600">Voice Call</span>
                </div>
                {parsedData.transcript && (
                  <button className="p-1 hover:bg-gray-100 rounded-full" title="View Transcript">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                )}
              </div>
              <audio controls className="w-full h-10 rounded-lg" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', border: '1px solid #d1d5db' }}>
                <source src={parsedData.recordingUrl} type="audio/wav" />
                <source src={parsedData.recordingUrl} type="audio/mpeg" />
                <source src={parsedData.recordingUrl} type="audio/mp3" />
              </audio>
            </div>
          )}

          {/* AI AUDIO MESSAGE */}
          {message.type === 'action_ai_voice_message' && parsedData.attachmentFilePath && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-gray-600">Audio Message</span>
              </div>
              <audio controls className="w-full h-10 rounded-lg" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', border: '1px solid #d1d5db' }}>
                <source src={parsedData.attachmentFilePath} type="audio/wav" />
                <source src={parsedData.attachmentFilePath} type="audio/mpeg" />
                <source src={parsedData.attachmentFilePath} type="audio/mp3" />
              </audio>
            </div>
          )}

          {/* REGULAR TEXT MESSAGE */}
          {message.type !== 'voice_call_recording' &&
            message.type !== 'action_ai_voice_message' &&
            (message.type !== 'action_send_email' && message.type !== 'inbox_email_message' || !parsedData.subject) && (
              <div className="text-sm leading-relaxed">
                {parsedData.message || parsedData.content || message.message || 'Message'}
              </div>
            )}

        </motion.div>
      </div>
    </div>
  );
}
