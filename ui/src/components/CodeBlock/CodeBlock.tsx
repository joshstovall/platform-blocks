import React from 'react';
import { View, ViewStyle, TextStyle, Platform } from 'react-native';

import { useTheme } from '../../core/theme';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { useColorScheme } from '../../core/theme/useColorScheme';
import { extractSpacingProps, getSpacingStyles } from '../../core/utils';
import { Text } from '../Text';
import { CopyButton } from '../CopyButton/CopyButton';
import type { CodeBlockProps } from './types';
import { Column } from '../Layout';
import { Spoiler } from '../Spoiler';
import { resolveOptionalModule } from '../../utils/optionalModule';
import { normalizeLanguage, parseHighlightLines, createNativeHighlighter } from './utils';

// Prism light build for JSX/TSX (react-syntax-highlighter)
let PrismSyntaxHighlighter: any = null;
let prismLightTheme: any = null;
let prismDarkTheme: any = null;
if (Platform.OS === 'web') {
  PrismSyntaxHighlighter = resolveOptionalModule<any>('react-syntax-highlighter', {
    accessor: module => module.PrismLight,
    devWarning: 'react-syntax-highlighter not found, CodeBlock will use basic formatting',
  });

  if (PrismSyntaxHighlighter) {
    const registerLanguage = (moduleId: string, name: string) => {
      const languageModule = resolveOptionalModule<any>(moduleId, { accessor: mod => mod.default });
      if (languageModule) {
        PrismSyntaxHighlighter.registerLanguage(name, languageModule);
      }
    };

    registerLanguage('react-syntax-highlighter/dist/esm/languages/prism/jsx', 'jsx');
    registerLanguage('react-syntax-highlighter/dist/esm/languages/prism/tsx', 'tsx');
    registerLanguage('react-syntax-highlighter/dist/esm/languages/prism/typescript', 'typescript');
    registerLanguage('react-syntax-highlighter/dist/esm/languages/prism/javascript', 'javascript');
    registerLanguage('react-syntax-highlighter/dist/esm/languages/prism/json', 'json');
    registerLanguage('react-syntax-highlighter/dist/esm/languages/prism/bash', 'bash');

    prismLightTheme = resolveOptionalModule<any>('react-syntax-highlighter/dist/esm/styles/prism/prism', {
      accessor: mod => mod.default,
    });

    prismDarkTheme = resolveOptionalModule<any>('react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus', {
      accessor: mod => mod.default,
      devWarning: 'Failed to load prism vsc-dark-plus theme, falling back to prism',
    });
  }
}

