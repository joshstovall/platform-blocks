#!/usr/bin/env ts-node
/**
 * Demo index generator (Phase 0)
 * Responsibilities:
 *   - Scan component demo directories: ui/src/components/<Component>/demo/*.tsx
 *   - Read optional paired markdown (.md) with YAML frontmatter for metadata
 *   - Emit generated artifacts to docs/data/generated/
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = path.resolve(__dirname, '..');
const UI_COMPONENTS_DIR = path.join(ROOT, 'ui', 'src', 'components');
const UI_HOOKS_DIR = path.join(ROOT, 'ui', 'src', 'hooks');
const CHARTS_COMPONENTS_DIR = path.join(ROOT, 'charts', 'src', 'components'); // charts components directory
const OUTPUT_DIR = path.join(ROOT, 'docs', 'data', 'generated');
const COMPONENT_MARKDOWN_DIR = path.join(OUTPUT_DIR, 'component-markdown');

interface DemoMeta {
  id: string; // Component.demoId
  component: string;
  demo: string; // short demo key (no component prefix)
  title: string;
  kind?: 'component' | 'chart' | 'hook';
  description?: string;
  localizedDescriptions?: Record<string, string>;
  tags: string[];
  category: string;
  order: number;
  status?: string;
  since?: string;
  hidden?: boolean;
  highlightLines?: (number | string)[];
  renderStyle?: 'auto' | 'center' | 'code_flex';
  codeCopy?: boolean; // show copy button
  codeLineNumbers?: boolean; // show line numbers
  codeSpoiler?: boolean; // wrap code in spoiler
  codeSpoilerMaxHeight?: number;
  showCodeToggle?: boolean; // show/hide toggle for code block (default true)
  previewCenter?: boolean; // center preview region regardless of layout
  codeFirst?: boolean; // if true show code before preview
  code?: string; // raw source when inlined (hooks, playgrounds)
  importPath?: string; // source module path reference
}

interface CodeEntry { code: string; hash: string; importPath: string; }

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function sha256(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function parseStructuredValue(rawValue: string): any {
  const value = rawValue.trim();
  const looksJson = (value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}'));
  if (!looksJson) return rawValue;
  try {
    return JSON.parse(value);
  } catch {
    if (value.startsWith('[') && value.endsWith(']')) {
      return value
        .slice(1, -1)
        .split(',')
        .map((token) => token.trim())
        .filter(Boolean);
    }
    return rawValue;
  }
}

function parseFrontmatter(raw: string): { frontmatter: any; body: string } {
  if (!raw.startsWith('---')) return { frontmatter: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { frontmatter: {}, body: raw };
  const fmBlock = raw.substring(3, end).trim();
  const body = raw.substring(end + 4).replace(/^\n/, '');
  const frontmatter: any = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value: any = m[2];
    if (typeof value === 'string') {
      value = value.replace(/\s+\/\/.*$/, '').replace(/\s+#.*$/, '').trim();
    }
    if (typeof value === 'string' && ((value.startsWith('[') && value.endsWith(']')) || (value.startsWith('{') && value.endsWith('}')))) {
      const structured = parseStructuredValue(value);
      if (structured !== value) {
        value = structured;
      }
    }
    if (typeof value === 'string' && /^\d+$/.test(value)) value = parseInt(value, 10);
    if (value === 'true') value = true; else if (value === 'false') value = false;
    frontmatter[key] = value;
  }
  return { frontmatter, body };
}

interface ComponentMetaRecord {
  [component: string]: any;
}

interface HookMetaRecord {
  [hook: string]: any;
}

type PlaygroundMetaConfig = {
  id: string;
  label?: string;
  description?: string;
};

function parseHighlight(val: any): (number | string)[] | undefined {
  if (!val) return undefined;
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return undefined;
}

function normalizePlaygroundMeta(value: any, componentName: string): PlaygroundMetaConfig | undefined {
  if (!value) return undefined;
  if (value === true) {
    return { id: componentName };
  }
  if (typeof value === 'string') {
    return { id: value };
  }
  if (typeof value === 'object') {
    const id = typeof value.id === 'string' && value.id.trim() ? value.id.trim() : componentName;
    const label = typeof value.label === 'string' ? value.label : undefined;
    const description = typeof value.description === 'string' ? value.description : undefined;
    return { id, label, description };
  }
  return undefined;
}

function collectDemos() {
  const demos: DemoMeta[] = [];
  const codeByComponent: Record<string, Record<string, CodeEntry>> = {};
  const componentMeta: ComponentMetaRecord = {};
  // Track source directory per component so props extraction works across multiple roots
  const componentSourceDir: Record<string, string> = {};

  const components = fs.readdirSync(UI_COMPONENTS_DIR).filter(f => fs.statSync(path.join(UI_COMPONENTS_DIR, f)).isDirectory());

  for (const comp of components) {
    componentSourceDir[comp] = path.join(UI_COMPONENTS_DIR, comp);
    const demoDir = path.join(UI_COMPONENTS_DIR, comp, 'demos');
    const metaDir = path.join(UI_COMPONENTS_DIR, comp, 'meta');
    if (!fs.existsSync(demoDir)) continue;

    const entries = fs.readdirSync(demoDir);

    // New canonical metadata location: meta/component.md
    const canonicalMetaMd = path.join(metaDir, 'component.md');
    if (fs.existsSync(canonicalMetaMd)) {
      try {
        const raw = fs.readFileSync(canonicalMetaMd, 'utf8');
        const { frontmatter, body } = parseFrontmatter(raw);
        const fm = { ...(frontmatter || {}) } as any;
        const { playground: playgroundRaw, ...restFm } = fm;
        const desc = (body || '').trim() || (typeof fm.description === 'string' ? fm.description : '');
        const name = typeof fm.name === 'string' && fm.name.trim() ? fm.name : comp;
        const title = typeof fm.title === 'string' && fm.title.trim() ? fm.title : comp;
        const playgroundMeta = normalizePlaygroundMeta(playgroundRaw, comp);
        const metaEntry: Record<string, any> = { ...restFm, name, title, description: desc || `${comp} component` };
        if (playgroundMeta) metaEntry.playground = playgroundMeta;
        componentMeta[comp] = metaEntry;
      } catch {
        console.warn(`[generate-demos] Failed to parse metadata for ${comp}`);
      }
    } else {
      console.warn(`[generate-demos] Missing canonical meta/component.md for ${comp}`);
    }
    const tsxFiles = entries.filter(f => f.endsWith('.tsx'));
    const subfolders = entries.filter(f => fs.existsSync(path.join(demoDir, f)) && fs.statSync(path.join(demoDir, f)).isDirectory());

    codeByComponent[comp] = codeByComponent[comp] || {};

    // 1. New structure: each subfolder is a demo (expects index.tsx, optional description.md, metadata.ts)
    for (const folder of subfolders) {
      const indexPath = path.join(demoDir, folder, 'index.tsx');
      if (!fs.existsSync(indexPath)) continue; // skip non-demo folders
      const raw = fs.readFileSync(indexPath, 'utf8');

      // Attempt to extract exported code snippet if defined as export const code = `...`;
      let codeSnippet = raw;
      const codeMatch = raw.match(/export const code\s*=\s*`([\s\S]*?)`;/);
      if (codeMatch) {
        codeSnippet = codeMatch[1];
      }
      const codeHash = sha256(codeSnippet);
      const id = `${comp}.${folder}`;
      const relImport = `../../../ui/src/components/${comp}/demos/${folder}`;
      codeByComponent[comp][id] = { code: codeSnippet, hash: codeHash, importPath: relImport };

      // Metadata precedence: metadata.ts -> frontmatter in description.md -> defaults
      let meta: any = {};
      const metadataTs = path.join(demoDir, folder, 'metadata.ts');
      if (fs.existsSync(metadataTs)) {
        // Naive parse: look for export const <folder> = { ... } capturing JSON-ish body
        const metaRaw = fs.readFileSync(metadataTs, 'utf8');
        const m = metaRaw.match(new RegExp(`export const ${folder}[^=]*=\\s*({[\\s\\S]*?});`));
        if (m) {
          try {
            // Transform to valid JSON: remove trailing commas and unquoted keys (simple heuristic)
            const jsonish = m[1]
              .replace(/:(\s*)(true|false)/g, ':$1$2')
              .replace(/:(\s*)([A-Za-z0-9_]+)([,\n])/g, ':$1"$2"$3');
            meta = {}; // fallback keep empty; proper evaluation intentionally avoided (no eval)
          } catch { }
        }
      }
      const descPath = path.join(demoDir, folder, 'description.md');
      let mdDesc = '';
      // Collect localized descriptions pattern: description.<locale>.md
      const localizedDescriptions: Record<string, string> = {};
      try {
        const localeFiles = fs.readdirSync(path.join(demoDir, folder)).filter(f => /^description\.[a-zA-Z-]+\.md$/.test(f));
        for (const lf of localeFiles) {
          const rawLocale = fs.readFileSync(path.join(demoDir, folder, lf), 'utf8');
          const { body } = parseFrontmatter(rawLocale);
          const locale = lf.split('.')[1];
          localizedDescriptions[locale] = body.trim();
        }
      } catch { }
      if (fs.existsSync(descPath)) {
        const mdRaw = fs.readFileSync(descPath, 'utf8');
        const { frontmatter, body } = parseFrontmatter(mdRaw);
        meta = { ...frontmatter, ...meta }; // frontmatter overrides parsed metadata
        mdDesc = body.trim();
      }
      const short = folder;
      const title = meta.title || short.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      demos.push({
        id,
        component: comp,
        demo: short,
        title,
        description: meta.description || mdDesc.split('\n').find(l => l.trim()) || '',
        localizedDescriptions: Object.keys(localizedDescriptions).length ? localizedDescriptions : undefined,
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        category: meta.category || 'general',
        order: typeof meta.order === 'number' ? meta.order : 100,
        status: meta.status,
        since: meta.since,
        hidden: meta.hidden === true,
        highlightLines: parseHighlight(meta.highlightLines),
        renderStyle: ['center', 'code_flex', 'auto'].includes(meta.renderStyle) ? meta.renderStyle : undefined,
        codeCopy: meta.codeCopy === true || meta.codeCopy === false ? meta.codeCopy : undefined,
        codeLineNumbers: meta.codeLineNumbers === true || meta.codeLineNumbers === false ? meta.codeLineNumbers : undefined,
        codeSpoiler: meta.codeSpoiler === true,
        codeSpoilerMaxHeight: typeof meta.codeSpoilerMaxHeight === 'number' ? meta.codeSpoilerMaxHeight : undefined,
        showCodeToggle: meta.showCodeToggle === false ? false : undefined,
        previewCenter: meta.previewCenter === true ? true : undefined,
        codeFirst: meta.codeFirst === true ? true : undefined
      });
    }

    // 2. Legacy flat .tsx files (kept for incremental migration)
    for (const file of tsxFiles) {
      if (file === 'index.ts' || file === 'index.tsx') continue; // ignore aggregator
      const baseName = file.replace(/\.tsx$/, '');
      const prefix = `${comp}.demo.`;
      let short = baseName.startsWith(prefix) ? baseName.slice(prefix.length) : baseName;
      short = short.replace(/\.+/g, '-');
      const id = `${comp}.${short}`;
      if (codeByComponent[comp][id]) continue; // skip if new structure already registered same id
      const tsxPath = path.join(demoDir, file);
      const raw = fs.readFileSync(tsxPath, 'utf8');
      const codeHash = sha256(raw);
      const relImport = `../../../ui/src/components/${comp}/demos/${baseName}`;
      codeByComponent[comp][id] = { code: raw, hash: codeHash, importPath: relImport };
      const mdPath = path.join(demoDir, `${baseName}.md`);
      let meta: any = {};
      let mdBody = '';
      const localizedDescriptions2: Record<string, string> = {};
      try {
        const localeFiles = fs.readdirSync(demoDir).filter(f => f.startsWith(baseName + '.description.') && f.endsWith('.md'));
        for (const lf of localeFiles) {
          const rawLoc = fs.readFileSync(path.join(demoDir, lf), 'utf8');
          const { body } = parseFrontmatter(rawLoc);
          const parts = lf.split('.');
          const locale = parts[parts.length - 2];
          localizedDescriptions2[locale] = body.trim();
        }
      } catch { }
      if (fs.existsSync(mdPath)) {
        const mdRaw = fs.readFileSync(mdPath, 'utf8');
        const { frontmatter, body } = parseFrontmatter(mdRaw);
        meta = frontmatter;
        mdBody = body.trim();
      }
      const title = meta.title || short.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      demos.push({
        id,
        component: comp,
        demo: short,
        title,
        description: meta.description || mdBody.split('\n').find(l => l.trim()) || '',
        localizedDescriptions: Object.keys(localizedDescriptions2).length ? localizedDescriptions2 : undefined,
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        category: meta.category || 'general',
        order: typeof meta.order === 'number' ? meta.order : 100,
        status: meta.status,
        since: meta.since,
        hidden: meta.hidden === true,
        highlightLines: parseHighlight(meta.highlightLines),
        renderStyle: ['center', 'code_flex', 'auto'].includes(meta.renderStyle) ? meta.renderStyle : undefined,
        showCodeToggle: true,
        codeCopy: meta.codeCopy === true || meta.codeCopy === false ? meta.codeCopy : undefined,
        codeLineNumbers: meta.codeLineNumbers === true || meta.codeLineNumbers === false ? meta.codeLineNumbers : undefined,
        codeSpoiler: meta.codeSpoiler === true,
        codeSpoilerMaxHeight: typeof meta.codeSpoilerMaxHeight === 'number' ? meta.codeSpoilerMaxHeight : undefined,
        // showCodeToggle: meta.showCodeToggle === false ? false : undefined,
        previewCenter: meta.previewCenter === true ? true : undefined,
        codeFirst: meta.codeFirst === true ? true : undefined
      });
    }
  }

  // Also collect from charts package if present
  if (fs.existsSync(CHARTS_COMPONENTS_DIR)) {
    const chartComponents = fs.readdirSync(CHARTS_COMPONENTS_DIR).filter(f => fs.statSync(path.join(CHARTS_COMPONENTS_DIR, f)).isDirectory());
    if (process.env.DEMOS_DEBUG) {
      console.log('[generate-demos][charts] Candidate component dirs:', chartComponents);
    }
    for (const comp of chartComponents) {
      componentSourceDir[comp] = path.join(CHARTS_COMPONENTS_DIR, comp);
      const demoDir = path.join(CHARTS_COMPONENTS_DIR, comp, 'demos');
      const metaDir = path.join(CHARTS_COMPONENTS_DIR, comp, 'meta');
      if (!fs.existsSync(demoDir)) continue; // skip if no demos

      const entries = fs.readdirSync(demoDir);
      const canonicalMetaMd = path.join(metaDir, 'component.md');
      if (fs.existsSync(canonicalMetaMd)) {
        try {
          const raw = fs.readFileSync(canonicalMetaMd, 'utf8');
          const { frontmatter, body } = parseFrontmatter(raw);
          const fm = { ...(frontmatter || {}) } as any;
          const { playground: playgroundRaw, ...restFm } = fm;
          const desc = (body || '').trim() || (typeof fm.description === 'string' ? fm.description : '');
          const name = typeof fm.name === 'string' && fm.name.trim() ? fm.name : comp;
          const title = typeof fm.title === 'string' && fm.title.trim() ? fm.title : comp;
          const category = fm.category || 'charts';
          const playgroundMeta = normalizePlaygroundMeta(playgroundRaw, comp);
          const metaEntry: Record<string, any> = { ...restFm, name, title, description: desc || `${comp} component`, category };
          if (playgroundMeta) metaEntry.playground = playgroundMeta;
          componentMeta[comp] = metaEntry;
        } catch {
          console.warn(`[generate-demos] Failed to parse metadata for chart ${comp}`);
        }
      } else {
        console.warn(`[generate-demos] Missing canonical meta/component.md for chart ${comp}`);
      }

      const tsxFiles = entries.filter(f => f.endsWith('.tsx'));
      const subfolders = entries.filter(f => fs.existsSync(path.join(demoDir, f)) && fs.statSync(path.join(demoDir, f)).isDirectory());
      codeByComponent[comp] = codeByComponent[comp] || {};

      // New structured demos
      for (const folder of subfolders) {
        const indexPath = path.join(demoDir, folder, 'index.tsx');
        if (!fs.existsSync(indexPath)) continue;
        const raw = fs.readFileSync(indexPath, 'utf8');
        if (process.env.DEMOS_DEBUG) {
          console.log(`[generate-demos][charts] Processing structured demo: ${comp}/${folder}`);
        }
        let codeSnippet = raw;
        const codeMatch = raw.match(/export const code\s*=\s*`([\s\S]*?)`;/);
        if (codeMatch) codeSnippet = codeMatch[1];
        const codeHash = sha256(codeSnippet);
        const id = `${comp}.${folder}`;
        const relImport = `../../../charts/src/components/${comp}/demos/${folder}`;
        codeByComponent[comp][id] = { code: codeSnippet, hash: codeHash, importPath: relImport };
        let meta: any = {};
        const descPath = path.join(demoDir, folder, 'description.md');
        let mdDesc = '';
        if (fs.existsSync(descPath)) {
          const mdRaw = fs.readFileSync(descPath, 'utf8');
          const { frontmatter, body } = parseFrontmatter(mdRaw);
          meta = { ...frontmatter };
          mdDesc = body.trim();
        }
        const short = folder;
        const title = meta.title || short.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        demos.push({
          id,
          component: comp,
          demo: short,
          title,
          description: meta.description || mdDesc.split('\n').find(l => l.trim()) || '',
          localizedDescriptions: undefined,
          tags: Array.isArray(meta.tags) ? meta.tags : [],
          category: meta.category || 'charts',
          order: typeof meta.order === 'number' ? meta.order : 100,
          status: meta.status,
          since: meta.since,
          hidden: meta.hidden === true,
          highlightLines: parseHighlight(meta.highlightLines),
          renderStyle: ['center', 'code_flex', 'auto'].includes(meta.renderStyle) ? meta.renderStyle : undefined,
          codeCopy: meta.codeCopy === true || meta.codeCopy === false ? meta.codeCopy : undefined,
          codeLineNumbers: meta.codeLineNumbers === true || meta.codeLineNumbers === false ? meta.codeLineNumbers : undefined,
          codeSpoiler: meta.codeSpoiler === true,
          codeSpoilerMaxHeight: typeof meta.codeSpoilerMaxHeight === 'number' ? meta.codeSpoilerMaxHeight : undefined,
          showCodeToggle: meta.showCodeToggle === false ? false : undefined,
          previewCenter: meta.previewCenter === true ? true : undefined,
          codeFirst: meta.codeFirst === true ? true : undefined
        });
      }

      // Legacy flat .tsx demo files
      for (const file of tsxFiles) {
        if (file === 'index.ts' || file === 'index.tsx') continue;
        const baseName = file.replace(/\.tsx$/, '');
        const prefix = `${comp}.demo.`;
        let short = baseName.startsWith(prefix) ? baseName.slice(prefix.length) : baseName;
        short = short.replace(/\.+/g, '-');
        const id = `${comp}.${short}`;
        if (codeByComponent[comp][id]) continue;
        const tsxPath = path.join(demoDir, file);
        const raw = fs.readFileSync(tsxPath, 'utf8');
        if (process.env.DEMOS_DEBUG) {
          console.log(`[generate-demos][charts] Processing legacy demo file: ${comp}/${file}`);
        }
        const codeHash = sha256(raw);
        const relImport = `../../../charts/src/components/${comp}/demos/${baseName}`;
        codeByComponent[comp][id] = { code: raw, hash: codeHash, importPath: relImport };
        const mdPath = path.join(demoDir, `${baseName}.md`);
        let meta: any = {};
        let mdBody = '';
        if (fs.existsSync(mdPath)) {
          const mdRaw = fs.readFileSync(mdPath, 'utf8');
          const { frontmatter, body } = parseFrontmatter(mdRaw);
          meta = frontmatter;
          mdBody = body.trim();
        }
        const title = meta.title || short.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        demos.push({
          id,
          component: comp,
          demo: short,
          title,
          description: meta.description || mdBody.split('\n').find(l => l.trim()) || '',
          localizedDescriptions: undefined,
          tags: Array.isArray(meta.tags) ? meta.tags : [],
          category: meta.category || 'charts',
          order: typeof meta.order === 'number' ? meta.order : 100,
          status: meta.status,
          since: meta.since,
          hidden: meta.hidden === true,
          highlightLines: parseHighlight(meta.highlightLines),
          renderStyle: ['center', 'code_flex', 'auto'].includes(meta.renderStyle) ? meta.renderStyle : undefined,
          codeCopy: meta.codeCopy === true || meta.codeCopy === false ? meta.codeCopy : undefined,
          codeLineNumbers: meta.codeLineNumbers === true || meta.codeLineNumbers === false ? meta.codeLineNumbers : undefined,
          codeSpoiler: meta.codeSpoiler || true,
          codeSpoilerMaxHeight: typeof meta.codeSpoilerMaxHeight === 'number' ? meta.codeSpoilerMaxHeight : undefined,
          showCodeToggle: meta.showCodeToggle === false ? false : undefined,
          previewCenter: meta.previewCenter === true ? true : undefined,
          codeFirst: meta.codeFirst === true ? true : undefined
        });
      }
    }
  }

  if (process.env.DEMOS_DEBUG) {
    const chartDemos = demos.filter(d => d.component === 'LineChart' || d.component === 'AreaChart').map(d => d.id);
    console.log('[generate-demos][charts] Final collected chart demo IDs:', chartDemos);
  }

  // Extract simple props metadata per component (heuristic)
  const propsMeta: Record<string, any[]> = {};
  const warningCounts: Record<string, number> = {};
  const componentWarnings: Record<string, Record<string, number>> = {};
  const addWarning = (type: string, comp?: string) => {
    warningCounts[type] = (warningCounts[type] || 0) + 1;
    if (comp) {
      componentWarnings[comp] = componentWarnings[comp] || {};
      componentWarnings[comp][type] = (componentWarnings[comp][type] || 0) + 1;
    }
  };
  for (const comp of Object.keys(componentMeta)) {
    const compDir = componentSourceDir[comp] || path.join(UI_COMPONENTS_DIR, comp);
    const candidateFiles = [
      path.join(compDir, `${comp}.tsx`),
      path.join(compDir, 'index.tsx'),
      path.join(compDir, `${comp}.ts`),
      path.join(compDir, 'index.ts'),
      path.join(compDir, 'types.ts'), // component-local types
      // For charts, also fallback to shared root types file so interfaces like HeatmapChartProps are discovered.
      /charts\/src\//.test(compDir.replace(/\\/g, '/')) ? path.join(ROOT, 'charts', 'src', 'types.ts') : ''
    ].filter(f => f && fs.existsSync(f));
    if (!candidateFiles.length) continue;

    let collected: any[] = [];
    const dedupe = new Set<string>();
    function extractPropsShape(name: string, source: string): { body: string | null } {
      const iface = new RegExp(`(?:export\\s+)?interface\\s+${name}Props(?:\\s+extends[^{]+)?\\s*{`, 'm');
      const typeAlias = new RegExp(`(?:export\\s+)?type\\s+${name}Props\\s*=\\s*{`, 'm');
      let m = iface.exec(source);
      if (!m) m = typeAlias.exec(source);
      if (!m) return { body: null };
      const startIdx = source.indexOf('{', m.index);
      if (startIdx === -1) return { body: null };
      let depth = 0;
      for (let i = startIdx; i < source.length; i++) {
        const ch = source[i];
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) return { body: source.substring(startIdx + 1, i) };
        }
      }
      addWarning('unbalanced-interface');
      return { body: null };
    }

    for (const file of candidateFiles) {
      const raw = fs.readFileSync(file, 'utf8');
      const extracted = extractPropsShape(comp, raw);
      if (!extracted.body) continue;
      const body = extracted.body;
      const lines = body.split(/\n/);
      let inJsDoc = false;
      let jsDocLines: string[] = [];
      let pendingLineComment: string | undefined;
      const flushJsDoc = () => {
        if (!jsDocLines.length) return { description: undefined, tags: '' };
        const content = jsDocLines.join('\n');
        const cleaned = jsDocLines
          .map(l => l.replace(/^\s*\* ?/, ''))
          .filter(l => !l.trim().startsWith('@'))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        jsDocLines = [];
        return { description: cleaned || undefined, tags: content };
      };
      for (let i = 0; i < lines.length; i++) {
        let original = lines[i];
        let line = original.trim();
        if (!line) continue;
        if (line.startsWith('/**')) {
          inJsDoc = true;
          jsDocLines.push(line.replace('/**', ''));
          if (line.includes('*/')) {
            inJsDoc = false;
            jsDocLines[jsDocLines.length - 1] = jsDocLines[jsDocLines.length - 1].replace('*/', '');
          }
          continue;
        }
        if (inJsDoc) {
          jsDocLines.push(line);
          if (line.includes('*/')) {
            inJsDoc = false;
            jsDocLines[jsDocLines.length - 1] = jsDocLines[jsDocLines.length - 1].replace('*/', '');
          }
          continue;
        }
        if (line.startsWith('//')) { pendingLineComment = line.replace(/^\/\//, '').trim() || pendingLineComment; continue; }
        const sigMatch = line.match(/^(readonly\s+)?([A-Za-z0-9_]+)\??:\s*(.+)$/);
        if (!sigMatch) continue;
        const name = sigMatch[2];
        if (dedupe.has(name)) { pendingLineComment = undefined; jsDocLines = []; continue; }
        let typePortion = sigMatch[3];
        while (!typePortion.includes(';') && i + 1 < lines.length && !lines[i + 1].trim().match(/^(readonly\s+)?[A-Za-z0-9_]+\??:/)) { i++; typePortion += ' ' + lines[i].trim(); }
        let trailingComment: string | undefined;
        const commentSplit = typePortion.split(/\/\/+/);
        if (commentSplit.length > 1) { trailingComment = commentSplit.slice(1).join('//').trim(); typePortion = commentSplit[0].trim(); }
        if (typePortion.endsWith(';')) typePortion = typePortion.slice(0, -1).trim();
        let defaultValue: string | undefined;
        const eqIdx = typePortion.indexOf('=');
        if (eqIdx !== -1) { const two = typePortion.substring(eqIdx, eqIdx + 2); if (two !== '=>') { defaultValue = typePortion.slice(eqIdx + 1).trim(); typePortion = typePortion.slice(0, eqIdx).trim(); } }
        const optional = sigMatch[0].includes(name + '?:');
        const { description: jsDesc, tags } = flushJsDoc();
        let description = jsDesc || pendingLineComment || trailingComment;
        let deprecated: boolean | undefined; let internal: boolean | undefined; let jsDefault: string | undefined;
        if (tags) {
          const tagLines = tags.split(/@/).slice(1).map(s => s.trim());
          for (const t of tagLines) {
            if (t.startsWith('deprecated')) deprecated = true;
            if (t.startsWith('internal')) internal = true;
            const defMatch = t.match(/^default\s+([^\n]*)/); if (defMatch) jsDefault = defMatch[1].trim();
          }
        }
        pendingLineComment = undefined;
        if (name) { collected.push({ name, type: typePortion, required: !optional, defaultValue: jsDefault || defaultValue, description, deprecated, internal }); dedupe.add(name); }
      }
      if (collected.length) break;
    }
    if (collected.length) {
      // Attempt to augment with default values from implementation destructuring
      try {
        const implFile = path.join(compDir, `${comp}.tsx`);
        if (fs.existsSync(implFile)) {
          const implRaw = fs.readFileSync(implFile, 'utf8');
          const destructureMatch = implRaw.match(/const\s+\{([\s\S]*?)\}\s*=\s*props\s*;/);
          if (destructureMatch) {
            // Collapse newlines inside destructure for simpler splitting while preserving spaces
            const blockRaw = destructureMatch[1];
            const block = blockRaw.replace(/\n+/g, ' ').replace(/\s+/g, ' ');
            const parts = block.split(',').map(p => p.trim()).filter(Boolean);
            const defaultsMap: Record<string, string> = {};
            for (let part of parts) {
              if (!part || part.startsWith('...')) continue;
              // Ignore rest or spread or direct renames with colon (alias)
              if (/^[A-Za-z0-9_]+\s*:/.test(part)) continue;
              const mDef = part.match(/^([A-Za-z0-9_]+)\s*=\s*(.+)$/);
              if (mDef) {
                const name = mDef[1];
                let defVal = mDef[2].trim();
                // Remove trailing comma if any (post split safety)
                defVal = defVal.replace(/,$/, '').trim();
                // Basic cleanup for objects/arrays/functions: keep concise preview
                if (defVal.length > 80) defVal = defVal.slice(0, 77) + '...';
                defaultsMap[name] = defVal;
              }
            }
            if (Object.keys(defaultsMap).length) {
              collected = collected.map(p => {
                if (p.defaultValue == null && defaultsMap[p.name] !== undefined) {
                  return { ...p, defaultValue: defaultsMap[p.name] };
                }
                return p;
              });
            }
          }
        }
      } catch {/* non-fatal */ }

      // Attempt defaults.ts object parse (preferred source) if exists
      try {
        const defaultsFile = path.join(compDir, 'defaults.ts');
        if (fs.existsSync(defaultsFile)) {
          const raw = fs.readFileSync(defaultsFile, 'utf8');
          // Look for export const SOMETHING_DEFAULTS = { ... } as const;
          const m = raw.match(/export const [A-Z0-9_]+DEFAULTS\s*=\s*({[\s\S]*?})\s*as const/);
          if (m) {
            const obj = m[1];
            const kvPairs = obj
              .replace(/\n/g, ' ')
              .replace(/\s+/g, ' ')
              .replace(/\/\/.*?$/gm, '')
              .match(/([A-Za-z0-9_]+)\s*:\s*([^,}]+)/g) || [];
            const map: Record<string, string> = {};
            for (const pair of kvPairs) {
              const pm = pair.match(/([A-Za-z0-9_]+)\s*:\s*([^,}]+)/);
              if (pm) map[pm[1]] = pm[2].trim();
            }
            if (Object.keys(map).length) {
              collected = collected.map(p => map[p.name] ? { ...p, defaultValue: map[p.name] } : p);
            }
          }
        }
      } catch { }

      if (collected.some(p => p.internal)) addWarning('internal-props', comp);
      // Post-process warnings: missing docs / ambiguous types
      for (const p of collected) {
        if (!p.description) addWarning('missing-doc', comp);
        if (!p.type || /\bany\b/.test(p.type)) addWarning('ambiguous-type', comp);
      }
      propsMeta[comp] = collected;
    }
  }

  return { demos, codeByComponent, componentMeta, propsMeta, warningCounts, componentWarnings };
}

