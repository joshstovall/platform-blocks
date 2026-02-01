import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type JSONObject = Record<string, unknown>;
type ComponentMeta = Record<string, JSONObject>;
type ComponentPropsMap = Record<string, Array<Record<string, any>>>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const uiDir = path.join(repoRoot, 'ui');
const docsDir = path.join(repoRoot, 'docs');
const generatedDir = path.join(docsDir, 'data', 'generated');
const publicDir = path.join(docsDir, 'public');
const outputPathTxt = path.join(publicDir, 'llms.txt');

const allowedDocExtensions = new Set(['.md', '.mdx', '.ts', '.tsx', '.json']);
const ignoredDirectories = new Set(['node_modules', '.expo', '.next', 'dist', 'build', 'lib', '.turbo', '.git', 'generated']);

// Set to false to generate full llms.txt without limits
const USE_LIMITS = true;

const MAX_LIST_ITEMS = 12;
const MAX_DEMO_ENTRIES = 2;
const MAX_PROP_ENTRIES = 12;
const MAX_DOC_FILES = 10;
const SUMMARY_CHAR_LIMIT = 240;

async function readTextIfExists(filePath: string): Promise<string | null> {
	try {
		const raw = await fs.readFile(filePath, 'utf8');
		return raw.replace(/\r\n/g, '\n');
	} catch {
		return null;
	}
}

