import { 
  Workflow, 
  Users, 
  User, 
  MessageSquare, 
  Settings, 
  Send 
} from 'lucide-react';

export const MOCK_AUDIENCES = [
  { id: '1', name: 'Tech Professionals', count: 1250, description: 'Software engineers, developers, tech leads' },
  { id: '2', name: 'Marketing Managers', count: 890, description: 'Digital marketing, growth, content managers' },
  { id: '3', name: 'Sales Directors', count: 456, description: 'VP Sales, Sales Directors, Revenue leaders' },
  { id: '4', name: 'Startup Founders', count: 234, description: 'Early-stage startup founders and CEOs' }
];

export const MOCK_IDENTITIES = [
  { id: 'identity1', name: 'Chait Jain', email: 'chait@company.com', status: 'active' },
  { id: 'identity2', name: 'John Doe', email: 'john@company.com', status: 'active' },
  { id: 'identity3', name: 'Jane Smith', email: 'jane@company.com', status: 'inactive' }
];

export const CAMPAIGN_STEPS = [
  { id: 'workflow', name: 'Workflow', description: 'Build your workflow', icon: Workflow, color: 'text-orange-500', status: 'current' as const },
  { id: 'audience', name: 'Audience', description: 'Target settings', icon: Users, color: 'text-blue-500', status: 'upcoming' as const },
  { id: 'identity', name: 'Identity', description: 'Sender profile', icon: User, color: 'text-green-500', status: 'upcoming' as const },
  { id: 'content', name: 'Content', description: 'Content & Messages', icon: MessageSquare, color: 'text-indigo-500', status: 'upcoming' as const },
  { id: 'settings', name: 'Settings', description: 'Campaign config', icon: Settings, color: 'text-gray-500', status: 'upcoming' as const },
  { id: 'launch', name: 'Launch', description: 'Start campaign', icon: Send, color: 'text-purple-500', status: 'upcoming' as const }
];


