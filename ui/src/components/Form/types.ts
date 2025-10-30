import React from 'react';
import { ValidationRule } from '../Input/types';

export interface ValidationSchema {
  [fieldName: string]: ValidationRule[];
}

export interface FormContextValue {
  /** Form values */
  values: Record<string, any>;
  
  /** Form errors */
  errors: Record<string, string>;
  
  /** Touched fields */
  touched: Record<string, boolean>;
  
  /** Whether form is disabled */
  disabled: boolean;
  
  /** Whether form is submitting */
  isSubmitting: boolean;
  
  /** Whether form is valid */
  isValid: boolean;
  
  /** Validate a single field */
  validateField: (name: string, value: any) => Promise<string | null>;
  
  /** Set field value */
  setFieldValue: (name: string, value: any) => void;
  
  /** Set field error */
  setFieldError: (name: string, error: string | null) => void;
  
  /** Set field as touched */
  setFieldTouched: (name: string, touched: boolean) => void;
  
  /** Get field props for binding */
  getFieldProps: (name: string) => {
    value: any;
    onChangeText: (value: any) => void;
    onBlur: () => void;
    error?: string;
    name: string;
  };
  
  /** Submit form */
  submitForm: () => Promise<void>;
  
  /** Reset form */
  resetForm: () => void;
}

export interface FormProps {
  /** Initial form values */
  initialValues?: Record<string, any>;
  
  /** Form validation schema */
  validationSchema?: ValidationSchema;
  
  /** Submit handler */
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  
  /** Validation handler */
  validate?: (values: Record<string, any>) => Record<string, string> | Promise<Record<string, string>>;
  
  /** Whether form is disabled */
  disabled?: boolean;
  
  /** Whether to validate on change */
  validateOnChange?: boolean;
  
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  
  /** Children components */
  children: React.ReactNode;
}

export interface FormFieldProps {
  /** Field name */
  name: string;
  
  /** Field dependencies for conditional logic */
  dependsOn?: Array<{
    field: string;
    condition: (value: any, formValues: Record<string, any>) => boolean;
    action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
  }>;
  
  /** Field validation dependencies */
  validateWhen?: {
    field: string;
    condition: (value: any, formValues: Record<string, any>) => boolean;
  };
  
  /** Custom validation for this field */
  validation?: ValidationRule[];
  
  /** Children components */
  children: React.ReactNode;
}

export interface FormInputProps {
  /** Field name (optional when used inside FormField) */
  name?: string;
  
  /** All other props passed to Input component */
  [key: string]: any;
}

export interface FormLabelProps {
  /** Field name (for accessibility) */
  htmlFor?: string;
  
  /** Whether field is required */
  required?: boolean;
  
  /** Label content */
  children: React.ReactNode;
}

export interface FormErrorProps {
  /** Field name to show error for */
  name?: string;
  
  /** Custom error message */
  error?: string;
}

export interface FormSubmitProps {
  /** Submit button content */
  children: React.ReactNode;
  
  /** Whether button is disabled */
  disabled?: boolean;
  
  /** Additional button props */
  [key: string]: any;
}
