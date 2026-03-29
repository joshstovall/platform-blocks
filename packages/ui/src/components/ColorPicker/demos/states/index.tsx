import { useState } from 'react';
import { ColorPicker, Column, Text } from '@platform-blocks/ui';

const sections = [
  {
    title: 'Interactive state',
    helper: 'Updates value immediately',
    controlled: true,
    pickerProps: {
      label: 'Choose color',
    },
  },
  {
    title: 'Disabled',
    helper: 'Preview only',
    pickerProps: {
      label: 'Disabled picker',
      value: '#CCCCCC',
      disabled: true,
    },
  },
  {
    title: 'With error',
    pickerProps: {
      label: 'Required color',
      value: '',
      error: 'Color selection is required',
      required: true,
    },
  },
  {
    title: 'With description',
    controlled: true,
    pickerProps: {
      label: 'Brand color',
      description: "Choose your brand's primary color",
    },
  },
];

export default function Demo() {
  const [color, setColor] = useState('#FF6B6B');

  return (
    <Column gap="md" fullWidth>
      {sections.map(({ title, helper, controlled, pickerProps }) => {
        const sharedProps = controlled
          ? { value: color, onChange: setColor }
          : {};

        return (
          <Column key={title} gap="xs" fullWidth>
            <Text size="sm" weight="semibold">
              {title}
            </Text>
            <ColorPicker {...pickerProps} {...sharedProps} fullWidth />
            {helper && (
              <Text size="xs" colorVariant="secondary">
                {helper}
              </Text>
            )}
          </Column>
        );
      })}
    </Column>
  );
}
