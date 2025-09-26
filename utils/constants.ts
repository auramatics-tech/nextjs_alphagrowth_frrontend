export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  CAMPAIGNS: '/campaigns',
  ONBOARDING: {
    BUSINESS_OVERVIEW: '/onboarding/business-overview',
    BUSINESS_PROFILE: '/onboarding/business-profile',
    ICP_DRAFTS: '/onboarding/icp-drafts',
    GTM_GOAL: '/onboarding/gtm-goal',
    SUCCESS: '/onboarding/success',
    REGISTRATION_SUCCESS: '/onboarding/registration-success',
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  CAMPAIGNS: {
    LIST: '/campaigns',
    CREATE: '/campaigns',
    UPDATE: '/campaigns/:id',
    DELETE: '/campaigns/:id',
  },
  ONBOARDING: {
    BUSINESS_PROFILE: '/onboarding/business-profile',
    ICP: '/onboarding/icp',
    GTM_GOAL: '/onboarding/gtm-goal',
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  EMAIL_MAX_LENGTH: 254,
  WEBSITE_MAX_LENGTH: 2048,
} as const;

