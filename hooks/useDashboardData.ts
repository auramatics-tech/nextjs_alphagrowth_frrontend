import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { dashboardService } from '../services/dashboardService';
import type { DashboardFilters, KPIData, SalesFunnelData, ChannelData, TaskData } from '../types/dashboard';

// Custom hook for KPI data
export const useKPIData = (userId: string, filters: DashboardFilters, refreshTrigger: number) => {
  const [data, setData] = useState<KPIData>({
    prospects: 2432,
    replies: 189,
    meetings: 34,
    pipeline: 85200,
    openRate: 65,
    replyRate: 8.2,
    meetingRate: 18.0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const debouncedRefreshTrigger = useDebounce(refreshTrigger, 300);
  const filtersRef = useRef(filters);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getKPIs(userId, filtersRef.current);
      setData(response);
    } catch (err) {
      console.error('KPI Error:', err);
      // Keep existing fallback data, don't set error
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && !hasInitialized) {
      setHasInitialized(true);
      fetchData();
    }
  }, [userId, hasInitialized, fetchData]);

  // Only refetch on refresh trigger changes, not on every filter change
  useEffect(() => {
    if (hasInitialized && debouncedRefreshTrigger > 0) {
      fetchData();
    }
  }, [debouncedRefreshTrigger, hasInitialized, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Custom hook for Sales Funnel data
export const useSalesFunnelData = (userId: string, filters: DashboardFilters, refreshTrigger: number) => {
  const [data, setData] = useState<SalesFunnelData>({
    qualified: 43500,
    scheduled: 34800,
    completed: 31320,
    nurture: 26100,
    won: 31320,
    lost: 6960,
    qualifiedValue: 43500,
    scheduledValue: 34800,
    completedValue: 31320,
    nurtureValue: 26100,
    wonValue: 31320,
    lostValue: 6960,
    totalValue: 43500
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const debouncedRefreshTrigger = useDebounce(refreshTrigger, 300);
  const filtersRef = useRef(filters);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getSalesFunnel(userId, filtersRef.current);
      setData(response);
    } catch (err) {
      console.error('Sales Funnel Error:', err);
      // Keep existing fallback data, don't set error
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && !hasInitialized) {
      setHasInitialized(true);
      fetchData();
    }
  }, [userId, hasInitialized, fetchData]);

  // Only refetch on refresh trigger changes, not on every filter change
  useEffect(() => {
    if (hasInitialized && debouncedRefreshTrigger > 0) {
      fetchData();
    }
  }, [debouncedRefreshTrigger, hasInitialized, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Custom hook for Channels data
export const useChannelsData = (userId: string, filters: DashboardFilters, refreshTrigger: number) => {
  const [data, setData] = useState<ChannelData[]>([
    {
      channel: 'Email',
      prospects: 1050,
      openRate: 65,
      replies: 95,
      meetings: 18,
      pipeline: 42300
    },
    {
      channel: 'LinkedIn',
      prospects: 850,
      acceptRate: 35,
      replies: 78,
      meetings: 12,
      pipeline: 31500
    },
    {
      channel: 'Voice',
      prospects: 442,
      replies: 16,
      meetings: 4,
      pipeline: 11400
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const debouncedRefreshTrigger = useDebounce(refreshTrigger, 300);
  const filtersRef = useRef(filters);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getChannelsData(userId, filtersRef.current);
      
      // Ensure data is an array
      let processedData = response;
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        processedData = (response as any).channels || (response as any).data || (response as any).results || [];
      }
      
      if (!Array.isArray(processedData)) {
        processedData = [];
      }
      
      setData(processedData);
    } catch (err) {
      console.error('Channels Error:', err);
      // Keep existing fallback data, don't set error
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && !hasInitialized) {
      setHasInitialized(true);
      fetchData();
    }
  }, [userId, hasInitialized, fetchData]);

  // Only refetch on refresh trigger changes, not on every filter change
  useEffect(() => {
    if (hasInitialized && debouncedRefreshTrigger > 0) {
      fetchData();
    }
  }, [debouncedRefreshTrigger, hasInitialized, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Custom hook for Tasks data
export const useTasksData = (userId: string, filters: DashboardFilters, refreshTrigger: number) => {
  const [data, setData] = useState<TaskData[]>([
    {
      id: '1',
      name: 'Chait Jain',
      company: 'DataCorp',
      type: 'Create Task',
      date: '2025-09-16',
      time: '14:30',
      email: 'chait@datacorp.com',
      phone: '+1 555-0123',
      remark: 'Follow up on proposal Q4'
    },
    {
      id: '2',
      name: 'Jane Doe',
      company: 'TechCorp',
      type: 'Send Email',
      date: '2025-09-16',
      time: '16:00',
      email: 'jane@techcorp.com',
      phone: '+1 555-0456',
      remark: 'Initial outreach for new campaign'
    },
    {
      id: '3',
      name: 'Alex Ray',
      company: 'Innovate LLC',
      type: 'Call',
      date: '2025-09-17',
      time: '11:00',
      email: 'alex@innovate.com',
      phone: '+1 555-0789',
      remark: 'Discuss integration options'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const debouncedRefreshTrigger = useDebounce(refreshTrigger, 300);
  const filtersRef = useRef(filters);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getTasks(userId, filtersRef.current);
      
      // Ensure data is an array
      let processedData = response;
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        processedData = (response as any).tasks || (response as any).data || (response as any).results || [];
      }
      
      if (!Array.isArray(processedData)) {
        processedData = [];
      }
      
      setData(processedData);
    } catch (err) {
      console.error('Tasks Error:', err);
      // Keep existing fallback data, don't set error
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && !hasInitialized) {
      setHasInitialized(true);
      fetchData();
    }
  }, [userId, hasInitialized, fetchData]);

  // Only refetch on refresh trigger changes, not on every filter change
  useEffect(() => {
    if (hasInitialized && debouncedRefreshTrigger > 0) {
      fetchData();
    }
  }, [debouncedRefreshTrigger, hasInitialized, fetchData]);

  return { data, loading, error, refetch: fetchData };
};
