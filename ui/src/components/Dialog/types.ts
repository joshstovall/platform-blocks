import { ReactNode } from 'react';

// Public props for the imperative <Dialog /> component instance
export interface DialogProps {
  visible: boolean;
  variant?: 'modal' | 'bottomsheet' | 'fullscreen';
  title?: string | null;
  children: ReactNode;
  closable?: boolean;
  backdrop?: boolean;
  backdropClosable?: boolean;
  shouldClose?: boolean; // Triggers close animation when set to true
  onClose?: () => void;
  width?: number;
  height?: number;
  style?: object;
  /** Controls which part of the bottom sheet responds to swipe-to-dismiss gestures */
  bottomSheetSwipeZone?: 'container' | 'handle' | 'none';
}

// Internal configuration object stored in context for stacked dialogs
export interface DialogConfig {
  id: string;
  variant: 'modal' | 'bottomsheet' | 'fullscreen';
  content: ReactNode;
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  backdrop?: boolean;
  backdropClosable?: boolean;
  isClosing?: boolean; // Flag used to animate out before removal
  bottomSheetSwipeZone?: 'container' | 'handle' | 'none';
}

// Value shape provided by DialogContext
export interface DialogContextValue {
  dialogs: DialogConfig[];
  openDialog: (config: Omit<DialogConfig, 'id'> & { id?: string }) => string;
  closeDialog: (id: string) => void;
  removeDialog: (id: string) => void;
  closeAllDialogs: () => void;
}
