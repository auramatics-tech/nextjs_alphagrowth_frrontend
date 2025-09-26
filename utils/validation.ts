import { SignupData, LoginCredentials } from '../types/auth.types';

// Form validation error types
export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  tosAccepted?: string;
  general?: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateWebsite = (website: string): boolean => {
  const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return websiteRegex.test(website);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Comprehensive signup form validation
export const validateSignupForm = (data: SignupData): FormErrors => {
  const errors: FormErrors = {};

  // Name validation
  if (!data.name?.trim()) {
    errors.name = 'Full name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters';
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  // Terms acceptance validation
  if (!data.tosAccepted) {
    errors.tosAccepted = 'You must accept the Terms of Service and Privacy Policy';
  }

  return errors;
};

// Login form validation
export const validateLoginForm = (data: LoginCredentials): FormErrors => {
  const errors: FormErrors = {};

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

// Field-specific validation
export const validateField = (field: keyof SignupData, value: any): string | undefined => {
  switch (field) {
    case 'name':
      if (!value?.trim()) {
        return 'Full name is required';
      } else if (value.trim().length < 2) {
        return 'Full name must be at least 2 characters';
      }
      break;
    case 'email':
      if (!value?.trim()) {
        return 'Email is required';
      } else if (!validateEmail(value)) {
        return 'Please enter a valid email address';
      }
      break;
    case 'password':
      if (!value) {
        return 'Password is required';
      } else if (value.length < 8) {
        return 'Password must be at least 8 characters';
      }
      break;
    case 'tosAccepted':
      if (!value) {
        return 'You must accept the Terms of Service and Privacy Policy';
      }
      break;
  }
  return undefined;
};

