// Test file to verify Search component functionality
import React from 'react';
import { Search, KeyCap, Row } from '@platform-blocks/ui';

// This should compile without errors if our types are correct
const TestSearchComponent = () => {
  return (
    <>
      {/* Normal search */}
      <Search placeholder="Normal search" />
      
      {/* Button mode with default spotlight behavior */}
      <Search buttonMode placeholder="Button mode" />
      
      {/* Button mode with custom onPress */}
      <Search 
        buttonMode 
        placeholder="Custom action" 
        onPress={() => console.log('Custom press')} 
      />
      
      {/* Button mode with rightComponent */}
      <Search 
        buttonMode 
        placeholder="With shortcut"
        rightComponent={
          <Row gap={4}>
            <KeyCap size="xs">⌘</KeyCap>
            <KeyCap size="xs">K</KeyCap>
          </Row>
        }
      />
      
      {/* Button mode with both onPress and rightComponent */}
      <Search 
        buttonMode 
        placeholder="Full example"
        onPress={() => console.log('Custom action')}
        rightComponent={
          <Row gap={4}>
            <KeyCap size="xs" variant="outline">Ctrl</KeyCap>
            <KeyCap size="xs" variant="outline">F</KeyCap>
          </Row>
        }
      />
    </>
  );
};

export default TestSearchComponent;