const getCodeBlockStyles = (theme: PlatformBlocksTheme, isDark: boolean, fullWidth: boolean = false, variant: 'code' | 'terminal' | 'hacker' = 'code') => ({
  container: {
    marginBottom: 20,
    alignSelf: 'flex-start' as const,
    maxWidth: '100%' as const,
    ...(fullWidth ? { width: '100%' as const, alignSelf: 'stretch' as const } : {})
  } as ViewStyle,
  terminalWindow: (variant === 'terminal' || variant === 'hacker') ? {
    borderRadius: 12,
    overflow: 'hidden' as const,
    backgroundColor: variant === 'hacker' ? '#0a0a0a' : (isDark ? '#1e222b' : '#f5f6f8'),
    ...Platform.select({
      web: {
        transition: 'box-shadow 160ms ease, transform 160ms ease',
      },
      default: {
        elevation: 8,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
      }
    })
  } : {},
  terminalInner: (variant === 'terminal' || variant === 'hacker') ? {
    borderTopWidth: 1,
    borderTopColor: variant === 'hacker' ? 'rgba(0,255,0,0.2)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
  } : {},
  headerContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  } as ViewStyle,
  title: {
    fontWeight: '600' as const,
    flex: 1,
  } as TextStyle,
  codeBlock: {
    // Brand-aligned background using theme surfaces & subtle tinted overlay
    backgroundColor:  variant === 'hacker' 
      ? '#0f0f0f'
      : variant === 'terminal'
      ? (isDark ? theme.backgrounds.elevated :'rgba(22, 22, 22, 0.6)')
      : (isDark ? theme.backgrounds.surface : 'rgba(22, 22, 22, 0.6)'),
    ...(variant === 'code' && isDark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' } : {}),
    ...(variant === 'code' && !isDark ? { borderWidth: 1, borderColor: theme.backgrounds.border } : {}),
    ...(variant === 'hacker' ? { borderWidth: 1, borderColor: 'rgba(0,255,0,0.3)' } : {}),
    padding: (variant === 'terminal' || variant === 'hacker') ? 8 : 4,
    borderLeftWidth: (variant === 'terminal' || variant === 'hacker') ? 0 : 2,
  // Left accent border will appear on hover (for variant === 'code')
  borderLeftColor: (variant === 'terminal' || variant === 'hacker') ? 'transparent' : 'transparent',
    position: 'relative' as const,
    borderRadius: (variant === 'terminal' || variant === 'hacker') ? 8 : 0,
    ...((variant === 'terminal' || variant === 'hacker')
      ? Platform.select({
          web: {
            boxShadow:  isDark
              ? '0 2px 4px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)'
              : '0 2px 4px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.12)',
            border: variant === 'hacker'
              ? '1px solid rgba(72, 72, 72, 0.4)'
              : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)'
          },
          default: {
            boxShadow: variant === 'hacker' 
              ? '0 0 10px rgba(0, 0, 0, 0.8)' 
              : isDark 
                ? '0 2px 6px rgba(0, 0, 0, 0.6)' 
                : '0 3px 8px rgba(0, 0, 0, 0.18)',
            elevation: variant === 'hacker' ? 8 : (isDark ? 6 : 4),
            borderWidth: 1,
            // borderColor: variant === 'hacker' ? 'rgba(0,255,0,0.4)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')
          }
        }) : {})
  } as ViewStyle,
  codeBlockWithCopyButton: {
  } as ViewStyle,
  codeText: {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: 13,
    lineHeight: 18,
    color: variant === 'hacker'
      ? '#00ff41'
      : variant === 'terminal'
      ? (isDark ? theme.text.secondary : theme.text.primary)
      : (isDark ? theme.text.secondary : theme.text.primary)
  } as TextStyle,
  terminalBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: variant === 'hacker' ? '#050505' : (isDark ? '#2a303b' : '#eceef1'),
    ...(Platform.OS === 'web' ? {
      backgroundImage: variant === 'hacker'
        ? 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)'
        : isDark
        ? 'linear-gradient(180deg, #333a46 0%, #2a303b 100%)'
        : 'linear-gradient(180deg, #fdfdfe 0%, #e3e6e9 100%)'
    } : {}),
    borderBottomWidth: 1,
    borderBottomColor: variant === 'hacker' ? 'rgba(0,255,0,0.2)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)')
  } as ViewStyle,
  trafficLightDot: (color: string, isHacker = false) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: isHacker ? '#00ff41' : color,
    marginRight: 6,
    // ...(isHacker && Platform.OS === 'web' ? {
    //   boxShadow: '0 0 6px rgba(0,255,65,0.6)'
    // } : {})
  }) as ViewStyle,
  highlightedLine: (isDark: boolean) => ({
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary[5],
    marginLeft: -4,
    marginRight: -4,
    paddingLeft: 1,
    paddingRight: 1,
  }) as ViewStyle
});





/**
 * CodeBlock component for displaying formatted code with syntax highlighting.
 *
 * @example
 * ```tsx
 * <CodeBlock title="React Component" language="tsx">
 *   {`const App = () => {
 *   return <Text>Hello World</Text>;
 * };`}
 * </CodeBlock>
 * ```
 */
