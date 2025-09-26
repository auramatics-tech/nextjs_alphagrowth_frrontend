'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File, previewData: any[]) => void;
  currentFile: File | null;
}

export default function FileUpload({ onFileUpload, currentFile }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = useCallback((text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < Math.min(lines.length, 6); i++) { // Preview first 5 rows
      const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }

    return data;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file.');
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const previewData = parseCSV(text);
      
      if (previewData.length === 0) {
        alert('The CSV file appears to be empty or invalid.');
        return;
      }

      onFileUpload(file, previewData);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error reading the CSV file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [parseCSV, onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleRemoveFile = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Reset to allow file selection again
    window.location.reload(); // Simple reset for demo
  }, []);

  const handleClick = useCallback(() => {
    if (!currentFile && !isProcessing) {
      fileInputRef.current?.click();
    }
  }, [currentFile, isProcessing]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CSV File</h3>
        <p className="text-gray-600">Select a CSV file containing your contact data. We&apos;ll preview the first few rows to help you map the fields.</p>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-orange-500 bg-orange-50'
            : currentFile
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 mx-auto border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-lg font-medium text-gray-900">Processing CSV...</p>
              <p className="text-gray-600">Reading and parsing your file</p>
            </div>
          </motion.div>
        ) : currentFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">File Uploaded Successfully</p>
              <p className="text-gray-600 mb-2">{currentFile.name}</p>
              <p className="text-sm text-gray-500">
                Size: {(currentFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={16} className="mr-1" />
              Remove File
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Upload size={32} className="text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drag & drop your CSV file here
              </p>
              <p className="text-gray-600 mt-1">or click to browse files</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Supported format: .csv</p>
              <p>Maximum file size: 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* File Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">CSV File Requirements</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• First row should contain column headers</li>
          <li>• Include at least an email column for each contact</li>
          <li>• Use comma-separated values (CSV format)</li>
          <li>• Avoid special characters in headers</li>
          <li>• Maximum 10,000 rows per import</li>
        </ul>
      </div>

      {/* Sample CSV Format */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Sample CSV Format</h4>
        <div className="text-sm text-gray-600 font-mono bg-white p-3 rounded border">
          <div>first_name,last_name,email,company,title</div>
          <div>John,Doe,john@example.com,Acme Corp,CEO</div>
          <div>Jane,Smith,jane@example.com,Tech Inc,CTO</div>
        </div>
      </div>
    </div>
  );
}
