import { View } from 'react-native';
import { Highlight } from '../..';
import { Text } from '../../../../components/Text';

const SENTENCE = 'Platform Blocks brings patterns, blocks, and building tools together.';

export default function HighlightMultipleDemo() {
  return (
    <View>
      <Text variant="subtitle">Multiple values</Text>
      <Highlight highlight={['blocks', 'tools']}>{SENTENCE}</Highlight>
    </View>
  );
}