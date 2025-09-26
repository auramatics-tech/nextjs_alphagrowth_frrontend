export interface Identity {
  id: string;
  name: string;
  company_name?: string; // Optional since API doesn't return this
  email?: string; // Optional since API doesn't return this
  image?: string;
  user_id?: string;
  linkedin_sign?: 'loggedin' | 'disconnected' | 'requested';
  email_detail?: {
    connection_status?: 'loggedin' | 'requested' | 'disconnected';
    status?: number;
    provider_type?: string;
    provider?: string;
    type?: string;
    data?: any;
  };
  phone_detail?: {
    connection_status: 'verified' | 'unverified';
    status: number;
  };
  created_at?: string;
  updated_at?: string;
  user?: {
    name: string;
  };
}

export interface CreateIdentityRequest {
  name: string;
  company_name: string;
  email: string;
}

export interface ChannelStatus {
  linkedin: 'connected' | 'disconnected' | 'verified' | 'unverified';
  email: 'connected' | 'disconnected' | 'verified' | 'unverified';
  phone: 'connected' | 'disconnected' | 'verified' | 'unverified';
}

export interface IdentityLimits {
  timezone: string;
  emailDaily: number;
  linkedinDaily: number;
  callHours: {
    start: string;
    end: string;
  };
}

export interface EmailProvider {
  id: string;
  name: string;
  type: 'GMAIL' | 'OUTLOOK' | 'CUSTOM';
  icon: string;
  color: string;
}

export const EMAIL_PROVIDERS: EmailProvider[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    type: 'GMAIL',
    icon: '📧',
    color: 'red'
  },
  {
    id: 'outlook',
    name: 'Outlook',
    type: 'OUTLOOK',
    icon: '📧',
    color: 'blue'
  },
  {
    id: 'custom',
    name: 'Custom SMTP',
    type: 'CUSTOM',
    icon: '⚙️',
    color: 'gray'
  }
];
