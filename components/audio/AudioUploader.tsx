'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Play, Pause, Trash2, Mic, MicOff, Download,
  AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react';

interface AudioUploaderProps {
  nodeId: string;
  initialAudioUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => void;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  isLoading?: boolean;
}

export default function AudioUploader({
  nodeId,
  initialAudioUrl,
  onUpload,
  onDelete,
  maxFileSize = 10,
  acceptedFormats = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'],
  isLoading = false
}: AudioUploaderProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(initialAudioUrl || null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size must be less than ${maxFileSize}MB`);
      return;
    }

    // Validate file format
    if (!acceptedFormats.includes(file.type)) {
      setError(`File format not supported. Accepted formats: ${acceptedFormats.join(', ')}`);
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      setAudioFile(file);
      
      // Create URL for preview
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      
      // Upload file
      await onUpload(file);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [maxFileSize, acceptedFormats, onUpload]);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const file = new File([blob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        handleFileSelect(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle audio playback
  const togglePlayback = () => {
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

  // Handle audio end
  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  // Delete audio
  const handleDelete = () => {
    setAudioFile(null);
    setAudioURL(null);
    setError(null);
    setSuccess(false);
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      {!audioURL && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-orange-400 bg-orange-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload size={24} className="text-gray-500" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Audio File
            </h3>
            
            <p className="text-gray-600 mb-4">
              Drag and drop an audio file here, or click to select
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Choose File
              </button>
              
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                {isRecording ? 'Stop Recording' : 'Record Audio'}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Max file size: {maxFileSize}MB • Formats: MP3, WAV, OGG
            </p>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {audioURL && (
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayback}
                className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {audioFile?.name || 'Audio File'}
                </div>
                <div className="text-xs text-gray-600">
                  {audioFile ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB` : 'Audio file'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {audioFile && (
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = audioURL!;
                    link.download = audioFile.name;
                    link.click();
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Download size={16} />
                </button>
              )}
              
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={audioURL}
            onEnded={handleAudioEnd}
            onPause={handleAudioEnd}
            className="w-full"
            controls
          />
        </motion.div>
      )}

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
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
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-700 text-sm">Audio uploaded successfully!</span>
          </motion.div>
        )}
        
        {isUploading && (
          <motion.div 
            className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RefreshCw size={16} className="text-blue-500 animate-spin" />
            <span className="text-blue-700 text-sm">Uploading audio...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



