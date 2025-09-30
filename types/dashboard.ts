// Dashboard Types and Interfaces

export interface KPIData {
  prospects: number;
  replies: number;
  meetings: number;
  pipeline: number;
  openRate: number;
  replyRate: number;
  meetingRate: number;
}

export interface SalesFunnelData {
  qualified: number;
  scheduled: number;
  completed: number;
  nurture: number;
  won: number;
  lost: number;
  qualifiedValue: number;
  scheduledValue: number;
  completedValue: number;
  nurtureValue: number;
  wonValue: number;
  lostValue: number;
  totalValue: number;
}

export interface ChannelData {
  channel: string;
  prospects: number;
  openRate?: number;
  acceptRate?: number;
  replies: number;
  meetings: number;
  pipeline: number;
}

export interface TaskData {
  id: string;
  name: string;
  company: string;
  type: string;
  date: string;
  time: string;
  email: string;
  phone: string;
  remark: string;
}

export interface GTMStrategy {
  id: string;
  gtmName: string;
  targetCount?: number;
  coreValueProposition?: string;
  objectives?: string;
  painPoints?: string;
  goals?: string;
}

export interface Campaign {
  id: string;
  name: string;
  gtmId?: string;
  description?: string;
  objective?: string;
  success_metric?: string;
  target?: string;
  audience?: string;
  pain_point?: string;
  value_prop?: string;
}

export interface DashboardFilters {
  gtmIds: string[];
  campaignIds: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

