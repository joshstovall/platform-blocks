import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { SpacingProps } from '../../core/utils';
// import type { SupportedLanguage } from './SyntaxHighlighter';

export interface CodeBlockProps extends SpacingProps {
  /** Optional language for syntax highlighting */
  language?: string;
  children: string;
  /** Optional title displayed above the code block */
  title?: string;
  /** Optional filename displayed next to the title */
  fileName?: string;
  /** Optional icon displayed next to the filename */
  fileIcon?: React.ReactNode;
  /** Show line numbers in the code block */
  showLineNumbers?: boolean;
  /** Enable syntax highlighting */
  highlight?: boolean;
  /** Make the code block take the full width of its container */
  fullWidth?: boolean;
  /** Show a copy button to copy the code to clipboard */
  showCopyButton?: boolean;
  /** Callback when code is copied */
  onCopy?: (code: string) => void;
  /** Custom styles for the code block container and text */
  style?: ViewStyle;
  /** Custom styles for the code text */
  textStyle?: TextStyle;
  /** Custom styles for the title text */
  titleStyle?: TextStyle;
  /** Lines to highlight, e.g. ["1", "3-5"] */
  highlightLines?: string[];
  /** Show a spoiler for the code block */
  spoiler?: boolean;
  /** Maximum height for the spoiler, if exceeded a "Show More" button appears */
  spoilerMaxHeight?: number;
  /** Visual variant: default code styling, terminal emulation, or hacker theme */
  variant?: 'code' | 'terminal' | 'hacker';
  /** Optional prompt prefix for terminal variant (ignored if lines already prefixed) */
  promptSymbol?: string;
  /** GitHub URL to open the code file in GitHub */
  githubUrl?: string;
  /** Force a distinct file header bar (even without title) showing the filename */
  fileHeader?: boolean;
}
