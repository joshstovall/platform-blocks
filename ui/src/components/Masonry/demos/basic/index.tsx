import { Masonry } from '../../Masonry';
import type { MasonryItem } from '../../types';
import { Card } from '../../../Card';
import { Text } from '../../../Text';
import { useTheme } from '../../../../core/theme';

export default function BasicMasonryDemo() {
  const theme = useTheme();
  
  const masonryItems: MasonryItem[] = [
    {
      id: '1',
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Card 1</Text>
          <Text variant="body">This is a basic card item in the masonry layout.</Text>
        </Card>
      ),
    },
    {
      id: '2',
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Card 2</Text>
          <Text variant="body">Short content.</Text>
        </Card>
      ),
    },
    {
      id: '3',
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Card 3</Text>
          <Text variant="body">A third card showing how items are arranged in the masonry grid with longer content that will make this card taller than the others.</Text>
        </Card>
      ),
    },
    {
      id: '4',
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Card 4</Text>
          <Text variant="body">Medium length content here.</Text>
        </Card>
      ),
    },
    {
      id: '5',
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Card 5</Text>
          <Text variant="body">Fifth card in the masonry layout grid.</Text>
        </Card>
      ),
    },
    {
      id: '6',
      content: (
        <Card p={16}>
          <Text variant="h4" style={{ marginBottom: 8 }}>Card 6</Text>
          <Text variant="body">Sixth card showing the two-column arrangement.</Text>
        </Card>
      ),
    },
  ];

  return (
    <Masonry
      data={masonryItems}
      numColumns={2}
      gap="md"
      style={{ height: 400 }}
    />
  );
}