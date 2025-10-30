import React from 'react';
import { Text } from '../Text';
import { FormLabelProps } from './types';

export const FormLabel: React.FC<FormLabelProps> = ({ 
  htmlFor, 
  required, 
  children 
}) => {
  return (
    <Text 
      style={{ 
        fontSize: 14, 
        fontWeight: '600', 
        marginBottom: 4 
      }}
    >
      {children}
      {required && (
        <Text style={{ color: '#e53e3e' }}>
          {' *'}
        </Text>
      )}
    </Text>
  );
};

FormLabel.displayName = 'FormLabel';
