#!/usr/bin/env ts-node
/**
 * Basic validation for generated demo metadata.
 * Ensures uniqueness, required fields, and simple ordering constraints.
 */
import fs from 'fs';
import path from 'path';

// Optional zod import for component meta validation
let z: any; try { z = require('zod'); } catch { z = null; }

const ComponentMetaSchema = z?.object?.({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string().optional(),
  since: z.string().optional(),
  category: z.string().optional(),
}) || { safeParse: () => ({ success: true }) };

interface DemoMeta { id: string; component: string; demo: string; title: string; order: number; hidden?: boolean; }

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'docs', 'data', 'generated');
const FILE = path.join(OUTPUT_DIR, 'demos.json');

function fail(msg: string): never { console.error(`✖ ${msg}`); process.exit(1); }

function main() {
  if (!fs.existsSync(FILE)) fail('demos.json not found. Run generate-demos first.');
  const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const demos: DemoMeta[] = Array.isArray(raw) ? raw : raw.demos || [];
  const componentsMeta = raw.components || {};
  const seen = new Set<string>();
  for (const d of demos) {
    if (!d.id || !d.component || !d.demo || !d.title) fail(`Missing required fields on ${d.id || JSON.stringify(d)}`);
    if (seen.has(d.id)) fail(`Duplicate id detected: ${d.id}`);
    seen.add(d.id);
    if (!/^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.test(d.id)) fail(`Invalid id format: ${d.id}`);
    if (typeof d.order !== 'number') fail(`Order must be number: ${d.id}`);
  }
  // Validate component meta if zod available
  if (z) {
    for (const [comp, meta] of Object.entries(componentsMeta)) {
      const r = ComponentMetaSchema.safeParse(meta);
      if (!r.success) fail(`Component meta invalid for ${comp}`);
    }
  }
  console.log(`✔ validate-demos: ${demos.length} demos OK (${Object.keys(componentsMeta).length} components meta)`);
}

main();
