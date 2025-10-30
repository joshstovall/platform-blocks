import React from 'react';
import { BaseInputProps } from '../Input/types';

export interface RichTextEditorFormat {
  /** Bold text */
  bold?: boolean;
  /** Italic text */
  italic?: boolean;
  /** Underlined text */
  underline?: boolean;
  /** Strikethrough text */
  strikethrough?: boolean;
  /** Text color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Font size */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** List type */
  list?: 'ordered' | 'unordered' | null;
  /** Heading level */
  heading?: 1 | 2 | 3 | 4 | 5 | 6 | null;
  /** Link URL */
  link?: string | null;
  /** Code formatting */
  code?: boolean;
  /** Quote formatting */
  quote?: boolean;
}

export interface RichTextEditorContent {
  /** Raw HTML content */
  html: string;
  /** Plain text content */
  text: string;
  /** Delta format (for advanced editors) */
  delta?: any;
  /** Custom format */
  json?: any;
}

export interface RichTextEditorSelection {
  /** Start index */
  index: number;
  /** Selection length */
  length: number;
  /** Current format */
  format?: RichTextEditorFormat;
}

export interface RichTextEditorProps extends Omit<BaseInputProps, 'value' | 'onChange'> {
  /** Initial content */
  defaultValue?: RichTextEditorContent;
  
  /** Current content */
  value?: RichTextEditorContent;
  
  /** Content change handler */
  onChange?: (content: RichTextEditorContent) => void;
  
  /** Selection change handler */
  onSelectionChange?: (selection: RichTextEditorSelection) => void;
  
  /** Focus handler */
  onFocus?: () => void;
  
  /** Blur handler */
  onBlur?: () => void;
  
  /** Editor placeholder */
  placeholder?: string;
  
  /** Whether editor is read-only */
  readOnly?: boolean;
  
  /** Toolbar configuration */
  toolbar?: {
    /** Show toolbar */
    enabled?: boolean;
    /** Toolbar position */
    position?: 'top' | 'bottom' | 'floating';
    /** Available tools */
    tools?: Array<
      | 'bold'
      | 'italic'
      | 'underline'
      | 'strikethrough'
      | 'color'
      | 'backgroundColor'
      | 'fontSize'
      | 'fontFamily'
      | 'align'
      | 'list'
      | 'heading'
      | 'link'
      | 'image'
      | 'code'
      | 'quote'
      | 'separator'
      | { type: 'custom'; component: React.ComponentType<any>; props?: any }
    >;
    /** Toolbar groups */
    groups?: Array<Array<string>>;
  };
  
  /** Format options */
  formats?: {
    /** Available font families */
    fontFamilies?: string[];
    /** Available font sizes */
    fontSizes?: number[];
    /** Available colors */
    colors?: string[];
    /** Available heading levels */
    headings?: Array<1 | 2 | 3 | 4 | 5 | 6>;
  };
  
  /** Image handling */
  images?: {
    /** Allow image uploads */
    enabled?: boolean;
    /** Upload handler */
    onUpload?: (file: File) => Promise<string>;
    /** Maximum image size */
    maxSize?: number;
    /** Allowed image types */
    allowedTypes?: string[];
    /** Image resize settings */
    resize?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    };
  };
  
  /** Link handling */
  links?: {
    /** Allow links */
    enabled?: boolean;
    /** Link validation */
    validate?: (url: string) => boolean;
    /** Open links in new tab */
    openInNewTab?: boolean;
  };
  
  /** Custom plugins */
  plugins?: Array<{
    /** Plugin name */
    name: string;
    /** Plugin component */
    component: React.ComponentType<any>;
    /** Plugin configuration */
    config?: any;
  }>;
  
  /** Autosave configuration */
  autosave?: {
    /** Enable autosave */
    enabled?: boolean;
    /** Save interval in milliseconds */
    interval?: number;
    /** Save handler */
    onSave?: (content: RichTextEditorContent) => void;
  };
  
  /** Spell check */
  spellCheck?: boolean;
  
  /** Maximum content length */
  maxLength?: number;
  
  /** Minimum editor height */
  minHeight?: number;
  
  /** Maximum editor height */
  maxHeight?: number;
  
  /** Custom CSS classes */
  className?: string;
  
  /** Theme override */
  theme?: 'light' | 'dark' | 'auto';
}
