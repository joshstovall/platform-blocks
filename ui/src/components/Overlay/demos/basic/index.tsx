import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Overlay, Text, Flex, Button } from '@platform-blocks/ui';

const HERO_IMAGE = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png';
const GRADIENT_IMAGE = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png';
const BLUR_IMAGE = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png';

export default function BasicOverlayDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <Flex direction="column" gap="2xl" style={styles.wrapper}>
      <View style={styles.example}>
        <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.image} imageStyle={styles.imageInner}>
          {visible && (
            <Overlay color="#000" backgroundOpacity={0.8} radius="xl" />
          )}
          <View style={styles.caption}>
            <Text variant="h4" weight="semibold" color="white">Toggle overlay</Text>
            <Text color="white" align="center" mt="xs">
              Overlay fills its parent. Use backgroundOpacity to dim without affecting children.
            </Text>
          </View>
        </ImageBackground>
        <Button title={visible ? 'Hide overlay' : 'Show overlay'} onPress={() => setVisible(v => !v)} style={styles.button} />
      </View>

      <View style={styles.example}>
        <ImageBackground source={{ uri: GRADIENT_IMAGE }} style={styles.image} imageStyle={styles.imageInner}>
          <Overlay
            gradient="linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 75%)"
            radius="xl"
          >
            <Flex direction="column" align="flex-start" gap="xs" style={styles.overlayContent}>
              <Text variant="h4" weight="semibold" color="white">Gradient spotlight</Text>
              <Text color="white">
                When gradient is provided, color/backgroundOpacity are ignored on web for vivid fades.
              </Text>
            </Flex>
          </Overlay>
        </ImageBackground>
      </View>

      <View style={styles.example}>
        <ImageBackground source={{ uri: BLUR_IMAGE }} style={styles.image} imageStyle={styles.imageInner}>
          <Overlay color="#000" backgroundOpacity={0.35} blur={18} radius="xl" center>
            <Flex direction="column" align="center" gap="sm" style={styles.overlayContent}>
              <Text variant="h4" weight="semibold" color="white">Glass overlay</Text>
              <Text color="white" align="center">
                Combine blur with partial opacity for glassmorphism. Blur is web-only.
              </Text>
            </Flex>
          </Overlay>
        </ImageBackground>
      </View>
    </Flex>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 24,
  },
  example: {
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
  caption: {
    padding: 20,
  },
  button: {
    marginTop: 16,
  },
  overlayContent: {
    padding: 24,
  },
});
