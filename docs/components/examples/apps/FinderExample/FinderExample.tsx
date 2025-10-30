import React, { useState, useMemo, useEffect } from 'react';
import { View, Pressable, TextInput } from 'react-native';
// Optional video thumbnails (expo-video-thumbnails). We'll lazy-require to avoid hard dependency.
let VideoThumbModule: any = null;
try { // eslint-disable-next-line @typescript-eslint/no-var-requires
  VideoThumbModule = require('expo-video-thumbnails');
} catch { /* Module not installed; thumbnails for video will show placeholder */ }
import { Card, Text, Flex, Icon, Chip, Switch, useTheme, Image } from '@platform-blocks/ui';
import { Search } from '@platform-blocks/ui';
import { FinderFile } from './types';
import { FolderIcon } from './FolderIcon';
import { rootFiles } from './mockData';
import { finderStyles as S } from './styles';
import { PreviewFile } from './PreviewFile';

interface FinderState {
  path: string[]; // array of folder ids from root
  showPreview: boolean;
  search: string;
  view: 'list' | 'grid';
  selected?: string; // selected file id
  selectedIds?: string[]; // multi-select set (includes selected)
}
// Drag & drop interface removed

function formatSize(size?: number) {
  if (!size && size !== 0) return '';
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
  return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

function getFolderByPath(root: FinderFile[], path: string[]): FinderFile[] {
  if (!path.length) return root;
  let current: FinderFile[] = root;
  for (const id of path) {
    const folder = current.find(f => f.id === id && f.type === 'folder');
    if (!folder) break;
    current = folder.children || [];
  }
  return current;
}

function resolveCrumbs(root: FinderFile[], path: string[]): { id: string; name: string }[] {
  const crumbs: { id: string; name: string }[] = [{ id: '__root__', name: 'All Files' }];
  let currentList = root;
  for (const id of path) {
    const folder = currentList.find(f => f.id === id && f.type === 'folder');
    if (!folder) break;
    crumbs.push({ id: folder.id, name: folder.name });
    currentList = folder.children || [];
  }
  return crumbs;
}

// Recursive helper to find any file/folder by id within the full tree
function findFileRecursive(tree: FinderFile[], id: string): FinderFile | undefined {
  for (const f of tree) {
    if (f.id === id) return f;
    if (f.type === 'folder' && f.children) {
      const found = findFileRecursive(f.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

// Map extensions to available Icon names
const FILE_ICONS: Record<string, 'code' | 'folder' | 'table' | 'image'> = {
  md: 'code',
  txt: 'code',
  json: 'code',
  svg: 'image',
  png: 'image',
  xlsx: 'table'
};

export function FinderExample() {
  // Maintain a mutable copy of the file tree so we can reorder
  const [fileTree, setFileTree] = useState<FinderFile[]>(() => JSON.parse(JSON.stringify(rootFiles)));
  const [state, setState] = useState<FinderState>({ path: [], showPreview: true, search: '', view: 'list', selectedIds: [] });
  // Drag state removed
  const [titleHover, setTitleHover] = useState(false); // show proxy icon on hover like macOS
  const [controlsHover, setControlsHover] = useState(false); // show x/−/+ glyphs on hover
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // expanded folders (list tree)
  const [imageError, setImageError] = useState(false);
  const [thumbs, setThumbs] = useState<Record<string, { uri?: string; pending?: boolean; error?: boolean }>>({});
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  // Layout refs for drag removed
  const theme = useTheme();
  const isDark = theme.colorScheme === 'dark';
  // Track last press for double-press to open folders
  const lastPressRef = React.useRef<{ id: string; time: number }>({ id: '', time: 0 });
  // Ref for keyboard navigation focus
  const listContainerRef = React.useRef<any>(null);
  // Row element refs for auto-scroll
  const rowRefs = React.useRef<Record<string, any>>({});

  const colors = {
    winBorder: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)',
    titleBarBg: isDark ? theme.backgrounds.subtle : theme.backgrounds.subtle,
    titleBarBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    windowBg: theme.backgrounds.surface,
    sidebarBg: isDark ? theme.backgrounds.surface : theme.backgrounds.surface,
    sidebarBorder: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
    previewBg: theme.backgrounds.surface,
    previewBorder: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
    selection: isDark ? `${theme.colors.primary[5]}33` : `${theme.colors.primary[5]}22`,
    selectionPressed: isDark ? `${theme.colors.primary[5]}55` : `${theme.colors.primary[5]}33`,
    // Stronger row highlight colors for selected items
    selectionRowBg: isDark ? `${theme.colors.primary[5]}88` : `${theme.colors.primary[5]}55`,
    selectionRowBorder: isDark ? `${theme.colors.primary[5]}AA` : `${theme.colors.primary[5]}77`,
    textMuted: theme.text.muted,
  } as const;

  // Prevent native text selection so custom row highlight feels native
  const noSelect: any = { userSelect: 'none', WebkitUserSelect: 'none' };

  const folderFiles = useMemo(() => getFolderByPath(fileTree, state.path), [fileTree, state.path]);
  const crumbs = useMemo(() => resolveCrumbs(rootFiles, state.path), [state.path]);

  const visibleFiles = useMemo(() => {
    return folderFiles.filter(f => f.name.toLowerCase().includes(state.search.toLowerCase()));
  }, [folderFiles, state.search]);

  // selectedFile will be recalculated after treeFiles for nested visibility; placeholder here (overridden below)
  const selectedFile = useMemo(() => {
    const id = state.selected || state.selectedIds?.[0];
    if (!id) return undefined;
    return folderFiles.find(f => f.id === id);
  }, [folderFiles, state.selected, state.selectedIds]);
  useEffect(() => { setImageError(false); }, [selectedFile?.id]);

  const renderThumb = (file: FinderFile, size: number) => {
    const isImage = file.type === 'file' && file.uri && file.mime?.startsWith('image/');
    const isVideo = file.type === 'file' && file.mime === 'video/mp4' && file.uri;
    if (isImage) {
      return (
        <Image
          src={file.uri!}
          style={{ width: size, height: size, borderRadius: 4 }}
          imageStyle={{ width: '100%', height: '100%', borderRadius: 4 }}
          resizeMode="cover"
        />
      );
    }
    if (isVideo) {
      const t = thumbs[file.id];
      if (t?.uri) {
        return (
          <View style={{ position: 'relative' }}>
            <Image
              src={t.uri}
              style={{ width: size, height: size, borderRadius: 4 }}
              imageStyle={{ width: '100%', height: '100%', borderRadius: 4 }}
              resizeMode="cover"
            />
            <View style={{ position: 'absolute', right: 2, bottom: 2, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 }}>
              <Text size="xs" weight="medium" color="inverted">▶</Text>
            </View>
          </View>
        );
      }
      return (
        <View style={{ width: size, height: size, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? theme.colors.gray[7] : theme.colors.gray[2] }}>
          <Text size="xs" color="muted">{t?.error ? '!' : '…'}</Text>
        </View>
      );
    }
    return null;
  };

  // selectedInfo moved below treeFiles declaration

  const toggleExpand = (id: string) => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const treeFiles = useMemo(() => {
    if (state.view !== 'list') return [] as { file: FinderFile; depth: number }[];
    const current = getFolderByPath(fileTree, state.path);
    const out: { file: FinderFile; depth: number }[] = [];
    const walk = (arr: FinderFile[], depth: number) => {
      for (const f of arr) {
        out.push({ file: f, depth });
        if (f.type === 'folder' && expanded[f.id] && f.children) walk(f.children, depth + 1);
      }
    };
    walk(current, 0);
    return out.filter(n => n.file.name.toLowerCase().includes(state.search.toLowerCase()));
  }, [state.view, fileTree, state.path, expanded, state.search]);

  const selectedInfo = useMemo(() => {
    const ids = state.selectedIds || [];
    if (!ids.length) return { count: 0, total: 0 };
    const currentList = state.view === 'list' ? treeFiles.map(t => t.file) : visibleFiles;
    let total = 0;
    ids.forEach(id => {
      const f = currentList.find(ff => ff.id === id);
      if (f && f.type === 'file' && typeof f.size === 'number') total += f.size;
    });
    return { count: ids.length, total };
  }, [state.selectedIds, treeFiles, visibleFiles, state.view]);

  // All selected file objects (for multi-select summary preview)
  const selectedFiles = useMemo(() => {
    const ids = state.selectedIds || [];
    if (!ids.length) return [] as FinderFile[];
    const source = state.view === 'list' ? treeFiles.map(t => t.file) : visibleFiles;
    return ids.map(id => source.find(f => f.id === id)).filter(Boolean) as FinderFile[];
  }, [state.selectedIds, treeFiles, visibleFiles, state.view]);

  // Recompute selectedFile now that treeFiles is available so nested children in expanded folders resolve
  const effectiveSelectedFile = useMemo(() => {
    const id = state.selected || state.selectedIds?.[0];
    if (!id) return undefined;
    if (state.view === 'list') {
      const flat = treeFiles.map(t => t.file);
      const direct = flat.find(f => f.id === id);
      if (direct) return direct;
      // Fallback: selected item might be filtered out by search; look it up in full tree
      return findFileRecursive(fileTree, id);
    }
    // Grid view logic unchanged
    return selectedFile || findFileRecursive(fileTree, id);
  }, [state.selected, state.selectedIds, state.view, treeFiles, selectedFile, fileTree]);

  // Auto-scroll selected primary item into view (web only capability)
  useEffect(() => {
    const id = state.selected || state.selectedIds?.[0];
    if (!id) return;
    const el = rowRefs.current[id];
    // @ts-ignore - web only scrollIntoView
    if (el?.scrollIntoView) {
      // slight timeout to allow layout after expand/collapse
      setTimeout(() => {
        try { el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch {
          console.warn('scrollIntoView failed, element may be invalid');
        }
      }, 0);
    }
  }, [state.selected, state.selectedIds, state.view, expanded, treeFiles.length]);

  // Generate video thumbnails (after treeFiles defined). Guard against missing module.
  useEffect(() => {
    if (!VideoThumbModule?.getThumbnailAsync) return;
    const currentList = state.view === 'list' ? treeFiles.map(t => t.file) : visibleFiles;
    const candidates = currentList.filter(f => f.type === 'file' && f.mime === 'video/mp4' && f.uri);
    candidates.forEach(file => {
      // Stop if we already have a thumbnail, a pending request, or a recorded error (avoid infinite retry loop)
      if (thumbs[file.id]?.uri || thumbs[file.id]?.pending || thumbs[file.id]?.error) return;
      setThumbs(t => ({ ...t, [file.id]: { pending: true } }));
      (async () => {
        try {
          const res = await VideoThumbModule.getThumbnailAsync(file.uri!, { time: 800 });
          setThumbs(t => ({ ...t, [file.id]: { uri: res.uri } }));
        } catch (e) {
          // Mark error once; guard above prevents repeated attempts causing maximum update depth
          setThumbs(t => ({ ...t, [file.id]: { error: true } }));
        }
      })();
    });
  }, [state.view, treeFiles, visibleFiles, thumbs]);

  const enterFolder = (file: FinderFile) => {
    if (file.type !== 'folder') return;
    setState(s => ({ ...s, path: [...s.path, file.id], selected: undefined }));
  };
  const goToCrumb = (id: string) => {
    if (id === '__root__') { setState(s => ({ ...s, path: [], selected: undefined })); return; }
    const idx = state.path.indexOf(id);
    if (idx !== -1) {
      setState(s => ({ ...s, path: state.path.slice(0, idx + 1), selected: undefined }));
    }
  };

  const lastAnchorRef = React.useRef<string | null>(null);
  const toggleSelect = (file: FinderFile, index: number, list: FinderFile[], shiftKey?: boolean, metaKey?: boolean) => {
    setState(s => {
      // Shift range selection
      if (shiftKey) {
        const anchorId = lastAnchorRef.current || s.selected || s.selectedIds?.[0];
        if (!anchorId) {
          lastAnchorRef.current = file.id;
          return { ...s, selected: file.id, selectedIds: [file.id] };
        }
        const anchorIndex = list.findIndex(f => f.id === anchorId);
        if (anchorIndex === -1) {
          lastAnchorRef.current = file.id;
          return { ...s, selected: file.id, selectedIds: [file.id] };
        }
        const start = Math.min(anchorIndex, index);
        const end = Math.max(anchorIndex, index);
        const rangeIds = list.slice(start, end + 1).map(f => f.id);
        return { ...s, selected: file.id, selectedIds: rangeIds };
      }
      // Meta/Ctrl additive toggle
      if (metaKey) {
        const exists = s.selectedIds?.includes(file.id);
        let next = (s.selectedIds || []).slice();
        if (exists) {
          next = next.filter(id => id !== file.id);
        } else {
          next.push(file.id);
          lastAnchorRef.current = file.id;
        }
        if (!next.length) {
          lastAnchorRef.current = null;
          return { ...s, selected: undefined, selectedIds: [] };
        }
        return { ...s, selected: next[0], selectedIds: next };
      }
      // Regular click toggles single selection
      const already = s.selectedIds?.includes(file.id);
      if (already && (s.selectedIds?.length || 0) <= 1) {
        lastAnchorRef.current = null;
        return { ...s, selected: undefined, selectedIds: [] };
      }
      lastAnchorRef.current = file.id;
      return { ...s, selected: file.id, selectedIds: [file.id] };
    });
  };

  // Drag & drop helpers removed

  // Create new folder in current path
  const createFolder = () => {
    const baseName = 'New Folder';
    let newId = '';
    let newName = '';
    setFileTree(prev => {
      const clone: FinderFile[] = JSON.parse(JSON.stringify(prev));
      let arr: FinderFile[] = clone;
      for (const id of state.path) {
        const folder = arr.find(f => f.id === id && f.type === 'folder');
        if (!folder) return prev;
        arr = folder.children || (folder.children = []);
      }
      // Determine unique name
      let name = baseName;
      let counter = 2;
      const existing = new Set(arr.filter(f => f.type === 'folder').map(f => f.name));
      while (existing.has(name)) {
        name = baseName + ' ' + counter++;
      }
      newId = 'folder-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      newName = name;
      arr.push({ id: newId, name, type: 'folder', modified: new Date().toISOString(), children: [] });
      return clone;
    });
    // Enter rename mode & select it
    setState(s => ({ ...s, selected: newId, selectedIds: [newId] }));
    setRenamingId(newId);
    setRenameDraft(newName);
  };

  const finalizeRename = () => {
    if (!renamingId) return;
    const nextName = renameDraft.trim();
    if (!nextName) { setRenamingId(null); return; }
    setFileTree(prev => {
      const clone: FinderFile[] = JSON.parse(JSON.stringify(prev));
      const update = (arr: FinderFile[]) => {
        for (const f of arr) {
          if (f.id === renamingId) { f.name = nextName; return true; }
          if (f.type === 'folder' && f.children && update(f.children)) return true;
        }
        return false;
      };
      update(clone);
      return clone;
    });
    setRenamingId(null);
  };

  // Ensure the file list container is focusable for keyboard navigation
  useEffect(() => {
    if (listContainerRef.current && typeof listContainerRef.current.focus === 'function') {
      // Delay to ensure mounted
      setTimeout(() => listContainerRef.current?.focus?.(), 0);
    }
  }, []);

  const selectSingle = (fileId: string | undefined, dataset: FinderFile[]) => {
    if (!fileId) return;
    const exists = dataset.find(f => f.id === fileId);
    if (!exists) return;
    setState(s => ({ ...s, selected: fileId, selectedIds: [fileId] }));
  };

  const handleArrowNav = (e: any) => {
    const key = e.key;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;
    // Avoid interfering while renaming (TextInput focused)
    if (renamingId) return;
    const listMode = state.view === 'list';
    const dataset = listMode ? treeFiles.map(t => t.file) : visibleFiles;
    if (!dataset.length) return;
    const currentId = state.selected || state.selectedIds?.[0];
    let idx = currentId ? dataset.findIndex(f => f.id === currentId) : -1;
    const shift = e.shiftKey;
    // Helper to commit selection
    const commit = (newIndex: number) => {
      if (newIndex < 0 || newIndex >= dataset.length) return;
      // If shift held, extend range
      if (shift) {
        let anchorId = lastAnchorRef.current || currentId || dataset[newIndex].id;
        if (!lastAnchorRef.current) lastAnchorRef.current = anchorId;
        const anchorIndex = dataset.findIndex(f => f.id === anchorId);
        if (anchorIndex === -1) return selectSingle(dataset[newIndex].id, dataset);
        const start = Math.min(anchorIndex, newIndex);
        const end = Math.max(anchorIndex, newIndex);
        const rangeIds = dataset.slice(start, end + 1).map(f => f.id);
        setState(s => ({ ...s, selected: dataset[newIndex].id, selectedIds: rangeIds }));
      } else {
        lastAnchorRef.current = dataset[newIndex].id;
        selectSingle(dataset[newIndex].id, dataset);
      }
    };
    if (key === 'ArrowDown') {
      e.preventDefault();
      if (idx === -1) commit(0); else commit(Math.min(dataset.length - 1, idx + 1));
      return;
    }
    if (key === 'ArrowUp') {
      e.preventDefault();
      if (idx === -1) commit(dataset.length - 1); else commit(Math.max(0, idx - 1));
      return;
    }
    // Folder expand / collapse only in list mode (tree)
    if (listMode && (key === 'ArrowLeft' || key === 'ArrowRight')) {
      if (idx === -1) return;
      const currentFile = dataset[idx];
      if (currentFile.type === 'folder') {
        if (key === 'ArrowRight') {
          // Expand if collapsed, else move to first child
          if (!expanded[currentFile.id]) {
            e.preventDefault();
            setExpanded(ex => ({ ...ex, [currentFile.id]: true }));
          } else {
            // Find first child in treeFiles after expansion (already expanded)
            const flat = treeFiles.map(t => t.file);
            const flatIdx = flat.findIndex(f => f.id === currentFile.id);
            if (flatIdx !== -1) {
              const next = flat[flatIdx + 1];
              if (next) {
                e.preventDefault();
                selectSingle(next.id, flat);
              }
            }
          }
        } else if (key === 'ArrowLeft') {
          if (expanded[currentFile.id]) {
            e.preventDefault();
            setExpanded(ex => ({ ...ex, [currentFile.id]: false }));
          } else {
            // Move selection to parent folder (previous item with smaller depth)
            const flatWithDepth = treeFiles; // {file, depth}
            const flatIdx = flatWithDepth.findIndex(n => n.file.id === currentFile.id);
            if (flatIdx !== -1) {
              const currentDepth = flatWithDepth[flatIdx].depth;
              for (let i = flatIdx - 1; i >= 0; i--) {
                if (flatWithDepth[i].depth < currentDepth) {
                  e.preventDefault();
                  selectSingle(flatWithDepth[i].file.id, flatWithDepth.map(n => n.file));
                  break;
                }
              }
            }
          }
        }
      } else {
        // Non-folder: left/right do nothing special for now
      }
    }
    if (!listMode && (key === 'ArrowLeft' || key === 'ArrowRight')) {
      // Grid horizontal navigation
      e.preventDefault();
      const itemWidth = 96 + 12; // tile width + gap heuristic
      // Attempt to read width from ref (fallback to 600)
      const containerWidth = (listContainerRef.current?.clientWidth) || 600;
      const cols = Math.max(1, Math.floor(containerWidth / itemWidth));
      if (key === 'ArrowRight') {
        if (idx === -1) commit(0); else commit(Math.min(dataset.length - 1, idx + 1));
      } else if (key === 'ArrowLeft') {
        if (idx === -1) commit(dataset.length - 1); else commit(Math.max(0, idx - 1));
      }
    }
  };

  return (
    <Card style={[S.window, { width: '100%', maxWidth: 1000, borderColor: colors.winBorder }]} shadow="lg">
      {/* Title Bar */}
      <View style={[S.titleBar, { backgroundColor: colors.titleBarBg, borderBottomColor: colors.titleBarBorder }]}>
        <Pressable
          onHoverIn={() => setControlsHover(true)}
          onHoverOut={() => setControlsHover(false)}
          style={{ flexDirection: 'row', gap: 6, marginRight: 12 }}
        >
          <View style={[S.trafficDot, { backgroundColor: '#ff5f56', alignItems: 'center', justifyContent: 'center' }]}>
            {controlsHover && <Text style={{ fontSize: 8, lineHeight: 8, color: '#4d0000', fontWeight: '600' }}>×</Text>}
          </View>
          <View style={[S.trafficDot, { backgroundColor: '#ffbd2e', alignItems: 'center', justifyContent: 'center' }]}>
            {controlsHover && <Text style={{ fontSize: 10, lineHeight: 10, color: '#5a3d00', fontWeight: '600', marginTop: -1 }}>−</Text>}
          </View>
          <View style={[S.trafficDot, { backgroundColor: '#27c93f', alignItems: 'center', justifyContent: 'center' }]}>
            {controlsHover && <Text style={{ fontSize: 10, lineHeight: 10, color: '#034d19', fontWeight: '600', marginTop: -1 }}>+</Text>}
          </View>
        </Pressable>
        {/* Title + proxy icon (appears on hover like macOS Finder) */}
        <Pressable
          onHoverIn={() => setTitleHover(true)}
          onHoverOut={() => setTitleHover(false)}
          disabled
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 2 }}
        >
          {titleHover && (
            <View style={{ opacity: 1 }}>
              <FolderIcon size={14} />
            </View>
          )}
          <Text weight="semibold" style={noSelect}>Finder</Text>
        </Pressable>
        <Flex direction="row" gap={8} style={{ marginLeft: 'auto' }} align="center">
          <Pressable
            onPress={createFolder}
            style={({ pressed }) => ({
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 6,
              backgroundColor: pressed ? colors.selectionPressed : colors.selection
            })}
          >
            <Text size="xs" weight="medium">New Folder</Text>
          </Pressable>
          <Search
            value={state.search}
            onChange={(search: string) => setState(s => ({ ...s, search }))}
            placeholder="Search"
            size="xs"
            debounce={120}
            style={{ width: 140, marginBottom: 0 }}
          />
          {/* View mode toggle */}
          <Flex direction="row" gap={4} align="center">
            <Pressable
              onPress={() => setState(s => ({ ...s, view: 'list' }))}
              style={({ pressed }) => ({
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 6,
                backgroundColor: state.view === 'list' ? colors.selection : pressed ? colors.selectionPressed : 'transparent'
              })}
            >
              <Flex direction="row" gap={4} align="center">
                <Icon name="table" size={14} color={state.view === 'list' ? 'primary' : 'gray'} />
                <Text size="xs" color={state.view === 'list' ? 'primary' : 'muted'}>List</Text>
              </Flex>
            </Pressable>
            <Pressable
              onPress={() => setState(s => ({ ...s, view: 'grid' }))}
              style={({ pressed }) => ({
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 6,
                backgroundColor: state.view === 'grid' ? colors.selection : pressed ? colors.selectionPressed : 'transparent'
              })}
            >
              <Flex direction="row" gap={4} align="center">
                <Icon name="grid" size={14} color={state.view === 'grid' ? 'primary' : 'gray'} />
                <Text size="xs" color={state.view === 'grid' ? 'primary' : 'muted'}>Icons</Text>
              </Flex>
            </Pressable>
          </Flex>
          <Switch
            size="sm"
            checked={state.showPreview}
            onChange={val => setState(s => ({ ...s, showPreview: val }))}
          />
          <Text size="xs" color="muted">Preview</Text>
        </Flex>
      </View>
      {/* Layout */}
      <View style={[S.layout, { backgroundColor: colors.windowBg }]}>
        {/* Sidebar */}
        <View style={[S.sidebar, { backgroundColor: colors.sidebarBg, borderRightColor: colors.sidebarBorder }]}>
          <Text style={[S.sidebarSectionTitle, { color: colors.textMuted }]}>
            FAVORITES
          </Text>
          {['All Files', 'Documents', 'Media'].map(label => (
            <Pressable key={label} onPress={() => {
              if (label === 'All Files') setState(s => ({ ...s, path: [] }));
              else if (label === 'Documents') setState(s => ({ ...s, path: ['docs'] }));
              else if (label === 'Media') setState(s => ({ ...s, path: ['media'] }));
            }} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 6, borderRadius: 6 })}>
              <Text size="sm" color={isDark ? 'gray' : undefined}>{label}</Text>
            </Pressable>
          ))}
          <Text style={[S.sidebarSectionTitle, { color: colors.textMuted }]}>TAGS</Text>
          <Flex direction="row" wrap="wrap" gap={6}>
            {['work', 'design', 'assets', 'docs'].map(t => (
              <Chip key={t} size="xs" variant="filled">{t}</Chip>
            ))}
          </Flex>
        </View>

        {/* Main Files Pane */}
        <View style={S.filePane}>
          {/* Breadcrumb */}
          <View style={S.breadcrumb}>
            {crumbs.map((c, idx) => (
              <Flex key={c.id} direction="row" align="center" gap={4} style={noSelect}>
                <Pressable onPress={() => goToCrumb(c.id)} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                  <Text size="sm" weight={idx === crumbs.length - 1 ? 'semibold' : 'medium'} style={noSelect}>{c.name}</Text>
                </Pressable>
                {idx < crumbs.length - 1 && <Text size="sm" color="muted" style={noSelect}>/</Text>}
              </Flex>
            ))}
          </View>

          {/* File list */}
          <View
            ref={listContainerRef}
            // @ts-ignore - tabIndex/web only
            tabIndex={0}
            // @ts-ignore react-native-web key handler
            onKeyDown={handleArrowNav}
            // @ts-ignore web only
            focusable={true}
            style={[S.fileGrid, state.view === 'grid' && { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }]}
          >
            {state.view === 'list' && treeFiles.map(({ file, depth }, idx) => {
              const selected = state.selected === file.id;
              const multiSelected = state.selectedIds?.includes(file.id);
              const isFolder = file.type === 'folder';
              const icon: any = isFolder ? 'folder' : (FILE_ICONS[file.ext || ''] || 'code');
              // Drag indicators removed
              return (
                <View
                  key={file.id}
                  ref={el => { if (el) rowRefs.current[file.id] = el; }}
                  style={{ position: 'relative' }}
                >
                  <Pressable
                    onPress={(e) => {
                      const listForSelection = treeFiles.map(t => t.file);
                      const shiftKey = (e as any)?.nativeEvent?.shiftKey;
                      const metaKey = (e as any)?.nativeEvent?.metaKey || (e as any)?.nativeEvent?.ctrlKey;
                      if (isFolder) {
                        const now = Date.now();
                        const dbl = state.selected === file.id && lastPressRef.current.id === file.id && (now - lastPressRef.current.time) < 350;
                        if (dbl) {
                          enterFolder(file);
                          lastPressRef.current.time = 0; // reset
                        } else {
                          toggleSelect(file, idx, listForSelection, shiftKey, metaKey);
                          lastPressRef.current = { id: file.id, time: now };
                        }
                      } else {
                        toggleSelect(file, idx, listForSelection, shiftKey, metaKey);
                      }
                    }}
                    style={({ pressed }) => ([
                      S.fileRow,
                      {
                        // Increase indentation for nested folder depth
                        paddingLeft: 10 + depth * 20,
                        backgroundColor: (multiSelected || selected) ? colors.selectionRowBg : pressed ? colors.selectionPressed : 'transparent',
                        // Removed border to avoid layout shift on selection
                        borderWidth: 0,
                        borderColor: 'transparent',
                        outlineWidth: 0,
                        outlineColor: 'transparent'
                      }
                    ])}
                  >
                    {isFolder && (
                      <Pressable
                        onPress={(ev) => { ev.stopPropagation(); toggleExpand(file.id); }}
                        style={({ pressed }) => ({ padding: 2, marginRight: 2, opacity: pressed ? 0.6 : 1 })}
                      >
                        <Icon name={expanded[file.id] ? 'chevronDown' : 'chevronRight'} size={12} color="gray" />
                      </Pressable>
                    )}
                    {isFolder ? (
                      <FolderIcon size={16} />
                    ) : (
                      renderThumb(file, 20) || <Icon name={icon} size={16} color={'gray'} />
                    )}
                    {renamingId === file.id ? (
                      <TextInput
                        autoFocus
                        value={renameDraft}
                        onChangeText={setRenameDraft}
                        onBlur={finalizeRename}
                        onSubmitEditing={finalizeRename}
                        style={{
                          paddingVertical: 0,
                          paddingHorizontal: 4,
                          borderWidth: 1,
                          borderColor: colors.selectionPressed,
                          borderRadius: 4,
                          minWidth: 80,
                          fontSize: 12
                        }}
                      />
                    ) : (
                      <Text style={[S.fileName, noSelect]}>{file.name}</Text>
                    )}
                    {!isFolder && (
                      <Text size="xs" color="muted">{formatSize(file.size)}</Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
            {/* Drag overlay removed */}
            {state.view === 'grid' && visibleFiles.map((file, idx) => {
              const selected = state.selected === file.id;
              const multiSelected = state.selectedIds?.includes(file.id);
              const isFolder = file.type === 'folder';
              const icon: any = isFolder ? 'folder' : (FILE_ICONS[file.ext || ''] || 'code');
              // Drag indicators removed
              return (
                <Pressable
                  key={file.id}
                  ref={el => { if (el) rowRefs.current[file.id] = el; }}
                  onPress={(e) => {
                    const listForSelection = visibleFiles;
                    const shiftKey = (e as any)?.nativeEvent?.shiftKey;
                    const metaKey = (e as any)?.nativeEvent?.metaKey || (e as any)?.nativeEvent?.ctrlKey;
                    if (isFolder) {
                      const now = Date.now();
                      const dbl = state.selected === file.id && lastPressRef.current.id === file.id && (now - lastPressRef.current.time) < 350;
                      if (dbl) {
                        enterFolder(file);
                        lastPressRef.current.time = 0;
                      } else {
                        toggleSelect(file, idx, listForSelection, shiftKey, metaKey);
                        lastPressRef.current = { id: file.id, time: now };
                      }
                    } else {
                      toggleSelect(file, idx, listForSelection, shiftKey, metaKey);
                    }
                  }}
                  // Drag handlers removed
                  style={({ pressed }) => ([
                    {
                      width: 96,
                      padding: 8,
                      borderRadius: 8,
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: (multiSelected || selected) ? colors.selection : pressed ? colors.selectionPressed : 'transparent',
                      outlineWidth: 0,
                      outlineColor: 'transparent'
                    },
                    noSelect
                  ])}
                >
                  <View style={{
                    width: 56,
                    height: 48,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isFolder ? <FolderIcon size={28} /> : (
                      renderThumb(file, 48) || (
                        <View style={{ width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? theme.colors.gray[7] : theme.colors.gray[1] }}>
                          <Icon name={icon} size={20} color={'gray'} />
                        </View>
                      )
                    )}
                  </View>
                  {renamingId === file.id ? (
                    <TextInput
                      autoFocus
                      value={renameDraft}
                      onChangeText={setRenameDraft}
                      onBlur={finalizeRename}
                      onSubmitEditing={finalizeRename}
                      style={{
                        paddingVertical: 0,
                        paddingHorizontal: 4,
                        borderWidth: 1,
                        borderColor: colors.selectionPressed,
                        borderRadius: 4,
                        width: 80,
                        fontSize: 11,
                        textAlign: 'center'
                      }}
                    />
                  ) : (
                    <Text size="xs" style={[{ textAlign: 'center', maxWidth: 80 }, noSelect]}>
                      {file.name}
                    </Text>
                  )}
                  {!isFolder && (
                    <Text size="xs" color="muted" style={noSelect}>{formatSize(file.size)}</Text>
                  )}
                </Pressable>
              );
            })}
            {visibleFiles.length === 0 && (
              <Text size="sm" color="muted">No items</Text>
            )}
          </View>
        </View>
        {/* Footer summary */}
        <View style={{ position: 'absolute', left: 0, right: state.showPreview ? 300 : 0, bottom: 0 }} pointerEvents="box-none">
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderTopWidth: 1, borderTopColor: colors.sidebarBorder, backgroundColor: colors.windowBg, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <Text size="xs" color="muted">{selectedInfo.count} selected</Text>
            <Text size="xs" color="muted">{selectedInfo.count ? formatSize(selectedInfo.total) : ''}</Text>
          </View>
        </View>

        {/* Preview Pane */}
        {state.showPreview && (
          <View style={[S.previewPane, { backgroundColor: colors.previewBg, borderLeftColor: colors.previewBorder }]}>
            {selectedFiles.length > 1 ? (
              <>
                <Text style={S.previewTitle}>{selectedFiles.length} items selected</Text>
                <Text size="xs" color="muted">Total Size: {formatSize(selectedInfo.total)}</Text>
                <View style={{ marginTop: 8, gap: 4 }}>
                  {selectedFiles.slice(0, 6).map(f => (
                    <Text key={f.id} size="xs" style={{ opacity: 0.85 }}>
                      {f.name}{f.type === 'folder' ? '/' : ''}
                    </Text>
                  ))}
                  {selectedFiles.length > 6 && (
                    <Text size="xs" color="muted">+ {selectedFiles.length - 6} more…</Text>
                  )}
                </View>
              </>
            ) : effectiveSelectedFile ? (
              <>
                <Text style={S.previewTitle}>{effectiveSelectedFile.name}</Text>
                <Text size="xs" color="muted">{effectiveSelectedFile.type === 'folder' ? 'Folder' : (effectiveSelectedFile.ext?.toUpperCase() + ' File')}</Text>
                {effectiveSelectedFile.size && <Text size="xs" color="muted">{formatSize(effectiveSelectedFile.size)}</Text>}
                {effectiveSelectedFile.modified && <Text size="xs" color="muted">Modified {new Date(effectiveSelectedFile.modified).toLocaleString()}</Text>}
                {effectiveSelectedFile.type === 'folder' && (
                  <Text size="xs" color="muted" style={{ marginTop: 8 }}>
                    {effectiveSelectedFile.children?.length || 0} item(s)
                  </Text>
                )}
                {effectiveSelectedFile.type === 'file' && (
                  <PreviewFile file={effectiveSelectedFile} style={{ marginTop: 12 }} />
                )}
              </>
            ) : (
              state.selectedIds && state.selectedIds.length > 0 ? (
                <Text size="sm" color="muted">Item not visible (filtered). Clear or adjust search to view details.</Text>
              ) : (
                <Text size="sm" color="muted">Select a file to preview</Text>
              )
            )}
          </View>
        )}
      </View>
    </Card>
  );
}
