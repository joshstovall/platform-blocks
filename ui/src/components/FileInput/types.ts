import React from 'react';
import { BaseInputProps } from '../Input/types';

export interface DocumentPickerAssetLike {
  uri?: string | null;
  name?: string | null;
  size?: number | null;
  mimeType?: string | null;
  type?: string | null;
  file?: File;
  fileCopyUri?: string | null;
  [key: string]: any;
}

export interface FileInputFile {
  /** File object or document picker asset */
  file: File | DocumentPickerAssetLike;
  /** Unique identifier */
  id: string;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Native file URI (if available) */
  uri?: string;
  /** Preview URL (for images) */
  previewUrl?: string;
  /** Upload progress (0-100) */
  progress?: number;
  /** Upload status */
  status?: 'pending' | 'uploading' | 'success' | 'error';
  /** Error message if upload failed */
  error?: string;
}

export interface FileInputProps extends BaseInputProps {
  /** File input variant */
  variant?: 'standard' | 'dropzone' | 'compact';
  
  /** Accepted file types (MIME types or extensions) */
  accept?: string[];
  
  /** Multiple file selection */
  multiple?: boolean;
  
  /** Maximum file size in bytes */
  maxSize?: number;
  
  /** Maximum number of files */
  maxFiles?: number;
  
  /** Upload handler */
  onUpload?: (files: FileInputFile[]) => Promise<void>;
  
  /** Upload progress callback */
  onProgress?: (fileId: string, progress: number) => void;
  
  /** File change handler */
  onFilesChange?: (files: FileInputFile[]) => void;
  
  /** File remove handler */
  onFileRemove?: (fileId: string) => void;
  
  /** File preview component */
  PreviewComponent?: React.ComponentType<{ file: FileInputFile; onRemove: () => void }>;
  
  /** Custom drop zone content */
  children?: React.ReactNode;
  
  /** Whether to show file list */
  showFileList?: boolean;
  
  /** Whether to enable drag and drop */
  enableDragDrop?: boolean;
  
  /** Custom validation function */
  validateFile?: (file: File | DocumentPickerAssetLike) => string | null;
  
  /** Image preview settings */
  imagePreview?: {
    /** Enable image previews */
    enabled?: boolean;
    /** Maximum preview width */
    maxWidth?: number;
    /** Maximum preview height */
    maxHeight?: number;
    /** Preview quality (0-1) */
    quality?: number;
  };
  
  /** Upload settings */
  uploadSettings?: {
    /** Upload URL */
    url?: string;
    /** HTTP method */
    method?: 'POST' | 'PUT';
    /** Additional headers */
    headers?: Record<string, string>;
    /** Form field name for files */
    fieldName?: string;
    /** Additional form data */
    formData?: Record<string, string>;
  };
}
