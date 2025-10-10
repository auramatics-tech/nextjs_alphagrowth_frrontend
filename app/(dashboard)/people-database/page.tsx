'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  Plus,
  Eye,
  EyeOff,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Building,
  ExternalLink,
  Loader2,
  Download
} from 'lucide-react';
import FilterSidebarSimple, { FILTER_CONFIGS } from '../../../components/people/FilterSidebarSimple';
import ImportLeadsModal from '../../../components/people/ImportLeadsModal';
import peopleService, { Person, PaginationData } from '../../../services/peopleService';
import leadService from '../../../services/leadService';
import { toast } from 'react-hot-toast';


// Column configuration (mapped to Apollo.io fields)
const initialColumns = [
  { key: 'profilePicture', label: 'Profile Picture', isVisible: true },
  { key: 'firstName', label: 'First Name', isVisible: true },
  { key: 'lastName', label: 'Last Name', isVisible: true, isSticky: true },
  { key: 'pro_email', label: 'Business Email', isVisible: true },
  { key: 'phone', label: 'Phone', isVisible: true },
  { key: 'perso_email', label: 'Personal Email', isVisible: false },
  { key: 'company_name', label: 'Company', isVisible: true },
  { key: 'job', label: 'Job Title', isVisible: true },
  { key: 'location', label: 'Location', isVisible: true },
  { key: 'organization_employees_estimate', label: 'Company Size', isVisible: true },
  { key: 'website', label: 'Company Website', isVisible: true },
  { key: 'industry', label: 'Industry', isVisible: true },
  { key: 'profile_url', label: 'LinkedIn URL', isVisible: true },
  { key: 'bio', label: 'Bio', isVisible: false },
  { key: 'seniority', label: 'Seniority', isVisible: true },
  { key: 'email_status', label: 'Email Status', isVisible: true },
  { key: 'city', label: 'City', isVisible: false },
  { key: 'state', label: 'State', isVisible: false },
  { key: 'country', label: 'Country', isVisible: false },
  { key: 'departments', label: 'Departments', isVisible: false },
  { key: 'gender', label: 'Gender', isVisible: false }
];

