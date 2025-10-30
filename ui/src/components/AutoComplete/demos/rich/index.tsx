import React, { useState } from 'react';
import {
  AutoComplete,
  Column,
  Row,
  Text,
  Block,
  Divider,
  MenuItemButton,
} from '@platform-blocks/ui';

interface RichSportOption {
  label: string;
  value: string;
  emoji: string;
  color: string;
  price: number;     // Avg ticket price
  duration: string;  // Typical game length / format
}

export default function RichAutoCompleteDemo() {
  const [selectedSport, setSelectedSport] = useState('');

  const richSportData: RichSportOption[] = [
    { label: 'Soccer', value: 'soccer', emoji: '⚽', color: '#22c55e', price: 75.5, duration: '90 min' },
    { label: 'Basketball', value: 'basketball', emoji: '🏀', color: '#f97316', price: 120.0, duration: '48 min' },
    { label: 'American Football', value: 'football', emoji: '🏈', color: '#92400e', price: 180.0, duration: '60 min' },
    { label: 'Tennis', value: 'tennis', emoji: '🎾', color: '#10b981', price: 95.0, duration: 'Best of 3/5' },
    { label: 'Volleyball', value: 'volleyball', emoji: '🏐', color: '#fbbf24', price: 60.0, duration: 'Best of 5' },
    { label: 'Ice Hockey', value: 'ice_hockey', emoji: '🏒', color: '#3b82f6', price: 140.0, duration: '60 min' },
    { label: 'Baseball', value: 'baseball', emoji: '⚾', color: '#ef4444', price: 85.0, duration: '9 innings' },
    { label: 'Golf', value: 'golf', emoji: '⛳', color: '#15803d', price: 110.0, duration: '4–5 hrs' },
  ];

  return (
    <Column gap="md">
      <AutoComplete
        fullWidth
        placeholder="Search sports with rich details..."
        data={richSportData}
        value={selectedSport}
        onChangeText={setSelectedSport}
        onSelect={(item) => setSelectedSport((item as RichSportOption).label)}
        renderItem={(item, index, helpers) => {
          const sport = item as RichSportOption;
          const isLast = index === richSportData.length - 1;
          const isActive = helpers?.isSelected || selectedSport === sport.label;

          return (
            <MenuItemButton
              rounded={false}
              compact
              fullWidth
              active={isActive}
              onPress={() => helpers?.onSelect?.(sport)}
              onMouseDown={(event: any) => {
                event?.preventDefault?.();
                event?.stopPropagation?.();
              }}
              style={{ alignItems: 'stretch', gap: 0 }}
            >
              <Column>
                <Row align="center" gap="md" px="md" py="sm">
                  <Text size="xl" mr="md">
                    {sport.emoji}
                  </Text>
                  <Column grow={1} gap="xs">
                    <Row align="center" gap="sm">
                      <Text weight="semibold">
                        {sport.label}
                      </Text>
                      <Block w={12} h={12} radius="full" bg={sport.color} />
                      <Text size="xs" colorVariant="secondary">
                        {sport.duration}
                      </Text>
                    </Row>
                    <Text size="sm" weight="semibold" color="#2563eb">
                      ${sport.price.toFixed(2)}
                    </Text>
                  </Column>
                </Row>
                {!isLast && <Divider colorVariant="subtle" />}
              </Column>
            </MenuItemButton>
          );
        }}
        minSearchLength={1}
      />

      {selectedSport && (
        <Text size="sm" colorVariant="muted">
          Selected: {selectedSport}
        </Text>
      )}
    </Column>
  );
}