function collectHooks() {
  const hooks: DemoMeta[] = [];
  const codeByHook: Record<string, Record<string, CodeEntry>> = {};
  const hookMeta: HookMetaRecord = {};

  if (!fs.existsSync(UI_HOOKS_DIR)) {
    return { hooks, codeByHook, hookMeta };
  }

  const hookDirs = fs.readdirSync(UI_HOOKS_DIR).filter(dir => {
    const full = path.join(UI_HOOKS_DIR, dir);
    return fs.statSync(full).isDirectory();
  });

  for (const hook of hookDirs) {
    const hookDir = path.join(UI_HOOKS_DIR, hook);
    const demosDir = path.join(hookDir, 'demos');
    const metaDir = path.join(hookDir, 'meta');

    if (!fs.existsSync(demosDir)) continue;

    const canonicalMetaMd = path.join(metaDir, 'hook.md');
    if (fs.existsSync(canonicalMetaMd)) {
      try {
        const raw = fs.readFileSync(canonicalMetaMd, 'utf8');
        const { frontmatter, body } = parseFrontmatter(raw);
        const fm = { ...(frontmatter || {}) } as any;
        const desc = (body || '').trim() || (typeof fm.description === 'string' ? fm.description : '');
        const name = typeof fm.name === 'string' && fm.name.trim() ? fm.name : hook;
        const title = typeof fm.title === 'string' && fm.title.trim() ? fm.title : hook;
        hookMeta[hook] = {
          ...fm,
          name,
          title,
          description: desc || `${hook} hook`
        };
      } catch {
        console.warn(`[generate-demos] Failed to parse hook metadata for ${hook}`);
      }
    } else {
      console.warn(`[generate-demos] Missing meta/hook.md for ${hook}`);
    }

    const entries = fs.readdirSync(demosDir);
    const subfolders = entries.filter(entry => {
      const full = path.join(demosDir, entry);
      return fs.existsSync(full) && fs.statSync(full).isDirectory();
    });

    codeByHook[hook] = codeByHook[hook] || {};

    for (const folder of subfolders) {
      const indexPath = path.join(demosDir, folder, 'index.tsx');
      if (!fs.existsSync(indexPath)) continue;

      const raw = fs.readFileSync(indexPath, 'utf8');
      let codeSnippet = raw;
      const codeMatch = raw.match(/export const code\s*=\s*`([\s\S]*?)`;/);
      if (codeMatch) codeSnippet = codeMatch[1];

      const codeHash = sha256(codeSnippet);
      const id = `${hook}.${folder}`;
      const relImport = `../../../ui/src/hooks/${hook}/demos/${folder}`;
      codeByHook[hook][id] = { code: codeSnippet, hash: codeHash, importPath: relImport };

      let meta: any = {};
      const descPath = path.join(demosDir, folder, 'description.md');
      let mdDesc = '';
      const localizedDescriptions: Record<string, string> = {};

      try {
        const localeFiles = fs
          .readdirSync(path.join(demosDir, folder))
          .filter(f => /^description\.[a-zA-Z-]+\.md$/.test(f));
        for (const lf of localeFiles) {
          const rawLocale = fs.readFileSync(path.join(demosDir, folder, lf), 'utf8');
          const { body } = parseFrontmatter(rawLocale);
          const locale = lf.split('.')[1];
          localizedDescriptions[locale] = body.trim();
        }
      } catch {/* ignore */}

      if (fs.existsSync(descPath)) {
        const mdRaw = fs.readFileSync(descPath, 'utf8');
        const { frontmatter, body } = parseFrontmatter(mdRaw);
        meta = { ...meta, ...frontmatter };
        mdDesc = body.trim();
      }

      const short = folder;
      const title = meta.title || short.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      hooks.push({
        id,
        component: hook,
        demo: short,
        title,
        kind: 'hook',
        description: meta.description || mdDesc.split('\n').find(l => l.trim()) || '',
        localizedDescriptions: Object.keys(localizedDescriptions).length ? localizedDescriptions : undefined,
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        category: meta.category || 'general',
        order: typeof meta.order === 'number' ? meta.order : 100,
        status: meta.status,
        since: meta.since,
        hidden: meta.hidden === true,
        highlightLines: parseHighlight(meta.highlightLines),
        renderStyle: ['center', 'code_flex', 'auto'].includes(meta.renderStyle) ? meta.renderStyle : undefined,
        codeCopy: meta.codeCopy === true || meta.codeCopy === false ? meta.codeCopy : undefined,
        codeLineNumbers: meta.codeLineNumbers === true || meta.codeLineNumbers === false ? meta.codeLineNumbers : undefined,
        codeSpoiler: meta.codeSpoiler === true,
        codeSpoilerMaxHeight: typeof meta.codeSpoilerMaxHeight === 'number' ? meta.codeSpoilerMaxHeight : undefined,
        showCodeToggle: meta.showCodeToggle === false ? false : undefined,
        previewCenter: meta.previewCenter === true ? true : undefined,
        codeFirst: meta.codeFirst === true ? true : undefined,
        code: codeSnippet,
        importPath: relImport
      });
    }
  }

  return { hooks, codeByHook, hookMeta };
}

