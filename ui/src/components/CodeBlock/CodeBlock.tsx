import React from 'react';
import type { CSSProperties } from 'react';
import { View, ViewStyle, TextStyle, Platform, FlatList, ListRenderItemInfo, Linking, ScrollView } from 'react-native';

import { useTheme } from '../../core/theme';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { extractSpacingProps, getSpacingStyles } from '../../core/utils';
import { Text } from '../Text';
import { CopyButton } from '../CopyButton/CopyButton';
import { Spoiler } from '../Spoiler';
import { resolveOptionalModule } from '../../utils/optionalModule';
import { normalizeLanguage, parseHighlightLines, createNativeHighlighter } from './utils';
import type {
  CodeBlockColorOverrides,
  CodeBlockProps,
  CodeBlockToken,
  CodeBlockTextPalette,
} from './types';

// Prism light build for JSX/TSX (react-syntax-highlighter)
let PrismSyntaxHighlighter: any = null;
let prismLightTheme: any = null;
let prismDarkTheme: any = null;
if (Platform.OS === 'web') {
  PrismSyntaxHighlighter = resolveOptionalModule<any>('react-syntax-highlighter', {
    accessor: (module) => module.PrismLight,
    devWarning: 'react-syntax-highlighter not found, CodeBlock will use basic formatting',
  });

  if (PrismSyntaxHighlighter) {
    const registerLanguage = (moduleId: string, name: string) => {
      const languageModule = resolveOptionalModule<any>(moduleId, { accessor: (mod) => mod.default });
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
      accessor: (mod) => mod.default,
    });

    prismDarkTheme = resolveOptionalModule<any>('react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus', {
      accessor: (mod) => mod.default,
      devWarning: 'Failed to load prism vsc-dark-plus theme, falling back to prism',
    });
  }
}

const NO_HIGHLIGHTS = new Set<number>();
const LONG_LIST_THRESHOLD = 80;

const TOKEN_SEQUENCE: CodeBlockToken[] = [
  'keyword',
  'string',
  'comment',
  'number',
  'function',
  'operator',
  'punctuation',
  'tag',
  'attribute',
  'className',
];

type ResolvedCodeBlockColors = {
  background?: string;
  border?: string;
  text?: string;
  highlightBackground?: string;
  highlightAccent?: string;
  tokenOverrides?: Partial<Record<CodeBlockToken, string>>;
};

const resolveThemeColor = (theme: PlatformBlocksTheme, token?: string): string | undefined => {
  if (!token) return undefined;
  if (token.includes('.')) {
    const [scale, shade] = token.split('.');
    const shadeNum = Number(shade);
    const scaleObj: any = (theme.colors as any)[scale];
    if (scaleObj && !Number.isNaN(shadeNum) && scaleObj[shadeNum]) {
      return scaleObj[shadeNum];
    }
  }
  if ((theme.text as any)[token]) {
    return (theme.text as any)[token];
  }
  return token;
};

const resolveTextColors = (theme: PlatformBlocksTheme, palette?: CodeBlockTextPalette) => {
  if (!palette) return {};
  let baseColor: string | undefined;
  const tokenOverrides: Partial<Record<CodeBlockToken, string>> = {};

  const assign = (token: CodeBlockToken, value: string) => {
    const resolved = resolveThemeColor(theme, value) ?? value;
    tokenOverrides[token] = resolved;
    if (!baseColor) {
      baseColor = resolved;
    }
  };

  if (typeof palette === 'string') {
    const resolved = resolveThemeColor(theme, palette);
    if (resolved) {
      TOKEN_SEQUENCE.forEach((token) => {
        tokenOverrides[token] = resolved;
      });
      baseColor = resolved;
    }
    return { baseColor, tokenOverrides };
  }

  if (Array.isArray(palette)) {
    palette.forEach((value, index) => {
      if (!value) return;
      const token = TOKEN_SEQUENCE[index % TOKEN_SEQUENCE.length];
      assign(token, value);
    });
    return {
      baseColor,
      tokenOverrides: Object.keys(tokenOverrides).length ? tokenOverrides : undefined,
    };
  }

  TOKEN_SEQUENCE.forEach((token) => {
    const value = palette[token];
    if (value) assign(token, value);
  });

  return {
    baseColor,
    tokenOverrides: Object.keys(tokenOverrides).length ? tokenOverrides : undefined,
  };
};

