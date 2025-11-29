// Loader for new generated demos system (demos.json, components-meta.json, demo-manifest.ts, demo-code-*.json)
// Falls back gracefully if artifacts are missing.

/* NOTE: This is intentionally light and runtime-only. We avoid static type imports
 * to keep the docs app resilient when generation hasn't been run yet.
 */

let demosIndex: any = null;
export interface PlaygroundMeta {
  id: string;
  label?: string;
  description?: string;
}

export interface ComponentMeta {
  name?: string;
  title?: string;
  description?: string;
  status?: string;
  since?: string;
  category?: string;
  tags?: string[];
  playground?: PlaygroundMeta;
  resources?: Array<{ label?: string; href: string }>;
  [key: string]: any;
}

let componentsMeta: Record<string, ComponentMeta> | null = null;
let componentsProps: any = null;
let componentMarkdown: Record<string, string> | null = null;
let searchIndexNew: any = null;

try { demosIndex = require('../data/generated/demos.json'); } catch { /* ignore */ }
try { componentsMeta = require('../data/generated/components-meta.json'); } catch { /* ignore */ }
try { componentsProps = require('../data/generated/components-props.json'); } catch { /* ignore */ }
try { componentMarkdown = require('../data/generated/component-markdown.json'); } catch { /* ignore */ }
try { searchIndexNew = require('../data/generated/search-new.json'); } catch { /* ignore */ }

// Dynamic import map for demo React components
let DEMO_MODULES: Record<string, () => Promise<any>> | null = null;
let DEMO_STATIC: Record<string, () => any> | null = null;
try { ({ DEMO_MODULES, DEMO_STATIC } = require('../data/generated/demo-manifest')); } catch { /* ignore */ }

// Cache of loaded code maps per component
const codeCache: Record<string, Record<string, any>> = {};

export interface NewDemo {
  id: string;              // short id e.g. "basic"
  fullId: string;          // full id e.g. "Accordion.basic"
  component: string;       // component name
  title: string;
  description?: string;
  localizedDescriptions?: Record<string, string>;
  category?: string;
  tags?: string[];
  order?: number;
  status?: string;
  since?: string;
  hidden?: boolean;
  highlightLines?: string[];
  code?: string;
  importPath?: string;
  renderStyle?: 'auto' | 'center' | 'code_flex';
  codeCopy?: boolean;
  codeLineNumbers?: boolean;
  codeSpoiler?: boolean;
  codeSpoilerMaxHeight?: number;
  showCodeToggle?: boolean; // controls visibility of show/hide code switch
  previewCenter?: boolean; // center preview area even if layout not 'center'
  codeFirst?: boolean; // reverse order: code before preview
}

export function hasNewDemosArtifacts(): boolean {
  return Boolean(demosIndex && componentsMeta);
}

export function getComponentMeta(name: string): ComponentMeta | null {
  if (!componentsMeta) return null;
  return componentsMeta[name] || null;
}

export function getComponentPlaygroundMeta(name: string): PlaygroundMeta | null {
  const meta = getComponentMeta(name);
  return meta?.playground || null;
}

export function getComponentProps(name: string): any[] {
  if (!componentsProps) return [];
  return componentsProps[name] || [];
}

export function getComponentMarkdown(name: string): string | null {
  if (!componentMarkdown) return null;
  return componentMarkdown[name] || null;
}

export function getNewDemos(component: string): NewDemo[] {
  if (!demosIndex) return [];
  const list = (demosIndex.demos || []).filter((d: any) => d.component === component && !d.hidden);
  return list.map((d: any) => ({
    id: d.demo,
    fullId: d.id,
    component: d.component,
    title: d.title || d.demo,
    description: d.description,
    localizedDescriptions: d.localizedDescriptions,
    category: d.category,
    tags: d.tags,
    order: d.order,
    status: d.status,
    since: d.since,
    hidden: d.hidden,
    highlightLines: d.highlightLines,
    renderStyle: d.renderStyle,
    code: d.code, // may be undefined, will be lazy-loaded later
    codeCopy: d.codeCopy,
    codeLineNumbers: d.codeLineNumbers,
    codeSpoiler: d.codeSpoiler,
    codeSpoilerMaxHeight: d.codeSpoilerMaxHeight,
    showCodeToggle: d.showCodeToggle,
    previewCenter: d.previewCenter,
    codeFirst: d.codeFirst,
    // code & importPath lazy injected later
  }));
}

// Static imports for demo code JSON files to avoid bundling issues
const DEMO_CODE_MAPS: Record<string, any> = {};

