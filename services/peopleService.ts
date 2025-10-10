import apiClient from '../lib/apiClient';

export interface PeopleSearchPayload {
  person_titles?: string[];
  include_similar_titles?: boolean;
  q_keywords?: string;
  person_locations?: string[];
  person_seniorities?: string[];
  organization_locations?: string[];
  q_organization_domains_list?: string[];
  contact_email_status?: string[];
  organization_ids?: string[];
  organization_num_employees_ranges?: string[];
  'revenue_range[min]'?: number;
  'revenue_range[max]'?: number;
  currently_using_all_of_technology_uids?: string[];
  currently_using_any_of_technology_uids?: string[];
  currently_not_using_any_of_technology_uids?: string[];
  q_organization_job_titles?: string[];
  organization_job_locations?: string[];
  'organization_num_jobs_range[min]'?: number;
  'organization_num_jobs_range[max]'?: number;
  'organization_job_posted_at_range[min]'?: string;
  'organization_job_posted_at_range[max]'?: string;
  page?: number;
  per_page?: number;
}

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  bio?: string;
  picture?: string;
  profile_url?: string;
  job?: string;
  company_name?: string;
  pro_email?: string;
  perso_email?: string;
  phone?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  industry?: string;
  linkedin?: string;
  twitter?: string;
  gender?: string;
  email_status?: string;
  seniority?: string;
  departments?: string[];
  subdepartments?: string[];
  employment_history?: any[];
  organization?: any;
  organization_id?: string;
  organization_industry?: string;
  organization_employees_estimate?: number;
  organization_logo_url?: string;
  facebook_url?: string;
  github_url?: string;
}

export interface PaginationData {
  page: number;
  per_page: number;
  total_entries: number;
  total_pages: number;
}

export interface PeopleSearchResponse {
  message: string;
  person: any;
  data: Person[];
  pagination: PaginationData;
}

const peopleService = {
  /**
   * Search for people using Apollo.io filters
   */
  searchPeople: async (payload: PeopleSearchPayload): Promise<PeopleSearchResponse> => {
    try {
      console.log('🔍 Searching people with payload:', payload);
      
      const response = await apiClient.post('/pub/v1/people/search-people', payload);
      
      console.log('✅ People search response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error searching people:', error);
      throw new Error(error.response?.data?.message || 'Failed to search people');
    }
  },

  /**
   * Get person by email
   */
  getPersonByEmail: async (email: string): Promise<Person> => {
    try {
      const response = await apiClient.post('/pub/v1/people/by-email', { email });
      return response.data.person;
    } catch (error: any) {
      console.error('Error getting person by email:', error);
      throw new Error(error.response?.data?.message || 'Failed to get person');
    }
  },

  /**
   * Get person profile by ID
   */
  getPersonProfileById: async (employeeId: string): Promise<Person> => {
    try {
      const response = await apiClient.post('/pub/v1/people/profile-by-id', { employee_id: employeeId });
      return response.data.person;
    } catch (error: any) {
      console.error('Error getting person profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to get person profile');
    }
  }
};

export default peopleService;

