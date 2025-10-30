import React from 'react';
import { Button, Row, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="2xl">
      <Row gap="lg" align="flex-start">
        <Button 
          title="Save" 
          tooltip="Save your current work"
        />
        <Button 
          title="Delete" 
          variant="outline" 
          tooltip="Permanently delete this item"
          tooltipPosition="bottom"
        />
        <Button 
          title="Help" 
          variant="ghost" 
          tooltip="Get help and support"
          tooltipPosition="right"
        />
      </Row>
      
      <Row gap="lg" align="flex-start">
        <Button 
          title="Download" 
          tooltip="Download file to your device"
          tooltipPosition="left"
        />
        <Button 
          icon="⚙️" 
          tooltip="Open settings panel"
        />
        <Button 
          title="Upload" 
          disabled
          tooltip="Feature not available in demo mode"
        />
      </Row>
    </Column>
  );
}
