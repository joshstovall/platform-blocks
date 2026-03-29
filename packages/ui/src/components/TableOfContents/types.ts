import { SpacingProps } from '../../core/utils/spacing';
import { BorderRadiusProps } from '../../core/theme/radius';
import { SizeValue } from '../../core/theme/sizes';
import { ScrollSpyOptions, UseScrollSpyItem as TocItem } from '../../hooks/useScrollSpy';

export interface TableOfContentsProps extends SpacingProps, BorderRadiusProps {
  /**
   * Visual style variant for the table of contents
   * @default 'none'
   */
  variant?: 'filled' | 'outline' | 'ghost' | 'none';
  
  /**
   * Background color for filled variant. Falls back to theme primary color if not specified
   */
  color?: string;
  
  /**
   * Text size for table of contents items
   * @default 'sm'
   */
  size?: SizeValue;
  
  /**
   * Border radius value for the container
   */
  radius?: any;
  
  /**
   * Configuration options for scroll spy behavior
   */
  scrollSpyOptions?: ScrollSpyOptions;
  
  /**
   * Function to customize props for each table of contents item control
   * @param payload - Object containing item data, active state, and index
   * @returns Props to spread onto the control element
   */
  getControlProps?: (payload: { data: TocItem; active: boolean; index: number }) => any;
  
  /**
   * Initial data for table of contents items (useful for SSR or pre-rendering)
   */
  initialData?: TocItem[];
  
  /**
   * Minimum depth level at which to start applying depth offset indentation
   * @default 1
   */
  minDepthToOffset?: number;
  
  /**
   * Pixel offset to apply for each depth level (indentation amount)
   * @default 20
   */
  depthOffset?: number;
  
  /**
   * Ref to expose the reinitialize function for manually triggering TOC refresh
   */
  reinitializeRef?: React.RefObject<() => void>;
  
  /**
   * Automatically adjust text color for contrast when using filled variant
   * @default false
   */
  autoContrast?: boolean;
  
  /**
   * Additional styles to apply to the container
   */
  style?: any;
  
  /**
   * Callback fired when the active item changes
   * @param id - ID of the newly active item, or null if none
   * @param item - The complete TocItem object if available
   */
  onActiveChange?: (id: string | null, item?: TocItem) => void;
  
  /**
   * CSS selector string or HTMLElement to use as the scroll container
   * @default 'main, [role="main"], .main-content, #main-content, article, .content, #content'
   */
  container?: string | HTMLElement;
}

export type { TocItem };
