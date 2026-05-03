import { createContext } from 'react';

/**
 * Context shared from `<Card>` to its `Card.Section` children. The section
 * needs the parent's resolved padding (so it can negate it via negative
 * margins for full-bleed layout) and the parent's border color (for the
 * conditional top/bottom borders when `withBorder` is set on a section).
 */
export interface CardContextValue {
  /** Resolved padding of the parent Card, in px. */
  paddingPx: number;
  /** Whether the parent Card has `withBorder` (used by Card.Section borders). */
  withBorder: boolean;
  /** Resolved border color from the theme (or the parent's `borderColor` override). */
  borderColor: string;
}

export const CardContext = createContext<CardContextValue | null>(null);