const resolveCodeBlockColors = (theme: PlatformBlocksTheme, overrides?: CodeBlockColorOverrides) => {
  if (!overrides) return {};
  const resolved: ResolvedCodeBlockColors = {};

  if (overrides.background) {
    resolved.background = resolveThemeColor(theme, overrides.background);
  }

  if (overrides.border) {
    resolved.border = resolveThemeColor(theme, overrides.border);
  }

  if (overrides.highlight?.background) {
    resolved.highlightBackground = resolveThemeColor(theme, overrides.highlight.background);
  }

  if (overrides.highlight?.accent) {
    resolved.highlightAccent = resolveThemeColor(theme, overrides.highlight.accent);
  }

  const textConfig = resolveTextColors(theme, overrides.text);
  if (textConfig.baseColor) {
    resolved.text = textConfig.baseColor;
  }
  if (textConfig.tokenOverrides) {
    resolved.tokenOverrides = textConfig.tokenOverrides;
  }

  return resolved;
};

const getCodeBlockStyles = (
  theme: PlatformBlocksTheme,
  isDark: boolean,
  fullWidth: boolean,
  variant: 'code' | 'terminal' | 'hacker',
  overrides: ResolvedCodeBlockColors = {}
) => {
  const backgroundColor =
    overrides.background ??
    (variant === 'terminal'
      ? isDark
        ? '#0f1524'
        : '#f7f9fc'
      : isDark
      ? 'rgba(9,13,23,0.94)'
      : '#f8fafc');
  const borderColor = overrides.border ?? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)');
  const textColor = overrides.text ?? (isDark ? theme.text.primary : theme.text.secondary);
  const monoFont = Platform.select({ ios: 'SFMono-Regular', android: 'monospace', default: 'Menlo, monospace' });

  return {
    container: {
      marginBottom: 20,
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      width: fullWidth ? '100%' : undefined,
    } as ViewStyle,
    codeBlock: {
      width: '100%',
      position: 'relative',
      padding: variant === 'terminal' ? 14 : 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor,
      backgroundColor,
      overflow: 'hidden',
      paddingRight: 0,
    } as ViewStyle,
    codeBlockWithCopyButton: {
      // paddingRight: 48,
      paddingRight: 0,
    } as ViewStyle,
    title: {
      fontSize: 12,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
      marginBottom: 8,
      color: isDark ? theme.text.secondary : theme.text.primary,
    } as TextStyle,
    codeText: {
      fontFamily: monoFont,
      fontSize: 13,
      lineHeight: 18,
      color: textColor,
    } as TextStyle,
    highlightedLine: (_isDark: boolean, highlightColors: { background: string; accent: string }) => ({
      backgroundColor: highlightColors.background,
      borderLeftWidth: 3,
      borderLeftColor: highlightColors.accent,
      borderRadius: 4,
      marginVertical: 1,
      paddingLeft: 8,
    }),
    headerBar: {
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
    } as ViewStyle,
    inlineTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 8,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    } as ViewStyle,
  };
};

type FileHeaderBarProps = {
  fileName: string;
  isDark: boolean;
  titleBaseStyle: TextStyle;
  titleStyle?: TextStyle;
  showCopyButton: boolean;
  code: string;
  onCopy?: (code: string) => void;
  githubUrl?: string;
};

const FileHeaderBar: React.FC<FileHeaderBarProps> = ({
  fileName,
  isDark,
  titleBaseStyle,
  titleStyle,
  showCopyButton,
  code,
  onCopy,
  githubUrl,
}) => {
  const openGithub = React.useCallback(() => {
    if (githubUrl) {
      Linking.openURL(githubUrl).catch(() => undefined);
    }
  }, [githubUrl]);

  return (
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
      <Text variant="small" colorVariant="secondary" style={[titleBaseStyle, titleStyle, { marginBottom: 0 }]}>
        {fileName}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {githubUrl ? (
          <Text
            variant="small"
            colorVariant="secondary"
            onPress={openGithub}
            style={{ textDecorationLine: 'underline' }}
          >
            GitHub
          </Text>
        ) : null}
        {showCopyButton ? (
          <CopyButton
            value={code}
            onCopy={onCopy}
            iconOnly
            size="xs"
            style={{ minHeight: 24, minWidth: 24 }}
          />
        ) : null}
      </View>
    </View>
  );
};

type InlineTitleRowProps = {
  label: string;
  fileIcon?: React.ReactNode;
  isDark: boolean;
  theme: PlatformBlocksTheme;
  titleBaseStyle: TextStyle;
  titleStyle?: TextStyle;
  showCopyButton: boolean;
  code: string;
  onCopy?: (code: string) => void;
};

