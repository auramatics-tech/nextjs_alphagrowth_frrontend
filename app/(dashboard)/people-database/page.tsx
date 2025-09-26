'use client';

import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import FilterSidebar from '../../../components/people/FilterSidebar';
import AudienceSelectionModal from '../../../components/people/AudienceSelectionModal';

// Mock people data matching the design
const mockPeople = [
  {
    id: '1',
    profilePicture: 'https://placehold.co/32x32/FF7316/FFFFFF?text=YS',
    firstName: 'Yadvinder',
    lastName: 'Singh',
    businessEmail: 'yadvinder.singh@morepen.com',
    phone: '+91 98765 43210',
    personalEmail: 'yadvinder.personal@gmail.com',
    company: 'Morepen Laborator...',
    companyLogo: 'https://placehold.co/24x24/3AA3FF/FFFFFF?text=M',
    jobTitle: 'Assistant Manager',
    location: 'India',
    companySize: '1001-5000',
    companyWebsite: 'http://www.morepen.com',
    industry: 'Manufacturing',
    linkedinUrl: 'https://linkedin.com/in/yadvinder-singh',
    bio: 'Experienced professional in pharmaceutical manufacturing with expertise in quality control.',
    gender: 'Male'
  },
  {
    id: '2',
    profilePicture: 'https://placehold.co/32x32/FF6B2C/FFFFFF?text=RK',
    firstName: 'Dr Ravi',
    lastName: 'Kumar',
    businessEmail: 'ravi.kumar@sugunafoods.com',
    phone: '+91 98765 43211',
    personalEmail: 'ravi.personal@gmail.com',
    company: 'Suguna Foods Priv...',
    companyLogo: 'https://placehold.co/24x24/FF6B2C/FFFFFF?text=S',
    jobTitle: 'Senior Manager',
    location: 'India',
    companySize: '5001-10000',
    companyWebsite: 'https://sugunafoods.com/',
    industry: 'Food & Beverage',
    linkedinUrl: 'https://linkedin.com/in/dr-ravi-kumar',
    bio: 'Senior management professional in food and beverage industry.',
    gender: 'Male'
  },
  {
    id: '3',
    profilePicture: 'https://placehold.co/32x32/10B981/FFFFFF?text=SN',
    firstName: 'Saloni',
    lastName: 'Nathani',
    businessEmail: 'saloni@dezinesquad.com',
    phone: '+91 98765 43212',
    personalEmail: 'saloni.personal@gmail.com',
    company: 'dezinesquad',
    companyLogo: 'https://placehold.co/24x24/10B981/FFFFFF?text=D',
    jobTitle: 'Graphic Designer',
    location: 'India',
    companySize: '1-10',
    companyWebsite: 'https://dezinesquad.com',
    industry: 'Design',
    linkedinUrl: 'https://linkedin.com/in/saloni-nathani',
    bio: 'Creative graphic designer with expertise in branding and visual communication.',
    gender: 'Female'
  },
  {
    id: '4',
    profilePicture: 'https://placehold.co/32x32/8B5CF6/FFFFFF?text=SP',
    firstName: 'Smruti',
    lastName: 'Panigrahi',
    businessEmail: 'smruti.panigrahi@techmahindra.com',
    phone: '+91 98765 43213',
    personalEmail: 'smruti.personal@gmail.com',
    company: 'Tech Mahindra',
    companyLogo: 'https://placehold.co/24x24/8B5CF6/FFFFFF?text=T',
    jobTitle: 'Sales Manager',
    location: 'India',
    companySize: '10001+',
    companyWebsite: 'www.techmahindra.com',
    industry: 'Technology',
    linkedinUrl: 'https://linkedin.com/in/smruti-panigrahi',
    bio: 'Sales professional with strong background in technology solutions.',
    gender: 'Female'
  },
  {
    id: '5',
    profilePicture: 'https://placehold.co/32x32/F59E0B/FFFFFF?text=CR',
    firstName: 'Chakravarthy',
    lastName: 'Reddy',
    businessEmail: 'chakravarthy@sattvagroup.in',
    phone: '+91 98765 43214',
    personalEmail: 'chakravarthy.personal@gmail.com',
    company: 'Sattva Group',
    companyLogo: 'https://placehold.co/24x24/F59E0B/FFFFFF?text=S',
    jobTitle: 'Senior Engineer',
    location: 'India',
    companySize: '201-500',
    companyWebsite: 'http://www.sattvagroup.in',
    industry: 'Engineering',
    linkedinUrl: 'https://linkedin.com/in/chakravarthy-reddy',
    bio: 'Experienced engineer specializing in infrastructure and construction projects.',
    gender: 'Male'
  },
  {
    id: '6',
    profilePicture: 'https://placehold.co/32x32/EF4444/FFFFFF?text=HM',
    firstName: 'Hemu',
    lastName: 'Marisetty',
    businessEmail: 'hemu.marisetty@tcs.com',
    phone: '+91 98765 43215',
    personalEmail: 'hemu.personal@gmail.com',
    company: 'TCS',
    companyLogo: 'https://placehold.co/24x24/EF4444/FFFFFF?text=T',
    jobTitle: 'Project Manager',
    location: 'India',
    companySize: '10001+',
    companyWebsite: 'https://www.tcs.com/',
    industry: 'IT Services',
    linkedinUrl: 'https://linkedin.com/in/hemu-marisetty',
    bio: 'Project management expert with focus on IT service delivery.',
    gender: 'Male'
  },
  {
    id: '7',
    profilePicture: 'https://placehold.co/32x32/06B6D4/FFFFFF?text=NG',
    firstName: 'Nisshant',
    lastName: 'Goswami',
    businessEmail: 'nisshant@cars24.com',
    phone: '+91 98765 43216',
    personalEmail: 'nisshant.personal@gmail.com',
    company: 'CARS24',
    companyLogo: 'https://placehold.co/24x24/06B6D4/FFFFFF?text=C',
    jobTitle: 'Business Analyst',
    location: 'India',
    companySize: '5001-10000',
    companyWebsite: 'https://www.cars24.com',
    industry: 'Automotive',
    linkedinUrl: 'https://linkedin.com/in/nisshant-goswami',
    bio: 'Business analyst with expertise in automotive industry and data analytics.',
    gender: 'Male'
  },
  {
    id: '8',
    profilePicture: 'https://placehold.co/32x32/84CC16/FFFFFF?text=MM',
    firstName: 'Md',
    lastName: 'Mustufa',
    businessEmail: 'mustufa@mars.com',
    phone: '+91 98765 43217',
    personalEmail: 'mustufa.personal@gmail.com',
    company: 'Mars',
    companyLogo: 'https://placehold.co/24x24/84CC16/FFFFFF?text=M',
    jobTitle: 'Operations Manager',
    location: 'India',
    companySize: '10001+',
    companyWebsite: 'https://www.mars.com',
    industry: 'Manufacturing',
    linkedinUrl: 'https://linkedin.com/in/md-mustufa',
    bio: 'Operations management professional with focus on manufacturing excellence.',
    gender: 'Male'
  },
  {
    id: '9',
    profilePicture: 'https://placehold.co/32x32/DC2626/FFFFFF?text=SH',
    firstName: 'Sourav',
    lastName: 'Halder',
    businessEmail: 'sourav.halder@mha.gov.in',
    phone: '+91 98765 43218',
    personalEmail: 'sourav.personal@gmail.com',
    company: 'MHA',
    companyLogo: 'https://placehold.co/24x24/DC2626/FFFFFF?text=M',
    jobTitle: 'Administrative Officer',
    location: 'India',
    companySize: '10001+',
    companyWebsite: 'http://www.mha.gov.in',
    industry: 'Government',
    linkedinUrl: 'https://linkedin.com/in/sourav-halder',
    bio: 'Government administrative professional with expertise in public policy.',
    gender: 'Male'
  },
  {
    id: '10',
    profilePicture: 'https://placehold.co/32x32/7C3AED/FFFFFF?text=RL',
    firstName: 'Rahinur',
    lastName: 'Lasker',
    businessEmail: 'rahinur.lasker@cognizant.com',
    phone: '+91 98765 43219',
    personalEmail: 'rahinur.personal@gmail.com',
    company: 'Cognizant',
    companyLogo: 'https://placehold.co/24x24/7C3AED/FFFFFF?text=C',
    jobTitle: 'Software Developer',
    location: 'India',
    companySize: '10001+',
    companyWebsite: 'https://www.cognizant.com',
    industry: 'Professional Services',
    linkedinUrl: 'https://linkedin.com/in/rahinur-lasker',
    bio: 'Full-stack developer with expertise in modern web technologies.',
    gender: 'Male'
  },
  {
    id: '11',
    profilePicture: 'https://placehold.co/32x32/F97316/FFFFFF?text=CK',
    firstName: 'Chithambaram',
    lastName: 'K',
    businessEmail: 'chithambaram@india.dk',
    phone: '+91 98765 43220',
    personalEmail: 'chithambaram.personal@gmail.com',
    company: 'India DK',
    companyLogo: 'https://placehold.co/24x24/F97316/FFFFFF?text=I',
    jobTitle: 'Consultant',
    location: 'India',
    companySize: '1-10',
    companyWebsite: 'http://india.dk',
    industry: 'Professional Services',
    linkedinUrl: 'https://linkedin.com/in/chithambaram-k',
    bio: 'Independent consultant specializing in business strategy and operations.',
    gender: 'Male'
  },
  {
    id: '12',
    profilePicture: 'https://placehold.co/32x32/6B7280/FFFFFF?text=PM',
    firstName: 'Pravinraj',
    lastName: 'M',
    businessEmail: 'pravinraj.m@company.com',
    phone: '+91 98765 43221',
    personalEmail: 'pravinraj.personal@gmail.com',
    company: 'Unknown Company',
    companyLogo: 'https://placehold.co/24x24/6B7280/FFFFFF?text=?',
    jobTitle: 'no current title +1',
    location: 'India',
    companySize: 'Unknown',
    companyWebsite: '',
    industry: '',
    linkedinUrl: '',
    bio: '',
    gender: 'Male'
  },
  {
    id: '13',
    profilePicture: 'https://placehold.co/32x32/059669/FFFFFF?text=MT',
    firstName: 'Muthukarthik',
    lastName: 'T',
    businessEmail: 'muthukarthik@astrazeneca.in',
    phone: '+91 98765 43222',
    personalEmail: 'muthukarthik.personal@gmail.com',
    company: 'AstraZeneca',
    companyLogo: 'https://placehold.co/24x24/059669/FFFFFF?text=A',
    jobTitle: 'Research Scientist',
    location: 'India',
    companySize: '1001-5000',
    companyWebsite: 'https://www.astrazeneca.in/',
    industry: 'Manufacturing',
    linkedinUrl: 'https://linkedin.com/in/muthukarthik-t',
    bio: 'Research scientist focused on pharmaceutical development and clinical trials.',
    gender: 'Male'
  },
  {
    id: '14',
    profilePicture: 'https://placehold.co/32x32/1E40AF/FFFFFF?text=KK',
    firstName: 'Komal',
    lastName: 'Kumari',
    businessEmail: 'komal.kumari@hp.com',
    phone: '+91 98765 43223',
    personalEmail: 'komal.personal@gmail.com',
    company: 'HP',
    companyLogo: 'https://placehold.co/24x24/1E40AF/FFFFFF?text=H',
    jobTitle: 'Product Manager',
    location: 'India',
    companySize: '10001+',
    companyWebsite: 'http://www.hp.com',
    industry: 'Professional Services',
    linkedinUrl: 'https://linkedin.com/in/komal-kumari',
    bio: 'Product management professional with expertise in technology solutions.',
    gender: 'Female'
  },
  {
    id: '13',
    profilePicture: 'https://placehold.co/32x32/3B82F6/FFFFFF?text=AS',
    firstName: 'Amit',
    lastName: 'Sharma',
    businessEmail: 'amit.sharma@techcorp.com',
    phone: '+91 98765 43222',
    personalEmail: 'amit.personal@gmail.com',
    company: 'TechCorp',
    companyLogo: 'https://placehold.co/24x24/3B82F6/FFFFFF?text=T',
    jobTitle: 'Senior Developer',
    location: 'India',
    companySize: '1001-5000',
    companyWebsite: 'https://techcorp.com',
    industry: 'Technology',
    linkedinUrl: 'https://linkedin.com/in/amit-sharma',
    bio: 'Senior software developer with expertise in cloud technologies.',
    gender: 'Male'
  },
  {
    id: '14',
    profilePicture: 'https://placehold.co/32x32/10B981/FFFFFF?text=PS',
    firstName: 'Priya',
    lastName: 'Singh',
    businessEmail: 'priya.singh@marketing.com',
    phone: '+91 98765 43223',
    personalEmail: 'priya.personal@gmail.com',
    company: 'Marketing Pro',
    companyLogo: 'https://placehold.co/24x24/10B981/FFFFFF?text=M',
    jobTitle: 'Marketing Manager',
    location: 'India',
    companySize: '51-200',
    companyWebsite: 'https://marketingpro.com',
    industry: 'Marketing',
    linkedinUrl: 'https://linkedin.com/in/priya-singh',
    bio: 'Digital marketing expert with focus on growth strategies.',
    gender: 'Female'
  },
  {
    id: '15',
    profilePicture: 'https://placehold.co/32x32/F59E0B/FFFFFF?text=RK',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    businessEmail: 'rajesh.kumar@finance.com',
    phone: '+91 98765 43224',
    personalEmail: 'rajesh.personal@gmail.com',
    company: 'Finance Solutions',
    companyLogo: 'https://placehold.co/24x24/F59E0B/FFFFFF?text=F',
    jobTitle: 'Financial Analyst',
    location: 'India',
    companySize: '201-500',
    companyWebsite: 'https://financesolutions.com',
    industry: 'Finance',
    linkedinUrl: 'https://linkedin.com/in/rajesh-kumar',
    bio: 'Financial analyst specializing in investment strategies.',
    gender: 'Male'
  },
  {
    id: '16',
    profilePicture: 'https://placehold.co/32x32/EF4444/FFFFFF?text=SM',
    firstName: 'Sneha',
    lastName: 'Mishra',
    businessEmail: 'sneha.mishra@healthcare.com',
    phone: '+91 98765 43225',
    personalEmail: 'sneha.personal@gmail.com',
    company: 'HealthCare Plus',
    companyLogo: 'https://placehold.co/24x24/EF4444/FFFFFF?text=H',
    jobTitle: 'Medical Consultant',
    location: 'India',
    companySize: '1001-5000',
    companyWebsite: 'https://healthcareplus.com',
    industry: 'Healthcare',
    linkedinUrl: 'https://linkedin.com/in/sneha-mishra',
    bio: 'Medical consultant with expertise in patient care management.',
    gender: 'Female'
  },
  {
    id: '17',
    profilePicture: 'https://placehold.co/32x32/8B5CF6/FFFFFF?text=VK',
    firstName: 'Vikram',
    lastName: 'Krishnan',
    businessEmail: 'vikram.krishnan@education.com',
    phone: '+91 98765 43226',
    personalEmail: 'vikram.personal@gmail.com',
    company: 'EduTech Solutions',
    companyLogo: 'https://placehold.co/24x24/8B5CF6/FFFFFF?text=E',
    jobTitle: 'Education Director',
    location: 'India',
    companySize: '51-200',
    companyWebsite: 'https://edutechsolutions.com',
    industry: 'Education',
    linkedinUrl: 'https://linkedin.com/in/vikram-krishnan',
    bio: 'Education technology leader focused on digital learning solutions.',
    gender: 'Male'
  },
  {
    id: '18',
    profilePicture: 'https://placehold.co/32x32/06B6D4/FFFFFF?text=AM',
    firstName: 'Anita',
    lastName: 'Mehta',
    businessEmail: 'anita.mehta@retail.com',
    phone: '+91 98765 43227',
    personalEmail: 'anita.personal@gmail.com',
    company: 'RetailMax',
    companyLogo: 'https://placehold.co/24x24/06B6D4/FFFFFF?text=R',
    jobTitle: 'Operations Manager',
    location: 'India',
    companySize: '1001-5000',
    companyWebsite: 'https://retailmax.com',
    industry: 'Retail',
    linkedinUrl: 'https://linkedin.com/in/anita-mehta',
    bio: 'Operations manager with expertise in retail supply chain management.',
    gender: 'Female'
  },
  {
    id: '19',
    profilePicture: 'https://placehold.co/32x32/84CC16/FFFFFF?text=DP',
    firstName: 'Deepak',
    lastName: 'Patel',
    businessEmail: 'deepak.patel@manufacturing.com',
    phone: '+91 98765 43228',
    personalEmail: 'deepak.personal@gmail.com',
    company: 'Manufacturing Co',
    companyLogo: 'https://placehold.co/24x24/84CC16/FFFFFF?text=M',
    jobTitle: 'Production Head',
    location: 'India',
    companySize: '5001-10000',
    companyWebsite: 'https://manufacturingco.com',
    industry: 'Manufacturing',
    linkedinUrl: 'https://linkedin.com/in/deepak-patel',
    bio: 'Production head with expertise in manufacturing process optimization.',
    gender: 'Male'
  },
  {
    id: '20',
    profilePicture: 'https://placehold.co/32x32/F97316/FFFFFF?text=NG',
    firstName: 'Neha',
    lastName: 'Gupta',
    businessEmail: 'neha.gupta@consulting.com',
    phone: '+91 98765 43229',
    personalEmail: 'neha.personal@gmail.com',
    company: 'Consulting Pro',
    companyLogo: 'https://placehold.co/24x24/F97316/FFFFFF?text=C',
    jobTitle: 'Senior Consultant',
    location: 'India',
    companySize: '201-500',
    companyWebsite: 'https://consultingpro.com',
    industry: 'Consulting',
    linkedinUrl: 'https://linkedin.com/in/neha-gupta',
    bio: 'Senior consultant specializing in business transformation strategies.',
    gender: 'Female'
  }
];

