import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';

import { SpacingProps } from '../../core/utils';
// import type { SupportedLanguage } from './SyntaxHighlighter';

/**
 * Props for the CodeBlock component; extracted to a separate file for reuse and cleaner component file.
 */
export interface CodeBlockProps extends SpacingProps {
  /** The code content to display */
  children: string;
  /** Optional title for the code block */
  title?: string;
  /** Optional filename badge (displayed left of copy button, overrides title if both provided) */
  fileName?: string;
  /** Optional icon element or name to render beside title/filename */
  fileIcon?: React.ReactNode;
  /** Programming language for syntax highlighting */
  language?: any;//SupportedLanguage;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Whether to enable syntax highlighting (default: true) */
  highlight?: boolean;
  /** Whether code block should fill the full width of its parent container */
  fullWidth?: boolean;
  /** Whether to show copy button (default: true) */
  showCopyButton?: boolean;
  /** Callback when copy button is pressed */
  onCopy?: (code: string) => void;
  /** Custom style for the container */
  style?: ViewStyle;
  /** Custom style for the code text */
  textStyle?: TextStyle;
  /** Custom style for the title */
  titleStyle?: TextStyle;
  /** Added highlightLines prop: accepts array of strings like ['5', '10-15'] */
  highlightLines?: string[];
  /** If true, wraps the code content in a Spoiler (collapsible) container */
  spoiler?: boolean;
  /** Max height (px) for spoiler collapsed state (only when spoiler=true) */
  spoilerMaxHeight?: number;
}
