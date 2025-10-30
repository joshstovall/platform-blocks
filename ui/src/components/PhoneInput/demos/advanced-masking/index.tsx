import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PhoneInput } from '../../PhoneInput';

// Simple test to verify the PhoneInput with new masking works
export default function PhoneInputMaskTest() {
  const [value, setValue] = useState('');
  const [formatted, setFormatted] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Phone Input Masking Test</Text>
      
      <PhoneInput
        label="US Phone (React-IMask Style)"
        value={value}
        onChange={(raw: string, fmt: string) => {
          setValue(raw);
          setFormatted(fmt);
          console.log('Phone input:', { raw, formatted: fmt });
        }}
        country="US"
        showCountryCode={true}
        placeholder="Enter phone number"
      />
      
      <View style={styles.output}>
        <Text>Raw: {value}</Text>
        <Text>Formatted: {formatted}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 20,
  },
  output: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 16,
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  }
});