async function readJSONIfExists<T = any>(filePath: string): Promise<T | null> {
	const raw = await readTextIfExists(filePath);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

function formatKeyValueBlock(title: string, record: Record<string, string> | undefined, limit: number = MAX_LIST_ITEMS): string | null {
	if (!record || Object.keys(record).length === 0) {
		return null;
	}
	const sorted = Object.entries(record).sort(([a], [b]) => a.localeCompare(b));
	const trimmed = USE_LIMITS ? sorted.slice(0, limit) : sorted;
	const lines = trimmed.map(([key, value]) => `- ${key}: ${value}`);
	if (USE_LIMITS && sorted.length > trimmed.length) {
		lines.push(`- … ${sorted.length - trimmed.length} more`);
	}
	return `### ${title}\n${lines.join('\n')}`;
}

function indentBlock(text: string, spaces = 2): string {
	const prefix = ' '.repeat(spaces);
	return text
		.split('\n')
		.map(line => (line.length ? `${prefix}${line}` : line))
		.join('\n');
}

async function collectFiles(baseDir: string, relativeRoot: string): Promise<Array<{ relative: string; content: string }>> {
	const collected: Array<{ relative: string; content: string }> = [];

	async function walk(currentDir: string) {
		let entries: Array<import('node:fs').Dirent> = [];
		try {
			entries = await fs.readdir(currentDir, { withFileTypes: true });
		} catch {
			return;
		}

		for (const entry of entries) {
			if (entry.name.startsWith('.')) continue;
			if (ignoredDirectories.has(entry.name)) continue;
			const fullPath = path.join(currentDir, entry.name);
			if (entry.isDirectory()) {
				await walk(fullPath);
				continue;
			}
			const ext = path.extname(entry.name).toLowerCase();
			if (!allowedDocExtensions.has(ext)) continue;
			const content = await readTextIfExists(fullPath);
			if (!content) continue;
			const relative = path.relative(relativeRoot, fullPath);
			collected.push({ relative, content });
		}
	}

	await walk(baseDir);
	collected.sort((a, b) => a.relative.localeCompare(b.relative));
	return collected;
}

function formatMetaSection(name: string, meta: JSONObject | undefined): string {
	if (!meta) {
		return `## Component: ${name}\n(No metadata available.)`;
	}

	const lines: string[] = [`## Component: <${name}>`];
	const basicFields: Array<[string, unknown]> = [
		// ['Title', meta.title],
		// ['Status', meta.status],
		// ['Since', meta.since],
		// ['Category', meta.category],
		// ['Subcategories', Array.isArray(meta.subcategories) ? (meta.subcategories as string[]).join(', ') : undefined],
		// ['Tags', Array.isArray(meta.tags) ? (meta.tags as string[]).join(', ') : undefined]
	];
	for (const [label, value] of basicFields) {
		if (value) {
			lines.push(`${label}: ${value}`);
		}
	}

	// if (meta.a11yKeyboard || meta.a11yRoles) {
	// 	lines.push('### Accessibility');
	// 	if (meta.a11yKeyboard) lines.push(`- Keyboard: ${meta.a11yKeyboard}`);
	// 	if (meta.a11yRoles) lines.push(`- Roles: ${meta.a11yRoles}`);
	// }

	// if (Array.isArray(meta.theming) && meta.theming.length) {
	// 	lines.push('### Theming Hooks');
	// 	lines.push(...(meta.theming as string[]).map(item => `- ${item}`));
	// }

	// if (meta.performanceNotes) {
	// 	lines.push('### Performance Notes');
	// 	lines.push(meta.performanceNotes as string);
	// }

	if (meta.description) {
		const rawDescription = String(meta.description);
		const primaryParagraph = rawDescription.split(/\n\n+/)[0]?.trim() ?? rawDescription.trim();
		const snippet = USE_LIMITS && primaryParagraph.length > SUMMARY_CHAR_LIMIT
			? `${primaryParagraph.slice(0, SUMMARY_CHAR_LIMIT - 1)}…`
			: primaryParagraph;
		// lines.push('### Description');
		lines.push(snippet);
	}

	return lines.join('\n');
}

function formatPropsSection(props: Array<Record<string, any>>): string | null {
	if (!props || props.length === 0) return null;
	const lines: string[] = ['### Props'];
	const limitedProps = USE_LIMITS ? props.slice(0, MAX_PROP_ENTRIES) : props;
	for (const prop of limitedProps) {
		const type = prop.type ? ` (${prop.type})` : '';
		const requirement = prop.required ? 'required' : 'optional';
		const defaultValue = prop.defaultValue ? `, default: ${prop.defaultValue}` : '';
		const header = `\`${prop.name}\`${type} [${requirement}${defaultValue}]`;
    const description = prop.description ? String(prop.description).trim() : '';
		
    lines.push(header)
	if (description) {
		lines.push(indentBlock(description));
	}
	}
	if (USE_LIMITS && props.length > limitedProps.length) {
		lines.push(`- … ${props.length - limitedProps.length} more props documented`);
	}
	return lines.join('\n');
}


function withCodeBlock(code: string, language = 'tsx'): string {
	const cleaned = code.replace(/\r\n/g, '\n').trimEnd();
	return `\`\`\`${language}\n${cleaned}\n\`\`\``;
}

function sanitizeDemoCode(code: string): string {
	const normalized = code.replace(/\r\n/g, '\n');
	const withoutImports = normalized
		// .replace(/import[\s\S]*?from\s+['"][^'"]+['"];?\s*/g, '')
		// .replace(/import\s+['"][^'"]+['"];?\s*/g, '');

	const lines = withoutImports.split('\n');
	const filtered = lines.filter(line => {
		const trimmed = line.trim();
		if (!trimmed) return false;
		return !trimmed.startsWith('export');
	});
	return filtered.join('\n');
}

async function loadDemoCode(component: string): Promise<Record<string, { code?: string; importPath?: string }>> {
	const fileName = `demo-code-${component}.json`;
	const filePath = path.join(generatedDir, fileName);
	const data = await readJSONIfExists<Record<string, { code?: string; importPath?: string }>>(filePath);
	return data ?? {};
}


async function buildComponentSection(
	name: string,
	metaMap: ComponentMeta,
	propsMap: ComponentPropsMap,
	demosByComponent: Map<string, Array<Record<string, any>>>
): Promise<string> {
	const parts: string[] = [];
	parts.push(formatMetaSection(name, metaMap[name] as JSONObject | undefined));

	const propsSection = formatPropsSection(propsMap[name] || []);
	if (propsSection) parts.push(propsSection);

	const demos = demosByComponent.get(name) || [];
  if (USE_LIMITS) {
    demos.splice(MAX_DEMO_ENTRIES);
  }

		if (demos.length) {
		parts.push('### Demos');
		const codeMap = await loadDemoCode(name);
		for (const demo of demos) {
			const codeEntry = codeMap[demo.id as string] || null;
			const headerParts: string[] = [];
			headerParts.push(`- ${demo.title || demo.demo || demo.id}`);
			headerParts.push(`(id: ${demo.id})`);
			// if (demo.category) headerParts.push(`category: ${demo.category}`);
			// if (demo.status) headerParts.push(`status: ${demo.status}`);
			// if (demo.since) headerParts.push(`since: ${demo.since}`);
			if (Array.isArray(demo.tags) && demo.tags.length) headerParts.push(`tags: ${(demo.tags as string[]).join(', ')}`);
			const demoLines: string[] = [headerParts.join(' | ')];
			if (demo.description) demoLines.push(indentBlock(String(demo.description).trim()));
					// if (codeEntry?.importPath) demoLines.push(indentBlock(`importPath: ${codeEntry.importPath}`));
					if (codeEntry?.code) {
						const sanitizedCode = sanitizeDemoCode(codeEntry.code);
						if (sanitizedCode) {
							demoLines.push('');
							demoLines.push(withCodeBlock(sanitizedCode));
						}
					}
			parts.push(demoLines.join('\n'));
		}
	}


	return parts.filter(Boolean).join('\n\n');
}

async function gatherDocsSections(): Promise<string[]> {
	const docSections: string[] = [];
	const targets = [
		['Docs App Source', path.join(docsDir, 'app')],
		['Docs Config', path.join(docsDir, 'config')],
		['Docs Hooks', path.join(docsDir, 'hooks')],
		['Docs Providers', path.join(docsDir, 'providers')],
		['Docs Screens', path.join(docsDir, 'screens')],
		['Docs Utilities', path.join(docsDir, 'utils')]
	];

	for (const [label, dir] of targets) {
		try {
			const stats = await fs.stat(dir);
			if (!stats.isDirectory()) continue;
		} catch {
			continue;
		}
		const files = await collectFiles(dir, docsDir);
		if (!files.length) continue;
		const limitedFiles = USE_LIMITS ? files.slice(0, MAX_DOC_FILES) : files;
		const lines: string[] = [`## ${label}`];
		for (const file of limitedFiles) {
			const ext = path.extname(file.relative).toLowerCase();
			const summary = summarizeContent(file.content, ext);
			lines.push(`- ${file.relative}: ${summary}`);
		}
		if (USE_LIMITS && files.length > limitedFiles.length) {
			lines.push(`- … ${files.length - limitedFiles.length} more files`);
		}
		docSections.push(lines.join('\n'));
	}

	return docSections;
}

function summarizeContent(content: string, ext: string): string {
  const trimmed = content.trim();
  if (!trimmed) return 'No content';

  if (ext === '.json') {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return `JSON array with ${parsed.length} entries`;
      }
      if (parsed && typeof parsed === 'object') {
        const keys = Object.keys(parsed as Record<string, unknown>);
        const displayKeys = USE_LIMITS ? keys.slice(0, MAX_LIST_ITEMS) : keys;
        return `JSON object with keys: ${displayKeys.join(', ')}${USE_LIMITS && keys.length > MAX_LIST_ITEMS ? ', …' : ''}`;
      }
    } catch {
      /* ignore parse errors */
    }
  }

  if (ext === '.md' || ext === '.mdx') {
    const paragraph = trimmed.split(/\n\s*\n/)[0] ?? trimmed;
    return truncate(paragraph.replace(/[#>*`]/g, '').replace(/\s+/g, ' ').trim());
  }

  if (ext === '.ts' || ext === '.tsx') {
    const withoutImports = trimmed.replace(/(^import[^;]+;\s*)+/gm, '').trim();
    const firstLines = withoutImports.split('\n').slice(0, 8).join(' ');
    return truncate(firstLines.replace(/\s+/g, ' '));
  }

  return truncate(trimmed.replace(/\s+/g, ' '));
}

function truncate(value: string): string {
  if (!USE_LIMITS || value.length <= SUMMARY_CHAR_LIMIT) return value;
  return `${value.slice(0, SUMMARY_CHAR_LIMIT - 1)}…`;
}

async function main() {
	const sections: string[] = [];

	const uiPackage = (await readJSONIfExists<JSONObject>(path.join(uiDir, 'package.json'))) || {};
	sections.push('# Platform Blocks UI Knowledge Base');
	sections.push(`Generated: ${new Date().toISOString()}`);

	const overviewLines: string[] = ['## Package Overview'];
	const overviewFields: Array<[string, unknown]> = [
		['Name', uiPackage.name],
		['Version', uiPackage.version],
		['Description', uiPackage.description],
		['Main', uiPackage.main],
		['Module', uiPackage.module],
		['Types', uiPackage.types],
		['React Native Entry', uiPackage['react-native']]
	];
	for (const [label, value] of overviewFields) {
		if (value) overviewLines.push(`- ${label}: ${value}`);
	}
	sections.push(overviewLines.join('\n'));

	const scriptsBlock = formatKeyValueBlock('Scripts (top commands)', uiPackage.scripts as Record<string, string> | undefined);
	if (scriptsBlock) sections.push(scriptsBlock);
	const depsBlock = formatKeyValueBlock('Runtime Dependencies', uiPackage.dependencies as Record<string, string> | undefined);
	if (depsBlock) sections.push(depsBlock);
	const peerBlock = formatKeyValueBlock('Peer Dependencies', uiPackage.peerDependencies as Record<string, string> | undefined);
	if (peerBlock) sections.push(peerBlock);
	const devDepsBlock = formatKeyValueBlock('Dev Dependencies (not exhaustive)', uiPackage.devDependencies as Record<string, string> | undefined);
	if (devDepsBlock) sections.push(devDepsBlock);

	const uiReadme = await readTextIfExists(path.join(uiDir, 'README.md'));
	if (uiReadme) {
		sections.push('## UI README');
		sections.push(uiReadme.trim());
	}

	const componentsMeta = (await readJSONIfExists<ComponentMeta>(path.join(generatedDir, 'components-meta.json'))) || {};
	const componentsProps = (await readJSONIfExists<ComponentPropsMap>(path.join(generatedDir, 'components-props.json'))) || {};
	const demosJson = (await readJSONIfExists<{ demos: Array<Record<string, any>> }>(path.join(generatedDir, 'demos.json'))) || { demos: [] };
	const demosByComponent = new Map<string, Array<Record<string, any>>>();
	for (const demo of demosJson.demos) {
		const componentName = demo.component as string | undefined;
		if (!componentName) continue;
		if (!demosByComponent.has(componentName)) {
			demosByComponent.set(componentName, []);
		}
		demosByComponent.get(componentName)!.push(demo);
	}

	const componentNames = new Set<string>([
		...Object.keys(componentsMeta),
		...Object.keys(componentsProps),
		...Array.from(demosByComponent.keys())
	]);
	const sortedComponentNames = Array.from(componentNames).sort((a, b) => a.localeCompare(b));

	for (const name of sortedComponentNames) {
		const section = await buildComponentSection(name, componentsMeta, componentsProps, demosByComponent);
		sections.push(section);
	}

	const docSections = await gatherDocsSections();
	sections.push(...docSections);

	await fs.mkdir(publicDir, { recursive: true });
	await fs.writeFile(outputPathTxt, sections.join('\n\n') + '\n', 'utf8');
	console.log(`llms.txt updated at ${outputPathTxt}`);
}

main().catch(error => {
	console.error('Failed to generate llms.txt', error);
	process.exitCode = 1;
});
