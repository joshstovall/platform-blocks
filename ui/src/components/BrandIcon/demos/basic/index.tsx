import React from 'react';
import { BrandIcon } from '../../BrandIcon';
import { Text, Card, Column, Row, Title } from '../../../..';
import type { BrandName } from '../../BrandIcon';

// Available brand icons for the demo
const FEATURED_BRANDS: BrandName[] = [
  'google', 'facebook', 'apple', 'github', 'x', 'microsoft', 'linkedin', 
  'discord', 'slack', 'chrome', 'openai', 'spotify', 'youtube'
];

const ALL_BRANDS: BrandName[] = [
  'google', 'facebook', 'discord', 'android', 'apple', 'app-store', 'openai', 'chrome',
  'spotify', 'github', 'x', 'microsoft', 'linkedin', 'slack', 'youtube', 
  'youtubeMusic', 'mastercard', 'visa', 'reddit', 'amazon', 'twitch', 'tiktok'
];

export default function BrandIconDemo() {
  return (
    <Column gap="xl">
      <Column gap="xs">
        <Text variant="h4">BrandIcon</Text>
        <Text variant="body" colorVariant="secondary">
          High-quality brand icons with multi-color support and automatic dark mode theming.
        </Text>
      </Column>

      {/* Original Colors */}
      <Card variant="outline" p="xl">
        <Column gap="lg">
          <Column gap="xs">
            <Text variant="h6">Original Brand Colors</Text>
            <Text variant="body" colorVariant="secondary">
              Icons displayed in their authentic brand colors.
            </Text>
          </Column>

          <Row align="center" gap="md" wrap="wrap">
            {FEATURED_BRANDS.map((brand) => (
              <Column key={brand} align="center" gap="xs">
                <BrandIcon brand={brand} size="xl" />
                <Text variant="caption" align="center">
                  {brand}
                </Text>
              </Column>
            ))}
          </Row>
        </Column>
      </Card>

      {/* Different Sizes */}
      <Card variant="outline" p="xl">
        <Column gap="lg">
          <Column gap="xs">
            <Text variant="h6">Sizes</Text>
            <Text variant="body" colorVariant="secondary">
              Available in multiple sizes from small to extra large.
            </Text>
          </Column>

          <Row align="center" gap="lg" wrap="wrap">
            <Column align="center" gap="sm">
              <BrandIcon brand="google" size="sm" />
              <Text variant="caption">sm</Text>
            </Column>
            <Column align="center" gap="sm">
              <BrandIcon brand="google" size="md" />
              <Text variant="caption">md</Text>
            </Column>
            <Column align="center" gap="sm">
              <BrandIcon brand="google" size="lg" />
              <Text variant="caption">lg</Text>
            </Column>
            <Column align="center" gap="sm">
              <BrandIcon brand="google" size="xl" />
              <Text variant="caption">xl</Text>
            </Column>
          </Row>
        </Column>
      </Card>

      {/* Mono Variant with Custom Color */}
      <Card variant="outline" p="xl">
        <Column gap="lg">
          <Column gap="xs">
            <Text variant="h6">Mono Variant</Text>
            <Text variant="body" colorVariant="secondary">
              Single-color icons that can be customized to match your theme.
            </Text>
          </Column>

          <Column gap="md">
            <Row align="center" gap="md" wrap="wrap">
              <Title variant="caption" colorVariant="secondary">Default Color:</Title>
              {FEATURED_BRANDS.slice(0, 6).map((brand) => (
                <BrandIcon key={brand} brand={brand} size="xl" variant="mono" />
              ))}
            </Row>

            <Row align="center" gap="md" wrap="wrap">
              <Title variant="caption" colorVariant="secondary">Custom Blue:</Title>
              {FEATURED_BRANDS.slice(0, 6).map((brand) => (
                <BrandIcon key={brand} brand={brand} size="xl" variant="mono" color="#1976D2" />
              ))}
            </Row>

            <Row align="center" gap="md" wrap="wrap">
              <Title variant="caption" colorVariant="secondary">Custom Red:</Title>
              {FEATURED_BRANDS.slice(0, 6).map((brand) => (
                <BrandIcon key={brand} brand={brand} size="xl" variant="mono" color="#D32F2F" />
              ))}
            </Row>
          </Column>
        </Column>
      </Card>

      {/* Dark Mode Support */}
      <Card variant="outline" p="xl">
        <Column gap="lg">
          <Column gap="xs">
            <Text variant="h6">Dark Mode Support</Text>
            <Text variant="body" colorVariant="secondary">
              Some brands automatically invert from black to white in dark mode.
            </Text>
          </Column>

          <Row align="center" gap="lg" wrap="wrap">
            <Column align="center" gap="sm">
              <BrandIcon brand="apple" size="xl" />
              <Text variant="caption">Apple</Text>
              <Text variant="caption" colorVariant="secondary">Auto Dark Mode</Text>
            </Column>
            <Column align="center" gap="sm">
              <BrandIcon brand="github" size="xl" />
              <Text variant="caption">GitHub</Text>
              <Text variant="caption" colorVariant="secondary">Auto Dark Mode</Text>
            </Column>
            <Column align="center" gap="sm">
              <BrandIcon brand="x" size="xl" />
              <Text variant="caption">X (Twitter)</Text>
              <Text variant="caption" colorVariant="secondary">Auto Dark Mode</Text>
            </Column>
          </Row>
        </Column>
      </Card>

      {/* All Available Brands */}
      <Card variant="outline" p="xl">
        <Column gap="lg">
          <Column gap="xs">
            <Text variant="h6">All Available Brands</Text>
            <Text variant="body" colorVariant="secondary">
              Complete collection of supported brand icons.
            </Text>
          </Column>

          <Row align="center" gap="md" wrap="wrap">
            {ALL_BRANDS.map((brand) => (
              <Column key={brand} align="center" gap="xs" minWidth={60}>
                <BrandIcon brand={brand} size={36} />
                <Text variant="caption" align="center" size={10}>
                  {brand}
                </Text>
              </Column>
            ))}
          </Row>
        </Column>
      </Card>
    </Column>
  );
}