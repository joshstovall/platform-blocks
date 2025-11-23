import { useState } from 'react';
import { Column, Switch, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [homeAlerts, setHomeAlerts] = useState(true);
  const [awayAlerts, setAwayAlerts] = useState(false);

  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text variant="small" colorVariant="muted">
          Interactive states
        </Text>
        <Switch
          checked={homeAlerts}
          onChange={setHomeAlerts}
          label="Home team alerts"
        />
        <Switch
          checked={awayAlerts}
          onChange={setAwayAlerts}
          label="Away team alerts"
        />
      </Column>
      <Column gap="sm">
        <Text variant="small" colorVariant="muted">
          Disabled states
        </Text>
        <Switch defaultChecked label="Lineup lock" disabled />
        <Switch label="Sound effects" disabled />
      </Column>
      <Column gap="sm">
        <Text variant="small" colorVariant="muted">
          Validation helpers
        </Text>
        <Switch
          label="Require broadcast approval"
          required
          error="Approval is needed before publishing."
        />
        <Switch
          defaultChecked
          label="Send pre-game summary"
          description="Dispatch an email recap to coaches and analysts."
        />
      </Column>
    </Column>
  );
}
