import React from 'react';
import { View } from 'react-native';
import { Card, CodeBlock, Block } from '@platform-blocks/ui';
import type { NewDemo } from '../utils/demosLoader';

export interface DemoRendererProps {
  demo: NewDemo & { code?: string };
  preview: React.ReactNode;
  mode?: 'preview' | 'code';
}

/**
 * Layout-aware demo renderer. Uses demo.renderStyle to choose layout.
 *  - auto: vertical stack (preview then code)
 *  - center: centers preview horizontally
 *  - code_flex: side-by-side (wrap to column on small widths via flex wrap)
 */
export const DemoRenderer: React.FC<DemoRendererProps> = ({ demo, preview, mode = 'preview' }) => {
  const {
    renderStyle ='auto',
    code,
    codeCopy,
    codeLineNumbers,
    codeSpoiler,
    codeSpoilerMaxHeight,
    previewCenter = true,
    codeFirst = false,
    highlightLines,
    githubUrl
  } = demo as any;

  const shouldShowCode = mode === 'code' && Boolean(code);
  const shouldShowPreview = mode !== 'code' || !code;

  const codeBlock = shouldShowCode && code ? (
    <CodeBlock
      // fullWidth={true}//{renderStyle === 'auto'}
      showCopyButton={codeCopy !== false}
      showLineNumbers={codeLineNumbers === true}
      highlightLines={highlightLines as any}
      spoiler={codeSpoiler}
      spoilerMaxHeight={codeSpoilerMaxHeight}
      language='tsx'
      // githubUrl prop added to frontmatter in demo description.md files
      githubUrl={githubUrl}
      // title prop added to frontmatter in demo description.md files
      // Future: wire demo.fileName / demo.fileIcon if added to generator
      fileName={(demo as any).fileName}
      fileIcon={(demo as any).fileIcon}
      fullWidth
    >
      {code}
    </CodeBlock>
  ) : null;

  if (renderStyle === 'center') {
    return (
      <Card variant="outline" style={{ padding: 24, alignItems: 'center' }}>
        {shouldShowPreview && (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: shouldShowCode ? 16 : 0 }}>
            {preview}
          </View>
        )}
        {codeBlock}
      </Card>
    );
  }

  if (renderStyle === 'code_flex') {
    return (
      <Block>
        <Block
          direction="row"
          gap={24}
          wrap="wrap"
          style={{
            width: '100%',
            alignItems: previewCenter ? 'center' : undefined,
            justifyContent: previewCenter ? 'center' : undefined
          }}
        >
          {codeFirst ? (
            <>
              {codeBlock && (
                <Card variant="outline" style={{ flex: 1, minWidth: 260, padding: 0 }}>
                  {codeBlock}
                </Card>
              )}
              {shouldShowPreview && (
                <Card
                  variant="outline"
                  style={{
                    flex: 1,
                    minWidth: 260,
                    alignItems: previewCenter ? 'center' : undefined,
                    justifyContent: previewCenter ? 'center' : undefined,
                    padding: 16
                  }}
                >
                  {preview}
                </Card>
              )}
            </>
          ) : (
            <>
              {shouldShowPreview && (
                <Card
                  variant="outline"
                  style={{
                    flex: 1,
                    minWidth: 260,
                    alignItems: previewCenter ? 'center' : undefined,
                    justifyContent: previewCenter ? 'center' : undefined,
                    padding: 16
                  }}
                >
                  {preview}
                </Card>
              )}
              {codeBlock && (
                <Card variant="outline" style={{ flex: 1, minWidth: 260, padding: 0 }}>
                  {codeBlock}
                </Card>
              )}
            </>
          )}
        </Block>
      </Block>
    );
  }

  // auto (default)
  return (
    <Card variant="outline" style={{ padding: 16 }}>
      {!codeFirst && shouldShowPreview && (
        <View
          style={{
            marginBottom: shouldShowCode ? 12 : 0,
            alignItems: previewCenter ? 'center' : undefined,
            justifyContent: previewCenter ? 'center' : undefined
          }}
        >
          {preview}
        </View>
      )}
      {codeBlock}
      {codeFirst && shouldShowPreview && (
        <View
          style={{
            marginTop: shouldShowCode ? 12 : 0,
            alignItems: previewCenter ? 'center' : undefined,
            justifyContent: previewCenter ? 'center' : undefined
          }}
        >
          {preview}
        </View>
      )}
    </Card>
  );
};
