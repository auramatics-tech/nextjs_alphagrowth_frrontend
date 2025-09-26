export interface BusinessData {
  domain: string;
  businessType: 'B2B' | 'B2C';
}

export interface BusinessAnalysisResponse {
  business?: {
    id: string;
    industry?: string;
  };
  aiResponse?: {
    prompt: string;
  };
  error?: string;
}

export interface DomainAnalysisRequest {
  domain: string;
  businessType: string;
}

export interface BusinessInfoResponse {
  business?: {
    id: string;
    industry?: string;
    domain?: string;
    website?: string;
    businessType?: string;
    business_type?: string;
    valueProposition?: string;
    value_proposition?: string;
    keyProductsOrServices?: string[];
    services?: string[] | string;
    summary?: string;
  };
  businesses?: any[];
  updatedBusinessData?: any;
  data?: {
    business?: any;
    updatedBusinessData?: any;
  };
  aiResponse?: {
    prompt: string;
  };
  error?: string;
}

export interface UpdateBusinessRequest {
  business_id: string;
  industry: string;
  services: string[];
  valueProposition: string;
}

export interface CreateIcpRequest {
  businessId: string;
  title: string;
  domain: string;
  newPrompt: string;
}

export interface CreateIcpResponse {
  icps?: any[];
  error?: string;
}
