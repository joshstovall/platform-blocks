import { ReactNode } from 'react';

export interface FormLayoutProps {
  children: ReactNode;
  maxWidth?: number;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'card' | 'modal';
}

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormGroupProps {
  children: ReactNode;
  direction?: 'row' | 'column';
  columns?: 2 | 3 | 4;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  width?: 'auto' | 'full' | number;
  labelPosition?: 'top' | 'left' | 'right';
}