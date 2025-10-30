import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { LayoutProps } from '../../core/utils';

export interface OAuthProvider {
  name: 'google' | 'facebook' | 'apple' | string;
  displayName: string;
  icon?: string;
  color?: string;
  onPress: () => void;
}

export interface LoginFormProps extends LayoutProps {
  style?: ViewStyle;
  onLogin?: (email: string, password: string) => void;
  onSignup?: () => void;
  onForgotPassword?: () => void;
  oauthProviders?: OAuthProvider[];
  loading?: boolean;
  error?: string;
  title?: string;
  subtitle?: string;
  showSignupLink?: boolean;
  showForgotPasswordLink?: boolean;
  primaryButtonText?: string;
  signupLinkText?: string;
  forgotPasswordLinkText?: string;
}

export interface SignupFormProps extends LayoutProps {
  style?: ViewStyle;
  onSignup?: (data: SignupFormData) => void;
  onLogin?: () => void;
  oauthProviders?: OAuthProvider[];
  loading?: boolean;
  error?: string;
  title?: string;
  subtitle?: string;
  showLoginLink?: boolean;
  primaryButtonText?: string;
  loginLinkText?: string;
  requireTermsAcceptance?: boolean;
  termsText?: string;
  onTermsPress?: () => void;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms?: boolean;
}

export interface ForgotPasswordFormProps extends LayoutProps {
  style?: ViewStyle;
  onSubmit?: (email: string) => void;
  onBackToLogin?: () => void;
  loading?: boolean;
  error?: string;
  success?: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  backToLoginText?: string;
}

export interface ContactFormProps extends LayoutProps {
  style?: ViewStyle;
  onSubmit?: (data: ContactFormData) => void;
  loading?: boolean;
  error?: string;
  success?: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  showSubjectField?: boolean;
  showPhoneField?: boolean;
  customFields?: ContactFormField[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  [key: string]: any; // For custom fields
}

export interface ContactFormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea';
  required?: boolean;
  placeholder?: string;
}
