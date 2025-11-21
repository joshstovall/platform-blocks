import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Pressable, Platform } from 'react-native';
// NOTE: Direct component/theme imports to break circular dependency with barrel index.ts
import { Text } from '../Text';
import { Icon } from '../Icon';
import { useTheme } from '../../core/theme';
import { Checkbox } from '../Checkbox';
import type { TreeNode, TreeProps } from './types';
export type { TreeNode, TreeProps } from './types';

interface InternalNodeState {
  [id: string]: boolean; // open state
}

const buildInitialState = (nodes: TreeNode[], expandAll: boolean): InternalNodeState => {
  const state: InternalNodeState = {};
  const walk = (list: TreeNode[]) => {
    list.forEach(n => {
      if (n.children?.length) {
        state[n.id] = expandAll || !!n.startOpen;
        walk(n.children);
      }
    });
  };
  walk(nodes);
  return state;
};

// Collect all descendant ids
const collectDescendants = (node: TreeNode): string[] => {
  if (!node.children) return [];
  const ids: string[] = [];
  const walk = (n: TreeNode) => {
    n.children?.forEach(c => {
      ids.push(c.id);
      walk(c);
    });
  };
  walk(node);
  return ids;
};

const findNode = (nodes: TreeNode[], id: string): TreeNode | undefined => {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const f = findNode(n.children, id);
      if (f) return f;
    }
  }
  return undefined;
};

