import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { I18nConfig, I18nContextValue, TranslationDictionary } from './types';

const defaultConfig: I18nConfig = {
  locale: 'en',
  fallbackLocale: 'en',
  resources: { en: { translation: {} } },
  pluralSeparator: '::'
};

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveKey(dict: TranslationDictionary | undefined, key: string): string | ((p: any)=>string) | undefined {
  if (!dict) return undefined;
  if (key in dict) return dict[key];
  // Support nested keys with dot notation
  if (key.includes('.')) {
    const parts = key.split('.');
    let cur: any = dict;
    for (const p of parts) {
      if (cur && typeof cur === 'object') cur = cur[p]; else return undefined;
    }
    if (typeof cur === 'string' || typeof cur === 'function') return cur;
  }
  return undefined;
}

export interface I18nProviderProps {
  initial?: Partial<I18nConfig>;
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ initial, children }) => {
  const merged: I18nConfig = { ...defaultConfig, ...initial, resources: { ...defaultConfig.resources, ...(initial?.resources || {}) } };
  const [locale, setLocale] = useState(merged.locale);

  const t = useCallback((key: string, params?: Record<string, any>) => {
    const current = merged.resources[locale]?.translation;
    const fallback = merged.resources[merged.fallbackLocale]?.translation;
    let entry = resolveKey(current, key) ?? resolveKey(fallback, key);
    if (!entry) {
      merged.onMissingKey?.(key, locale);
      return key; // return key as last resort
    }
    if (typeof entry === 'function') return entry(params || {});
    if (params && Object.keys(params).length) {
      return entry.replace(/{{(.*?)}}/g, (_, p) => {
        const v = params[p.trim()];
        return v == null ? '' : String(v);
      });
    }
    return entry;
  }, [locale, merged]);

  const formatNumber = useCallback((value: number, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, opts).format(value), [locale]);
  const formatDate = useCallback((value: Date, opts?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, opts).format(value), [locale]);
  const formatRelativeTime = useCallback((value: number, unit: Intl.RelativeTimeFormatUnit, opts?: Intl.RelativeTimeFormatOptions) => new Intl.RelativeTimeFormat(locale, opts).format(value, unit), [locale]);
  const hasKey = useCallback((key: string) => !!resolveKey(merged.resources[locale]?.translation, key) || !!resolveKey(merged.resources[merged.fallbackLocale]?.translation, key), [locale, merged]);

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t, formatNumber, formatDate, formatRelativeTime, hasKey }), [locale, t, formatNumber, formatDate, formatRelativeTime, hasKey]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
