import React from 'react';
import { View } from 'react-native';
import { Card, CodeBlock, Flex, Markdown, Row, Text, Switch, Block } from '@platform-blocks/ui';
import type { NewDemo } from '../utils/newDemosLoader';

export interface DemoRendererProps {
  demo: NewDemo & { code?: string };
  preview: React.ReactNode;
  description?: string;
  showCode?: boolean;
}

/**
 * Layout-aware demo renderer. Uses demo.renderStyle to choose layout.
 *  - auto: vertical stack (preview then code)
 *  - center: centers preview horizontally
 *  - code_flex: side-by-side (wrap to column on small widths via flex wrap)
 */
export const DemoRenderer: React.FC<DemoRendererProps> = ({ demo, preview, description, showCode: showCodeProp = false }) => {
  const {
    renderStyle ='auto',
    code,
    codeCopy,
    codeLineNumbers,
    codeSpoiler,
    codeSpoilerMaxHeight,
    showCodeToggle,
    previewCenter = true,
    codeFirst = false,
    highlightLines,
    githubUrl
  } = demo as any;

  const [showCode, setShowCode] = React.useState(showCodeProp !== false);
  const effectiveShowToggle = showCodeToggle !== false && showCodeProp !== false; // default true, but disable if showCode prop is false

  // Update internal state when prop changes
  React.useEffect(() => {
    setShowCode(showCodeProp !== false);
  }, [showCodeProp]);
  const codeBlock = code && showCode ? (
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
    >
      {code}
    </CodeBlock>
  ) : null;

  const renderDescription = description ? (
    <View style={{ marginBottom: 12 }}>
      <Markdown>{description}</Markdown>
    </View>
  ) : null;

  if (renderStyle === 'center') {
    return (
      <Card variant="outline" style={{ padding: 24, alignItems: 'center' }}>
        {/* {renderDescription} */}
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: codeBlock ? 16 : 0 }}>
          {preview}
        </View>
        {effectiveShowToggle && code && (
          <Row justify="flex-end" mb={codeBlock ? 8 : 0} align="center" gap={8}>
            <Text variant="caption">Show code</Text>
            <Switch
              checked={showCode}
              onChange={setShowCode}
              size="sm"
            />
          </Row>
        )}
        {codeBlock}
      </Card>
    );
  }

  if (renderStyle === 'code_flex') {
    return (
      <Block >
        {code && effectiveShowToggle && (
          <View style={{ width: '100%', }}>
            <Row justify="flex-end" mb={8} align="center" gap={8}>
              <Text variant="caption">Show code</Text>
              <Switch
                checked={showCode}
                onChange={setShowCode}
                size="sm"
              />
            </Row>
          </View>
        )}
        <Block direction="row" gap={24} wrap="wrap" style={{
          width: '100%',
          alignItems: previewCenter ? 'center' : undefined,
          justifyContent: previewCenter ? 'center' : undefined
        }}>
          {codeFirst && codeBlock && <View style={{ flex: 1, minWidth: 260 }}>{codeBlock}</View>}
          <View style={{ flex: 1, minWidth: 260, alignItems: previewCenter ? 'center' : undefined, justifyContent: previewCenter ? 'center' : undefined }}>
            {/* <Card variant="outline" style={{ padding: 16 }}> */}
              {preview}
            {/* </Card> */}
          </View>
          {!codeFirst && codeBlock && <View style={{ flex: 1, minWidth: 260 }}>{codeBlock}</View>}
        </Block>
      </Block>
    );
  }

  // auto (default)
  return (
    <Block variant="outline" style={{ padding: 16 }}>
      {/* {renderDescription} */}
      {!codeFirst && (
        <View style={{ marginBottom: 12, alignItems: previewCenter ? 'center' : undefined, justifyContent: previewCenter ? 'center' : undefined }}>
          {preview}
        </View>
      )}
      {codeFirst && codeBlock}
      {effectiveShowToggle && code && !codeFirst && (
        <Row justify="flex-end" mb={codeBlock ? 8 : 0} align="center" gap={8}>
          <Text variant="caption">Show code</Text>
          <Switch
            checked={showCode}
            onChange={setShowCode}
            size="sm"
          />
        </Row>
      )}
      {!codeFirst && codeBlock}
      {codeFirst && effectiveShowToggle && code && (
        <Row justify="flex-end" mt={8} align="center" gap={8}>
          <Text variant="caption">Show code</Text>
          <Switch
            checked={showCode}
            onChange={setShowCode}
            size="sm"
          />
        </Row>
      )}
      {codeFirst && (
        <View style={{ marginTop: 12, alignItems: previewCenter ? 'center' : undefined, justifyContent: previewCenter ? 'center' : undefined }}>
          {preview}
        </View>
      )}
    </Block>
  );
};
