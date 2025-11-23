import { useState, type ComponentProps } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Button, Column, Overlay, Text } from '@platform-blocks/ui';

const HERO_IMAGE = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png';
const GRADIENT_IMAGE = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png';
const BLUR_IMAGE = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png';

type OverlayExample = {
  key: string;
  image: string;
  title: string;
  description: string;
  align?: 'flex-start' | 'center';
  overlayProps: Omit<ComponentProps<typeof Overlay>, 'children'>;
};

const STATIC_EXAMPLES: OverlayExample[] = [
  {
    key: 'gradient',
    image: GRADIENT_IMAGE,
    title: 'Gradient spotlight',
    description: 'When `gradient` is provided, the overlay renders a vivid fade instead of a solid tint.',
    overlayProps: {
      gradient: 'linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 75%)',
      radius: 'xl',
    },
  },
  {
    key: 'blurred',
    image: BLUR_IMAGE,
    title: 'Glass overlay',
    description: 'Blend blur with partial opacity to achieve a glassmorphism effect (blur is web-only).',
    align: 'center',
    overlayProps: {
      color: '#000',
      backgroundOpacity: 0.35,
      blur: 18,
      radius: 'xl',
      center: true,
    },
  },
];

export default function Demo() {
  const [visible, setVisible] = useState(true);

  return (
    <Column gap="xl" align="center" style={styles.wrapper}>
      <Column gap="md" style={styles.section}>
        <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.image} imageStyle={styles.imageInner}>
          {visible ? <Overlay color="#000" backgroundOpacity={0.8} radius="xl" /> : null}
          <Column gap="xs" align="center" style={styles.overlayContent}>
            <Text variant="h4" weight="semibold" color="white">
              Toggle overlay
            </Text>
            <Text color="white" align="center">
              Overlay fills its parent. Use `backgroundOpacity` to dim the background without affecting children.
            </Text>
          </Column>
        </ImageBackground>
        <Button onPress={() => setVisible((current) => !current)}>
          {visible ? 'Hide overlay' : 'Show overlay'}
        </Button>
      </Column>

      {STATIC_EXAMPLES.map(({ key, image, overlayProps, align = 'flex-start', title, description }) => (
        <Column key={key} gap="sm" style={styles.section}>
          <ImageBackground source={{ uri: image }} style={styles.image} imageStyle={styles.imageInner}>
            <Overlay {...overlayProps}>
              <Column gap="xs" align={align} style={styles.overlayContent}>
                <Text variant="h4" weight="semibold" color="white">
                  {title}
                </Text>
                <Text color="white" align={align === 'center' ? 'center' : 'left'}>
                  {description}
                </Text>
              </Column>
            </Overlay>
          </ImageBackground>
        </Column>
      ))}

      <Text variant="small" colorVariant="muted" align="center">
        Overlay inherits the size of its container, making it ideal for dimming media, spotlights, and modal scrims.
      </Text>
    </Column>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  section: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  imageInner: {
    borderRadius: 24,
  },
  overlayContent: {
    padding: 24,
  },
});
