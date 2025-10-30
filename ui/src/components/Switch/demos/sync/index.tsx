import { useState } from 'react';
import { Switch, Text, Column, Card } from '@platform-blocks/ui';

export default function Demo() {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  return (
    <Column gap={24}>
      <Text variant="h6">Basic Switch Usage</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Switch
            checked={notifications}
            onChange={setNotifications}
            label="Enable notifications"
          />
          
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            label="Dark mode"
          />
          
          <Switch
            checked={autoSave}
            onChange={setAutoSave}
            label="Auto-save documents"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={8}>
          <Text variant="body" weight="medium">Current Settings:</Text>
          <Text variant="body">Notifications: {notifications ? 'On' : 'Off'}</Text>
          <Text variant="body">Dark Mode: {darkMode ? 'On' : 'Off'}</Text>
          <Text variant="body">Auto-save: {autoSave ? 'On' : 'Off'}</Text>
        </Column>
      </Card>
    </Column>
  );
}


