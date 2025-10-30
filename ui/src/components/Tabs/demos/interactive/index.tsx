import { useState } from 'react';
import { Tabs, Text } from '@platform-blocks/ui';

export default function InteractiveTabsDemo() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Tabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
      items={[
        {
          key: 'dashboard',
          label: '🏠 Dashboard',
          content: <Text>Dashboard content with analytics and metrics.</Text>
        },
        {
          key: 'settings',
          label: '⚙️ Settings',
          content: <Text>Application settings and preferences.</Text>
        },
        {
          key: 'profile',
          label: '👤 Profile',
          content: <Text>User profile information and preferences.</Text>
        }
      ]}
    />
  );
}