// Import all available demo code JSON files statically
try { DEMO_CODE_MAPS.Rating = require('../data/generated/demo-code-Rating.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Button = require('../data/generated/demo-code-Button.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Input = require('../data/generated/demo-code-Input.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Card = require('../data/generated/demo-code-Card.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Text = require('../data/generated/demo-code-Text.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Flex = require('../data/generated/demo-code-Flex.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Grid = require('../data/generated/demo-code-Grid.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Badge = require('../data/generated/demo-code-Badge.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Avatar = require('../data/generated/demo-code-Avatar.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Notice = require('../data/generated/demo-code-Notice.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Accordion = require('../data/generated/demo-code-Accordion.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.AppStoreButton = require('../data/generated/demo-code-AppStoreButton.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.AutoComplete = require('../data/generated/demo-code-AutoComplete.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.BrandButton = require('../data/generated/demo-code-BrandButton.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Breadcrumbs = require('../data/generated/demo-code-Breadcrumbs.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Carousel = require('../data/generated/demo-code-Carousel.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Checkbox = require('../data/generated/demo-code-Checkbox.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Chip = require('../data/generated/demo-code-Chip.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.CodeBlock = require('../data/generated/demo-code-CodeBlock.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.ColorPicker = require('../data/generated/demo-code-ColorPicker.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Container = require('../data/generated/demo-code-Container.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.CopyButton = require('../data/generated/demo-code-CopyButton.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.DataTable = require('../data/generated/demo-code-DataTable.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.DatePicker = require('../data/generated/demo-code-DatePicker.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Dialog = require('../data/generated/demo-code-Dialog.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Divider = require('../data/generated/demo-code-Divider.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.EmojiPicker = require('../data/generated/demo-code-EmojiPicker.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.FileInput = require('../data/generated/demo-code-FileInput.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Gallery = require('../data/generated/demo-code-Gallery.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.HoverCard = require('../data/generated/demo-code-HoverCard.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.KeyCap = require('../data/generated/demo-code-KeyCap.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Link = require('../data/generated/demo-code-Link.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Lottie = require('../data/generated/demo-code-Lottie.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Markdown = require('../data/generated/demo-code-Markdown.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Menu = require('../data/generated/demo-code-Menu.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.NavigationProgress = require('../data/generated/demo-code-NavigationProgress.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Pagination = require('../data/generated/demo-code-Pagination.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.PhoneInput = require('../data/generated/demo-code-PhoneInput.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.PinInput = require('../data/generated/demo-code-PinInput.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Progress = require('../data/generated/demo-code-Progress.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.QRCode = require('../data/generated/demo-code-QRCode.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Radio = require('../data/generated/demo-code-Radio.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.RichTextEditor = require('../data/generated/demo-code-RichTextEditor.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Search = require('../data/generated/demo-code-Search.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Select = require('../data/generated/demo-code-Select.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Skeleton = require('../data/generated/demo-code-Skeleton.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Slider = require('../data/generated/demo-code-Slider.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Loader = require('../data/generated/demo-code-Loader.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Spoiler = require('../data/generated/demo-code-Spoiler.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Spotlight = require('../data/generated/demo-code-Spotlight.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Stepper = require('../data/generated/demo-code-Stepper.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Switch = require('../data/generated/demo-code-Switch.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Table = require('../data/generated/demo-code-Table.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.TableOfContents = require('../data/generated/demo-code-TableOfContents.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Tabs = require('../data/generated/demo-code-Tabs.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.TextArea = require('../data/generated/demo-code-TextArea.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.TimePicker = require('../data/generated/demo-code-TimePicker.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Timeline = require('../data/generated/demo-code-Timeline.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Title = require('../data/generated/demo-code-Title.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Toast = require('../data/generated/demo-code-Toast.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Toggle = require('../data/generated/demo-code-Toggle.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Tooltip = require('../data/generated/demo-code-Tooltip.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Tree = require('../data/generated/demo-code-Tree.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.Waveform = require('../data/generated/demo-code-Waveform.json'); } catch { /* ignore */ }
// Charts components
try { DEMO_CODE_MAPS.AreaChart = require('../data/generated/demo-code-AreaChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.BarChart = require('../data/generated/demo-code-BarChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.BubbleChart = require('../data/generated/demo-code-BubbleChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.CandlestickChart = require('../data/generated/demo-code-CandlestickChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.ComboChart = require('../data/generated/demo-code-ComboChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.DonutChart = require('../data/generated/demo-code-DonutChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.FunnelChart = require('../data/generated/demo-code-FunnelChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.GroupedBarChart = require('../data/generated/demo-code-GroupedBarChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.HeatmapChart = require('../data/generated/demo-code-HeatmapChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.HistogramChart = require('../data/generated/demo-code-HistogramChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.LineChart = require('../data/generated/demo-code-LineChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.NetworkChart = require('../data/generated/demo-code-NetworkChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.PieChart = require('../data/generated/demo-code-PieChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.RadarChart = require('../data/generated/demo-code-RadarChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.RadialBarChart = require('../data/generated/demo-code-RadialBarChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.RidgeChart = require('../data/generated/demo-code-RidgeChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.SankeyChart = require('../data/generated/demo-code-SankeyChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.ScatterChart = require('../data/generated/demo-code-ScatterChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.SparklineChart = require('../data/generated/demo-code-SparklineChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.StackedAreaChart = require('../data/generated/demo-code-StackedAreaChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.StackedBarChart = require('../data/generated/demo-code-StackedBarChart.json'); } catch { /* ignore */ }
try { DEMO_CODE_MAPS.ViolinChart = require('../data/generated/demo-code-ViolinChart.json'); } catch { /* ignore */ }

function loadCodeMap(component: string): Record<string, any> | null {
  if (codeCache[component]) return codeCache[component];
  
  const codeMap = DEMO_CODE_MAPS[component];
  if (codeMap) {
    codeCache[component] = codeMap;
    return codeMap;
  }
  
  return null;
}

export function attachDemoCode(component: string, demos: NewDemo[]): NewDemo[] {
  const codeMap = loadCodeMap(component);
  if (!codeMap) return demos;
  return demos.map(d => {
    const entry = codeMap[`${component}.${d.id}`];
    if (entry) {
      return { ...d, code: entry.code, importPath: entry.importPath };
    }
    return d;
  });
}

// ---- New helpers for replacing legacy unified docs listing ----

export interface NewComponentIndexEntry {
  name: string;
  title: string;
  description?: string;
  category?: string;
  demoCount: number;
  hasDemos: boolean;
  playground?: PlaygroundMeta;
}

export function getAllNewComponents(): NewComponentIndexEntry[] {
  if (!componentsMeta) return [];
  return Object.keys(componentsMeta).map(name => {
    const meta = componentsMeta[name] || {};
    const demoCount = (demosIndex?.demos || []).filter((d: any) => d.component === name && !d.hidden).length;
    return {
      name,
      title: meta.title || name,
      description: meta.description,
      category: meta.category,
      demoCount,
      hasDemos: demoCount > 0,
      playground: meta.playground
    } as NewComponentIndexEntry;
  }).sort((a, b) => a.name.localeCompare(b.name));
}

export function getNewComponentIndex(name: string): NewComponentIndexEntry | null {
  return getAllNewComponents().find(c => c.name === name) || null;
}

export function getNewComponentDemos(name: string): NewDemo[] {
  return attachDemoCode(name, getNewDemos(name));
}

export interface NewSearchEntry { id: string; type: string; title: string; description?: string; category?: string; keywords?: string[] }

export function searchNewDocs(query: string): NewSearchEntry[] {
  if (!searchIndexNew || !query.trim()) return [];
  const lower = query.toLowerCase();
  return (searchIndexNew.entries as NewSearchEntry[]).filter(e => {
    const hay = [e.title, e.description || '', e.category || '', ...(e.keywords || [])].join(' ').toLowerCase();
    return hay.includes(lower);
  }).slice(0, 30);
}

export async function loadDemoComponentNew(component: string, demoId: string): Promise<any | null> {
  if (!DEMO_MODULES) return null;
  const key = `${component}.${demoId}`;
  // Dev eager path: use static require if present to avoid loader & network split
  if (typeof __DEV__ !== 'undefined' && __DEV__ && DEMO_STATIC && DEMO_STATIC[key]) {
    try {
      const mod = DEMO_STATIC[key]();
      const raw = mod?.default || mod?.Demo || null;
      const isValidFn = typeof raw === 'function';
      const isObjectComponent = raw && typeof raw === 'object' && ('$$typeof' in raw);
      if (!isValidFn && !isObjectComponent) return null;
      return raw;
    } catch (e) {
      console.warn('[demos] static require failed, falling back to dynamic', key, e);
    }
  }
  const loader = DEMO_MODULES[key];
  if (!loader) return null;
  try {
    const mod = await loader();
    const raw = mod?.default || mod?.Demo || null;
    // Validate that raw looks like a React component (function or forwardRef / memo result)
    const isValidFn = typeof raw === 'function';
    const isObjectComponent = raw && typeof raw === 'object' && ('$$typeof' in raw); // memo/forwardRef already invoked (should not usually happen)
    if (!isValidFn && !isObjectComponent) {
      console.warn('[demos] Invalid demo export shape', key, {
        typeofRaw: typeof raw,
        keys: raw && typeof raw === 'object' ? Object.keys(raw) : undefined,
      });
      return null;
    }
    return raw;
  } catch (e) {
    console.warn('Failed to load demo module', key, e);
    return null;
  }
}

export async function preloadAllComponentDemos(component: string): Promise<void> {
  if (!DEMO_MODULES) return;
  const demos = Object.keys(DEMO_MODULES).filter(k => k.startsWith(component + '.'));
  await Promise.all(demos.map(async k => { try { await DEMO_MODULES![k](); } catch { /* ignore */ } }));
}

