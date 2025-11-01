import type { ViewStyle, TextInput } from 'react-native';
import React from 'react';
import { SpotlightItem } from './SpotlightTypes';
import type { HighlightProps as HighlightComponentProps } from '../Highlight';

export interface SpotlightProps {
  actions: SpotlightItem[];
  nothingFound?: string;
  highlightQuery?: boolean | HighlightComponentProps['highlight'];
  limit?: number;
  scrollable?: boolean;
  maxHeight?: number;
  shortcut?: string | string[] | null;
  searchProps?: any;
  store?: any;
  variant?: 'modal' | 'bottomsheet' | 'fullscreen';
  width?: number;
  height?: number;
}

export interface SpotlightRootProps {
  query: string;
  onQueryChange: (query: string) => void;
  children: React.ReactNode;
  opened?: boolean;
  onClose?: () => void;
  shortcut?: string | string[] | null;
  style?: ViewStyle;
}

export interface SpotlightSearchProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  leftSection?: React.ReactNode;
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
  onSelectAction?: () => void;
  onClose?: () => void;
  autoFocus?: boolean;
  inputRef?: React.RefObject<TextInput | null>;
}

export interface SpotlightActionsListProps {
  children: React.ReactNode;
  scrollable?: boolean;
  maxHeight?: number;
  style?: ViewStyle;
  scrollRef?: any; // internal usage for auto-scroll
  onScrollChange?: (y: number) => void; // internal usage for auto-scroll
}

export interface SpotlightActionProps {
  label?: string;
  description?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
  innerRef?: any; // internal usage for auto-scroll
  onLayout?: (e: any) => void; // layout capture for auto-scroll
  highlightQuery?: HighlightComponentProps['highlight'];
}

export interface SpotlightActionsGroupProps {
  label: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface SpotlightEmptyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
