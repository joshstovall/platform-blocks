import type { PlatformBlocksTheme } from '../../core/theme/types';
import type { CodeBlockToken } from './types';

/**
 * Normalizes language identifiers to standard values for syntax highlighting
 */
export function normalizeLanguage(lang: string): string {
  switch (lang) {
    case 'ts':
    case 'tsx':
    case 'typescript': return 'tsx';
    case 'js':
    case 'jsx':
    case 'javascript': return 'jsx';
    case 'md':
    case 'mdx': return 'markdown';
    case 'yml':
    case 'yaml': return 'json';
    case 'sh':
    case 'bash': return 'bash';
    default: return lang;
  }
}

/**
 * Parses highlight line specifications like "1", "3-5", "7,9-12" into a Set of line numbers
 */
export function parseHighlightLines(specs: string[] | undefined, total: number): Set<number> {
  const set = new Set<number>();
  if (!specs) return set;
  
  for (const raw of specs) {
    const part = raw.trim();
    if (!part) continue;
    
    // Single line number like "5"
    if (/^\d+$/.test(part)) {
      const n = parseInt(part, 10);
      if (n >= 1 && n <= total) set.add(n);
      continue;
    }
    
    // Range like "3-7"
    const range = part.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = parseInt(range[1], 10);
      const end = parseInt(range[2], 10);
      if (start <= end) {
        for (let i = start; i <= end && i <= total; i++) {
          set.add(i);
        }
      }
      continue;
    }
  }
  return set;
}

/**
 * Color schemes for different code block variants
 */
export type SyntaxColorMap = Record<CodeBlockToken, string>;

export function getSyntaxColors(
  theme: PlatformBlocksTheme,
  isDark: boolean,
  variant: 'code' | 'terminal' | 'hacker' = 'code',
  overrides?: Partial<Record<CodeBlockToken, string>>
): SyntaxColorMap {
  if (variant === 'hacker') {
    const base: SyntaxColorMap = {
      keyword: '#00ff00',
      string: '#00cc00',
      comment: '#006600',
      number: '#00ff99',
      function: '#00dd00',
      operator: '#00ff66',
      punctuation: '#00aa00',
      tag: '#00ff33',
      attribute: '#00bb00',
      className: '#00ee00',
    };
    return applyOverrides(base, overrides);
  }

  const base: SyntaxColorMap = {
    keyword: isDark ? '#c678dd' : '#a626a4',
    string: isDark ? '#98c379' : '#50a14f',
    comment: isDark ? '#5c6370' : '#a0a1a7',
    number: isDark ? '#d19a66' : '#986801',
    function: isDark ? '#61afef' : '#4078f2',
    operator: isDark ? '#56b6c2' : '#0184bc',
    punctuation: isDark ? '#abb2bf' : '#383a42',
    tag: isDark ? '#e06c75' : '#e45649',
    attribute: isDark ? '#d19a66' : '#986801',
    className: isDark ? '#e5c07b' : '#c18401',
  };

  return applyOverrides(base, overrides);
}

function applyOverrides(
  base: SyntaxColorMap,
  overrides?: Partial<Record<CodeBlockToken, string>>
): SyntaxColorMap {
  if (!overrides) return base;
  const next = { ...base };
  (Object.keys(overrides) as CodeBlockToken[]).forEach((key) => {
    const color = overrides[key];
    if (color) {
      next[key] = color;
    }
  });
  return next;
}

/**
 * Regex patterns for syntax highlighting
 */
export function getSyntaxPatterns(colors: ReturnType<typeof getSyntaxColors>) {
  return [
    // JSX/TSX Tags
    { pattern: /<\/?[A-Z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)*(?:\s|>|\/)/g, color: colors.tag },
    // HTML/JSX attributes
    { pattern: /\s([a-zA-Z-]+)(?==)/g, color: colors.attribute },
    // Comments
    { pattern: /\/\*[\s\S]*?\*\/|\/\/.*$/gm, color: colors.comment },
    // Strings
    { pattern: /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, color: colors.string },
    // Template literals
    { pattern: /`(?:[^`\\]|\\.)*`/g, color: colors.string },
    // Numbers
    { pattern: /\b\d+\.?\d*\b/g, color: colors.number },
    // Keywords
    { pattern: /\b(const|let|var|function|class|interface|type|import|export|from|default|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|static|async|await|yield|true|false|null|undefined|void|never|any|string|number|boolean|object|Array|Promise)\b/g, color: colors.keyword },
    // Function calls
    { pattern: /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, color: colors.function },
    // Class names (PascalCase)
    { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, color: colors.className },
    // Operators
    { pattern: /[+\-*/%=<>!&|^~?:]+/g, color: colors.operator },
  ];
}

/**
 * Creates a simple syntax highlighter for React Native that returns colored tokens
 */
export function createNativeHighlighter(
  theme: PlatformBlocksTheme,
  isDark: boolean,
  variant: 'code' | 'terminal' | 'hacker' = 'code',
  overrides?: Partial<Record<CodeBlockToken, string>>
) {
  const colors = getSyntaxColors(theme, isDark, variant, overrides);
  const patterns = getSyntaxPatterns(colors);

  return function highlightCode(code: string): Array<Array<{ text: string; color: string }>> {
    const lines = code.split('\n');
    
    return lines.map((line) => {
      if (!line.trim()) {
        return [{ text: line || ' ', color: colors.punctuation }];
      }

      let lastIndex = 0;
      const tokens: Array<{ text: string; color: string }> = [];
      const matches: Array<{ start: number; end: number; color: string }> = [];

      // Find all matches
      patterns.forEach(({ pattern, color }) => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            color,
          });
        }
        pattern.lastIndex = 0; // Reset regex
      });

      // Sort matches by start position
      matches.sort((a, b) => a.start - b.start);

      // Remove overlapping matches (keep first match)
      const filteredMatches = matches.filter((match, index) => {
        for (let i = 0; i < index; i++) {
          const prev = matches[i];
          if (match.start < prev.end) {
            return false;
          }
        }
        return true;
      });

      // Create tokens
      filteredMatches.forEach((match) => {
        if (match.start > lastIndex) {
          tokens.push({
            text: line.slice(lastIndex, match.start),
            color: colors.punctuation,
          });
        }
        tokens.push({
          text: line.slice(match.start, match.end),
          color: match.color,
        });
        lastIndex = match.end;
      });

      if (lastIndex < line.length) {
        tokens.push({
          text: line.slice(lastIndex),
          color: colors.punctuation,
        });
      }

      return tokens.length > 0 ? tokens : [{ text: line || ' ', color: colors.punctuation }];
    });
  };
}