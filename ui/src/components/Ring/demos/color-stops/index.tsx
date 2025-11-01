import React from 'react';
import { Card, Column, Block, Flex } from '@platform-blocks/ui';
import { Ring } from '../../Ring';

const stops = [
  { value: 0, color: '#f87171' },
  { value: 60, color: '#fb923c' },
  { value: 75, color: '#f59e0b' },
  { value: 85, color: '#0ea5e9' },
  { value: 92, color: '#14b8a6' },
];

export default function Demo() {
  return (
        <Block direction="row" gap="md" >
          {[48, 72, 97].map(value => (
            <Ring
              key={value}
              value={value}
              size={110}
              thickness={12}
              caption={`${value}%`}
              colorStops={stops}
            />
          ))}
        </Block>
  );
}
