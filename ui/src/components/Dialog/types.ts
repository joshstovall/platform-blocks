import { ReactNode } from 'react';

// Public props for the imperative <Dialog /> component instance
export interface DialogProps {
  /** Controls whether the dialog is visible. */
  visible: boolean;
  /** Presentation style of the dialog. */
  variant?: 'modal' | 'bottomsheet' | 'fullscreen';
  /** Optional title text shown in the header area. */
  title?: string | null;
  /** Dialog body content. */
  children: ReactNode;
  /** Allows the user to close the dialog via UI controls or escape/back. */
  closable?: boolean;
  /** Whether to render the dimming backdrop behind the dialog. */
  backdrop?: boolean;
  /** Whether tapping the backdrop should close the dialog. */
  backdropClosable?: boolean;
  /** Triggers close animation when set to true. */
  shouldClose?: boolean;
  /** Called when the dialog requests to close. */
  onClose?: () => void;
  /** Optional explicit width for the dialog content (modal/bottomsheet). */
  w?: number;
  /** Optional explicit height for the dialog content. */
  h?: number;
  /** Corner radius for the dialog container (bottom sheet rounds top corners only). */
  radius?: number;
  /** Optional style overrides for the dialog container. */
  style?: object;
  /** Whether to show the styled header area with background and border (default true). */
  showHeader?: boolean;
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
  w?: number;
  h?: number;
  radius?: number;
  style?: object;
  showHeader?: boolean;
}

// Value shape provided by DialogContext
export interface DialogContextValue {
  dialogs: DialogConfig[];
  openDialog: (config: Omit<DialogConfig, 'id'> & { id?: string }) => string;
  closeDialog: (id: string) => void;
  removeDialog: (id: string) => void;
  closeAllDialogs: () => void;
}
