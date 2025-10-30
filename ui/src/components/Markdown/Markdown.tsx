import React, { useMemo } from 'react';
import { View, Image } from 'react-native';
import { Text } from '../Text';
import { CodeBlock } from '../CodeBlock';
import { useTheme } from '../../core/theme';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { extractSpacingProps, getSpacingStyles, SpacingProps } from '../../core/utils';

// Lightweight markdown renderer without external deps.
// Supports: headings (#..######), bold ** **, italic _ _, inline code `code`, code fences ```lang, blockquote >, lists -, *, ordered lists 1., images ![alt](src), links [text](url) (as plain text for now)

export interface MarkdownProps extends SpacingProps {
  children: string;
  /** Override default code block language guess */
  defaultCodeLanguage?: string;
  /** Max heading level to render (others downgraded) */
  maxHeadingLevel?: number;
  /** Whether to render inline HTML literally (ignored for now) */
  allowHtml?: boolean;
  /** Custom renderer overrides */
  components?: Partial<MarkdownComponentMap>;
}

export interface MarkdownComponentMap {
  heading: (props: { level: number; children: React.ReactNode }) => React.ReactNode;
  paragraph: (props: { children: React.ReactNode }) => React.ReactNode;
  strong: (props: { children: React.ReactNode }) => React.ReactNode;
  em: (props: { children: React.ReactNode }) => React.ReactNode;
  codeInline: (props: { children: string }) => React.ReactNode;
  codeBlock: (props: { code: string; language?: string }) => React.ReactNode;
  blockquote: (props: { children: React.ReactNode }) => React.ReactNode;
  list: (props: { ordered: boolean; items: React.ReactNode[] }) => React.ReactNode;
  listItem: (props: { children: React.ReactNode; index?: number; ordered?: boolean }) => React.ReactNode;
  link: (props: { href: string; children: React.ReactNode }) => React.ReactNode;
  image: (props: { src: string; alt?: string }) => React.ReactNode;
  thematicBreak: () => React.ReactNode;
  table: (props: { headers: React.ReactNode[]; rows: React.ReactNode[][] }) => React.ReactNode;
  tableCell: (props: { children: React.ReactNode; isHeader?: boolean }) => React.ReactNode;
}

const createDefaultComponents = (theme: PlatformBlocksTheme): MarkdownComponentMap => ({
  heading: ({ level, children }) => (
    <Text
      variant={`h${Math.min(level, 6)}` as any}
      style={{ marginTop: level === 1 ? 24 : 16, marginBottom: 8 }}
      weight={level <= 2 ? '700' : '600'}
    >
      {children}
    </Text>
  ),
  paragraph: ({ children }) => (
    <Text variant="p" style={{ marginBottom: 12 }}>
      {children}
    </Text>
  ),
  strong: ({ children }) => (
    <Text variant="strong">{children}</Text>
  ),
  em: ({ children }) => (
    <Text variant="em">{children}</Text>
  ),
  codeInline: ({ children }) => (
    <Text
      variant="code"
      style={{
        paddingHorizontal: 4,
        paddingVertical: 2,
        backgroundColor: 'rgba(0,0,0,0.06)',
        borderRadius: 4,
      }}
    >
      {children}
    </Text>
  ),
  codeBlock: ({ code, language }) => (
    <CodeBlock language={(language as any) || 'tsx'}>{code}</CodeBlock>
  ),
  blockquote: ({ children }) => (
    <View
      style={{
        borderLeftColor: '#ccc',
        borderLeftWidth: 4,
        paddingLeft: 12,
        marginVertical: 12,
      }}
    >
      <Text variant="blockquote">{children}</Text>
    </View>
  ),
  list: ({ ordered, items }) => (
    <View style={{ marginVertical: 8 }}>
      {items.map((it, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 4,
          }}
        >
          {ordered ? (
            <Text variant="p" style={{ width: 24 }}>
              {i + 1}.{' '}
            </Text>
          ) : (
            <Text variant="p" style={{ width: 24 }}>
              •{' '}
            </Text>
          )}
          <View style={{ flex: 1 }}>{it}</View>
        </View>
      ))}
    </View>
  ),
  listItem: ({ children }) => (
    <Text variant="p" style={{ marginBottom: 0 }}>
      {children}
    </Text>
  ),
  link: ({ children }) => (
    <Text variant="u" style={{ color: theme.text.link }}>
      {children}
    </Text>
  ),
  image: ({ src, alt }) => (
    <Image
      source={{ uri: src }}
      accessibilityLabel={alt}
      style={{
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginVertical: 12,
      }}
    />
  ),
  thematicBreak: () => (
    <View
      style={{
        height: 1,
        backgroundColor: theme.backgrounds.border,
        marginVertical: 24,
      }}
    />
  ),
  table: ({ headers, rows }) => (
    <View
      style={{
        marginVertical: 12,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.gray?.[3] || theme.backgrounds.border,
      }}
    >
      {/* Header row */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: theme.colors.gray?.[1] || theme.backgrounds.subtle,
        }}
      >
        {headers.map((header, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              padding: 12,
              borderRightWidth: i < headers.length - 1 ? 1 : 0,
              borderRightColor: theme.colors.gray?.[3] || theme.backgrounds.border,
            }}
          >
            {header}
          </View>
        ))}
      </View>
      {/* Data rows */}
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: theme.colors.gray?.[3] || theme.backgrounds.border,
          }}
        >
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={{
                flex: 1,
                padding: 12,
                borderRightWidth: cellIndex < row.length - 1 ? 1 : 0,
                borderRightColor: theme.colors.gray?.[3] || theme.backgrounds.border,
              }}
            >
              {cell}
            </View>
          ))}
        </View>
      ))}
    </View>
  ),
  tableCell: ({ children, isHeader }) => (
    <Text
      variant={isHeader ? 'strong' : 'p'}
      style={{
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 0,
      }}
    >
      {children}
    </Text>
  ),
});

