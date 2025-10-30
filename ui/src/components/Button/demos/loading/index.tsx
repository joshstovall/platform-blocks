import React, { useState } from 'react';
import { Button, Row } from '@platform-blocks/ui';

export default function Demo() {
  const [loading, setLoading] = useState(false);

  return (
    <Row align="flex-start" gap="lg">
       <Button
        title="Submit Application"
        loading={loading}
        tooltip="Click to submit your application"
        onPress={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      />
      <Button
        title="Submit Application"
        loadingTitle="Submitting..."
        loading={loading}
        tooltip="This shows custom loading text"
        tooltipPosition="bottom"
        onPress={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      />
      {/* disabled button */}
      <Button
        title="Submit Application"
        loadingTitle="Disabled and Loading..."
        loading={loading}
        disabled={loading}
        tooltip="This button is disabled while loading"
        tooltipPosition="right"
        onPress={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      />
  </Row>
  );
}
