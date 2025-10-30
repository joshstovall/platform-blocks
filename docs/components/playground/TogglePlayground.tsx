import { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { ToggleButton, ToggleGroup, Text, Block, Flex, Icon, Column, Title, Card } from '@platform-blocks/ui';

const TogglePlayground = () => {
  const [alignment, setAlignment] = useState('center');
  const [toggleSide, setToggleSide] = useState('side1');
  const [formats, setFormats] = useState(['bold']);
  const [view, setView] = useState('list');
  const [favorite, setFavorite] = useState(false);
  const [colorVariant, setColorVariant] = useState('error');

  const { width } = useWindowDimensions();
  const isSmall = width < 768;
  return (
    <View>
       {/* Block Section */}
            <Title text="Block" variant="h2" afterline />
            <Text variant="body" colorVariant="secondary">
              Block is a low-level layout primitive with universal props. It can act as a flexible container or item.
            </Text>
            <Card>
              <Block direction="row" justify="space-between" align="center" gap="md">
                <Block p="sm" bg="surface.1"><Text>Item 1</Text></Block>
                <Block p="sm" bg="surface.1"><Text>Item 2</Text></Block>
                <Block p="sm" bg="surface.1"><Text>Item 3</Text></Block>
              </Block>
            </Card>

      <Title afterline>Toggles</Title>

      <Flex direction={isSmall ? 'column' : 'row'} wrap={isSmall ? undefined : 'wrap'}>
      {/* Exclusive Selection */}
      <Column style={styles.section}>
      <Block>
              <Text style={styles.sectionTitle}>Exclusive Selection</Text>
  <ToggleGroup
          value={alignment}
          exclusive
          onChange={(value) => setAlignment(value as string)}
        >
          <ToggleButton value="left">Left</ToggleButton>
          <ToggleButton value="center">Center</ToggleButton>
          <ToggleButton value="right">Right</ToggleButton>
          <ToggleButton value="justify">Justify</ToggleButton>
        </ToggleGroup>
        <Text style={styles.status}>Selected: {alignment || 'None'}</Text>
      </Block>

      {/* Multiple Selection */}
      <Block>
        <Text style={styles.sectionTitle}>Multiple Selection</Text>
        <ToggleGroup
          value={formats}
          onChange={(value) => setFormats(value as string[])}
        >
          <ToggleButton value="bold">Bold</ToggleButton>
          <ToggleButton value="italic">Italic</ToggleButton>
          <ToggleButton value="underline">Underline</ToggleButton>
          <ToggleButton value="color">Color</ToggleButton>
        </ToggleGroup>
        <Text style={styles.status}>
          Selected: {formats.length > 0 ? formats.join(', ') : 'None'}
        </Text>
      </Block>
      </Column>
       {/* Vertical Orientation */}
      <Block>
        <Text style={styles.sectionTitle}>Vertical Orientation</Text>
        <ToggleGroup
          value={view}
          exclusive
          onChange={(value) => setView(value as string)}
          orientation="vertical"
        >
          <ToggleButton value="list">List View</ToggleButton>
          <ToggleButton value="grid">Grid View</ToggleButton>
          <ToggleButton value="Block">Block View</ToggleButton>
        </ToggleGroup>
        <Text style={styles.status}>Selected view: {view}</Text>
      </Block>

      {/* Heart Toggle Button */}
      <Block>
        {/* <Text style={styles.sectionTitle}>Toggle</Text> */}
        <ToggleButton
          value="favorite"
          variant="ghost"
          selected={favorite}
          onPress={() => setFavorite(!favorite)}
        >
         <Icon name="heart" size={24} color={favorite ? 'red' : 'gray'} variant={favorite ? 'filled' : 'outline'} />
        </ToggleButton>
      
      </Block>

      {/* Different Sizes */}
      <Block>
        <Text style={styles.sectionTitle}> Sizes</Text>
        <Flex direction="column" gap={12}>
          <ToggleGroup size="sm" value={toggleSide} exclusive onChange={(value) => setToggleSide(value as string)}>
            <ToggleButton value="side1">Small</ToggleButton>
            <ToggleButton value="side2">sm</ToggleButton>
          </ToggleGroup>
          <ToggleGroup size="md" value={toggleSide} exclusive onChange={(value) => setToggleSide(value as string)}>
            <ToggleButton value="side1">Medium</ToggleButton>
            <ToggleButton value="side2">md</ToggleButton>
          </ToggleGroup>
          <ToggleGroup size="lg" value={toggleSide} exclusive onChange={(value) => setToggleSide(value as string)}>
            <ToggleButton value="side1">Large</ToggleButton>
            <ToggleButton value="side2">lg</ToggleButton>
          </ToggleGroup>
          {/* <ToggleGroup size="xl" value={toggleSide} exclusive onChange={setToggleSide}>
            <ToggleButton value="side1">xl</ToggleButton>
            <ToggleButton value="side2">xl</ToggleButton>
          </ToggleGroup> */}
        </Flex>
      </Block>

      {/* Variant Options */}
      {/* <Block>
        <Text style={styles.sectionTitle}>Variant Options</Text>
        <ToggleGroup
        variant='solid'
        >
          <ToggleButton value="solid">Solid</ToggleButton>
          <ToggleButton value="outline">Outline</ToggleButton>
        </ToggleGroup>


         <ToggleGroup
         variant='ghost'
          exclusive
        >
          <ToggleButton value="solid">Solid</ToggleButton>
          <ToggleButton value="outline">Outline</ToggleButton>
        </ToggleGroup>
      </Block> */}

      {/* Color Variants */}
      <Block>
        <Text style={styles.sectionTitle}>Color Variants</Text>
        <ToggleGroup
          value={colorVariant}
          exclusive
          onChange={(value) => setColorVariant(value as string)}
        >
          <ToggleButton value="error" colorVariant="error">Red</ToggleButton>
          <ToggleButton value="success" colorVariant="success">Green</ToggleButton>
          <ToggleButton value="warning" colorVariant="warning">Yellow</ToggleButton>
        </ToggleGroup>
        <Text style={styles.status}>Selected color: {colorVariant}</Text>
      </Block>
      </Flex>

    </View>
  );
};

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  status: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default TogglePlayground;
