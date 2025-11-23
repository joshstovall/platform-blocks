import React from 'react';
import { View } from 'react-native';
import { Disclaimer, type DisclaimerProps } from './Disclaimer';

export interface DisclaimerSupport {
  disclaimer?: React.ReactNode;
  disclaimerProps?: Omit<DisclaimerProps, 'children'>;
}

/**
 * Hook that renders a disclaimer below content if provided
 */
export function useDisclaimer(
  disclaimer?: React.ReactNode,
  disclaimerProps?: Omit<DisclaimerProps, 'children'>
) {
  const renderDisclaimer = React.useCallback(() => {
    if (!disclaimer) return null;
    
    return (
      <Disclaimer {...disclaimerProps}>
        {disclaimer}
      </Disclaimer>
    );
  }, [disclaimer, disclaimerProps]);

  return renderDisclaimer;
}

/**
 * Utility function to wrap component content with disclaimer
 */
export function withDisclaimer(
  content: React.ReactNode,
  disclaimer?: React.ReactNode,
  disclaimerProps?: Omit<DisclaimerProps, 'children'>
): React.ReactNode {
  if (!disclaimer) {
    return content;
  }

  return (
    <View>
      {content}
      <Disclaimer {...disclaimerProps}>
        {disclaimer}
      </Disclaimer>
    </View>
  );
}

/**
 * Utility to extract disclaimer props from component props
 */
export function extractDisclaimerProps<T extends DisclaimerSupport>(
  props: T
): {
  disclaimerProps: Pick<T, 'disclaimer' | 'disclaimerProps'>;
  otherProps: Omit<T, 'disclaimer' | 'disclaimerProps'>;
} {
  const { disclaimer, disclaimerProps, ...otherProps } = props;
  return {
    disclaimerProps: { disclaimer, disclaimerProps },
    otherProps: otherProps as Omit<T, 'disclaimer' | 'disclaimerProps'>
  };
}