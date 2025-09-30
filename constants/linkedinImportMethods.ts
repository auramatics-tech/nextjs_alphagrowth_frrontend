export interface ImportMethodConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'people_who' | 'search';
  urlFieldLabel: string;
  urlPlaceholder: string;
  urlExample: string;
  instructions: string[];
  requiresUrl: boolean;
}

export const LINKEDIN_IMPORT_METHODS: ImportMethodConfig[] = [
  // Import People Who... Section
  {
    id: 'commented_post',
    title: 'Commented a Post',
    description: 'Import people who commented on a specific post',
    icon: '💬',
    color: 'blue',
    category: 'people_who',
    urlFieldLabel: 'LinkedIn Post URL',
    urlPlaceholder: 'Paste the LinkedIn Post URL here',
    urlExample: 'Eg: https://www.linkedin.com/posts/activity-1234567890',
    instructions: [
      'Go to the LinkedIn post you want to target',
      'Copy the post URL from your browser',
      'Paste the URL here and click Import'
    ],
    requiresUrl: true
  },
  {
    id: 'liked_post',
    title: 'Liked a Post',
    description: 'Import people who liked a specific post',
    icon: '👍',
    color: 'green',
    category: 'people_who',
    urlFieldLabel: 'LinkedIn Post URL',
    urlPlaceholder: 'Paste the LinkedIn Post URL here',
    urlExample: 'Eg: https://www.linkedin.com/posts/activity-1234567890',
    instructions: [
      'Go to the LinkedIn post you want to target',
      'Copy the post URL from your browser',
      'Paste the URL here and click Import'
    ],
    requiresUrl: true
  },
  {
    id: 'attended_event',
    title: 'Attended an Event',
    description: 'Import people who attended a specific event',
    icon: '🎉',
    color: 'purple',
    category: 'people_who',
    urlFieldLabel: 'LinkedIn Event URL',
    urlPlaceholder: 'Paste the LinkedIn Event URL here',
    urlExample: 'Eg: https://www.linkedin.com/events/1234567890',
    instructions: [
      'Go to the LinkedIn event page',
      'Copy the event URL from your browser',
      'Paste the URL here and click Import'
    ],
    requiresUrl: true
  },
  {
    id: 'followed_company',
    title: 'My Followers',
    description: 'Import your LinkedIn followers',
    icon: '👥',
    color: 'orange',
    category: 'people_who',
    urlFieldLabel: '',
    urlPlaceholder: '',
    urlExample: '',
    instructions: [
      'This will scrape followers of your LinkedIn identity',
      'Select your identity and enter audience name',
      'Click Import to get your followers'
    ],
    requiresUrl: false
  },
  // Import from LinkedIn Search Section
  {
    id: 'basic_search',
    title: 'LinkedIn Basic Search',
    description: 'Import from LinkedIn search results',
    icon: '🔍',
    color: 'blue',
    category: 'search',
    urlFieldLabel: 'LinkedIn Search URL',
    urlPlaceholder: 'Paste the LinkedIn Search URL here',
    urlExample: 'Eg: https://www.linkedin.com/search/results/people',
    instructions: [
      'Go to LinkedIn and search for people using your criteria',
      'Copy the search URL from your browser',
      'Paste the URL here and click Import'
    ],
    requiresUrl: true
  },
  {
    id: 'sales_navigator',
    title: 'Sales Navigator',
    description: 'Import from LinkedIn Sales Navigator',
    icon: '🧭',
    color: 'blue',
    category: 'search',
    urlFieldLabel: 'Sales Navigator URL',
    urlPlaceholder: 'Paste the Sales Navigator URL here',
    urlExample: 'Eg: https://www.linkedin.com/sales/search/people',
    instructions: [
      'Go to LinkedIn Sales Navigator',
      'Create your search and copy the URL',
      'Paste the URL here and click Import'
    ],
    requiresUrl: true
  },
  {
    id: 'sales_navigator_list',
    title: 'Sales Navigator List',
    description: 'Import from a saved Sales Navigator list',
    icon: '📋',
    color: 'blue',
    category: 'search',
    urlFieldLabel: 'Sales Navigator List URL',
    urlPlaceholder: 'Paste the Sales Navigator List URL here',
    urlExample: 'Eg: https://www.linkedin.com/sales/lists/1234567890',
    instructions: [
      'Go to your Sales Navigator saved list',
      'Copy the list URL from your browser',
      'Paste the URL here and click Import'
    ],
    requiresUrl: true
  }
];

export const getImportMethodConfig = (methodId: string): ImportMethodConfig | undefined => {
  return LINKEDIN_IMPORT_METHODS.find(method => method.id === methodId);
};

export const getImportMethodsByCategory = (category: 'people_who' | 'search'): ImportMethodConfig[] => {
  return LINKEDIN_IMPORT_METHODS.filter(method => method.category === category);
};
