import type { BaseChartProps, ChartAnimation } from '../../types/base';

export interface SankeyNode {
  /** Unique identifier for the node */
  id: string;
  /** Display name for the node */
  name?: string;
  /** Numeric value associated with the node */
  value?: number;
  /** Color override for the node */
  color?: string;
  /** Additional metadata associated with the node */
  meta?: any;
}

export interface SankeyLink {
  /** Source node identifier */
  source: string;
  /** Target node identifier */
  target: string;
  /** Magnitude of the flow */
  value: number;
  /** Color override for the link */
  color?: string;
  /** Additional metadata associated with the link */
  meta?: any;
}

export interface SankeyInconsistency {
  nodeId: string;
  inbound: number;
  outbound: number;
}

export interface SankeyChartProps extends BaseChartProps {
  /** Nodes included in the Sankey diagram */
  nodes: SankeyNode[];
  /** Links connecting the nodes */
  links: SankeyLink[];
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Disable animations */
  disabled?: boolean;
  /** Fixed node width in pixels (auto-calculated if omitted) */
  nodeWidth?: number;
  /** Vertical gap between nodes (auto-calculated if omitted) */
  nodePadding?: number;
  /** Override chart padding (defaults to 40px all around) */
  chartPadding?: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  /** Format display label for a node */
  labelFormatter?: (node: SankeyNode) => string;
  /** Format value label for a node */
  valueFormatter?: (value: number, node: SankeyNode | undefined) => string;
  /** Receive callbacks when a node is hovered/focused */
  onNodeHover?: (node: SankeyNode | null) => void;
  /** Receive callbacks when a link is hovered/focused */
  onLinkHover?: (link: SankeyLink | null) => void;
  /** Highlight hovered nodes/links (defaults to true) */
  highlightOnHover?: boolean;
  /** Surfaced when inbound/outbound totals differ for a node */
  onDataInconsistency?: (issues: SankeyInconsistency[]) => void;
}