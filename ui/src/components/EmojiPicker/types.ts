import type { SpacingProps } from '../../core/utils';

export type EmojiPickerVariant = 'quick';

export interface EmojiPickerProps extends SpacingProps {
  /** Picker variant */
  variant?: EmojiPickerVariant;
  /** Controlled value (selected emoji) */
  value?: string;
  /** Callback when emoji selected */
  onSelect?: (emoji: string) => void;
  /** Whether picker is disabled */
  disabled?: boolean;
  /** Placeholder text for search */
  searchPlaceholder?: string;
  /** Number of frequently used / quick emojis to show in quick variant */
  emojis?: { label: string; emoji: string }[];
  /** Default opened (uncontrolled) */
  defaultOpened?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (opened: boolean) => void;
  /** Callback whenever search query changes */
  onSearchChange?: (query: string) => void;
  /** Show background for the whole quick variant component */
  showBackground?: boolean;
  /** Test id */
  testID?: string;
}