interface TokenBase { type: string; }
interface HeadingToken extends TokenBase { type: 'heading'; level: number; text: string; }
interface ParagraphToken extends TokenBase { type: 'paragraph'; text: string; }
interface CodeBlockToken extends TokenBase { type: 'code'; code: string; language?: string; }
interface BlockquoteToken extends TokenBase { type: 'blockquote'; children: Token[]; }
interface ListToken extends TokenBase { type: 'list'; ordered: boolean; items: string[]; }
interface ThematicBreakToken extends TokenBase { type: 'thematicBreak'; }
interface TableToken extends TokenBase { 
  type: 'table'; 
  headers: string[]; 
  rows: string[][]; 
}

type Token = HeadingToken | ParagraphToken | CodeBlockToken | BlockquoteToken | ListToken | ThematicBreakToken | TableToken;

// Very small block-level tokenizer
const tokenize = (src: string): Token[] => {
  const lines = src.split(/\r?\n/);
  const tokens: Token[] = [];
  let i=0;
  while(i<lines.length){
    let line = lines[i];
    // code fence
    const fenceMatch = line.match(/^```(.*)$/);
    if(fenceMatch){
      const lang = fenceMatch[1].trim()||undefined;
      i++;
      const codeLines: string[] = [];
      while(i<lines.length && !lines[i].startsWith('```')){ codeLines.push(lines[i]); i++; }
      if(i<lines.length && lines[i].startsWith('```')) i++; // consume closing fence
      tokens.push({ type:'code', code: codeLines.join('\n'), language: lang });
      continue;
    }
    // heading
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if(headingMatch){
      tokens.push({ type:'heading', level: headingMatch[1].length, text: headingMatch[2] });
      i++; continue;
    }
    // thematic break
    if(/^(-\s?){3,}$/.test(line) || /^(\*\s?){3,}$/.test(line) || /^(\_\s?){3,}$/.test(line)){
      tokens.push({ type:'thematicBreak' }); i++; continue;
    }
    // blockquote
    if(line.startsWith('>')){
      const quoteLines: string[] = [];
      while(i<lines.length && lines[i].startsWith('>')){ quoteLines.push(lines[i].replace(/^>\s?/,'')); i++; }
      const inner = tokenize(quoteLines.join('\n'));
      tokens.push({ type:'blockquote', children: inner });
      continue;
    }
    // list
    if(/^\s*([*\-+] )/.test(line) || /^\s*\d+\. /.test(line)){
      const ordered = /^\s*\d+\. /.test(line);
      const items: string[] = [];
      while(i<lines.length && ( /^\s*([*\-+] )/.test(lines[i]) || /^\s*\d+\. /.test(lines[i]) )){
        items.push(lines[i].replace(/^\s*([*\-+]|\d+\.)\s+/,''));
        i++;
      }
      tokens.push({ type:'list', ordered, items });
      continue;
    }
    // table (must have header row followed by separator row)
    if(line.includes('|') && i+1 < lines.length && lines[i+1].includes('|') && /^\s*[\|\s\-:]+\s*$/.test(lines[i+1])){
      const headerLine = line;
      const separatorLine = lines[i+1];
      i += 2; // consume header and separator
      
      // Parse header
      const headers = headerLine.split('|').map(h => h.trim()).filter(h => h.length > 0);
      
      // Parse data rows
      const rows: string[][] = [];
      while(i < lines.length && lines[i].includes('|') && lines[i].trim().length > 0){
        const cells = lines[i].split('|').map(c => c.trim()).filter(c => c.length > 0);
        if(cells.length > 0) {
          rows.push(cells);
        }
        i++;
      }
      
      tokens.push({ type: 'table', headers, rows });
      continue;
    }
    // paragraph (collect consecutive non-empty, non-special lines)
    if(line.trim().length===0){ i++; continue; }
    const para: string[] = [];
    while(i<lines.length && lines[i].trim().length>0 && !/^(#{1,6})\s+/.test(lines[i]) && !lines[i].startsWith('>') && !/^```/.test(lines[i]) && !/^\s*([*\-+]|\d+\.)\s/.test(lines[i]) && !(lines[i].includes('|') && i+1 < lines.length && lines[i+1].includes('|') && /^\s*[\|\s\-:]+\s*$/.test(lines[i+1]))){
      para.push(lines[i]); i++;
    }
    tokens.push({ type:'paragraph', text: para.join(' ') });
  }
  return tokens;
};

// Inline parsing: bold ** ** or __ __, italic * * or _ _, combined bold+italic *** *** or ___ ___, inline code `code`, images, links.
// Supports emphasis inside list items like: - **Bold** text
const parseInline = (text: string, components: MarkdownComponentMap): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  const pushText = (t:string)=>{ if(!t) return; parts.push(<Text key={parts.length} variant="span">{t}</Text>); };
  // Order matters: longer tokens first (***, ___) to avoid premature matching
  const regex = /(!\[[^\]]*\]\([^\)]+\)|\[[^\]]+\]\([^\)]+\)|`[^`]+`|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/;
  while(remaining.length){
    const m = remaining.match(regex);
    if(!m){ pushText(remaining); break; }
    const idx = m.index!;
    pushText(remaining.slice(0,idx));
    const token = m[0];
    if(token.startsWith('![')){
      const im = token.match(/^!\[([^\]]*)\]\(([^\)]+)\)/);
      if(im){ parts.push(<React.Fragment key={parts.length}>{components.image({ src: im[2], alt: im[1] })}</React.Fragment>); }
    } else if(token.startsWith('[')){
      const lm = token.match(/^\[([^\]]+)\]\(([^\)]+)\)/);
      if(lm){ parts.push(<React.Fragment key={parts.length}>{components.link({ href: lm[2], children: lm[1] })}</React.Fragment>); }
    } else if(token.startsWith('`')){
      parts.push(<React.Fragment key={parts.length}>{components.codeInline({ children: token.slice(1,-1) })}</React.Fragment>);
    } else if(/^\*\*\*.*\*\*\*$/.test(token) || /^___.*___$/.test(token)){
      const content = token.slice(3,-3);
      // bold+italic: wrap italic inside strong for styling fallback
      parts.push(<React.Fragment key={parts.length}>{components.strong({ children: components.em({ children: content }) as any })}</React.Fragment>);
    } else if(/^\*\*.*\*\*$/.test(token) || /^__.*__$/.test(token)){
      const content = token.slice(2,-2);
      parts.push(<React.Fragment key={parts.length}>{components.strong({ children: content })}</React.Fragment>);
    } else if(/^\*.*\*$/.test(token) || /^_.*_$/.test(token)){
      const content = token.slice(1,-1);
      parts.push(<React.Fragment key={parts.length}>{components.em({ children: content })}</React.Fragment>);
    } else {
      pushText(token);
    }
    remaining = remaining.slice(idx + token.length);
  }
  return parts;
};

