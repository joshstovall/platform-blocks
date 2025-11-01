import React from 'react';
import { View } from 'react-native';

type LinearGradientProps = {
  children?: React.ReactNode;
  style?: any;
  colors?: string[];
  locations?: number[];
  start?: { x: number; y: number } | [number, number];
  end?: { x: number; y: number } | [number, number];
  [key: string]: any;
};

let linearGradientCache: React.ComponentType<any> | null | undefined;
let linearGradientAvailable = false;
let warnedLinearGradient = false;

const LinearGradientFallback: React.FC<LinearGradientProps> = ({ children, style, colors }) => {
  if (__DEV__ && !warnedLinearGradient) {
    console.warn('expo-linear-gradient not installed; gradient-based components fall back to solid colors.');
    warnedLinearGradient = true;
  }
  const styles = [
    colors?.[0] ? { backgroundColor: colors[0] } : undefined,
    ...(Array.isArray(style) ? style : style ? [style] : []),
  ].filter(Boolean);

  return React.createElement(View, { style: styles }, children);
};

export function resolveLinearGradient() {
  if (linearGradientCache === undefined) {
    try {
      const mod = require('expo-linear-gradient');
      linearGradientCache = mod?.LinearGradient ?? mod?.default ?? mod;
      linearGradientAvailable = !!linearGradientCache;
    } catch {
      linearGradientCache = LinearGradientFallback;
      linearGradientAvailable = false;
    }
  }

  if (!linearGradientCache) {
    linearGradientCache = LinearGradientFallback;
    linearGradientAvailable = false;
  }

  return {
    LinearGradient: linearGradientCache,
    hasLinearGradient: linearGradientAvailable,
  } as const;
}

type DocumentPickerModule = {
  getDocumentAsync?: (...args: any[]) => Promise<any>;
};

let documentPickerCache: DocumentPickerModule | null | undefined;
let warnedDocumentPicker = false;

export function resolveDocumentPicker() {
  if (documentPickerCache === undefined) {
    try {
      documentPickerCache = require('expo-document-picker');
    } catch {
      documentPickerCache = null;
    }
  }

  const hasDocumentPicker = !!documentPickerCache?.getDocumentAsync;

  if (!hasDocumentPicker && __DEV__ && !warnedDocumentPicker) {
    console.warn('expo-document-picker not installed; native file picker support is disabled.');
    warnedDocumentPicker = true;
  }

  return {
    DocumentPicker: documentPickerCache,
    hasDocumentPicker,
  } as const;
}
