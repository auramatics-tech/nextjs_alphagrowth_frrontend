'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  type: 'incoming' | 'outgoing' | 'system';
  content: string;
  timestamp: string;
  sender: string;
  subject?: string;
  body?: string;
  channel?: string;
  messageType?: string; // Add message type for voice_call_recording, etc.
  recordingUrl?: string; // Add recording URL
  transcript?: string; // Add transcript for voice calls
  recording?: {
    duration: string;
    currentTime: string;
  };
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePlayRecording = () => {
    setIsPlaying(!isPlaying);
    // Handle audio playback logic here
  };

  if (message.type === 'system') {
    return (
      <div className="flex items-center justify-center my-6">
        <div className="max-w-md">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-gray-500 italic">{message.content}</span>
          </div>
        </div>
      </div>
    );
  }

  const isOutgoing = message.type === 'outgoing';
  const isEmail = message.channel === 'email';
  const isVoiceCall = message.messageType === 'voice_call_recording' && message.recordingUrl;
  const isAudioMessage = message.messageType === 'action_ai_voice_message' && message.recordingUrl;

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOutgoing ? 'ml-12' : 'mr-12'}`}>
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mb-1 ${isOutgoing ? 'text-right' : 'text-left'}`}>
          {message.sender === 'user' ? 'Heer' : message.sender}, {formatTime(message.timestamp)}
        </div>

        {/* Message Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`rounded-xl px-4 py-3 ${
            isOutgoing 
              ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {/* Email Message */}
          {isEmail && message.subject && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{message.content}</span>
              </div>
              <div className="text-sm opacity-90">
                <div className="font-medium">Subject: {message.subject}</div>
                <div className="mt-1">{message.body}</div>
              </div>
            </div>
          )}

          {/* Voice Call Recording */}
          {isVoiceCall ? (
            <div className="voice-call-recording">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span className="text-sm text-gray-600">Voice Call Recording</span>
                </div>
                {message.transcript && (
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="View Transcript"
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                )}
              </div>
              <audio 
                controls 
                className="w-full h-10 rounded-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  border: '1px solid #d1d5db'
                }}
              >
                <source src={message.recordingUrl} type="audio/wav" />
                <source src={message.recordingUrl} type="audio/mpeg" />
                <source src={message.recordingUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : isAudioMessage ? (
            /* Audio Message */
            <div className="audio-message">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span className="text-sm text-gray-600">Audio Message</span>
              </div>
              <audio 
                controls 
                className="w-full h-10 rounded-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  border: '1px solid #d1d5db'
                }}
              >
                <source src={message.recordingUrl} type="audio/wav" />
                <source src={message.recordingUrl} type="audio/mpeg" />
                <source src={message.recordingUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            /* Regular Text Message */
            <div className="text-sm leading-relaxed">
              {message.content}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