const InlineTitleRow: React.FC<InlineTitleRowProps> = ({
  label,
  fileIcon,
  isDark,
  theme,
  titleBaseStyle,
  titleStyle,
  showCopyButton,
  code,
  onCopy,
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center',  marginBottom: 8, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
    {fileIcon ? <View style={{ marginRight: 8 }}>{fileIcon}</View> : null}
    <Text
      variant="small"
      style={[
        titleBaseStyle,
        titleStyle,
        {
          marginBottom: 0,
          color: isDark ? theme.text.primary : theme.text.secondary,
          fontWeight: '500',
        },
      ]}
    >
      {label}
    </Text>
    {showCopyButton ? (
      <View style={{ marginLeft: 'auto' , marginRight: 12}}>
        <CopyButton
          value={code}
          onCopy={onCopy}
          iconOnly
          size="xs"
          style={{ minHeight: 20, minWidth: 20 }}
          iconColor={isDark ? theme.text.primary : theme.text.secondary}
        />
      </View>
    ) : null}
  </View>
);

type FloatingCopyControlsProps = {
  visible: boolean;
  code: string;
  onCopy?: (code: string) => void;
  topOffset: number;
  isWeb: boolean;
};

const FloatingCopyControls: React.FC<FloatingCopyControlsProps> = ({ visible, code, onCopy, topOffset, isWeb }) => (
  <View
    style={{
      position: 'absolute',
      top: topOffset,
      right: 8,
      zIndex: 10,
      opacity: visible ? 1 : 0,
      gap: 4,
      pointerEvents: visible ? 'auto' : 'none',
      ...(isWeb
        ? { transition: 'opacity 120ms ease, transform 120ms ease', transform: `translateY(${visible ? 0 : -2}px)` }
        : {}),
    }}
  >
    <CopyButton value={code} onCopy={onCopy} iconOnly size="sm" tooltip="Copy code" tooltipPosition="left" style={{ minHeight: 32, minWidth: 32 }} />
  </View>
);

export const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const {
    children,
    title,
    fileName,
    fileIcon,
    language = 'tsx',
    showLineNumbers = false,
    highlight = true,
    fullWidth = true,
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
    colors,
    wrap = true,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);
  const theme = useTheme();
  const isDark = theme.colorScheme === 'dark';
  const resolvedColors = React.useMemo(() => resolveCodeBlockColors(theme, colors), [theme, colors]);
  const styles = React.useMemo(() => getCodeBlockStyles(theme, isDark, fullWidth, variant, resolvedColors), [theme, isDark, fullWidth, variant, resolvedColors]);
  const highlightBackgroundColor = React.useMemo(() => resolvedColors.highlightBackground ?? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'), [resolvedColors.highlightBackground, isDark]);
  const highlightAccentColor = resolvedColors.highlightAccent ?? theme.colors.primary[5];
  const highlightColors = React.useMemo(() => ({ background: highlightBackgroundColor, accent: highlightAccentColor }), [highlightAccentColor, highlightBackgroundColor]);
  const nativeHighlighter = React.useMemo(() => createNativeHighlighter(theme, isDark, variant, resolvedColors.tokenOverrides), [theme, isDark, variant, resolvedColors.tokenOverrides]);

  const [hovered, setHovered] = React.useState(false);
  const [codeHeight, setCodeHeight] = React.useState<number | null>(null);
  const isWeb = Platform.OS === 'web';
  const showFloatingCopy = showCopyButton && !title && !fileName;
  const showCopyVisible = !isWeb ? showFloatingCopy : showFloatingCopy && hovered;

  const codeData = React.useMemo(() => {
    const rawInput = typeof children === 'string' ? children : String(children || '');
    const processed = rawInput.trim();
    const transformed =
      variant !== 'terminal'
        ? processed
        : processed
            .split('\n')
            .map((line: string) => (line.trim().length && !/^([>#]|\s)/.test(line) ? `${promptSymbol} ${line}` : line))
            .join('\n');
    const lines = transformed.split('\n');
    return {
      processed,
      transformed,
      lines,
      lineCount: lines.length,
    };
  }, [children, promptSymbol, variant]);

  const highlightSet = React.useMemo(() => {
    if (!highlight || !highlightLines?.length) return NO_HIGHLIGHTS;
    return parseHighlightLines(highlightLines, codeData.lineCount);
  }, [highlight, highlightLines, codeData.lineCount]);

  const hideLineNumbersVisually = highlight && !showLineNumbers && highlightSet.size > 0;
  const prismShowLineNumbers = showLineNumbers || hideLineNumbersVisually;
  const normalizedLang = normalizeLanguage(language);

  const baseLineStyle = React.useMemo<CSSProperties>(() => ({
    display: 'block',
    width: wrap ? '100%' : 'auto',
    boxSizing: 'border-box',
    paddingLeft: showLineNumbers ? 0 : 12,
    paddingRight: showLineNumbers ? 0 : 12,
  }), [showLineNumbers, wrap]);

  const highlightedLineStyle = React.useMemo<CSSProperties>(() => ({
    backgroundColor: highlightBackgroundColor,
    boxShadow: `inset 3px 0 0 0 ${highlightAccentColor}`,
  }), [highlightBackgroundColor, highlightAccentColor]);

  const fallbackColor = (styles.codeText.color as string) ?? theme.text.primary;
  const lineNumberColor = isDark ? theme.colors.gray[5] : theme.colors.gray[6];
  const lineNumberWidth = React.useMemo(() => Math.max(2, String(Math.max(1, codeData.lineCount)).length), [codeData.lineCount]);

  const tokenLines = React.useMemo(() => (highlight ? nativeHighlighter(codeData.transformed) : null), [highlight, nativeHighlighter, codeData.transformed]);

  const shouldVirtualizeNative = !isWeb && codeData.lineCount >= LONG_LIST_THRESHOLD;
  const lineHeight = styles.codeText.lineHeight ?? 18;

  const buildNativeLine = React.useCallback(
    (line: string, index: number, appendNewline: boolean, includeKey: boolean) => {
      const lineNumber = index + 1;
      const tokens = tokenLines?.[index] ?? [{ text: line || ' ', color: fallbackColor }];
      const isLineHighlighted = highlightSet.has(lineNumber);

      const lineStyles = [
        styles.codeText,
        textStyle,
        wrap ? { flexWrap: 'wrap' as const } : { flexWrap: 'nowrap' as const, width: 'auto' as const },
      ];
      if (isLineHighlighted) {
        lineStyles.push(styles.highlightedLine(isDark, highlightColors));
      }

      return (
        <Text key={includeKey ? `line-${lineNumber}` : undefined} selectable style={lineStyles}>
          {showLineNumbers ? (
            <Text style={{ color: lineNumberColor, opacity: 0.7 }}>
              {`${String(lineNumber).padStart(lineNumberWidth, ' ')} | `}
            </Text>
          ) : null}
          {tokens.map((token, tokenIdx) => (
            <Text key={`${lineNumber}-${tokenIdx}`} style={{ color: token.color }}>
              {token.text || ' '}
            </Text>
          ))}
          {appendNewline ? '\n' : null}
        </Text>
      );
    },
    [fallbackColor, highlightColors, highlightSet, isDark, lineNumberColor, lineNumberWidth, showLineNumbers, styles.codeText, styles.highlightedLine, textStyle, tokenLines, wrap]
  );

  const renderWebCode = React.useMemo(() => {
    if (!(isWeb && highlight && PrismSyntaxHighlighter)) {
      return null;
    }
    const themeObj = isDark ? prismDarkTheme || prismLightTheme : prismLightTheme;

    return (
      <PrismSyntaxHighlighter
        language={normalizedLang}
        style={themeObj}
        PreTag="div"
        customStyle={{
          background: 'transparent',
          padding: 0,
          margin: 0,
          fontSize: 13,
          lineHeight: '18px',
          display: 'block',
          width: '100%',
        }}
        codeTagProps={{ style: { fontFamily: styles.codeText.fontFamily } }}
  wrapLongLines={wrap}
  wrapLines={wrap}
        showLineNumbers={prismShowLineNumbers}
        lineNumberStyle={
          hideLineNumbersVisually
            ? { display: 'none' }
            : { opacity: 0.55, paddingRight: 12, userSelect: 'none' }
        }
        lineProps={(lineNumber: number) => {
          const style: CSSProperties = { ...baseLineStyle };
          if (highlightSet.has(lineNumber)) {
            Object.assign(style, highlightedLineStyle);
            const prevHighlighted = highlightSet.has(lineNumber - 1);
            const nextHighlighted = highlightSet.has(lineNumber + 1);
            const cornerRadius = 4;
            style.borderTopLeftRadius = prevHighlighted ? 0 : cornerRadius;
            style.borderTopRightRadius = prevHighlighted ? 0 : cornerRadius;
            style.borderBottomLeftRadius = nextHighlighted ? 0 : cornerRadius;
            style.borderBottomRightRadius = nextHighlighted ? 0 : cornerRadius;
            return { style, 'data-highlighted': 'true' };
          }
          return { style };
        }}
      >
        {codeData.transformed}
      </PrismSyntaxHighlighter>
    );
  }, [
    baseLineStyle,
    codeData.transformed,
    highlight,
    highlightSet,
    highlightedLineStyle,
    hideLineNumbersVisually,
    isDark,
    isWeb,
    normalizedLang,
    prismShowLineNumbers,
    styles.codeText.fontFamily,
    wrap,
  ]);

  const renderNativeCode = React.useMemo(() => {
    if (!codeData.lineCount) {
      return (
        <Text selectable style={[styles.codeText, textStyle]}>
          {' '}
        </Text>
      );
    }

    if (shouldVirtualizeNative) {
      return (
        <FlatList
          data={codeData.lines}
          keyExtractor={(_, index) => `line-${index}`}
          renderItem={({ item, index }: ListRenderItemInfo<string>) => buildNativeLine(item, index, false, false)}
          initialNumToRender={20}
          maxToRenderPerBatch={40}
          windowSize={7}
          removeClippedSubviews
          getItemLayout={(_, index) => ({ length: lineHeight, offset: lineHeight * index, index })}
        />
      );
    }

    return (
      <Text selectable style={[styles.codeText, textStyle]}>
        {codeData.lines.map((line, idx) => buildNativeLine(line, idx, idx < codeData.lineCount - 1, true))}
      </Text>
    );
  }, [buildNativeLine, codeData.lineCount, codeData.lines, lineHeight, shouldVirtualizeNative, styles.codeText, textStyle]);

  const codeContent = renderWebCode ?? renderNativeCode;

  const scrollableCodeContent = wrap ? (
    codeContent
  ) : (
    <ScrollView
      horizontal
      bounces={false}
      showsHorizontalScrollIndicator
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ width: '100%' }}
    >
      <View style={{ flexGrow: 1 }}>{codeContent}</View>
    </ScrollView>
  );

  let wrappedCodeContent: React.ReactNode = scrollableCodeContent;
  if (spoiler) {
    wrappedCodeContent = (
      <Spoiler maxHeight={spoilerMaxHeight}>
        {scrollableCodeContent}
      </Spoiler>
    );
  }

  const userHasWidth = Boolean(style && (style.width !== undefined || style.flex !== undefined));
  const containerStyle = userHasWidth ? [{ marginBottom: 20 }, style, spacingStyles] : [styles.container, spacingStyles, style];
  const showHeaderBar = fileHeader && fileName && variant !== 'terminal';
  const inlineTitleVisible = variant === 'code' && (title || fileName);
  const inlineTitleLabel = fileName || title || '';
  const floatingTop = codeHeight && codeHeight < 40 ? 4 : 8;

  return (
    <View style={containerStyle} {...otherProps}>
      {showHeaderBar && fileName ? (
        <FileHeaderBar
          fileName={fileName}
          isDark={isDark}
          titleBaseStyle={styles.title}
          titleStyle={titleStyle}
          showCopyButton={showCopyButton}
          code={codeData.processed}
          onCopy={onCopy}
          githubUrl={githubUrl}
        />
      ) : null}
      <View
        style={[styles.codeBlock, showFloatingCopy && styles.codeBlockWithCopyButton]}
        onLayout={(event) => {
          if (showFloatingCopy) setCodeHeight(event.nativeEvent.layout.height);
        }}
        {...(isWeb
          ? {
              onMouseEnter: () => setHovered(true),
              onMouseLeave: () => setHovered(false),
            }
          : {})}
      >
        {isWeb && variant === 'code' ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: 2,
              pointerEvents: 'none',
              backgroundColor: hovered ? theme.colors.primary[5] : 'transparent',
            }}
          />
        ) : null}
        {inlineTitleVisible ? (
          <InlineTitleRow
            label={inlineTitleLabel}
            fileIcon={fileIcon}
            isDark={isDark}
            theme={theme}
            titleBaseStyle={styles.title}
            titleStyle={titleStyle}
            showCopyButton={showCopyButton}
            code={codeData.processed}
            onCopy={onCopy}
          />
        ) : null}
        {wrappedCodeContent}
        {showFloatingCopy ? (
          <FloatingCopyControls visible={showCopyVisible} code={codeData.processed} onCopy={onCopy} topOffset={floatingTop} isWeb={isWeb} />
        ) : null}
      </View>
    </View>
  );
};

export default CodeBlock;
