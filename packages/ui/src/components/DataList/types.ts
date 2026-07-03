import { ReactNode } from 'react';
import { ViewProps } from 'react-native';
import { SpacingProps } from '../../core/utils';
import { type ComponentSizeValue } from '../../core/theme/componentSize';

export type DataListOrientation = 'horizontal' | 'vertical';

export interface DataListSizeMetrics {
  /** Font size for labels and values */
  fontSize: number;
  /** Vertical gap between items */
  gap: number;
  /** Gap between a label and its value in vertical orientation */
  labelGap: number;
  /** Gap between the label and value columns in horizontal orientation */
  columnGap: number;
}

/** Shorthand item used by the `data` prop */
export interface DataListDataItem {
  /** Label / term content */
  label: ReactNode;
  /** Value / definition content */
  value: ReactNode;
}

export interface DataListProps extends SpacingProps, Omit<ViewProps, 'children'> {
  /** `DataList.Item` children. Ignored when `data` is provided. */
  children?: ReactNode;
  /** Shorthand for rendering items without composing `DataList.Item` manually */
  data?: DataListDataItem[];
  /** Layout direction of each label/value pair */
  orientation?: DataListOrientation;
  /** Render a divider between items */
  withDivider?: boolean;
  /** Controls font size and spacing */
  size?: ComponentSizeValue;
  /** Override the vertical gap between items */
  spacing?: ComponentSizeValue | number;
  /** Width of the label column in horizontal orientation */
  labelWidth?: number | string;
  /** Override the label text color for all items */
  labelColor?: string;
  /** Override the value text color for all items */
  valueColor?: string;
  /** Override the divider color when `withDivider` is set */
  dividerColor?: string;
}

export interface DataListItemProps extends Omit<ViewProps, 'children'> {
  /** Item content. Compose with `DataList.ItemLabel` / `DataList.ItemValue`. */
  children?: ReactNode;
  /** Shorthand label content (rendered when `children` is not provided) */
  label?: ReactNode;
  /** Shorthand value content (rendered when `children` is not provided) */
  value?: ReactNode;
  /** @internal injected by DataList */
  itemIndex?: number;
  /** @internal injected by DataList */
  isLastItem?: boolean;
}

export interface DataListItemLabelProps extends Omit<ViewProps, 'children'> {
  children?: ReactNode;
  /** Override the label text color */
  color?: string;
}

export interface DataListItemValueProps extends Omit<ViewProps, 'children'> {
  children?: ReactNode;
  /** Override the value text color */
  color?: string;
}

export interface DataListContextValue {
  orientation: DataListOrientation;
  withDivider: boolean;
  metrics: DataListSizeMetrics;
  labelWidth?: number | string;
  labelColor?: string;
  valueColor?: string;
  dividerColor: string;
}
