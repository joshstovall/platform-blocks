export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  href?: string; // optional navigation target
  startOpen?: boolean;
  icon?: React.ReactNode; // optional leading icon
  disabled?: boolean;
  selectable?: boolean; // override global selection mode
  data?: any; // arbitrary extra data
}

export interface TreeProps {
  data: TreeNode[];
  /** Called when a leaf (no children) or any node with href is pressed */
  onNavigate?: (node: TreeNode) => void;
  /** Called when a node row is pressed. Return false to prevent default handling (selection, expand). */
  onNodePress?: (node: TreeNode, context: { isBranch: boolean; event?: any }) => boolean | void;
  /** Allow collapsing/expanding */
  collapsible?: boolean;
  /** Indent size in px for each depth level */
  indent?: number;
  /** Render only expanded branches (otherwise all flat) */
  accordion?: boolean;
  /** Initially expand all nodes */
  expandAll?: boolean;
  /** Custom render for label */
  renderLabel?: (node: TreeNode, depth: number, isOpen: boolean, state: { selected: boolean; checked: boolean; indeterminate: boolean }) => React.ReactNode;
  style?: any;
  /** Selection mode */
  selectionMode?: 'none' | 'single' | 'multiple';
  /** Controlled selected ids */
  selectedIds?: string[];
  /** Uncontrolled default selected ids */
  defaultSelectedIds?: string[];
  /** Selection change callback */
  onSelectionChange?: (ids: string[], node: TreeNode) => void;
  /** Fired after selection changes with the node considered primary (first in selection) */
  onActiveNodeChange?: (node: TreeNode | null, ids: string[]) => void;
  /** Enable checkboxes */
  checkboxes?: boolean;
  /** Controlled checked ids */
  checkedIds?: string[];
  /** Uncontrolled default checked ids */
  defaultCheckedIds?: string[];
  /** Checked change callback */
  onCheckedChange?: (ids: string[], node: TreeNode) => void;
  /** Cascade checking to descendants */
  cascadeCheck?: boolean;
  /** Expand branches also when pressing label area (not just chevron) */
  expandOnClick?: boolean;
  /** Controlled external expansion state */
  expandedIds?: string[];
  /** Expansion change callback */
  onToggle?: (node: TreeNode, expanded: boolean) => void;
  /** Filter query to highlight / hide unmatched nodes */
  filterQuery?: string;
  /** If true, nodes that don't match filter are hidden; otherwise all shown with highlight */
  hideFiltered?: boolean;
  /** Content when no results after filtering */
  noResultsFallback?: React.ReactNode;
  /** Custom highlight function for labels (return ReactNode) */
  highlight?: (label: string, query: string) => React.ReactNode;
  /** Apply alternating background stripes to rows */
  striped?: boolean;
  /** Animate branch expansion/collapse using the Collapse component */
  useAnimations?: boolean;
}
