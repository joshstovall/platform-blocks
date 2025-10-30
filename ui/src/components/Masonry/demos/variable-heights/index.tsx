import { Masonry } from '../../Masonry';
import type { MasonryItem } from '../../types';
import { Card } from '../../../Card';
import { Text } from '../../../Text';
import { useTheme } from '../../../../core/theme';

export default function VariableHeightsMasonryDemo() {
  const theme = useTheme();
  
  const masonryItems: MasonryItem[] = [
    {
      id: '1',
      heightRatio: 1.2,
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Tall Card</Text>
          <Text variant="body">
            This is a taller card with more content to demonstrate the variable height 
            functionality. It shows how items with different heights are arranged in 
            the masonry layout to create an organic, staggered appearance.
          </Text>
        </Card>
      ),
    },
    {
      id: '2',
      heightRatio: 0.7,
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Short Card</Text>
          <Text variant="body">A shorter card with minimal content.</Text>
        </Card>
      ),
    },
    {
      id: '3',
      heightRatio: 1.8,
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Very Tall Card</Text>
          <Text variant="body">
            This card is extra tall to showcase the masonry layout's ability to handle 
            significant height variations. Lorem ipsum dolor sit amet, consectetur 
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna 
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </Text>
          <Text variant="body" style={{ marginTop: 8 }}>
            Additional paragraph to make it even taller and show how the layout adapts 
            to content of different sizes naturally.
          </Text>
        </Card>
      ),
    },
    {
      id: '4',
      heightRatio: 1.0,
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Regular Card</Text>
          <Text variant="body">A standard height card with regular content length.</Text>
        </Card>
      ),
    },
    {
      id: '5',
      heightRatio: 0.9,
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Medium Card</Text>
          <Text variant="body">Medium height card with moderate content.</Text>
        </Card>
      ),
    },
    {
      id: '6',
      heightRatio: 1.5,
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Extended Card</Text>
          <Text variant="body">
            An extended card that demonstrates how the masonry layout handles 
            items that are taller than average, creating natural flow patterns.
          </Text>
        </Card>
      ),
    },
    {
      id: '7',
      heightRatio: 0.6,
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Compact</Text>
          <Text variant="body">Compact card.</Text>
        </Card>
      ),
    },
    {
      id: '8',
      heightRatio: 2.0,
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Extra Tall Card</Text>
          <Text variant="body">
            This is the tallest card in the set, demonstrating the maximum height 
            variation supported by the masonry layout. It shows how very tall items 
            are positioned while maintaining good visual balance.
          </Text>
          <Text variant="body" style={{ marginTop: 8 }}>
            The masonry layout algorithm ensures that even with extreme height 
            differences, the overall composition remains visually pleasing and 
            well-balanced across columns.
          </Text>
          <Text variant="body" style={{ marginTop: 8 }}>
            This extra content makes the card significantly taller than others to 
            really showcase the variable height capabilities.
          </Text>
        </Card>
      ),
    },
  ];

  return (
    <Masonry
      data={masonryItems}
      numColumns={2}
      gap="lg"
      optimizeItemArrangement={true}
      style={{ height: 600 }}
    />
  );
}