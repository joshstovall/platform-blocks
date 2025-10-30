import { Tabs, Text } from '@platform-blocks/ui';
import { View } from 'react-native';
import { useState } from 'react';

export default function NavigationOnlyTabsDemo() {
  const [activeTab, setActiveTab] = useState('home');

  const tabItems = [
    { key: 'home', label: 'Home', content: <></> },
    { key: 'products', label: 'Products', content: <></> },
    { key: 'about', label: 'About', content: <></> },
    { key: 'contact', label: 'Contact', content: <></> }
  ];

  return (
    <View>
      {/* Navigation only - separated from content */}
      <Tabs
        items={tabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="chip"
        navigationOnly={true}
        style={{ marginBottom: 20 }}
      />
      
      {/* Custom content based on active tab */}
      <View style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        {activeTab === 'home' && (
          <Text>Welcome to our homepage! This content is rendered separately from the tabs.</Text>
        )}
        {activeTab === 'products' && (
          <Text>Browse our amazing products here. The tab navigation is completely separate.</Text>
        )}
        {activeTab === 'about' && (
          <Text>Learn more about our company and mission. Navigation and content are decoupled.</Text>
        )}
        {activeTab === 'contact' && (
          <Text>Get in touch with us! The tabs above control what content shows here.</Text>
        )}
      </View>
    </View>
  );
}
