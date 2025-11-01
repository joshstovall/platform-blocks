import React from 'react';
import { useThemeMode } from '@platform-blocks/ui';
import { NavIconButton, NavIconButtonProps } from './NavIconButton';

type HeaderThemeToggleProps = Omit<NavIconButtonProps, 'icon' | 'onPress' | 'accessibilityLabel'>;

export const HeaderThemeToggle: React.FC<HeaderThemeToggleProps> = (props) => {
  const { mode, cycleMode } = useThemeMode();
  const icon = mode === 'light' ? 'sun' : mode === 'dark' ? 'moon' : 'contrast';
  const tooltipLabel =
    mode === 'light' ? 'Light mode' : mode === 'dark' ? 'Dark mode' : 'System theme';
  
  return (
    <NavIconButton 
      {...props}
      icon={icon as any} 
      onPress={cycleMode}
      accessibilityLabel={`Switch theme mode. Current: ${mode}`}
      size="md"
      variant="filled"
      tooltipLabel={tooltipLabel}
    />
  );
};