export const Markdown: React.FC<MarkdownProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const { children, defaultCodeLanguage='tsx', maxHeadingLevel=6, allowHtml=false, components } = otherProps;
  const spacingStyles = getSpacingStyles(spacingProps);
  const theme = useTheme();

  const baseComponents = useMemo(() => createDefaultComponents(theme), [theme]);
  const merged = useMemo(
    () => ({ ...baseComponents, ...(components || {}) }) as MarkdownComponentMap,
    [baseComponents, components]
  );

  const tokens = useMemo(()=> tokenize(children), [children]);

  const renderToken = (t: Token): React.ReactNode => {
    switch(t.type){
      case 'heading':{
        const level = Math.min(t.level, maxHeadingLevel);
        return <React.Fragment key={iKey++}>{merged.heading({ level, children: parseInline(t.text, merged) })}</React.Fragment>;
      }
      case 'paragraph':{
        return <React.Fragment key={iKey++}>{merged.paragraph({ children: parseInline(t.text, merged) })}</React.Fragment>;
      }
      case 'code':{
        return <React.Fragment key={iKey++}>{merged.codeBlock({ code: t.code, language: t.language||defaultCodeLanguage })}</React.Fragment>;
      }
      case 'blockquote':{
        return <React.Fragment key={iKey++}>{merged.blockquote({ children: t.children.map(c=>renderToken(c)) })}</React.Fragment>;
      }
      case 'list':{
        return <React.Fragment key={iKey++}>{merged.list({ ordered: t.ordered, items: t.items.map(it=> merged.listItem({ children: parseInline(it, merged) })) })}</React.Fragment>;
      }
      case 'thematicBreak':{
        return <React.Fragment key={iKey++}>{merged.thematicBreak()}</React.Fragment>;
      }
      case 'table':{
        const headers = t.headers.map(h => merged.tableCell({ children: parseInline(h, merged), isHeader: true }));
        const rows = t.rows.map(row => 
          row.map(cell => merged.tableCell({ children: parseInline(cell, merged), isHeader: false }))
        );
        return <React.Fragment key={iKey++}>{merged.table({ headers, rows })}</React.Fragment>;
      }
      default:
        return null;
    }
  };

  let iKey = 0; // reset per render
  return <View style={spacingStyles}>{tokens.map(renderToken)}</View>;
};

export default Markdown;
