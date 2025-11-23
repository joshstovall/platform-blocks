import { Highlight } from '../..';
import { Text } from '../../../../components/Text';
import type { PlatformBlocksTheme } from '../../../../core/theme/types';
import { Block } from '../../../Block';

const copy = 'You can customize the highlight style to match brand colors or emphasis states.';

const getAccentStyles = (theme: PlatformBlocksTheme) => ({
  backgroundColor: 'transparent',
  color: theme.colors.primary?.[7] ?? theme.text.primary,
  textDecorationLine: 'underline' as const,
  fontWeight: '700' as const,
});

export default function HighlightStyledDemo() {
  return (
    <Block>
      <Text variant="h5">Custom styles</Text>
      <Highlight highlight={['customize', 'brand']} highlightStyles={getAccentStyles}>
        {copy}
      </Highlight>
    </Block>
  );
}
