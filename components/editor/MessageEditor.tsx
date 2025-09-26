'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, X, Plus, Mic, MicOff, Play, Pause, Upload, 
  Download, RefreshCw, AlertCircle, CheckCircle
} from 'lucide-react';

// Variables that can be inserted into messages
const MESSAGE_VARIABLES = [
  { key: '{{first_name}}', label: 'First Name', description: 'Lead\'s first name' },
  { key: '{{last_name}}', label: 'Last Name', description: 'Lead\'s last name' },
  { key: '{{company}}', label: 'Company', description: 'Lead\'s company name' },
  { key: '{{position}}', label: 'Position', description: 'Lead\'s job position' },
  { key: '{{industry}}', label: 'Industry', description: 'Lead\'s industry' },
  { key: '{{location}}', label: 'Location', description: 'Lead\'s location' },
  { key: '{{linkedin_url}}', label: 'LinkedIn URL', description: 'Lead\'s LinkedIn profile' },
  { key: '{{email}}', label: 'Email', description: 'Lead\'s email address' },
  { key: '{{phone}}', label: 'Phone', description: 'Lead\'s phone number' },
  { key: '{{website}}', label: 'Website', description: 'Lead\'s company website' }
];

interface MessageEditorProps {
  nodeId: string;
  initialContent?: string;
  messageType?: 'text' | 'email' | 'linkedin' | 'voice';
  audioFile?: string;
  onSave: (content: string, messageType: string, audioFile?: File) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function MessageEditor({
  nodeId,
  initialContent = '',
  messageType = 'text',
  audioFile,
  onSave,
  onClose,
  isLoading = false
}: MessageEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [currentMessageType, setCurrentMessageType] = useState(messageType);
  const [showVariables, setShowVariables] = useState(false);
  const [audioFileState, setAudioFileState] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(audioFile || null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle variable insertion
  const insertVariable = (variable: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + variable + content.substring(end);
      setContent(newContent);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
        textarea.focus();
      }, 0);
    }
    setShowVariables(false);
  };

  // Handle audio file upload
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFileState(file);
      const url = URL.createObjectURL(file);
      setAudioURL(url);
    }
  };

  // Handle audio recording (placeholder - would need actual implementation)
  const handleStartRecording = () => {
    setIsRecording(true);
    // Implement actual recording logic here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Implement actual recording logic here
  };

  // Handle audio playback
  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      await onSave(content, currentMessageType, audioFileState || undefined);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save message');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Message</h2>
            <p className="text-sm text-gray-600">Node ID: {nodeId}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Message Type Selection */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Message Type:</span>
            <div className="flex gap-2">
              {[
                { key: 'text', label: 'Text', icon: '📝' },
                { key: 'email', label: 'Email', icon: '📧' },
                { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
                { key: 'voice', label: 'Voice', icon: '🎤' }
              ].map(type => (
                <button
                  key={type.key}
                  onClick={() => setCurrentMessageType(type.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentMessageType === type.key
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="p-6">
          {/* Variables Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Message Content</span>
              <button
                onClick={() => setShowVariables(!showVariables)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                <Plus size={16} />
                Add Variables
              </button>
            </div>

            <AnimatePresence>
              {showVariables && (
                <motion.div 
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {MESSAGE_VARIABLES.map(variable => (
                      <button
                        key={variable.key}
                        onClick={() => insertVariable(variable.key)}
                        className="text-left p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-mono text-sm text-blue-600">{variable.key}</div>
                        <div className="text-xs text-gray-600">{variable.description}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Simple Text Editor (CKEditor replacement for now) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <textarea
              ref={textareaRef}
              value={content.replace(/<[^>]*>/g, '')} // Strip HTML tags for plain text
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full p-4 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your message content here..."
            />
          </div>

          {/* Audio Section (for voice messages) */}
          {currentMessageType === 'voice' && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Audio File</span>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Upload size={16} />
                    Upload Audio
                  </label>
                  <button
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isRecording 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                    {isRecording ? 'Stop Recording' : 'Record'}
                  </button>
                </div>
              </div>

              {/* Audio Player */}
              {audioURL && (
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                  <button
                    onClick={handlePlayAudio}
                    className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Audio Message</div>
                    <div className="text-xs text-gray-600">
                      {audioFileState?.name || 'Audio file'}
                    </div>
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioURL}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              className="mx-6 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-green-700 text-sm">Message saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold rounded-lg shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? 'Saving...' : 'Save Message'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
