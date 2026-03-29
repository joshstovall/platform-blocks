import type { ComponentProps } from 'react';
import { Notice, Column, Text } from '@platform-blocks/ui';

type Variant = NonNullable<ComponentProps<typeof Notice>['variant']>;

const VARIANT_EXAMPLES: Array<{
  variant: Variant;
  color: NonNullable<ComponentProps<typeof Notice>['color']>;
  title: string;
  body: string;
}> = [
  {
    variant: 'light',
    color: 'primary',
    title: 'Light',
    body: 'Balanced background and border treatment best suited for inline notes.'
  },
  {
    variant: 'outline',
    color: 'success',
    title: 'Outline',
    body: 'Use outline styling for subtle emphasis without increasing background contrast.'
  },
  {
    variant: 'filled',
    color: 'warning',
    title: 'Filled',
    body: 'High-contrast option for urgent or high-visibility messaging.'
  },
  {
    variant: 'subtle',
    color: 'error',
    title: 'Subtle',
    body: 'Removes background color but keeps iconography and text tinted.'
  }
];

export default function Demo() {
  return (
    <Column gap="lg">
      {VARIANT_EXAMPLES.map(({ variant, color, title, body }) => (
        <Notice key={variant} variant={variant} color={color} title={title}>
          {body}
        </Notice>
      ))}
      <Text variant="small" colorVariant="muted">
        Choose a variant that matches the prominence you want without straying from the semantic color.
      </Text>
    </Column>
  );
}
