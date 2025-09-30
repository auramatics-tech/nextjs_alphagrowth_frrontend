import { 
  Workflow, 
  Users, 
  User, 
  MessageSquare, 
  Settings, 
  Send 
} from 'lucide-react';

 

 

export const CAMPAIGN_STEPS = [
  { id: 'workflow', name: 'Workflow', description: 'Build your workflow', icon: Workflow, color: 'text-orange-500', status: 'current' as const },
  { id: 'audience', name: 'Audience', description: 'Target settings', icon: Users, color: 'text-blue-500', status: 'upcoming' as const },
  { id: 'identity', name: 'Identity', description: 'Sender profile', icon: User, color: 'text-green-500', status: 'upcoming' as const },
  { id: 'content', name: 'Content', description: 'Content & Messages', icon: MessageSquare, color: 'text-indigo-500', status: 'upcoming' as const },
  { id: 'settings', name: 'Settings', description: 'Campaign config', icon: Settings, color: 'text-gray-500', status: 'upcoming' as const },
  { id: 'launch', name: 'Launch', description: 'Start campaign', icon: Send, color: 'text-purple-500', status: 'upcoming' as const }
];


