import { apiClient } from '../lib/apiClient';

export interface LeadRecord {
  id: string;
  first_name?: string;
  last_name?: string;
  pro_email?: string;
  perso_email?: string;
  phone?: string;
  company_name?: string;
  job?: string;
  location?: string;
  website?: string;
  industry?: string;
  linkedin?: string;
  bio?: string;
  gender?: string;
  audienceLeads?: Array<{ id: string; audience?: { audience_name?: string } }>;
  has_replied?: boolean;
  contacted?: boolean;
  unsubscribed?: boolean;
}

export interface ListLeadsResponse {
  status: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search?: string;
  data: LeadRecord[];
}

export const contactsService = {
  listLeads: async (params: { page?: number; limit?: number; search?: string }): Promise<ListLeadsResponse> => {
    const { page = 1, limit = 10, search } = params || {};
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('limit', String(limit));
    if (search && search.trim()) query.set('search', search.trim());
    const res = await apiClient.get(`/pub/v1/leads?${query.toString()}`);
    return res.data as ListLeadsResponse;
  },

  updateLead: async (leadId: string, data: Record<string, any>) => {
    const res = await apiClient.put(`/pub/v1/leads/${leadId}`, data);
    return res.data;
  },

  enrichLeads: async (payload: { lead_ids?: string[]; audience_id?: string }) => {
    const res = await apiClient.post(`/pub/v1/leads/enrich`, payload);
    return res.data;
  },

  fetchAllLeadIds: async (search?: string): Promise<string[]> => {
    // Fallback approach: request a large page size and pluck ids
    const res = await contactsService.listLeads({ page: 1, limit: 100000, search });
    return (res.data || []).map((l) => l.id);
  },
};


