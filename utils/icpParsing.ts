import { IcpData, IcpGoalsObjectives, IcpCompanyDetail, IcpOutreach, IcpScoringFramework, IcpConversionPath, IcpIntentSignals, IcpRevenueMetrics, IcpBuyingBehavior } from '../types/icp.types';

export const parseJsonField = (field: string | object | undefined): any => {
  if (!field) return {};
  if (typeof field === 'object') return field;
  try {
    return JSON.parse(field);
  } catch {
    return {};
  }
};

export const parseIcpData = (icpData: any): Omit<IcpData, 'goalsAndObjectives' | 'companyDetail' | 'outReach' | 'scoringFramework' | 'conversionPath' | 'intentSignals' | 'revenueMetrics' | 'buyingBehavior'> & {
  goalsAndObjectives: IcpGoalsObjectives;
  companyDetail: IcpCompanyDetail;
  outReach: IcpOutreach;
  scoringFramework: IcpScoringFramework;
  conversionPath: IcpConversionPath;
  intentSignals: IcpIntentSignals;
  revenueMetrics: IcpRevenueMetrics;
  buyingBehavior: IcpBuyingBehavior;
} => {
  // The API response already has the data in the correct format
  // We just need to structure it properly for our components
  return {
    id: icpData.id,
    name: icpData.name,
    position: icpData.position,
    gender: icpData.gender,
    ageRange: icpData.ageRange,
    location_city: icpData.location_city,
    location_country: icpData.location_country,
    goalsAndObjectives: {
      goals_obj_responsibilities: icpData.goals_obj_responsibilities || '',
      goals_obj_pain_points: icpData.goals_obj_pain_points || '',
      goals_obj_metric_affected: icpData.goals_obj_metric_affected || '',
      goals_obj_tactical_problem: icpData.goals_obj_tactical_problem || '',
      goals_obj_root_cause: icpData.goals_obj_root_cause || '',
      goals_obj_business_impact: icpData.goals_obj_business_impact || '',
      goals_obj_dream_outcome: icpData.goals_obj_dream_outcome || '',
      goals_obj_social_media: safeParseOrWrapInArray(icpData.goals_obj_social_media),
    },
    companyDetail: {
      company_size: icpData.company_size || '',
      industries: safeParseOrWrapInArray(icpData.company_industries),
      company_type: icpData.company_type || '',
      locations: `${icpData.company_location_city || ''}, ${icpData.company_location_country || ''}`,
      company_revenue_growth: icpData.company_revenue_growth || '',
      company_location_city: icpData.company_location_city || '',
      company_location_country: icpData.company_location_country || '',
      company_b2b_b2c: icpData.company_b2b_b2c || '',
      company_targets: safeParseOrWrapInArray(icpData.company_targets),
      company_growth_indicators: safeParseOrWrapInArray(icpData.company_growth_indicators),
      company_competitive_position: icpData.company_competitive_position || '',
    },
    outReach: {
      preferred_communication_channels: icpData.preferred_communication_channels || '',
      tools_they_might_use: icpData.tools_they_might_use || '',
      suggested_tone_of_voice: icpData.suggested_tone_of_voice || '',
      out_touchpoints: safeParseOrWrapInArray(icpData.out_touchpoints),
      out_message_resonance: safeParseOrWrapInArray(icpData.out_message_resonance),
      out_timing_optimization: icpData.out_timing_optimization || '',
      out_personalization_hooks: safeParseOrWrapInArray(icpData.out_personalization_hooks),
      out_social_proof_preferences: safeParseOrWrapInArray(icpData.out_social_proof_preferences),
      out_alternatives: icpData.out_alternatives || '',
      out_risk_of_inaction: safeParseOrWrapInArray(icpData.out_risk_of_inaction),
      out_value_proposition_alignment: safeParseOrWrapInArray(icpData.out_value_proposition_alignment),
      out_free_resource_strategy: icpData.out_free_resource_strategy || '',
      out_tone_optimization: safeParseOrWrapInArray(icpData.out_tone_optimization),
    },
    scoringFramework: {
      scoring_positive_indicators: safeParseOrWrapInArray(icpData.scoring_positive_indicators),
      scoring_negative_signals: safeParseOrWrapInArray(icpData.scoring_negative_signals),
      scoring_intent_weights: safeParseOrWrapInArray(icpData.scoring_intent_weights),
      scoring_firmographic_multipliers: safeParseOrWrapInArray(icpData.scoring_firmographic_multipliers),
      scoring_timing_factors: safeParseOrWrapInArray(icpData.scoring_timing_factors),
    },
    conversionPath: {
      path_discovery_channels: safeParseOrWrapInArray(icpData.path_discovery_channels),
      path_evaluation_process: safeParseOrWrapInArray(icpData.path_evaluation_process),
      path_decision_timeline: safeParseOrWrapInArray(icpData.path_decision_timeline),
      path_implementation_planning: safeParseOrWrapInArray(icpData.path_implementation_planning),
      path_objection_patterns: safeParseOrWrapInArray(icpData.path_objection_patterns),
      path_success_validation: safeParseOrWrapInArray(icpData.path_success_validation),
    },
    intentSignals: {
      buying_triggers: safeParseOrWrapInArray(icpData.buying_triggers),
      seasonal_buying_patterns: safeParseOrWrapInArray(icpData.seasonal_buying_patterns),
      competitive_displacement_signals: safeParseOrWrapInArray(icpData.competitive_displacement_signals),
      expansion_triggers: safeParseOrWrapInArray(icpData.expansion_triggers),
      urgency_accelerators: safeParseOrWrapInArray(icpData.urgency_accelerators),
    },
    revenueMetrics: {
      lifetime_value_predictors: safeParseOrWrapInArray(icpData.lifetime_value_predictors),
      upsell_expansion_potential: safeParseOrWrapInArray(icpData.upsell_expansion_potential),
      referral_probability: safeParseOrWrapInArray(icpData.referral_probability),
      retention_risk_factors: safeParseOrWrapInArray(icpData.retention_risk_factors),
      deal_size_influencers: safeParseOrWrapInArray(icpData.deal_size_influencers),
    },
    buyingBehavior: {
      buying_process_complexity: safeParseOrWrapInArray(icpData.buying_process_complexity),
      purchase_authority_level: safeParseOrWrapInArray(icpData.purchase_authority_level),
      evaluation_criteria_primary: safeParseOrWrapInArray(icpData.evaluation_criteria_primary),
      evaluation_criteria_secondary: safeParseOrWrapInArray(icpData.evaluation_criteria_secondary),
      decision_timeline: safeParseOrWrapInArray(icpData.decision_timeline),
      budget_considerations: safeParseOrWrapInArray(icpData.budget_considerations),
      stakeholder_involvement: safeParseOrWrapInArray(icpData.stakeholder_involvement),
      risk_tolerance: safeParseOrWrapInArray(icpData.risk_tolerance_profile),
      vendor_preferences: safeParseOrWrapInArray(icpData.vendor_selection_process),
      contract_preferences: safeParseOrWrapInArray(icpData.contract_preferences),
    },
  };
};

export const safeParseOrWrapInArray = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [field];
    } catch {
      return field.split(',').map(s => s.trim());
    }
  }
  return [];
};
