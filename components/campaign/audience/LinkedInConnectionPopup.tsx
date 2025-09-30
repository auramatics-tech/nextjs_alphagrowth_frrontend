'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Info, AlertCircle, Plus } from 'lucide-react';
import { linkedinService, LinkedInCredentials } from '@/services/linkedinService';
import { useIdentities } from '@/hooks/useIdentities';
// import { toast } from 'react-hot-toast';

interface LinkedInConnectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (connectionId: string) => void;
  identityId?: string;
}

const LinkedInConnectionPopup: React.FC<LinkedInConnectionPopupProps> = ({
  isOpen,
  onClose,
  onSuccess,
  identityId
}) => {
  const [credentials, setCredentials] = useState<LinkedInCredentials>({
    email: '',
    password: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showIdentitySelection, setShowIdentitySelection] = useState(!identityId);
  
  // Identity management
  const {
    identities,
    selectedIdentity,
    loading: identityLoading,
    selectIdentity,
    createIdentity
  } = useIdentities({ autoFetch: true, linkedInOnly: true });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password || !credentials.location) {
      setError('All fields are required.');
      return;
    }

    const currentIdentityId = identityId || selectedIdentity?.id;
    if (!currentIdentityId) {
      setError('Please select an identity.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await linkedinService.saveCredentials(credentials, currentIdentityId);
      
      if (response.success && response.data?.id) {
        console.log('LinkedIn credentials saved successfully!');
        onSuccess(response.data.id);
        onClose();
      } else {
        throw new Error(response.message || 'Failed to save credentials');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [credentials, identityId, selectedIdentity, onSuccess, onClose]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Connect to LinkedIn</h2>
                <p className="text-sm text-gray-600">Enter your LinkedIn credentials</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Identity Selection */}
            {showIdentitySelection && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Identity
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedIdentity?.id || ''}
                    onChange={(e) => selectIdentity(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose an identity</option>
                    {identities.map((identity) => (
                      <option key={identity.id} value={identity.id}>
                        {identity.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt('Enter identity name:');
                      if (name) createIdentity(name);
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                    title="Create new identity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {identityLoading && (
                  <div className="text-sm text-gray-500">Loading identities...</div>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn Email
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="Enter your LinkedIn email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn Password
                </label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter your LinkedIn password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Info size={14} />
                <span>No LinkedIn Password? Contact support for assistance.</span>
              </div>
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <span>Location</span>
                <Info 
                  size={14} 
                  className="inline ml-1 text-gray-400" 
                />
              </label>
              <div className="text-xs text-gray-500 mb-2">
                The identity will automate LinkedIn actions in the specified country, and use the Limits & Hours already set in the identity section
              </div>
              <select
                name="location"
                value={credentials.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="" disabled>Select Identity Country</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="India">India</option>
                <option value="Brazil">Brazil</option>
                <option value="Japan">Japan</option>
                <option value="Singapore">Singapore</option>
                {/* Add more countries as needed */}
              </select>
            </div>

            {/* Terms */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                By clicking Authorize, you understand that AlphaGrowth will connect to LinkedIn on your behalf, to import leads & engage with your prospects.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Authorizing...' : 'Authorize'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LinkedInConnectionPopup;