// Column configuration
const initialColumns = [
  { key: 'profilePicture', label: 'Profile Picture', isVisible: true },
  { key: 'firstName', label: 'First Name', isVisible: true },
  { key: 'lastName', label: 'Last Name', isVisible: true, isSticky: true },
  { key: 'businessEmail', label: 'Business Email', isVisible: true },
  { key: 'phone', label: 'Phone', isVisible: true },
  { key: 'personalEmail', label: 'Personal Email', isVisible: true },
  { key: 'company', label: 'Company', isVisible: true },
  { key: 'jobTitle', label: 'Job Title', isVisible: true },
  { key: 'location', label: 'Location', isVisible: true },
  { key: 'companySize', label: 'Company Size', isVisible: true },
  { key: 'companyWebsite', label: 'Company Website', isVisible: true },
  { key: 'industry', label: 'Industry', isVisible: true },
  { key: 'linkedinUrl', label: 'LinkedIn URL', isVisible: true },
  { key: 'bio', label: 'Bio', isVisible: true },
  { key: 'gender', label: 'Gender', isVisible: true }
];

// Column Selector Component
const ColumnSelector = ({ isOpen, onClose, columns, setColumns, searchQuery, setSearchQuery }) => {
  const filteredColumns = columns.filter(column => 
    column.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleColumnVisibility = (columnKey) => {
    setColumns(prev => prev.map(col => 
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
              {filteredColumns.map(column => (
                <div key={column.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{column.label || column.key}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleColumnVisibility(column.key)}
                      className={`w-8 h-5 rounded-full transition-colors ${
                        column.isVisible ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        column.isVisible ? 'translate-x-4' : 'translate-x-0.5'
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

interface ActiveFilter {
  id: string;
  category: string;
  label: string;
  value: string;
}

export default function PeopleDatabasePage() {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [columnSearchQuery, setColumnSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [isFilterSidebarCollapsed, setIsFilterSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);
  const totalItems = 72649323;
  
  // Audience selection modal state
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false);

  const visibleColumns = columns.filter(col => col.isVisible);

  const handleSelectAll = () => {
    if (selectedRows.length === mockPeople.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockPeople.map(person => person.id));
    }
  };

  const handleSelectRow = (personId) => {
    setSelectedRows(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const handleRemoveFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(filter => filter.id !== filterId));
  };

  const handleAddFilter = (category: string, option: any, value: string) => {
    const newFilter: ActiveFilter = {
      id: `${category}_${option.id}_${Date.now()}`,
      category,
      label: option.label,
      value
    };
    setActiveFilters(prev => [...prev, newFilter]);
  };

  const handleSaveFilters = () => {
    // In a real app, this would save filters to backend
    console.log('Saving filters:', activeFilters);
  };

  const handleResetFilters = () => {
    setActiveFilters([]);
  };

  // Audience selection handlers
  const handleImportToAudience = () => {
    setIsAudienceModalOpen(true);
  };

  const handleSelectAudience = (audienceId: string) => {
    console.log(`Importing ${selectedRows.length} leads to audience ${audienceId}`);
    // Here you would implement the actual import logic
    // For now, just show a success message
    alert(`Successfully imported ${selectedRows.length} leads to audience ${audienceId}`);
    setSelectedRows([]); // Clear selection after import
  };

  const handleCreateNewAudience = () => {
    console.log('Create new audience clicked');
    // Here you would navigate to audience creation page or open audience creation modal
    // For now, just show a message
    alert('Navigate to create new audience page');
  };

  const handleToggleFilterSidebar = () => {
    setIsFilterSidebarCollapsed(!isFilterSidebarCollapsed);
  };

  const getPersonAvatar = (name) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
        {initials}
      </div>
    );
  };

  const renderCellContent = (person, column) => {
    switch (column.key) {
      case 'lastName':
        return (
          <div className="flex items-center gap-3">
            {person.profilePicture ? (
              <img src={person.profilePicture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              getPersonAvatar(`${person.firstName} ${person.lastName}`)
            )}
            <div>
              <div className="font-medium text-gray-900">{person.firstName} {person.lastName}</div>
              {person.jobTitle && <div className="text-xs text-gray-500">{person.jobTitle}</div>}
            </div>
            {person.linkedinUrl && (
              <ExternalLink size={16} className="text-blue-600" />
            )}
          </div>
        );
      case 'profilePicture':
        return person.profilePicture ? (
          <img src={person.profilePicture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          getPersonAvatar(`${person.firstName} ${person.lastName}`)
        );
      case 'firstName':
        return <span className="text-gray-900">{person.firstName}</span>;
      case 'businessEmail':
        return person.businessEmail ? (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            <a href={`mailto:${person.businessEmail}`} className="text-blue-600 hover:text-blue-800 text-sm">
              {person.businessEmail}
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
        return person.personalEmail ? (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            <a href={`mailto:${person.personalEmail}`} className="text-blue-600 hover:text-blue-800 text-sm">
              {person.personalEmail}
            </a>
          </div>
        ) : null;
      case 'company':
        return (
          <div className="flex items-center gap-2">
            {person.companyLogo && (
              <img src={person.companyLogo} alt={person.company} className="w-6 h-6 rounded" />
            )}
            <span className="text-gray-900">{person.company}</span>
          </div>
        );
      case 'jobTitle':
        return <span className="text-gray-900">{person.jobTitle}</span>;
      case 'location':
        return (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span className="text-gray-700">{person.location}</span>
          </div>
        );
      case 'companySize':
        return <span className="text-gray-900">{person.companySize}</span>;
      case 'companyWebsite':
        return person.companyWebsite ? (
          <a href={person.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
            {person.companyWebsite}
          </a>
        ) : null;
      case 'industry':
        return <span className="text-gray-900">{person.industry}</span>;
      case 'linkedinUrl':
        return person.linkedinUrl ? (
          <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
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
      <FilterSidebar
        isCollapsed={isFilterSidebarCollapsed}
        onToggleCollapse={handleToggleFilterSidebar}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onAddFilter={handleAddFilter}
        onSaveFilters={handleSaveFilters}
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
              <span className="text-2xl font-bold text-gray-900">73M</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <button 
            onClick={handleToggleFilterSidebar}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={16} className="text-gray-600" />
            <span className="text-gray-700">Filters</span>
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
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
                  checked={selectedRows.length === mockPeople.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
              </th>

              {/* Dynamic Columns */}
              {visibleColumns.map((column, index) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap ${
                    column.key === 'profilePicture' ? 'sticky-profile' : 
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
            {mockPeople.map((person, rowIndex) => (
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
                    className={`px-4 py-3 text-sm whitespace-nowrap ${
                      column.key === 'profilePicture' ? 'sticky-profile' : 
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1 - 100</span> of{' '}
            <span className="font-medium">{totalItems.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1">
              {[1, 2, 3, '...', 30].map((page, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded text-sm font-medium ${
                    page === currentPage
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button className="p-2 text-gray-600 hover:text-gray-800">
              <ChevronRight size={16} />
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity">
            <span>Push to</span>
            <ExternalLink size={16} />
          </button>
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

      {/* Audience Selection Modal */}
      <AudienceSelectionModal
        isOpen={isAudienceModalOpen}
        onClose={() => setIsAudienceModalOpen(false)}
        selectedLeadsCount={selectedRows.length}
        onSelectAudience={handleSelectAudience}
        onCreateNewAudience={handleCreateNewAudience}
      />
    </div>
  );
}
