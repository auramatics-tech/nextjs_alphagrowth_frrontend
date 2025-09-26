'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Linkedin, 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  Save, 
  Clock,
  User,
  Building,
  MapPin
} from 'lucide-react';

// Mock data for prospects
const mockProspects = [
  {
    id: 1,
    name: 'Chait Jain',
    title: 'Founder & CEO',
    company: 'DataMind AI',
    location: 'Bengaluru, India',
    linkedinUrl: 'https://linkedin.com/in/chaitjain',
    sequence: [
      { 
        step: 'LinkedIn Connection Note', 
        content: 'Hi Chait, saw your work on AI-driven analytics at DataMind AI. Your insights on machine learning applications in business intelligence really caught my attention. I\'d love to connect and share some thoughts on how we might collaborate on similar projects.',
        channel: 'LinkedIn',
        characterCount: 280
      },
      { 
        step: 'Email 1', 
        content: 'Following up on my connection request, I was impressed by your recent post about scaling AI solutions for enterprise clients. At AlphaGrowth, we\'ve been working on similar challenges and I believe there could be valuable synergies between our approaches. Would you be open to a brief conversation about potential collaboration opportunities?',
        channel: 'Email',
        characterCount: 420
      },
      { 
        step: 'Email 2', 
        content: 'Hi Chait, I noticed DataMind AI has been expanding into new verticals. Given your expertise in AI-driven analytics, I thought you might find our latest research on customer segmentation algorithms interesting. I\'ve attached a brief case study that might be relevant to your current projects.',
        channel: 'Email',
        characterCount: 380
      }
    ]
  },
  {
    id: 2,
    name: 'Sarah Chen',
    title: 'VP of Marketing',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    sequence: [
      { 
        step: 'LinkedIn Connection Note', 
        content: 'Hi Sarah, your marketing strategies at TechFlow Solutions are impressive! I particularly enjoyed your recent article on data-driven customer acquisition. I\'d love to connect and share insights on similar approaches we\'ve implemented at AlphaGrowth.',
        channel: 'LinkedIn',
        characterCount: 260
      },
      { 
        step: 'Email 1', 
        content: 'Hi Sarah, following up on my LinkedIn connection. I was impressed by TechFlow\'s recent campaign results and your innovative approach to marketing automation. I believe AlphaGrowth could offer some complementary solutions that might interest your team. Would you be available for a brief call this week?',
        channel: 'Email',
        characterCount: 390
      }
    ]
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    title: 'CTO',
    company: 'InnovateLab',
    location: 'Austin, TX',
    linkedinUrl: 'https://linkedin.com/in/michaelrodriguez',
    sequence: [
      { 
        step: 'LinkedIn Connection Note', 
        content: 'Hi Michael, your technical leadership at InnovateLab is inspiring! I\'ve been following your work on scalable infrastructure solutions. I\'d love to connect and discuss some innovative approaches we\'re exploring at AlphaGrowth.',
        channel: 'LinkedIn',
        characterCount: 240
      },
      { 
        step: 'Email 1', 
        content: 'Hi Michael, I came across your recent presentation on cloud architecture optimization. Your insights on cost-effective scaling really resonated with our current challenges at AlphaGrowth. I\'d love to share some thoughts on similar solutions we\'ve implemented. Are you available for a brief technical discussion?',
        channel: 'Email',
        characterCount: 410
      },
      { 
        step: 'Email 2', 
        content: 'Hi Michael, following up on our previous exchange. I wanted to share a technical whitepaper we recently published on API optimization strategies that might be relevant to InnovateLab\'s current projects. I\'ve attached it for your review.',
        channel: 'Email',
        characterCount: 320
      }
    ]
  }
];

interface SequenceItem {
  step: string;
  content: string;
  channel: string;
  characterCount: number;
}

interface Prospect {
  id: number;
  name: string;
  title: string;
  company: string;
  location: string;
  linkedinUrl: string;
  sequence: SequenceItem[];
}

interface ProspectCardProps {
  prospect: Prospect;
  onContentChange: (prospectId: number, stepIndex: number, newContent: string) => void;
  onPreview: (prospect: Prospect) => void;
}