function writeJsonPretty(file: string, data: any) {
  const content = JSON.stringify(data, null, 2) + '\n';
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return; // skip unchanged
  fs.writeFileSync(file, content, 'utf8');
}

function writeTextFile(file: string, data: string) {
  const content = data.endsWith('\n') ? data : `${data}\n`;
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return;
  fs.writeFileSync(file, content, 'utf8');
}

function withCodeBlock(code: string, language = 'tsx'): string {
  const cleaned = code.replace(/\r\n/g, '\n').trimEnd();
  return `
\`\`\`${language}
${cleaned}
\`\`\`
`.trim();
}

function sanitizeDemoCode(code: string): string {
  const normalized = code.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const filtered = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('import ')) return false;
    if (trimmed.startsWith('export ')) return false;
    return true;
  });
  return filtered.join('\n').trim();
}

function escapeTableCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
}

function compactParagraph(text?: string): string {
  if (!text) return '';
  return text
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatTagList(tags: unknown): string | null {
  if (!tags) return null;
  if (Array.isArray(tags)) {
    const normalized = tags
      .map(tag => (typeof tag === 'string' ? tag : String(tag ?? '')))
      .map(tag => tag.trim())
      .filter(Boolean);
    if (!normalized.length) return null;
    return normalized.join(', ');
  }
  if (tags instanceof Set) {
    return formatTagList(Array.from(tags));
  }
  if (typeof tags === 'string') {
    const trimmed = tags.trim();
    return trimmed || null;
  }
  return null;
}

function buildPropsTable(props: Array<Record<string, any>>): string {
  if (!props || props.length === 0) {
    return '_No documented props yet._';
  }
  const header = ['| Name | Type | Required | Default | Description |', '| --- | --- | --- | --- | --- |'];
  const rows = props.map(prop => {
    const name = `\`${prop.name}\``;
    const type = escapeTableCell(prop.type);
    const required = prop.required ? 'Yes' : 'No';
    const defaultValue = escapeTableCell(prop.defaultValue);
    const description = escapeTableCell(prop.description);
    return `| ${name} | ${type} | ${required} | ${defaultValue} | ${description} |`;
  });
  return [...header, ...rows].join('\n');
}

function formatDemoMarkdown(
  demo: DemoMeta,
  codeEntry: CodeEntry | undefined,
): string {
  const lines: string[] = [];
  lines.push(`### ${demo.title || demo.demo}`);
  const metaBits: string[] = [];
  metaBits.push(`ID: \`${demo.id}\``);
  const demoTags = formatTagList(demo.tags);
  if (demoTags) metaBits.push(`Tags: ${demoTags}`);
  if (demo.category) metaBits.push(`Category: ${demo.category}`);
  if (demo.status) metaBits.push(`Status: ${demo.status}`);
  if (demo.since) metaBits.push(`Since: ${demo.since}`);
  lines.push(metaBits.join(' • '));
  if (demo.description) {
    lines.push('');
    lines.push(compactParagraph(demo.description));
  }
  if (codeEntry?.code) {
    const sanitized = sanitizeDemoCode(codeEntry.code);
    if (sanitized) {
      lines.push('');
      lines.push(withCodeBlock(sanitized));
    }
  }
  return lines.join('\n');
}

function buildComponentMarkdown(
  name: string,
  meta: ComponentMetaRecord,
  propsMap: Record<string, any[]>,
  demosMap: Map<string, DemoMeta[]>,
  codeMap: Record<string, Record<string, CodeEntry>>,
): string {
  const componentMeta = meta[name] || {};
  const lines: string[] = [];
  const title = componentMeta.title || name;
  lines.push(`# ${title}`);
  if (componentMeta.description) {
    lines.push('');
    lines.push(compactParagraph(componentMeta.description));
  }

  const metaList: string[] = [];
  metaList.push(`- Canonical name: \`${name}\``);
  if (componentMeta.status) metaList.push(`- Status: ${componentMeta.status}`);
  if (componentMeta.since) metaList.push(`- Since: ${componentMeta.since}`);
  if (componentMeta.category) metaList.push(`- Category: ${componentMeta.category}`);
  const componentTags = formatTagList(componentMeta.tags);
  if (componentTags) metaList.push(`- Tags: ${componentTags}`);
  if (metaList.length) {
    lines.push('');
    lines.push('## Metadata');
    lines.push('');
    lines.push(...metaList);
  }

  lines.push('');
  lines.push('## Props');
  lines.push('');
  lines.push(buildPropsTable(propsMap[name] || []));

  const demos = (demosMap.get(name) || []).filter(d => !d.hidden);
  if (demos.length) {
    lines.push('');
    lines.push('## Examples');
    lines.push('');
    demos.forEach((demo, index) => {
      if (index > 0) lines.push('');
      const codeEntry = codeMap[name]?.[demo.id] || codeMap[name]?.[`${name}.${demo.demo}`] || codeMap[name]?.[`${demo.component}.${demo.demo}`];
      lines.push(formatDemoMarkdown(demo, codeEntry));
    });
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function generate() {
  ensureDir(OUTPUT_DIR);
  ensureDir(COMPONENT_MARKDOWN_DIR);
  const { demos, codeByComponent, componentMeta, propsMeta, warningCounts, componentWarnings } = collectDemos();
  const { hooks, codeByHook, hookMeta } = collectHooks();

  // Sort metadata
  demos.sort((a, b) => a.component.localeCompare(b.component) || a.order - b.order || a.title.localeCompare(b.title));
  hooks.sort((a, b) => a.component.localeCompare(b.component) || a.order - b.order || a.title.localeCompare(b.title));

  // Filter out hidden entities from metadata shards
  const visibleComponentMeta = Object.fromEntries(
    Object.entries(componentMeta).filter(([comp, meta]) => meta.hidden !== true)
  );
  const visibleHookMeta = Object.fromEntries(
    Object.entries(hookMeta).filter(([hook, meta]) => meta?.hidden !== true)
  );

  const demosByComponent = new Map<string, DemoMeta[]>();
  for (const demo of demos) {
    if (!demosByComponent.has(demo.component)) {
      demosByComponent.set(demo.component, []);
    }
    demosByComponent.get(demo.component)!.push(demo);
  }

  writeJsonPretty(path.join(OUTPUT_DIR, 'demos.json'), { demos, components: visibleComponentMeta });
  // Standalone component meta shard for global navigation/search facets
  writeJsonPretty(path.join(OUTPUT_DIR, 'components-meta.json'), visibleComponentMeta);
  // Regression safeguard: ensure no component lost >70% of props vs existing artifact
  const existingPropsPath = path.join(OUTPUT_DIR, 'components-props.json');
  if (fs.existsSync(existingPropsPath)) {
    try {
      const previous = JSON.parse(fs.readFileSync(existingPropsPath, 'utf8'));
      for (const comp of Object.keys(propsMeta)) {
        const prev = previous[comp];
        const curr = propsMeta[comp];
        if (Array.isArray(prev) && prev.length > 0 && curr && curr.length / prev.length < 0.3) {
          console.warn(`[generate-demos] WARNING: Prop extraction regression for ${comp} (prev ${prev.length} -> now ${curr.length}). Retaining previous set.`);
          propsMeta[comp] = prev; // retain previous to avoid data wipe
        }
      }
    } catch { }
  }
  writeJsonPretty(existingPropsPath, propsMeta);

  // Hooks metadata shards
  writeJsonPretty(path.join(OUTPUT_DIR, 'hooks.json'), { hooks });
  writeJsonPretty(path.join(OUTPUT_DIR, 'hooks-meta.json'), visibleHookMeta);

  // Write per-component code shards
  for (const comp of Object.keys(codeByComponent)) {
    const shardPath = path.join(OUTPUT_DIR, `demo-code-${comp}.json`);
    writeJsonPretty(shardPath, codeByComponent[comp]);
  }

  const componentNames = new Set<string>([
    ...Object.keys(componentMeta),
    ...Object.keys(propsMeta),
    ...Object.keys(codeByComponent),
    ...demos.map(d => d.component),
  ]);
  const sortedComponentNames = Array.from(componentNames).sort((a, b) => a.localeCompare(b));

  const markdownIndex: Record<string, string> = {};
  for (const name of sortedComponentNames) {
    if (visibleComponentMeta[name]?.hidden === true) continue;
    const markdown = buildComponentMarkdown(name, componentMeta, propsMeta, demosByComponent, codeByComponent);
    markdownIndex[name] = markdown;
    const filePath = path.join(COMPONENT_MARKDOWN_DIR, `${name}.md`);
    writeTextFile(filePath, markdown);
  }
  writeJsonPretty(path.join(OUTPUT_DIR, 'component-markdown.json'), markdownIndex);

  // Write per-hook code shards
  for (const hook of Object.keys(codeByHook)) {
    const shardPath = path.join(OUTPUT_DIR, `hook-code-${hook}.json`);
    writeJsonPretty(shardPath, codeByHook[hook]);
  }

  // Simple search index combining component and hook names, titles, and demo titles
  const searchEntries: any[] = [];
  for (const comp of Object.keys(componentMeta)) {
    const meta = componentMeta[comp] || {};
    if (meta.hidden === true) continue;

    searchEntries.push({
      id: `component:${comp}`,
      type: 'component',
      title: meta.title || comp,
      description: meta.description?.slice(0, 140) || '',
      category: meta.category || 'component',
      keywords: [comp, ...(meta.tags || [])]
    });
  }

  for (const hookName of Object.keys(hookMeta)) {
    const meta = hookMeta[hookName] || {};
    if (meta.hidden === true) continue;

    searchEntries.push({
      id: `hook:${hookName}`,
      type: 'hook',
      title: meta.title || hookName,
      description: meta.description?.slice(0, 140) || '',
      category: meta.category || 'hook',
      keywords: [hookName, ...(meta.tags || [])]
    });
  }

  for (const demo of demos) {
    searchEntries.push({
      id: `demo:${demo.id}`,
      type: 'demo',
      title: demo.title,
      description: (demo.description || '').slice(0, 140),
      category: demo.category || 'demo',
      keywords: [demo.component, ...(demo.tags || [])]
    });
  }

  for (const demo of hooks) {
    searchEntries.push({
      id: `hook-demo:${demo.id}`,
      type: 'hook-demo',
      title: demo.title,
      description: (demo.description || '').slice(0, 140),
      category: demo.category || 'hook-demo',
      keywords: [demo.component, ...(demo.tags || [])]
    });
  }
  writeJsonPretty(path.join(OUTPUT_DIR, 'search-new.json'), { entries: searchEntries });

  // Manifest placeholder (Phase 1 may replace path strategy)
  const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');
  const manifestLines: string[] = [];
  manifestLines.push('/* AUTO-GENERATED: demo-manifest */');
  manifestLines.push('// NOTE: This file is regenerated by scripts/generate-demos.ts – do not edit manually.');
  manifestLines.push('// Exports:');
  manifestLines.push('//   DEMO_MODULES: always present, async dynamic imports (code-split)');
  manifestLines.push('//   DEMO_STATIC: dev-only synchronous require map for instant demo rendering');
  manifestLines.push('');
  manifestLines.push('export const DEMO_MODULES = {');
  for (const comp of Object.keys(codeByComponent)) {
    for (const [id, entry] of Object.entries(codeByComponent[comp])) {
      manifestLines.push(`  '${id}': () => import('${entry.importPath}'),`);
    }
  }
  manifestLines.push('};');
  if (!isProd) {
    manifestLines.push('');
    manifestLines.push('// Dev eager map (omitted in production builds to keep bundle lean)');
    manifestLines.push('export const DEMO_STATIC = {');
    for (const comp of Object.keys(codeByComponent)) {
      for (const [id, entry] of Object.entries(codeByComponent[comp])) {
        manifestLines.push(`  '${id}': () => require('${entry.importPath}'),`);
      }
    }
    manifestLines.push('};');
  }
  const manifestPath = path.join(OUTPUT_DIR, 'demo-manifest.ts');
  const manifestContent = manifestLines.join('\n') + '\n';
  if (!fs.existsSync(manifestPath) || fs.readFileSync(manifestPath, 'utf8') !== manifestContent) {
    fs.writeFileSync(manifestPath, manifestContent, 'utf8');
  }

  // Hook manifest for demo components
  const hookManifestLines: string[] = [];
  hookManifestLines.push('/* AUTO-GENERATED: hook demo manifest */');
  hookManifestLines.push('// NOTE: This file is regenerated by scripts/generate-demos.ts – do not edit manually.');
  hookManifestLines.push('// Exports:');
  hookManifestLines.push('//   HOOK_DEMO_MODULES: async dynamic imports for hook demos');
  hookManifestLines.push('//   HOOK_DEMO_STATIC: dev-only synchronous require map');
  hookManifestLines.push('');
  hookManifestLines.push('export const HOOK_DEMO_MODULES = {');
  for (const hook of Object.keys(codeByHook)) {
    for (const [id, entry] of Object.entries(codeByHook[hook])) {
      hookManifestLines.push(`  '${id}': () => import('${entry.importPath}'),`);
    }
  }
  hookManifestLines.push('};');
  if (!isProd) {
    hookManifestLines.push('');
    hookManifestLines.push('// Dev eager map for hook demos (omitted in production)');
    hookManifestLines.push('export const HOOK_DEMO_STATIC = {');
    for (const hook of Object.keys(codeByHook)) {
      for (const [id, entry] of Object.entries(codeByHook[hook])) {
        hookManifestLines.push(`  '${id}': () => require('${entry.importPath}'),`);
      }
    }
    hookManifestLines.push('};');
  }
  const hookManifestPath = path.join(OUTPUT_DIR, 'hook-manifest.ts');
  const hookManifestContent = hookManifestLines.join('\n') + '\n';
  if (!fs.existsSync(hookManifestPath) || fs.readFileSync(hookManifestPath, 'utf8') !== hookManifestContent) {
    fs.writeFileSync(hookManifestPath, hookManifestContent, 'utf8');
  }

  // Generate code loader map for web bundling compatibility
  const codeLoaderLines: string[] = [];
  codeLoaderLines.push('/* AUTO-GENERATED: demo code loaders */');
  codeLoaderLines.push('// NOTE: This file is regenerated by scripts/generate-demos.ts – do not edit manually.');
  codeLoaderLines.push('// Static imports for demo code JSON files to avoid web bundling issues');
  codeLoaderLines.push('');
  codeLoaderLines.push('const DEMO_CODE_MAPS: Record<string, any> = {};');
  codeLoaderLines.push('');

  for (const comp of Object.keys(codeByComponent).sort()) {
    codeLoaderLines.push(`try { DEMO_CODE_MAPS.${comp} = require('../demo-code-${comp}.json'); } catch { /* ignore */ }`);
  }

  codeLoaderLines.push('');
  codeLoaderLines.push('export function loadCodeMap(component: string): Record<string, any> | null {');
  codeLoaderLines.push('  return DEMO_CODE_MAPS[component] || null;');
  codeLoaderLines.push('}');

  const codeLoaderPath = path.join(OUTPUT_DIR, 'demoCodeLoader.ts');
  const codeLoaderContent = codeLoaderLines.join('\n') + '\n';
  if (!fs.existsSync(codeLoaderPath) || fs.readFileSync(codeLoaderPath, 'utf8') !== codeLoaderContent) {
    fs.writeFileSync(codeLoaderPath, codeLoaderContent, 'utf8');
  }

  // Hook code loader map
  const hookCodeLoaderLines: string[] = [];
  hookCodeLoaderLines.push('/* AUTO-GENERATED: hook demo code loaders */');
  hookCodeLoaderLines.push('// NOTE: This file is regenerated by scripts/generate-demos.ts – do not edit manually.');
  hookCodeLoaderLines.push('// Static imports for hook demo code JSON files to avoid web bundling issues');
  hookCodeLoaderLines.push('');
  hookCodeLoaderLines.push('const HOOK_CODE_MAPS: Record<string, any> = {};');
  hookCodeLoaderLines.push('');

  for (const hook of Object.keys(codeByHook).sort()) {
    hookCodeLoaderLines.push(`try { HOOK_CODE_MAPS.${hook} = require('../hook-code-${hook}.json'); } catch { /* ignore */ }`);
  }

  hookCodeLoaderLines.push('');
  hookCodeLoaderLines.push('export function loadHookCodeMap(hook: string): Record<string, any> | null {');
  hookCodeLoaderLines.push('  return HOOK_CODE_MAPS[hook] || null;');
  hookCodeLoaderLines.push('}');

  const hookCodeLoaderPath = path.join(OUTPUT_DIR, 'hookCodeLoader.ts');
  const hookCodeLoaderContent = hookCodeLoaderLines.join('\n') + '\n';
  if (!fs.existsSync(hookCodeLoaderPath) || fs.readFileSync(hookCodeLoaderPath, 'utf8') !== hookCodeLoaderContent) {
    fs.writeFileSync(hookCodeLoaderPath, hookCodeLoaderContent, 'utf8');
  }

  const componentCount = Object.keys(codeByComponent).length;
  const hookCount = Object.keys(codeByHook).length;
  console.log(`[generate-demos] Indexed ${demos.length} component demos across ${componentCount} components and ${hooks.length} hook demos across ${hookCount} hooks.`);
  if (Object.keys(warningCounts).length) {
    console.log('[generate-demos] Warning summary:');
    for (const k of Object.keys(warningCounts)) console.log(`  - ${k}: ${warningCounts[k]}`);
  }
  // Persist warnings shard
  writeJsonPretty(path.join(OUTPUT_DIR, 'warnings.json'), { total: warningCounts, byComponent: componentWarnings });

  // Validation mode (fail build on certain warning types or regression)
  if (process.argv.includes('--validate')) {
    const failTypes = ['unbalanced-interface', 'ambiguous-type'];
    const fatal = failTypes.some(t => warningCounts[t] > 0);
    if (fatal) {
      console.error('[generate-demos] Validation failed due to fatal warnings.');
      process.exit(1);
    } else {
      console.log('[generate-demos] Validation passed.');
    }
  }
}

generate();
