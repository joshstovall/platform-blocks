import { Divider, Row, Column, Text, Icon } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={24}>
      <Row gap={16} align="center" style={{ height: 100 }}>
        <Column gap={8} align="center">
          <Text variant="h4">Profile</Text>
          <Text variant="body" colorVariant="secondary">View Profile</Text>
        </Column>
        
        <Divider orientation="vertical" />
        
        <Column gap={8} align="center">
          <Text variant="h4">Settings</Text>
          <Text variant="body" colorVariant="secondary">Preferences</Text>
        </Column>
        
        <Divider 
          orientation="vertical" 
          label={<Icon name="star" />}
          color="#28a745"
        />
        
        <Column gap={8} align="center">
          <Text variant="h4">Help</Text>
          <Text variant="body" colorVariant="secondary">Support</Text>
        </Column>
      </Row>
      
      <Row gap={12} align="center" style={{ padding: 12, borderRadius: 8 }}>
        <Text variant="body">Home</Text>
        <Divider orientation="vertical"    color="#28a745"/>
        <Text variant="body">Products</Text>
          <Divider 
          orientation="vertical" 
          label={<Icon name="star" />}
          color="#28a745"
        />
         <Text variant="body">About</Text>
        <Divider orientation="vertical" />
        <Text variant="body">Contact</Text>
      </Row>
    </Column>
  );
}