const ProspectCard = ({ prospect, onContentChange, onPreview }: ProspectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleContentChange = (stepIndex: number, newContent: string) => {
    onContentChange(prospect.id, stepIndex, newContent);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'LinkedIn':
        return <Linkedin size={16} className="text-blue-600" />;
      case 'Email':
        return <div className="w-4 h-4 bg-gray-600 rounded text-white text-xs flex items-center justify-center font-bold">@</div>;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded"></div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Profile Snapshot */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {prospect.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{prospect.name}</h3>
              <p className="text-gray-600 text-sm">{prospect.title}</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Building size={12} />
                  <span>{prospect.company}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <MapPin size={12} />
                  <span>{prospect.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={prospect.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Linkedin size={20} className="text-blue-600" />
            </a>
            <button
              onClick={() => onPreview(prospect)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Sequence View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {prospect.sequence.map((item, stepIndex) => (
                <div key={stepIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(item.channel)}
                      <h4 className="font-medium text-gray-900">{item.step}</h4>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.channel}
                    </span>
                  </div>
                  <textarea
                    value={item.content}
                    onChange={(e) => handleContentChange(stepIndex, e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter your message content..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {item.content.length} characters
                    </span>
                    {item.channel === 'LinkedIn' && (
                      <span className={`text-xs ${item.content.length > 300 ? 'text-red-500' : 'text-green-500'}`}>
                        {item.content.length > 300 ? 'Over LinkedIn limit' : 'Within limit'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface PreviewModalProps {
  prospect: Prospect | null;
  onClose: () => void;
}

const PreviewModal = ({ prospect, onClose }: PreviewModalProps) => {
  if (!prospect) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sequence Preview</h2>
              <p className="text-gray-600 text-sm mt-1">
                {prospect.name} - {prospect.title} at {prospect.company}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {prospect.sequence.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {item.channel === 'LinkedIn' ? (
                      <Linkedin size={16} className="text-blue-600" />
                    ) : (
                      <div className="w-4 h-4 bg-gray-600 rounded text-white text-xs flex items-center justify-center font-bold">@</div>
                    )}
                    <h3 className="font-medium text-gray-900">{item.step}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded ml-auto">
                      {item.channel}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{item.content}</p>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {item.content.length} characters
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button className="btn-primary">
              Send Sequence
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AIPersonalisationEditor = () => {
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);
  const [searchTerm, setSearchTerm] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [previewProspect, setPreviewProspect] = useState<Prospect | null>(null);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const handleContentChange = useCallback((prospectId: number, stepIndex: number, newContent: string) => {
    setProspects(prev => 
      prev.map(prospect => 
        prospect.id === prospectId 
          ? {
              ...prospect,
              sequence: prospect.sequence.map((item, index) => 
                index === stepIndex 
                  ? { ...item, content: newContent }
                  : item
              )
            }
          : prospect
      )
    );
    setLastSaved(new Date());
  }, []);

  const handlePreview = useCallback((prospect: Prospect) => {
    setPreviewProspect(prospect);
  }, []);

  const filteredProspects = useMemo(() => {
    return prospects.filter(prospect => {
      const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prospect.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTitle = !titleFilter || prospect.title.toLowerCase().includes(titleFilter.toLowerCase());
      const matchesCompany = !companyFilter || prospect.company.toLowerCase().includes(companyFilter.toLowerCase());
      
      return matchesSearch && matchesTitle && matchesCompany;
    });
  }, [prospects, searchTerm, titleFilter, companyFilter]);

  const formatLastSaved = () => {
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Personalisation</h1>
              <p className="text-gray-600 text-sm mt-1">
                Review and edit AI-generated drafts for each prospect
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                <Clock size={16} />
                <span>Autosaved {formatLastSaved()}</span>
              </div>
              <button className="btn-primary whitespace-nowrap">
                <Save size={16} className="mr-2" />
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search prospects by name, company, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Titles</option>
                <option value="ceo">CEO</option>
                <option value="cto">CTO</option>
                <option value="vp">VP</option>
                <option value="founder">Founder</option>
              </select>
              
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Companies</option>
                <option value="datamind">DataMind AI</option>
                <option value="techflow">TechFlow Solutions</option>
                <option value="innovatelab">InnovateLab</option>
              </select>
              
              <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2">
                <Filter size={16} />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredProspects.length} Prospects
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Click on any prospect to expand and edit their personalized sequence
          </p>
        </div>

        {/* Prospects List */}
        <div className="space-y-4">
          {filteredProspects.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onContentChange={handleContentChange}
              onPreview={handlePreview}
            />
          ))}
        </div>

        {filteredProspects.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prospects found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        prospect={previewProspect}
        onClose={() => setPreviewProspect(null)}
      />
    </div>
  );
};

export default AIPersonalisationEditor;
