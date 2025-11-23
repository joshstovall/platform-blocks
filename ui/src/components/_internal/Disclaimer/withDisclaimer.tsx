import React from 'react';
import { View } from 'react-native';
import { Disclaimer, type DisclaimerProps } from './Disclaimer';

export interface WithDisclaimerProps {
  disclaimer?: React.ReactNode;
  disclaimerProps?: Omit<DisclaimerProps, 'children'>;
}

/**
 * Component wrapper that adds disclaimer functionality
 */
export interface ComponentWithDisclaimerProps extends WithDisclaimerProps {
  children: React.ReactNode;
}

export const ComponentWithDisclaimer: React.FC<ComponentWithDisclaimerProps> = ({
  children,
  disclaimer,
  disclaimerProps
}) => {
  if (!disclaimer) {
    return <>{children}</>;
  }

  return (
    <View>
      {children}
      <Disclaimer {...disclaimerProps}>
        {disclaimer}
      </Disclaimer>
    </View>
  );
};