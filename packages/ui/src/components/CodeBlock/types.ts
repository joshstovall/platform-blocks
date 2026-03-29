import React from 'react';
import { ViewStyle, TextStyle, StyleProp } from 'react-native';
import { SpacingProps } from '../../core/utils';

export type CodeBlockToken =
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'function'
  | 'operator'
  | 'punctuation'
  | 'tag'
  | 'attribute'
  | 'className';

export type CodeBlockTextPalette =
  | string
  | string[]
  | Partial<Record<CodeBlockToken, string>>;

export interface CodeBlockColorOverrides {
  /** Background color (hex, rgb, or theme token like `primary.6`) */
  background?: string;
  /** Border/accent color (hex/rgb/theme token) */
  border?: string;
  /** Override text/token colors. Accepts a single color, an array, or a token map. */
  text?: CodeBlockTextPalette;
  /** Highlight colors for emphasized lines */
  highlight?: {
    background?: string;
    accent?: string;
  };
}

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
  style?: StyleProp<ViewStyle>;
  /** Custom styles for the code text */
  textStyle?: StyleProp<TextStyle>;
  /** Custom styles for the title text */
  titleStyle?: StyleProp<TextStyle>;
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
  /** Override base colors (background, text, highlights) */
  colors?: CodeBlockColorOverrides;
  /** Control whether long lines wrap (defaults to true). Set to false to enable horizontal scrolling instead. */
  wrap?: boolean;
}
