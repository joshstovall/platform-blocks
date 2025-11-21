import React from 'react';
import { Column, Text, Icon, Badge, Block } from '@platform-blocks/ui';
import { Ring } from '../../Ring';

export default function Demo() {
  return (
    <Block direction="row" gap="xl">
      <Ring
        value={86}
        size={120}
        thickness={14}
        caption="Pipeline"
        colorStops={[
          { value: 0, color: '#60a5fa' },
          { value: 50, color: '#2563eb' },
          { value: 80, color: '#0ea5e9' },
        ]}
      >
        {({ percent }) => (
          <Column align="center" gap={4}>
            <Icon name="Rocket" size={24} color="#2563eb" />
            <Text weight="700">{Math.round(percent)}%</Text>
          </Column>
        )}
      </Ring>
      <Ring
        value={0}
        neutral
        size={110}
        caption={<Badge color="#64748b">Paused</Badge>}
        label="Design System"
        subLabel="--"
  progressColor="rgba(148, 163, 184, 0.4)"
      />
    </Block>
  );
}
