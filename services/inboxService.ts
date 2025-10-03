import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('_token');
  if (token) {
    config.headers['login-jwt'] = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface InboxMessage {
  id: string;
  user_id: string;
  from: string;
  to: string;
  identity_id: string;
  type: string;
  message: string | null;
  created_at: string;
  updated_at: string;
  identity?: {
    id: string;
    name: string;
    email: string;
    company: string;
  };
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  pro_email?: string;
  perso_email?: string;
  phone?: string;
  profile_url: string;
  linkedin?: string;
  job?: string;
  industry?: string;
  location?: string;
}

export interface MessageRepliedLead {
  id: string;
  user_id: string;
  lead_id: string;
  identity_id: string;
  created_at: string;
  lead_status: string;
  deal_value?: string;
  channel?: string;
  lead: Lead;
  user?: any;
  identity?: any;
}

export interface Contact {
  name: string;
  avatar: string;
  company: string;
  title: string;
  verified: boolean;
  leadStatus: string;
  dealValue: string;
  emails: string[];
  linkedinUrl: string;
  phone: string;
  campaign: string;
}

export interface Conversation {
  id: string;
  leadId: string; // Add this
  identityId: string; // Add this
  contact: Contact;
  lastMessage: {
    content: string;
    timestamp: string;
    type: string;
  };
  unreadCount: number;
  channel: string;
  messages: InboxMessage[];
}

export interface SendMessageRequest {
  message: string;
  identity_id: string;
  channel?: 'linkedin' | 'email';
  subject?: string;
  userId: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: Array<{
      name: string;
      value: string;
    }>;
    body: {
      data?: string;
    };
  };
  internalDate: string;
}

// API Functions
export const inboxService = {
  // Get inbox messages for a specific lead
  async getInboxMessages(leadId: string, identityId: string, page = 1, limit = 50) {
    try {
      console.log('Fetching inbox messages for leadId:', leadId, 'identityId:', identityId);
      const response = await apiClient.get(`/pub/v1/inbox/of_lead/${leadId}?identity_id=${identityId}`);
      console.log('Inbox messages API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching inbox messages:', error);
      throw error;
    }
  },

  // Send message to lead
  async sendMessage(leadId: string, messageData: SendMessageRequest) {
    try {
      const response = await apiClient.post(
        `/pub/v1/inbox/send_multichannel/${leadId}`,
        messageData
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get Gmail inbox emails
  async getGmailInbox(identityId: string, maxResults = 20) {
    try {
      const response = await apiClient.get(`/api/v1/gmail/inbox/${identityId}`, {
        params: { maxResults },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Gmail inbox:', error);
      throw error;
    }
  },

  // Reply to Gmail email
  async replyToGmailEmail(identityId: string, messageId: string, threadId: string, replyBody: string) {
    try {
      const response = await apiClient.post('/api/v1/gmail/reply', {
        identityId,
        messageId,
        threadId,
        replyBody,
      });
      return response.data;
    } catch (error) {
      console.error('Error replying to Gmail email:', error);
      throw error;
    }
  },

  // Get email thread
  async getEmailThread(threadId: string, identityId: string) {
    try {
      const response = await apiClient.get(`/api/v1/gmail/thread/${threadId}`, {
        params: { identityId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching email thread:', error);
      throw error;
    }
  },

  // Get all leads for inbox (you might need to create this endpoint)
  async getAllLeads() {
    try {
      const response = await apiClient.get('/pub/v1/leads/inbox-lead');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  // Get identities for the current user
  async getIdentities() {
    try {
      const response = await apiClient.get('/pub/v1/identities/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching identities:', error);
      throw error;
    }
  },

  // Debug email configuration
  async debugEmailConfig(identityId: string) {
    try {
      const response = await apiClient.get(`/pub/v1/inbox/debug-email-config/${identityId}`);
      return response.data;
    } catch (error) {
      console.error('Error debugging email config:', error);
      throw error;
    }
  },
};

export default inboxService;
