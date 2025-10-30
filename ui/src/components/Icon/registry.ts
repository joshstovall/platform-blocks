import type { IconRegistry } from './types';

// Registry to store all available icons
export const iconRegistry: IconRegistry = {};

// Function to register new icons
export const registerIcon = (name: string, definition: IconRegistry[string]) => {
  iconRegistry[name] = definition;
};

// Function to register multiple icons
export const registerIcons = (icons: IconRegistry) => {
  Object.assign(iconRegistry, icons);
};

// Function to get all registered icon names
export const getIconNames = (): string[] => {
  return Object.keys(iconRegistry);
};

// Function to check if an icon exists
export const hasIcon = (name: string): boolean => {
  return name in iconRegistry;
};