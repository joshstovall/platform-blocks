export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onSelect?: () => void;
}

export interface ContextMenuProps {
  /** Render prop for the trigger */
  children: (props: { onContextMenu: (e: any) => void; onPressIn: (e: any) => void }) => React.ReactNode;
  items: ContextMenuItem[];
  /** Close after selection (default true) */
  closeOnSelect?: boolean;
  /** Long press duration (ms) for native */
  longPressDelay?: number;
  /** Optional maximum height (scrolls) */
  maxHeight?: number;
  /** Called when menu opens */
  onOpen?: () => void;
  /** Called when menu closes */
  onClose?: () => void;
  /** Controlled open */
  open?: boolean;
  /** Controlled position */
  position?: { x: number; y: number };
  /** Portal target id (web) - simple placeholder for future portal integration */
  portalId?: string;
  style?: any;
}