export const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const {
    children,
    title,
    fileName,
    fileIcon,
    language = 'tsx',
    showLineNumbers = false,
    highlight = true,
    fullWidth = false,
    showCopyButton = true,
    onCopy,
    style,
    textStyle,
    titleStyle,
    highlightLines,
    spoiler = false,
    spoilerMaxHeight = 160,
    variant = 'code',
    promptSymbol = '$',
    githubUrl,
    fileHeader = false,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = true;
  const styles = getCodeBlockStyles(theme, isDark, fullWidth, variant);
  const [hovered, setHovered] = React.useState(false);
  const [codeHeight, setCodeHeight] = React.useState<number | null>(null);
  const isWeb = Platform.OS === 'web';
  const showFloatingCopy = showCopyButton && !title && !fileName;
  const showCopyVisible = !isWeb ? showFloatingCopy : (showFloatingCopy && hovered);
  const processedCode = React.useMemo(() => (typeof children === 'string' ? children : String(children || '')).trim(), [children]);
  const transformedCode = React.useMemo(() => {
    if (variant !== 'terminal') return processedCode;
    return processedCode.split('\n').map((line: string) => line.trim().length && !/^([>#]|\s)/.test(line) ? `${promptSymbol} ${line}` : line).join('\n');
  }, [processedCode, variant, promptSymbol]);
  const highlightSet = React.useMemo(() => parseHighlightLines(highlightLines, processedCode.split('\n').length), [highlightLines, processedCode]);
  const normalizedLang = normalizeLanguage(language);
  const codeContent = React.useMemo(() => {
    const baseColor = styles.codeText.color as string;
    if (Platform.OS === 'web' && highlight && PrismSyntaxHighlighter) {
      const themeObj = isDark ? (prismDarkTheme || prismLightTheme) : prismLightTheme;
      return (
        <PrismSyntaxHighlighter
          language={normalizedLang}
          style={themeObj}
          PreTag="span"
          customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: 13, lineHeight: '18px' }}
          codeTagProps={{ style: { fontFamily: styles.codeText.fontFamily } }}
          wrapLongLines
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{ opacity: 0.55, paddingRight: 12, userSelect: 'none' }}
          lineProps={(lineNumber: number) => highlightSet.has(lineNumber) ? {
            style: { background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', display: 'block' }
          } : {}}
        >
          {transformedCode}
        </PrismSyntaxHighlighter>
      );
    }
    return (null);
    // const highlighter = createNativeHighlighter(theme, isDark, variant);
    // const highlightedLines = highlight ? highlighter(transformedCode) : null;
    // const rawLines = transformedCode.split('\n');
    // return (
    //   <Text style={[styles.codeText, textStyle]}>
    //     {rawLines.map((line, idx) => {
    //       const lineNumber = idx + 1;
    //         const isHl = highlightSet.has(lineNumber);
    //         const tokens = highlightedLines?.[idx] || [{ text: line || ' ', color: baseColor }];
    //         return (
    //           <Text key={idx} style={isHl ? styles.highlightedLine(isDark) : undefined}>
    //             {showLineNumbers && (
    //               <Text style={{ color: isDark ? theme.colors.gray[5] : theme.colors.gray[6], opacity: 0.7 }}>
    //                 {String(lineNumber).padStart(Math.max(2, String(rawLines.length).length), ' ')} | 
    //               </Text>
    //             )}
    //             {tokens.map((token, tokenIdx) => (
    //               <Text key={tokenIdx} style={{ color: token.color }}>
    //                 {token.text}
    //               </Text>
    //             ))}
    //             {idx < rawLines.length - 1 && '\n'}
    //           </Text>
    //         );
    //     })}
    //   </Text>
    // );
  }, [highlight, transformedCode, showLineNumbers, highlightSet, normalizedLang, isDark, styles.codeText, textStyle, theme.colors.gray]);

  let wrappedCodeContent: React.ReactNode = codeContent;
  if (spoiler) {
    wrappedCodeContent = (
      <Spoiler maxHeight={spoilerMaxHeight} style={{ margin: 0 }}>
        {codeContent}
      </Spoiler>
    );
  }

  const userHasWidth = !!(style && (('width' in style) || ('flex' in style)));
  const containerStyle = userHasWidth ? [{ marginBottom: 20 }, style, spacingStyles] : [styles.container, spacingStyles, style];

  const showHeaderBar = fileHeader && fileName && variant !== 'terminal';

  return (
    <View style={containerStyle} {...otherProps}>
      {showHeaderBar && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isDark ? '#2a303b' : '#eceef1',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          marginBottom: 4,
        }}>
          <Text variant="caption" colorVariant="secondary" style={[styles.title, titleStyle, { marginBottom: 0 }]}> {fileName} </Text>
          {showCopyButton && (
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <CopyButton
                value={processedCode}
                onCopy={onCopy}
                iconOnly
                size="xs"
                style={{ minHeight: 24, minWidth: 24}}
              />
            </View>
          )}
        </View>
      )}
      {/* {(variant === 'terminal' || variant === 'hacker') ? (
        <View style={styles.terminalBar}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 4, paddingTop: 2 }}>
            <View style={styles.trafficLightDot('#ff5f56', variant === 'hacker')} />
            <View style={styles.trafficLightDot('#ffbd2e', variant === 'hacker')} />
            <View style={styles.trafficLightDot('#27c93f', variant === 'hacker')} />
          </View>
          {(fileName || title) && (
            <Text
              variant="caption"
              colorVariant="secondary"
              style={[
                styles.title, 
                titleStyle, 
                { 
                  textAlign: 'center',
                  color: variant === 'hacker' ? '#00ff41' : undefined
                }
              ]}
            >
              {fileName || title}
            </Text>
          )}
          {showCopyButton && (title || fileName) && (
            <View style={{ flexDirection: 'row', gap: 4, marginLeft: 'auto', paddingRight: 8 }}>
              <CopyButton
                value={processedCode}
                onCopy={onCopy}
                iconOnly
                size="xs"
                style={{
                  minHeight: 24,
                  minWidth: 24,
                }}
              />
            </View>
          )}
        </View>
      ) : null} */}
      <View
        style={[
          styles.codeBlock,
          showFloatingCopy && styles.codeBlockWithCopyButton,
          
        ]}
        onLayout={e => {
          if (showFloatingCopy) setCodeHeight(e.nativeEvent.layout.height);
        }}
        // Web-only hover handlers
        {...(isWeb ? {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false)
        } : {})}
      >
        {/* Hover accent border (web only) */}
        {isWeb && variant === 'code' && (
          <View style={{
            position:'absolute',
            top:0,
            bottom:0,
            left:0,
            width:2,
            pointerEvents: 'none',
            backgroundColor: hovered ? theme.colors.primary[5] : 'transparent'
          }}/>
        )}
        {/* Title inside code block for non-terminal variants */}
        {variant === 'code' && (title || fileName) && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 8,
            marginBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}>
            {fileIcon && (
              <View style={{ marginRight: 8 }}>
                {fileIcon}
              </View>
            )}
            <Text
              variant="caption"
              style={[
                styles.title,
                titleStyle,
                {
                  marginBottom: 0,
                  color: isDark ? theme.text.primary : theme.text.secondary,
                  fontWeight: '500'
                }
              ]}
            >
              {fileName || title}
            </Text>
            {showCopyButton && (
              <View style={{ marginLeft: 'auto' }}>
                <CopyButton
                  value={processedCode}
                  onCopy={onCopy}
                  iconOnly
                  size="xs"
                  style={{
                    minHeight: 20,
                    minWidth: 20,
                  }}
                  iconColor={isDark ? theme.text.primary : theme.text.secondary}
                />
              </View>
            )}
          </View>
        )}
        {wrappedCodeContent}
        {showFloatingCopy && (
          <Column 
          // direction='column'
          style={{
            position: 'absolute',
            top: codeHeight && codeHeight < 40 ? 4 : 8,
            right: 8,
            zIndex: 10,
            opacity: showCopyVisible ? 1 : 0,
            // flexDirection: 'row',
            gap: 4,
            // Transition for web (ignored on native)
            ...(isWeb ? { transition: 'opacity 120ms ease, transform 120ms ease', transform: `translateY(${showCopyVisible ? 0 : -2}px)` } : {}),
            pointerEvents: showCopyVisible ? 'auto' : 'none',
          }}
          
          >
        
            <CopyButton
              value={processedCode}
              onCopy={onCopy}
              iconOnly
              size="sm"
              // tooltip='Copy code'
              tooltipPosition="left"
              style={{
                minHeight: 32,
                minWidth: 32,
              }}
            />

          </Column>
        )}
      </View>
    </View>
  );
};

export default CodeBlock;