// Column Selector Component
const ColumnSelector = ({ isOpen, onClose, columns, setColumns, searchQuery, setSearchQuery }: any) => {
  const filteredColumns = columns.filter((column: any) =>
    column.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleColumnVisibility = (columnKey: any) => {
    setColumns((prev: any) => prev.map((col: any) =>
      col.key === columnKey ? { ...col, isVisible: !col.isVisible } : col
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-6 w-96 max-h-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search a column</h3>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredColumns.map((column: any) => (
                <div key={column.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{column.label || column.key}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleColumnVisibility(column.key)}
                      className={`w-8 h-5 rounded-full transition-colors ${column.isVisible ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${column.isVisible ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                    </button>
                    {column.isVisible ? (
                      <Eye size={16} className="text-gray-600" />
                    ) : (
                      <EyeOff size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function PeopleDatabasePage() {
  // UI State
  const [columns, setColumns] = useState(initialColumns);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [columnSearchQuery, setColumnSearchQuery] = useState('');
  const [isFilterSidebarCollapsed, setIsFilterSidebarCollapsed] = useState(false);
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false);

  // Data State
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [jumpToPage, setJumpToPage] = useState('');

  // Page size options
  const pageSizeOptions = [10, 25, 50, 100];

  // Filter State (maps to Apollo.io API) - Only filters from FILTER_CONFIGS
  const [filters, setFilters] = useState<Record<string, string[]>>({
    selectedJobs: [],
    selectedcountry: [],
    selectedregion: [],
    selecteddepartment: [],
    selectedposition: [],
    selectedseniority: []
  });

  const visibleColumns = columns.filter(col => col.isVisible);

  // Build API payload from filters
  const buildAPIPayload = (filters: Record<string, string[]>, page: number, perPage: number) => {
    const payload: any = {
      page,
      per_page: perPage
    };

    // Map filters to API parameters using FILTER_CONFIGS
    Object.keys(FILTER_CONFIGS).forEach(key => {
      const config = FILTER_CONFIGS[key as keyof typeof FILTER_CONFIGS];
      const filterValues = filters[config.key];

      if (filterValues && filterValues.length > 0) {
        payload[config.apiKey] = filterValues;
      }
    });

    return payload;
  };

  // Fetch people data from API
  const fetchPeople = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Fetching people with filters:', filters);

      // Build API payload
      const payload = buildAPIPayload(filters, currentPage, itemsPerPage);
      console.log('📤 API Payload:', payload);

      // Call API
      const response = await peopleService.searchPeople(payload);
      console.log('📥 API Response:', response);

      // Update people data
      setPeople(response.data || []);

      // Update pagination
      if (response.pagination) {
   
        setTotalRecords(response.pagination.total_entries);
        setTotalPages(response.pagination.total_pages);
        setCurrentPage(response.pagination.page);
      }

      toast.success(`Found ${response.data?.length || 0} people`);

    } catch (err: any) {
      console.error('❌ Error fetching people:', err);
      setError(err.message || 'Failed to fetch people');
      setPeople([]);
      toast.error(err.message || 'Failed to fetch people');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, itemsPerPage]);

  // Fetch data on mount and when filters/pagination change
  useEffect(() => {
    // Only fetch if we have some filters or it's initial load
    if (Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) || currentPage > 1) {
      fetchPeople();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPeople, currentPage, filters]);

  const handleSelectAll = () => {
    if (selectedRows.length === people.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(people.map((person: any) => person.id) as any);
    }
  };

  const handleSelectRow = (personId: any) => {
    setSelectedRows((prev: any) =>
      prev.includes(personId)
        ? prev.filter((id: any) => id !== personId)
        : [...prev, personId]
    );
  };

  const handleFilterChange = (filterKey: string, values: string[]) => {
    console.log('Filter changed:', filterKey, values);
    setFilters(prev => ({
      ...prev,
      [filterKey]: values
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      selectedJobs: [],
      selectedcountry: [],
      selectedregion: [],
      selecteddepartment: [],
      selectedposition: [],
      selectedseniority: []
    });
    setCurrentPage(1);
    setPeople([]);
    setSelectedRows([]);
    toast.success('Filters reset');
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page
    fetchPeople();
  };

  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
    toast.success(`Showing ${newSize} items per page`);
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpToPage('');
      toast.success(`Jumped to page ${pageNum}`);
    } else {
      toast.error(`Please enter a page between 1 and ${totalPages}`);
    }
  };

  // Import leads handlers
  const handleImportToAudience = () => {
    setIsAudienceModalOpen(true);
  };

  const handleImportLeads = async (audienceName: string) => {
    try {
      console.log('📤 Importing leads:', { audienceName, count: selectedRows.length });

      // Get selected leads data
      const selectedLeads = people.filter(person => selectedRows.includes(person.id));

      if (selectedLeads.length === 0) {
        toast.error('No leads selected');
        return;
      }

      // Build payload matching old frontend format
      // Note: campaign_id will be added by backend or use a default
      const payload = {
        campaign_id: '', // Empty - backend will handle or create default
        audience_name: audienceName,
        leads: selectedLeads.map((user) => ({
          bio: user.bio,
          picture: user.picture,
          profile_url: user.profile_url,
          location: user.location,
          first_name: user.first_name,
          last_name: user.last_name,
          company_name: user.company_name,
          phone: user.phone,
          pro_email: user.pro_email,
          perso_email: user.perso_email,
          job: user.job,
          website: user.website,
          industry: user.industry,
          linkedin: user.profile_url,
          twitter: user.twitter,
          gender: user.gender,
          city: user.city,
          country: user.country,
          email_status: user.email_status,
          employment_history: user.employment_history,
          facebook_url: user.facebook_url,
          github_url: user.github_url,
          organization: user.organization,
          seniority: user.seniority,
          state: user.state,
          departments: user.departments,
          subdepartments: user.subdepartments
        }))
      };

      console.log('📦 Import payload:', payload);

      // Call API
      await leadService.addLeadsToCampaign(payload);

      // Success feedback
      toast.success(`Successfully imported ${selectedLeads.length} leads to "${audienceName}"`);

      // Clear selection
      setSelectedRows([]);

    } catch (err: any) {
      console.error('❌ Import error:', err);
      toast.error(err.message || 'Failed to import leads');
      throw err; // Re-throw to let modal handle it
    }
  };

  const handleToggleFilterSidebar = () => {
    setIsFilterSidebarCollapsed(!isFilterSidebarCollapsed);
  };

  // Export to CSV functionality
  const handleExportCSV = () => {
    try {
      const selectedLeads = people.filter(p => selectedRows.includes(p.id));
      
      if (selectedLeads.length === 0) {
        toast.error('No leads selected for export');
        return;
      }

      // Define CSV headers
      const headers = [
        'First Name', 'Last Name', 'Email', 'Phone', 'Company',
        'Job Title', 'Location', 'City', 'State', 'Country',
        'LinkedIn URL', 'Website', 'Industry', 'Seniority', 'Email Status'
      ];

      // Convert leads to CSV rows
      const csvRows = selectedLeads.map(person => [
        person.first_name || '',
        person.last_name || '',
        person.pro_email || person.perso_email || '',
        person.phone || '',
        person.company_name || '',
        person.job || '',
        person.location || '',
        person.city || '',
        person.state || '',
        person.country || '',
        person.profile_url || '',
        person.website || '',
        person.industry || '',
        person.seniority || '',
        person.email_status || ''
      ]);

      // Build CSV string
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Successfully exported ${selectedLeads.length} leads to CSV`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export leads');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'f':
            e.preventDefault();
            setIsFilterSidebarCollapsed(false);
            toast.success('Filters opened (Ctrl+F)');
            break;
          case 'a':
            e.preventDefault();
            handleSelectAll();
            break;
          case 'e':
            if (selectedRows.length > 0) {
              e.preventDefault();
              handleExportCSV();
            }
            break;
        }
      } else if (e.key === 'Escape') {
        if (isAudienceModalOpen) {
          setIsAudienceModalOpen(false);
        } else if (isColumnMenuOpen) {
          setIsColumnMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows, isAudienceModalOpen, isColumnMenuOpen, people, handleSelectAll, handleExportCSV]);

  const getPersonAvatar = (name: any) => {
    const initials = name.split(' ').map((n: any) => n[0]).join('').toUpperCase();
    return (
      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
        {initials}
      </div>
    );
  };

  const renderCellContent = (person: any, column: any) => {
    switch (column.key) {
      case 'lastName':
        return (
          <div className="flex items-center gap-3">
            {person.picture ? (
              <img src={person.picture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              getPersonAvatar(`${person.first_name} ${person.last_name}`)
            )}
            <div>
              <div className="font-medium text-gray-900">{person.first_name} {person.last_name}</div>
              {person.job && <div className="text-xs text-gray-500">{person.job}</div>}
            </div>
            {person.profile_url && (
              <a href={person.profile_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="text-blue-600" />
              </a>
            )}
          </div>
        );
      case 'profilePicture':
        return person.picture ? (
          <img src={person.picture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          getPersonAvatar(`${person.first_name} ${person.last_name}`)
        );
      case 'firstName':
        return <span className="text-gray-900">{person.first_name}</span>;
      case 'fullName':
        return <span className="text-gray-900">{person.first_name} {person.last_name}</span>;
      case 'businessEmail':
      case 'pro_email':
        return person.pro_email ? (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            <a href={`mailto:${person.pro_email}`} className="text-blue-600 hover:text-blue-800 text-sm">
              {person.pro_email}
            </a>
          </div>
        ) : null;
      case 'phone':
        return person.phone ? (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-400" />
            <a href={`tel:${person.phone}`} className="text-blue-600 hover:text-blue-800">
              {person.phone}
            </a>
          </div>
        ) : null;
      case 'personalEmail':
      case 'perso_email':
        return person.perso_email ? (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            <a href={`mailto:${person.perso_email}`} className="text-blue-600 hover:text-blue-800 text-sm">
              {person.perso_email}
            </a>
          </div>
        ) : null;
      case 'company':
      case 'company_name':
        return (
          <div className="flex items-center gap-2">
            {person.organization_logo_url && (
              <img src={person.organization_logo_url} alt={person.company_name} className="w-6 h-6 rounded" />
            )}
            <span className="text-gray-900">{person.company_name}</span>
          </div>
        );
      case 'jobTitle':
      case 'job':
        return <span className="text-gray-900">{person.job}</span>;
      case 'location':
        return (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span className="text-gray-700">{person.location}</span>
          </div>
        );
      case 'companySize':
      case 'organization_employees_estimate':
        return person.organization_employees_estimate ? (
          <span className="text-gray-900">{person.organization_employees_estimate}</span>
        ) : null;
      case 'companyWebsite':
      case 'website':
        return person.website ? (
          <a href={person.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
            {person.website}
          </a>
        ) : null;
      case 'industry':
        return <span className="text-gray-900">{person.industry}</span>;
      case 'linkedinUrl':
      case 'profile_url':
        return person.profile_url ? (
          <a href={person.profile_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ExternalLink size={16} />
            <span className="text-sm">LinkedIn</span>
          </a>
        ) : null;
      case 'bio':
        return person.bio ? (
          <div className="text-sm text-gray-700 max-w-xs truncate" title={person.bio}>
            {person.bio}
          </div>
        ) : null;
      case 'gender':
        return <span className="text-gray-900">{person.gender}</span>;
      case 'seniority':
        return person.seniority ? (
          <span className="text-gray-900">{person.seniority}</span>
        ) : null;
      case 'email_status':
        return person.email_status ? (
          <span className={`px-2 py-1 text-xs rounded-full ${person.email_status === 'verified' ? 'bg-green-100 text-green-800' :
              person.email_status === 'guessed' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
            }`}>
            {person.email_status}
          </span>
        ) : null;
      case 'departments':
        return person.departments && person.departments.length > 0 ? (
          <span className="text-gray-900">{person.departments.join(', ')}</span>
        ) : null;
      default:
        return <span className="text-gray-900">{person[column.key]}</span>;
    }
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <style jsx>{`
        .people-table {
          min-width: 3000px;
          width: 100%;
          table-layout: auto;
          border-collapse: separate;
          border-spacing: 0;
        }
        .people-table th,
        .people-table td {
          white-space: nowrap;
          min-width: 120px;
          padding: 12px 16px;
        }
        .sticky-checkbox {
          position: sticky;
          left: 0;
          background-color: white;
          z-index: 10;
          border-right: 1px solid #e5e7eb;
          width: 60px;
          min-width: 60px;
          max-width: 60px;
        }
        .sticky-profile {
          position: sticky;
          left: 60px;
          background-color: white;
          z-index: 10;
          border-right: 1px solid #e5e7eb;
          width: 80px;
          min-width: 80px;
          max-width: 80px;
        }
        .sticky-name {
          position: sticky;
          left: 140px;
          background-color: white;
          z-index: 10;
          border-right: 1px solid #e5e7eb;
          width: 200px;
          min-width: 200px;
          max-width: 200px;
        }
        .sticky-header {
          position: sticky;
          top: 0;
          background-color: #f9fafb;
          z-index: 20;
        }
        .people-table thead th {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .table-scroll-container {
          overflow-x: auto;
          overflow-y: auto;
          height: 70vh;
          max-height: 70vh;
          width: 100%;
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f9fafb;
          position: relative;
          flex: 1;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .table-scroll-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .table-scroll-container::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .table-scroll-container::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }
        .table-scroll-container::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        .main-content {
          height: 100vh;
          overflow: hidden;
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {/* Filter Sidebar */}
      <FilterSidebarSimple
        isCollapsed={isFilterSidebarCollapsed}
        onToggleCollapse={handleToggleFilterSidebar}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col main-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">People</h1>
              <div className="flex items-center gap-1">
                {loading ? (
                  <Loader2 size={20} className="animate-spin text-orange-500" />
                ) : (
                  <>
                    <span className="text-2xl font-bold text-gray-900">
                      {totalRecords > 0 ? (
                        totalRecords >= 1000000
                          ? `${(totalRecords / 1000000).toFixed(1)}M`
                          : totalRecords >= 1000
                            ? `${(totalRecords / 1000).toFixed(1)}K`
                            : totalRecords
                      ) : '0'}
                    </span>
                    {totalRecords > 0 && (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </>
                )}
              </div>
            </div>

          <div className="flex items-center gap-3">
            {/* Selected Count */}
            {selectedRows.length > 0 && (
              <div className="text-sm text-gray-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                <span className="font-medium text-orange-700">{selectedRows.length}</span> selected
              </div>
            )}

            {/* Export Button */}
            {selectedRows.length > 0 && (
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                title="Export selected leads to CSV (Ctrl+E)"
              >
                <Download size={16} />
                <span>Export {selectedRows.length}</span>
              </button>
            )}

            {/* Filter Toggle Button */}
            <button 
              onClick={handleToggleFilterSidebar}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Toggle filters (Ctrl+F)"
            >
              <Filter size={16} className="text-gray-600" />
              <span className="text-gray-700">Filters</span>
              {Object.values(filters).some((f: any) => f.length > 0) && (
                <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {Object.values(filters).filter((f: any) => f.length > 0).length}
                </span>
              )}
            </button>

            {/* Keyboard Shortcuts Helper */}
            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="font-mono">Ctrl+F</span> Filters • 
              <span className="font-mono ml-1">Ctrl+A</span> Select All • 
              <span className="font-mono ml-1">Ctrl+E</span> Export • 
              <span className="font-mono ml-1">Esc</span> Close
            </div>
          </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="table-scroll-container">
          <table className="people-table">
            <thead className="bg-gray-50 border-b border-gray-200 sticky-header">
              <tr>
                {/* Select All Checkbox */}
                <th className="sticky-checkbox px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={people.length > 0 && selectedRows.length === people.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    disabled={loading || people.length === 0}
                  />
                </th>

                {/* Dynamic Columns */}
                {visibleColumns.map((column, index) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap ${column.key === 'profilePicture' ? 'sticky-profile' :
                        column.isSticky ? 'sticky-name' : ''
                      }`}
                  >
                    {column.label}
                  </th>
                ))}

                {/* Add Column Button */}
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => setIsColumnMenuOpen(true)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </th>

                {/* Actions Column */}
                <th className="px-4 py-3 text-left">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </th>
              </tr>
            </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton rows
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <tr key={i} className="animate-pulse">
                    {/* Checkbox skeleton */}
                    <td className="sticky-checkbox px-4 py-3">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    </td>
                    
                    {/* Profile picture skeleton */}
                    <td className="sticky-profile px-4 py-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </td>
                    
                    {/* Name skeleton */}
                    <td className="sticky-name px-4 py-3">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </td>
                    
                    {/* Other columns skeleton */}
                    {visibleColumns.slice(3).map((col, idx) => (
                      <td key={idx} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                    ))}
                    
                    {/* Add column placeholder */}
                    <td className="px-4 py-3"></td>
                    
                    {/* Actions skeleton */}
                    <td className="px-4 py-3">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : error ? (
                <tr>
                  <td colSpan={visibleColumns.length + 3} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="text-red-500 text-lg">⚠️</div>
                      <p className="text-red-600">{error}</p>
                      <button
                        onClick={fetchPeople}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : people.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 3} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="text-gray-400 text-lg">🔍</div>
                      <p className="text-gray-600">No people found. Try adjusting your filters.</p>
                      <button
                        onClick={() => setIsFilterSidebarCollapsed(false)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Open Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                people.map((person, rowIndex) => (
                  <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                    {/* Row Checkbox */}
                    <td className="sticky-checkbox px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(person.id)}
                        onChange={() => handleSelectRow(person.id)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                    </td>

                    {/* Dynamic Columns */}
                    {visibleColumns.map((column, colIndex) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-sm whitespace-nowrap ${column.key === 'profilePicture' ? 'sticky-profile' :
                            column.isSticky ? 'sticky-name' : ''
                          }`}
                      >
                        {renderCellContent(person, column)}
                      </td>
                    ))}

                    {/* Add Column Placeholder */}
                    <td className="px-4 py-3"></td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left Section - Record Info & Page Size */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-sm text-gray-700">
                {people.length > 0 ? (
                  <>
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalRecords)}</span> of{' '}
                    <span className="font-medium">{totalRecords.toLocaleString()}</span> entries
                  </>
                ) : (
                  <span>No results</span>
                )}
              </div>

              {/* Page Size Selector */}
              {people.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pageSizeOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
              )}
            </div>

            {/* Center Section - Page Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* First Page Button */}
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors rounded hover:bg-gray-100"
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage(1)}
                  title="First Page"
                >
                  <ChevronLeft size={16} className="transform scale-x-150" />
                </button>

                {/* Previous Button */}
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors rounded hover:bg-gray-100"
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                  {/* First page */}
                  {currentPage > 2 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={loading}
                        className="w-8 h-8 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        1
                      </button>
                      {currentPage > 3 && <span className="px-2 text-gray-400">•••</span>}
                    </>
                  )}

                  {/* Current and adjacent pages */}
                  {[currentPage - 1, currentPage, currentPage + 1].map((page) => {
                    if (page < 1 || page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        disabled={loading}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors disabled:opacity-50 ${page === currentPage
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Last page */}
                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && <span className="px-2 text-gray-400">•••</span>}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={loading}
                        className="w-8 h-8 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <button
                  className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors rounded hover:bg-gray-100"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Last Page Button */}
                <button
                  className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors rounded hover:bg-gray-100"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setCurrentPage(totalPages)}
                  title="Last Page"
                >
                  <ChevronRight size={16} className="transform scale-x-150" />
                </button>
              </div>
            )}

            {/* Right Section - Jump to Page & Apply Filters */}
            <div className="flex items-center gap-3">
              {/* Jump to Page */}
              {totalPages > 1 && (
                <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Go to:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    placeholder={currentPage.toString()}
                    disabled={loading}
                    className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={loading || !jumpToPage}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Go
                  </button>
                </form>
              )}

              {/* Apply Filters Button */}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
                onClick={handleApplyFilters}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Apply Filters</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Import Button */}
      {selectedRows.length > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={handleImportToAudience}
          className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="font-semibold">Import {selectedRows.length} leads to Audience</span>
        </motion.button>
      )}

      {/* Column Selector Modal */}
      <ColumnSelector
        isOpen={isColumnMenuOpen}
        onClose={() => setIsColumnMenuOpen(false)}
        columns={columns}
        setColumns={setColumns}
        searchQuery={columnSearchQuery}
        setSearchQuery={setColumnSearchQuery}
      />

      {/* Import Leads Modal */}
      <ImportLeadsModal
        isOpen={isAudienceModalOpen}
        onClose={() => setIsAudienceModalOpen(false)}
        selectedCount={selectedRows.length}
        onImport={handleImportLeads}
      />
    </div>
  );
}

