'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardFilters } from '../../types/dashboard';

interface FilterDropdownsProps {
  userId: string;
  refreshTrigger: number;
  onRefresh: () => void;
  onFiltersChange: (filters: DashboardFilters) => void;
}

interface Option {
  id: string;
  label: string;
  gtmId?: string;
}

const MultiSelectDropdown: React.FC<{
  label: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
}> = ({ label, options, selected, onChange }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(x => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const allSelected = selected.length === options.length && options.length > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
        type="button"
        onClick={() => setOpen(v => !v)}
      >
        {label}
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <div className="flex justify-between items-center px-2 pb-2 text-xs text-gray-500">
              <span>{options.length} options</span>
              <button
                type="button"
                className="text-orange-600 hover:text-orange-700 text-xs font-medium"
                onClick={() => onChange(allSelected ? [] : options.map(o => o.id))}
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {options.map(o => (
                <label key={o.id} className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    checked={selected.includes(o.id)}
                    onChange={() => toggle(o.id)}
                  />
                  <span className="text-sm text-gray-700 truncate">{o.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterDropdowns: React.FC<FilterDropdownsProps> = ({ 
  userId, 
  refreshTrigger, 
  onRefresh, 
  onFiltersChange 
}) => {
  const [gtmOptions, setGtmOptions] = useState<Option[]>([]);
  const [campaignOptions, setCampaignOptions] = useState<Option[]>([]);
  const [selGtms, setSelGtms] = useState<string[]>([]);
  const [selCampaigns, setSelCampaigns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNotifiedInitial, setHasNotifiedInitial] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Transform GTM data from API response
  const transformGTMData = (response: any): Option[] => {
    const gtmData = response.data || response;
    return gtmData.map((gtm: any) => ({
      id: gtm.id,
      label: gtm.gtmName
    }));
  };

  // Transform Campaign data from API response
  const transformCampaignData = (response: any): Option[] => {
    const campaignData = response.data || response;
    return campaignData.map((campaign: any) => ({
      id: campaign.id,
      label: campaign.name || 'Unnamed Campaign',
      gtmId: campaign.gtmId || null
    }));
  };

  // Fetch GTM Strategies
  const fetchGTMStrategies = async () => {
    try {
      const response = await dashboardService.getGTMStrategies(userId);
      const gtmData = transformGTMData(response);
      setGtmOptions(gtmData);
      
      // Only auto-select on initial load
      if (gtmData.length > 0 && isInitialLoad) {
        setSelGtms(gtmData.map(g => g.id));
      }
    } catch (err) {
      console.error('Error fetching GTM strategies:', err);
      setError('Failed to load GTM strategies');
    }
  };

  // Fetch Campaigns
  const fetchCampaigns = async () => {
    try {
      const response = await dashboardService.getCampaigns(userId);
      const campaignData = transformCampaignData(response);
      setCampaignOptions(campaignData);
      
      // Only auto-select on initial load
      if (campaignData.length > 0 && isInitialLoad) {
        setSelCampaigns(campaignData.map(c => c.id));
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns');
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchGTMStrategies(),
        fetchCampaigns()
      ]);
      
      // Mark as no longer initial load after first fetch
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (err) {
      setError('Failed to load filter data');
    } finally {
      setLoading(false);
    }
  };

  // Effect for data fetching - only on userId change
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Notify parent when filters change
  const notifyFiltersChange = useCallback(() => {
    if (onFiltersChange) {
      onFiltersChange({
        gtmIds: selGtms,
        campaignIds: selCampaigns
      });
    }
  }, [selGtms, selCampaigns, onFiltersChange]);

  // Notify parent only after initial data load
  useEffect(() => {
    if ((gtmOptions.length > 0 || campaignOptions.length > 0) && onFiltersChange && !hasNotifiedInitial) {
      onFiltersChange({
        gtmIds: selGtms,
        campaignIds: selCampaigns
      });
      setHasNotifiedInitial(true);
    }
  }, [gtmOptions.length, campaignOptions.length, hasNotifiedInitial]);

  // Handle GTM selection change
  const handleGTMChange = (selectedGtmIds: string[]) => {
    setSelGtms(selectedGtmIds);
    
    // Filter campaigns based on selected GTMs
    const filteredCampaigns = campaignOptions.filter(c => 
      selectedGtmIds.includes(c.gtmId || '')
    );
    const filteredCampaignIds = filteredCampaigns.map(c => c.id);
    setSelCampaigns(filteredCampaignIds);
    
    // Notify parent immediately
    if (onFiltersChange) {
      onFiltersChange({
        gtmIds: selectedGtmIds,
        campaignIds: filteredCampaignIds
      });
    }
  };

  // Handle Campaign selection change
  const handleCampaignChange = (selectedCampaignIds: string[]) => {
    setSelCampaigns(selectedCampaignIds);
    
    // Notify parent immediately
    if (onFiltersChange) {
      onFiltersChange({
        gtmIds: selGtms,
        campaignIds: selectedCampaignIds
      });
    }
  };

  // Get filtered campaign options based on selected GTMs
  const filteredCampaignOptions = selGtms.length 
    ? campaignOptions.filter(c => selGtms.includes(c.gtmId || ''))
    : campaignOptions;

  // Clear all selections
  const clearAllSelections = () => {
    setSelGtms([]);
    setSelCampaigns([]);
    
    // Notify parent immediately
    if (onFiltersChange) {
      onFiltersChange({
        gtmIds: [],
        campaignIds: []
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex gap-2">
        <div className="px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
          Loading GTMs...
        </div>
        <div className="px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
          Loading Campaigns...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex gap-2">
        <div className="px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
          Error loading filters
        </div>
        <button
          onClick={onRefresh}
          className="px-3 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-300 rounded-lg hover:bg-orange-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <MultiSelectDropdown
        label={`GTM: ${selGtms.length ? `${selGtms.length} selected` : "All"}`}
        options={gtmOptions}
        selected={selGtms}
        onChange={handleGTMChange}
      />
      <MultiSelectDropdown
        label={`Campaigns: ${selCampaigns.length ? `${selCampaigns.length} selected` : "All"}`}
        options={filteredCampaignOptions}
        selected={selCampaigns}
        onChange={handleCampaignChange}
      />
      {(selGtms.length > 0 || selCampaigns.length > 0) && (
        <button
          onClick={clearAllSelections}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          title="Clear all selections"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterDropdowns;


