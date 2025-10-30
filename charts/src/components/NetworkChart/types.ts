import type { BaseChartProps, ChartAxis, ChartGrid } from '../../types/base';

export type NetworkLayoutMode = 'force' | 'coordinate' | 'circular' | 'radial';

export type NetworkLinkShape = 'straight' | 'curved';

export interface NetworkNode {
  /** Unique identifier for the node */
  id: string;
  /** Display name for the node */
  name?: string;
  /** Optional grouping key used for styling */
  group?: string | number;
  /** Numeric value associated with the node */
  value?: number;
  /** Explicit color override for the node */
  color?: string;
  /** Additional metadata associated with the node */
  meta?: any;
  /** Optional X coordinate for coordinate layouts */
  x?: number;
  /** Optional Y coordinate for coordinate layouts */
  y?: number;
}

export interface NetworkLink {
  /** ID of the source node */
  source: string;
  /** ID of the target node */
  target: string;
  /** Strength or weight of the connection */
  weight?: number;
  /** Additional metadata associated with the link */
  meta?: any;
  /** Optional color override for the link */
  color?: string;
  /** Optional opacity override for the link */
  opacity?: number;
  /** Explicit stroke width override for the link */
  width?: number;
}

export interface NetworkNodeInteractionEvent {
  node: NetworkNode;
  index: number;
  position: { x: number; y: number };
}

export interface NetworkLinkInteractionEvent {
  link: NetworkLink;
  index: number;
  source: { node?: NetworkNode; position: { x: number; y: number } };
  target: { node?: NetworkNode; position: { x: number; y: number } };
  weight: number;
}

export interface NetworkChartProps extends BaseChartProps {
  /** Nodes to render in the network */
  nodes: NetworkNode[];
  /** Links connecting the nodes */
  links: NetworkLink[];
  /** Layout engine mode */
  layout?: NetworkLayoutMode;
  /** Optional grid configuration for coordinate layouts */
  grid?: ChartGrid | boolean;
  /** X axis configuration when using coordinate layouts */
  xAxis?: ChartAxis;
  /** Y axis configuration when using coordinate layouts */
  yAxis?: ChartAxis;
  /** Optional padding overrides */
  padding?: Partial<{ top: number; right: number; bottom: number; left: number }>;
  /** Accessor overrides for coordinate layouts */
  coordinateAccessor?: {
    x?: (node: NetworkNode, index: number) => number;
    y?: (node: NetworkNode, index: number) => number;
  };
  /** Show node labels */
  showLabels?: boolean;
  /** Radius override for nodes */
  nodeRadius?: number;
  /** Optional range that scales node radius by node value */
  nodeRadiusRange?: [number, number];
  /** Optional accessor to extract numeric value for node sizing */
  nodeValueAccessor?: (node: NetworkNode, index: number) => number;
  /** Optional range that maps link weights to stroke width */
  linkWidthRange?: [number, number];
  /** Accessor for custom link colors */
  linkColorAccessor?: (link: NetworkLink, index: number) => string | undefined;
  /** Accessor for custom link opacity */
  linkOpacityAccessor?: (link: NetworkLink, index: number) => number | undefined;
  /** Link rendering shape */
  linkShape?: NetworkLinkShape;
  /** Curvature strength multiplier when using curved links */
  linkCurveStrength?: number;
  /** Palette used when a link does not provide an explicit color */
  linkPalette?: string[];
  /** Node focus callback for hover/focus interactions */
  onNodeFocus?: (event: NetworkNodeInteractionEvent) => void;
  /** Node blur callback */
  onNodeBlur?: (event: NetworkNodeInteractionEvent) => void;
  /** Node press callback */
  onNodePress?: (event: NetworkNodeInteractionEvent) => void;
  /** Link focus callback for hover/focus interactions */
  onLinkFocus?: (event: NetworkLinkInteractionEvent) => void;
  /** Link blur callback */
  onLinkBlur?: (event: NetworkLinkInteractionEvent) => void;
  /** Link press callback */
  onLinkPress?: (event: NetworkLinkInteractionEvent) => void;
}