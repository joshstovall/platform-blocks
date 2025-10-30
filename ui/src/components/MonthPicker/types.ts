import type { SizeValue } from '../../core/theme/types';
import type { ResponsiveProp } from '../../core/theme/breakpoints';

export interface MonthPickerProps {
  /** Currently selected date (uses the first day of the month) */
  value?: Date | null;
  /** Called when user picks a new month */
  onChange?: (date: Date | null) => void;
  /** Force a specific year to render */
  year?: number;
  /** Called when the visible year changes */
  onYearChange?: (year: number) => void;
  /** Minimum selectable date (inclusive) */
  minDate?: Date;
  /** Maximum selectable date (inclusive) */
  maxDate?: Date;
  /** Locale used for month labels */
  locale?: string;
  /** Size token that influences typography weight */
  size?: SizeValue;
  /** Format of month labels */
  monthLabelFormat?: 'short' | 'long';
  /** Hide navigation header (used when embedded in Calendar) */
  hideHeader?: boolean;
  /** Responsive override for the number of months rendered per row */
  monthsPerRow?: ResponsiveProp<number>;
}
