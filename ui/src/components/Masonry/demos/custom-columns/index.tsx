import { Masonry } from '../../Masonry';
import type { MasonryItem } from '../../types';
import { Card } from '../../../Card';
import { Text } from '../../../Text';
import { Button } from '../../../Button';
import { Row } from '../../../Layout';
import { useTheme } from '../../../../core/theme';
import { useState } from 'react';

export default function CustomColumnsMasonryDemo() {
  const theme = useTheme();
  const [numColumns, setNumColumns] = useState(3);
  
  const masonryItems: MasonryItem[] = [
    {
      id: '1',
      heightRatio: 1.1,
      content: (
        <Card p={12}>
          <Text variant="h5" style={{ marginBottom: 6 }}>Item 1</Text>
          <Text variant="caption">Content for first item with some extra text.</Text>
        </Card>
      ),
    },
    {
      id: '2',
      heightRatio: 0.8,
      content: (
        <Card p={12}>
          <Text variant="h5" style={{ marginBottom: 6 }}>Item 2</Text>
          <Text variant="caption">Short content.</Text>
        </Card>
      ),
    },
    {
      id: '3',
      heightRatio: 1.3,
      content: (
        <Card p={12}>
          <Text variant="h5" style={{ marginBottom: 6 }}>Item 3</Text>
          <Text variant="caption">Longer content to demonstrate height variation in different column layouts.</Text>
        </Card>
      ),
    },
    {
      id: '4',
      heightRatio: 0.9,
      content: (
        <Card p={12}>
          <Text variant="h5" style={{ marginBottom: 6 }}>Item 4</Text>
          <Text variant="caption">Medium length content.</Text>
        </Card>
      ),
    },
    {
      id: '5',
      heightRatio: 1.5,
      content: (
        <Card p={12}>
          <Text variant="h5" style={{ marginBottom: 6 }}>Item 5</Text>
          <Text variant="caption">Extended content that takes up more space to show how columns adapt.</Text>
        </Card>
      ),
    },
    {
      id: '6',
      heightRatio: 0.7,
      content: (
        <Card p={12}>
          <Text variant="h5" style={{ marginBottom: 6 }}>Item 6</Text>
          <Text variant="caption">Compact.</Text>
        </Card>
      ),
    },
    {
      id: '7',
      heightRatio: 1.2,
      content: (
        <Card p={12}>
          <Text variant="h5" style={{ marginBottom: 6 }}>Item 7</Text>
          <Text variant="caption">Another item with moderate content length for testing.</Text>
        </Card>
      ),
    },
    {
      id: '8',
      heightRatio: 0.9,
      content: (
        <Card p={12}>
          <Text variant="h5" style={{ marginBottom: 6 }}>Item 8</Text>
          <Text variant="caption">Standard content item.</Text>
        </Card>
      ),
    },
    {
      id: '9',
      heightRatio: 1.4,
      content: (
        <Card p={12}>
          <Text variant="h5" style={{ marginBottom: 6 }}>Item 9</Text>
          <Text variant="caption">Taller content to fill out the grid and show column distribution effects.</Text>
        </Card>
      ),
    },
  ];

  return (
    <>
      <Row gap="sm" style={{ marginBottom: 16 }}>
        <Button
          title="1 Column"
          size="sm"
          variant={numColumns === 1 ? 'filled' : 'outline'}
          onPress={() => setNumColumns(1)}
        />
        <Button
          title="2 Columns"
          size="sm"
          variant={numColumns === 2 ? 'filled' : 'outline'}
          onPress={() => setNumColumns(2)}
        />
        <Button
          title="3 Columns"
          size="sm"
          variant={numColumns === 3 ? 'filled' : 'outline'}
          onPress={() => setNumColumns(3)}
        />
        <Button
          title="4 Columns"
          size="sm"
          variant={numColumns === 4 ? 'filled' : 'outline'}
          onPress={() => setNumColumns(4)}
        />
      </Row>

      <Masonry
        data={masonryItems}
        numColumns={numColumns}
        gap="md"
        style={{ height: 400 }}
      />
    </>
  );
}