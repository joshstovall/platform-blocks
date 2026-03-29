import { useState } from 'react';
import { Column, Radio, RadioGroup, Text } from '@platform-blocks/ui';

const TEAMS = ['Falcons', 'Tigers', 'Sharks'] as const;

export default function Demo() {
  const [favoriteTeam, setFavoriteTeam] = useState<string>('Tigers');
  const [ticketType, setTicketType] = useState<string>('reserved');

  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text variant="small" colorVariant="muted">
          Standalone radios
        </Text>
        <Column gap="xs">
          {TEAMS.map((team) => (
            <Radio
              key={team}
              value={team}
              checked={favoriteTeam === team}
              onChange={setFavoriteTeam}
              label={team}
            />
          ))}
        </Column>
      </Column>

      <Column gap="sm">
        <Text variant="small" colorVariant="muted">
          Grouped selection
        </Text>
        <RadioGroup
          value={ticketType}
          onChange={setTicketType}
          options={[
            { label: 'General admission', value: 'general' },
            { label: 'Reserved seating', value: 'reserved' },
            { label: 'VIP hospitality', value: 'vip' }
          ]}
        />
      </Column>
    </Column>
  );
}