// Get all visible node IDs in order (respecting expansion state)
const getVisibleNodeIds = (nodes: TreeNode[], openState: InternalNodeState): string[] => {
  const ids: string[] = [];
  const walk = (nodeList: TreeNode[]) => {
    nodeList.forEach(node => {
      ids.push(node.id);
      if (node.children && openState[node.id]) {
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return ids;
};

// Get range of node IDs between two nodes (inclusive)
const getNodeRange = (visibleIds: string[], startId: string, endId: string): string[] => {
  const startIndex = visibleIds.indexOf(startId);
  const endIndex = visibleIds.indexOf(endId);
  
  if (startIndex === -1 || endIndex === -1) return [];
  
  const minIndex = Math.min(startIndex, endIndex);
  const maxIndex = Math.max(startIndex, endIndex);
  
  return visibleIds.slice(minIndex, maxIndex + 1);
};

export const Tree: React.FC<TreeProps> = ({
  data,
  onNavigate,
  onNodePress,
  collapsible = true,
  indent = 14,
  accordion = false,
  expandAll = false,
  renderLabel,
  style,
  selectionMode = 'none',
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  onActiveNodeChange,
  checkboxes = false,
  checkedIds,
  defaultCheckedIds = [],
  onCheckedChange,
  cascadeCheck = true,
  expandOnClick = true,
  expandedIds,
  onToggle,
  filterQuery = '',
  hideFiltered = true,
  noResultsFallback = <Text size="sm" color="gray">No results</Text>,
  highlight,
  striped = false,
}) => {
  const theme = useTheme?.() as any;
  const isDark = theme?.colorScheme === 'dark';
  const selectionBg = isDark ? `${theme.colors?.primary?.[5] || '#2684FF'}33` : `${theme.colors?.primary?.[5] || '#2684FF'}22`;
  const selectionBgStrong = isDark ? `${theme.colors?.primary?.[5] || '#2684FF'}66` : `${theme.colors?.primary?.[5] || '#2684FF'}44`;
  const selectionBorder = isDark ? `${theme.colors?.primary?.[5] || '#2684FF'}AA` : `${theme.colors?.primary?.[5] || '#2684FF'}66`;
  const stripeColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.035)';
  const [uncontrolledOpen, setUncontrolledOpen] = useState<InternalNodeState>(() => buildInitialState(data, expandAll));
  const controlledOpen = useMemo(() => {
    if (!expandedIds) return null;
    const map: InternalNodeState = {};
    expandedIds.forEach(id => {
      map[id] = true;
    });
    return map;
  }, [expandedIds]);
  const open = expandedIds ? (controlledOpen ?? {}) : uncontrolledOpen;
  const setOpen = useCallback((value: InternalNodeState | ((prev: InternalNodeState) => InternalNodeState)) => {
    if (expandedIds) return;
    setUncontrolledOpen(prev => (typeof value === 'function' ? (value as (state: InternalNodeState) => InternalNodeState)(prev) : value));
  }, [expandedIds]);

  const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelectedIds);
  const [internalChecked, setInternalChecked] = useState<string[]>(defaultCheckedIds);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const effectiveSelected = selectedIds ?? internalSelected;
  // If consumer supplied onActiveNodeChange but no selection mode, implicitly enable single selection
  const effectiveSelectionMode = (selectionMode === 'none' && onActiveNodeChange) ? 'single' : selectionMode;
  const effectiveChecked = checkedIds ?? internalChecked;

  const toggle = useCallback((node: TreeNode) => {
    if (!collapsible || !node.children?.length) return;

    if (expandedIds) {
      const willOpen = !open[node.id];
      onToggle?.(node, willOpen);
      return;
    }

    setOpen((prev: InternalNodeState) => {
      const next = { ...prev };
      const willOpen = !next[node.id];
      if (accordion) {
        Object.keys(next).forEach(k => { if (k !== node.id) next[k] = false; });
      }
      next[node.id] = willOpen;
      onToggle?.(node, willOpen);
      return next;
    });
  }, [collapsible, accordion, onToggle, expandedIds, open]);

  const setSelected = (ids: string[], node: TreeNode) => {
    if (selectedIds === undefined) setInternalSelected(ids);
    onSelectionChange?.(ids, node);
  const primaryId = ids[0];
  const primaryNode = primaryId ? findNode(data, primaryId) || null : null;
  onActiveNodeChange?.(primaryNode, ids);
  };

  const setChecked = (ids: string[], node: TreeNode) => {
    if (checkedIds === undefined) setInternalChecked(ids);
    onCheckedChange?.(ids, node);
  };

  const handleRowPress = (node: TreeNode, isBranch: boolean, event?: any) => {
    if (node.disabled) return;

    const intercept = onNodePress?.(node, { isBranch, event });
    if (intercept === false) return;

    // expansion
    if (isBranch && expandOnClick) {
      toggle(node);
    }

    // selection
    if (effectiveSelectionMode !== 'none' && (node.selectable ?? true)) {
      if (effectiveSelectionMode === 'single') {
        setSelected([node.id], node);
        setLastSelectedId(node.id);
      } else if (effectiveSelectionMode === 'multiple') {
        const exists = effectiveSelected.includes(node.id);
        
        // Check for modifier keys on web platforms
        const isShiftClick = Platform.OS === 'web' && event?.nativeEvent?.shiftKey;
        const isCtrlClick = Platform.OS === 'web' && (event?.nativeEvent?.ctrlKey || event?.nativeEvent?.metaKey);
        
        if (isShiftClick && lastSelectedId && lastSelectedId !== node.id) {
          // Range selection
          const visibleIds = getVisibleNodeIds(data, open);
          const rangeIds = getNodeRange(visibleIds, lastSelectedId, node.id);
          
          // Filter out any nodes that are not selectable
          const selectableRangeIds = rangeIds.filter(id => {
            const foundNode = findNode(data, id);
            return foundNode && (foundNode.selectable ?? true) && !foundNode.disabled;
          });
          
          // Merge with existing selection, removing duplicates
          const newSelection = Array.from(new Set([...effectiveSelected, ...selectableRangeIds]));
          setSelected(newSelection, node);
        } else if (isCtrlClick) {
          // Ctrl/Cmd+click - toggle individual item without affecting others
          const next = exists ? effectiveSelected.filter(i => i !== node.id) : [...effectiveSelected, node.id];
          setSelected(next, node);
          setLastSelectedId(node.id);
        } else {
          // Regular click - replace selection with single item or toggle if already selected
          if (exists && effectiveSelected.length === 1) {
            // If clicking on the only selected item, deselect it
            setSelected([], node);
            setLastSelectedId(null);
          } else {
            // Replace selection with this item
            setSelected([node.id], node);
            setLastSelectedId(node.id);
          }
        }
      }
    }

    // navigation
    if (node.href) onNavigate?.(node);
  };

  // Precompute descendant ids per branch for performance (stable unless data changes)
  const descendantMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    const build = (nodes: TreeNode[]) => {
      nodes.forEach(n => {
        if (n.children?.length) {
          map[n.id] = collectDescendants(n);
          build(n.children);
        }
      });
    };
    build(data);
    return map;
  }, [data]);

  // Aggregate state helper for branches (leaves return direct checked/unchecked)
  const getAggregateState = (node: TreeNode): 'checked' | 'indeterminate' | 'unchecked' => {
    if (!node.children?.length) {
      return effectiveChecked.includes(node.id) ? 'checked' : 'unchecked';
    }
    const descendants = descendantMap[node.id] || [];
    const selfChecked = effectiveChecked.includes(node.id);
    const checkedDescCount = descendants.reduce((acc, id) => acc + (effectiveChecked.includes(id) ? 1 : 0), 0);
    const totalDesc = descendants.length;
    // Fully checked only when self + all descendants checked
    if (selfChecked && checkedDescCount === totalDesc && totalDesc > 0) return 'checked';
    // Unchecked when neither self nor any descendants are checked
    if (!selfChecked && checkedDescCount === 0) return 'unchecked';
    // Otherwise indeterminate (covers: parent-only, some descendants, all descendants w/o parent)
    return 'indeterminate';
  };

  const toggleCheckbox = (node: TreeNode) => {
    let next: string[] = effectiveChecked.slice();
    const isLeaf = !node.children?.length || !cascadeCheck;
    if (isLeaf) {
      const selfChecked = next.includes(node.id);
      next = selfChecked ? next.filter(id => id !== node.id) : [...next, node.id];
      setChecked(Array.from(new Set(next)), node);
      return;
    }
    const descendants = descendantMap[node.id] || [];
    const selfChecked = next.includes(node.id);
    const checkedDesc = descendants.filter(id => next.includes(id));
    const totalDesc = descendants.length;
    const allDescendantsChecked = checkedDesc.length === totalDesc && totalDesc > 0;
    // Tri-state cycle (branch): none -> parent only -> full -> none; partial -> full
    if (!selfChecked && checkedDesc.length === 0) { // none -> parent only
      next.push(node.id);
    } else if (selfChecked && checkedDesc.length === 0) { // parent only -> full
      next = Array.from(new Set([...next, node.id, ...descendants]));
    } else if (selfChecked && allDescendantsChecked) { // full -> none
      next = next.filter(id => id !== node.id && !descendants.includes(id));
    } else { // any partial variant -> full
      next = Array.from(new Set([...next, node.id, ...descendants]));
    }
    setChecked(next, node);
  };

  // Filtering logic
  const normalizedQuery = filterQuery.trim().toLowerCase();
  const matchesQuery = (label: string) => label.toLowerCase().includes(normalizedQuery);

  const filterTree = (nodes: TreeNode[]): TreeNode[] => {
    if (!normalizedQuery) return nodes;
    const result: TreeNode[] = [];
    for (const n of nodes) {
      const childFiltered = n.children ? filterTree(n.children) : undefined;
      const match = matchesQuery(n.label);
      if (match || (childFiltered && childFiltered.length)) {
        result.push({ ...n, children: childFiltered });
      }
    }
    return result;
  };

  const filteredData = hideFiltered ? filterTree(data) : data;
  const hasResults = filteredData.length > 0;

  let rowCounter = -1;

  const renderNode = (node: TreeNode, depth: number) => {
    const isBranch = !!node.children?.length;
    const isOpen = !!open[node.id];
    const leftPad = depth * indent;
    const selected = effectiveSelected.includes(node.id);
    const aggregate = isBranch ? getAggregateState(node) : (effectiveChecked.includes(node.id) ? 'checked' : 'unchecked');
    const checked = aggregate === 'checked';
    const indeterminate = aggregate === 'indeterminate';
    const disabled = !!node.disabled;
    const showCheckbox = checkboxes && (node.selectable ?? true);
    const rowNumber = ++rowCounter;
    const stripedBg = striped && !selected ? (rowNumber % 2 === 1 ? stripeColor : 'transparent') : 'transparent';

    const labelContent = (() => {
      const base = node.label;
      if (!normalizedQuery || !highlight) return base;
      return highlight(base, normalizedQuery);
    })();
    return (
      <View key={node.id} style={{}}>
    <Pressable
          onPress={(event) => handleRowPress(node, isBranch, event)}
          style={({ pressed }) => ({
      paddingVertical: 4,
      paddingRight: 8,
      paddingLeft: 6 + leftPad,
      borderRadius: 6,
  backgroundColor: selected ? selectionBgStrong : pressed ? selectionBg : stripedBg,
      borderWidth: selected ? 1 : 0,
      borderColor: selected ? selectionBorder : 'transparent',
            flexDirection: 'row',
            alignItems: 'center',
      opacity: disabled ? 0.45 : 1
          })}
          accessibilityRole="button"
          accessibilityLabel={node.label}
        >
          {isBranch ? (
            <Pressable
              onPress={() => toggle(node)}
              style={{ padding: 4 }}
              hitSlop={4}
              disabled={disabled}
              accessibilityLabel={isOpen ? 'Collapse' : 'Expand'}
            >
              <Icon
                name={isOpen ? 'chevron-down' : 'chevron-right'}
                size="xs"
                color={disabled ? '#AAA' : '#666'}
              />
            </Pressable>
          ) : node.icon ? (
            <View style={{ width: 16, alignItems: 'center' }}>
              {node.icon}
            </View>
          ) : (
            // No icon: add spacer margin to keep label alignment without showing empty badge box
            <View style={{ width: 4 }} />
          )}
          <View style={{ width: 4 }} />
          {showCheckbox && (
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              indeterminateIcon={<Icon name="minus" />}
              disabled={disabled}
              onChange={() => toggleCheckbox(node)}
              size="sm"
              style={{ marginRight: 4 }}
            />
          )}
          {node.icon && !isBranch && (
            <View style={{ marginRight: 4 }}>{node.icon}</View>
          )}
          {renderLabel ? (
            renderLabel(node, depth, isOpen, { selected, checked, indeterminate })
          ) : (
            <Text size="sm" color={selected ? theme.colors?.primary?.[7] || theme.colors?.textPrimary : theme.colors?.textPrimary} style={{ fontWeight: selected ? '600' : '400' }}>
              {labelContent}
            </Text>
          )}
        </Pressable>
        {isBranch && isOpen && (
          <View>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={style}>
      {hasResults ? filteredData.map(n => renderNode(n, 0)) : noResultsFallback}
    </View>
  );
};

export default Tree;