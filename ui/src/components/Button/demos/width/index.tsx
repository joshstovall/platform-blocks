import React, { useState } from 'react';
import { Button, Column, Text } from '@platform-blocks/ui';

export default function WidthButtonDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <Column gap="lg" p="lg">
      <Text variant="h6">Width Control</Text>
      
      {/* Default width */}
      <Button title="Default width" />
      
      {/* Using w prop with fixed width */}
      <Button title="Fixed width 200" w={200} />
      
      {/* Using w prop with percentage */}
      <Button title="50% width" w="50%" />
      
      {/* Using traditional width prop (takes precedence over w) */}
      <Button title="Width prop 150" width={150} w={200} />
      
      {/* Full width (existing prop) */}
      <Button title="Full Width Primary Button" fullWidth />
      
  <Text variant="h6" mt="xl">Loading State Width Preservation</Text>
      
      {/* Demonstrates automatic width preservation during loading */}
      <Button 
        title="This is a longer button text that will be preserved during loading"
        loading={loading}
        loadingTitle="Loading..."
        onPress={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      />
      
      {/* Demonstrates with empty loading title */}
      <Button 
        title="Short text"
        loading={loading}
        onPress={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      />
    </Column>
  );
}
