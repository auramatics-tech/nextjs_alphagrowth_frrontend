export interface IcpData {
  id: string;
  name: string;
  position: string;
  gender: string;
  ageRange: string;
  location_city: string;
  location_country: string;
  goalsAndObjectives: string | IcpGoalsObjectives;
  companyDetail: string | IcpCompanyDetail;
  outReach: string | IcpOutreach;
  scoringFramework: string | IcpScoringFramework;
  conversionPath: string | IcpConversionPath;
  intentSignals: string | IcpIntentSignals;
  revenueMetrics: string | IcpRevenueMetrics;
  buyingBehavior: string | IcpBuyingBehavior;
}

export interface IcpGoalsObjectives {
  goals_obj_responsibilities: string;
  goals_obj_pain_points: string;
  goals_obj_metric_affected: string;
  goals_obj_tactical_problem: string;
  goals_obj_root_cause: string;
  goals_obj_business_impact: string;
  goals_obj_dream_outcome: string;
  goals_obj_social_media: string[];
}

export interface IcpCompanyDetail {
  company_size: string;
  industries: string[];
  company_type: string;
  locations: string;
  company_revenue_growth: string;
  company_location_city: string;
  company_location_country: string;
  company_b2b_b2c: string;
  company_targets: string[];
  company_growth_indicators: string[];
  company_competitive_position: string;
}

export interface IcpOutreach {
  preferred_communication_channels: string;
  tools_they_might_use: string;
  suggested_tone_of_voice: string;
  out_touchpoints: string[];
  out_message_resonance: string[];
  out_timing_optimization: string;
  out_personalization_hooks: string[];
  out_social_proof_preferences: string[];
  out_alternatives: string;
  out_risk_of_inaction: string[];
  out_value_proposition_alignment: string[];
  out_free_resource_strategy: string;
  out_tone_optimization: string[];
}

export interface IcpScoringFramework {
  scoring_positive_indicators: string[];
  scoring_negative_signals: string[];
  scoring_intent_weights: string[];
  scoring_firmographic_multipliers: string[];
  scoring_timing_factors: string[];
}

export interface IcpConversionPath {
  path_discovery_channels: string[];
  path_evaluation_process: string[];
  path_decision_timeline: string[];
  path_implementation_planning: string[];
  path_objection_patterns: string[];
  path_success_validation: string[];
}

export interface IcpIntentSignals {
  buying_triggers: string[];
  seasonal_buying_patterns: string[];
  competitive_displacement_signals: string[];
  expansion_triggers: string[];
  urgency_accelerators: string[];
}

export interface IcpRevenueMetrics {
  lifetime_value_predictors: string[];
  upsell_expansion_potential: string[];
  referral_probability: string[];
  retention_risk_factors: string[];
  deal_size_influencers: string[];
}

export interface IcpBuyingBehavior {
  buying_process_complexity: string[];
  purchase_authority_level: string[];
  evaluation_criteria_primary: string[];
  evaluation_criteria_secondary: string[];
  decision_timeline: string[];
  budget_considerations: string[];
  stakeholder_involvement: string[];
  risk_tolerance: string[];
  vendor_preferences: string[];
  contract_preferences: string[];
}

export interface IcpResponse {
  icp?: IcpData;
  error?: string;
}









