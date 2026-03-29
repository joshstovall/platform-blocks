import React from 'react';
import { View } from 'react-native';

import { resolveOptionalModule } from './optionalModule';

type LinearGradientProps = {
  children?: React.ReactNode;
  style?: any;
  colors?: string[];
  locations?: number[];
  start?: { x: number; y: number } | [number, number];
  end?: { x: number; y: number } | [number, number];
  [key: string]: any;
};

const LinearGradientFallback: React.FC<LinearGradientProps> = ({ children, style, colors }) => {
  const styles = [
    colors?.[0] ? { backgroundColor: colors[0] } : undefined,
    ...(Array.isArray(style) ? style : style ? [style] : []),
  ].filter(Boolean);

  return React.createElement(View, { style: styles }, children);
};

export function resolveLinearGradient() {
  const linearGradientModule = resolveOptionalModule<React.ComponentType<any>>('expo-linear-gradient', {
    accessor: (mod) => mod?.LinearGradient ?? mod?.default ?? mod,
    devWarning: 'expo-linear-gradient not installed; gradient-based components fall back to solid colors.',
  });

  const LinearGradientComponent = linearGradientModule ?? LinearGradientFallback;
  const hasLinearGradient = !!linearGradientModule;

  return {
    LinearGradient: LinearGradientComponent,
    hasLinearGradient,
  } as const;
}

type DocumentPickerModule = {
  getDocumentAsync?: (...args: any[]) => Promise<any>;
};

export function resolveDocumentPicker() {
  const documentPickerModule = resolveOptionalModule<DocumentPickerModule>('expo-document-picker', {
    devWarning: 'expo-document-picker not installed; native file picker support is disabled.',
  });

  const hasDocumentPicker = !!documentPickerModule?.getDocumentAsync;

  return {
    DocumentPicker: documentPickerModule,
    hasDocumentPicker,
  } as const;
}
