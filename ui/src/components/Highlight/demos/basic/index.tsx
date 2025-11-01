import { View } from 'react-native';
import { Highlight } from '../..';
import { Text } from '../../../../components/Text';

const PARAGRAPH = 'Highlight This, definitely THIS and also this!';

export default function HighlightBasicDemo() {
  return (
    <View>
      <Text variant="subtitle">Case-insensitive match</Text>
      <Highlight highlight="this">{PARAGRAPH}</Highlight>
    </View>
  );
}