export type TranslationDictionary = Record<string, string | ((params: Record<string, any>) => string)>;

export interface I18nResources {
  [locale: string]: {
    translation: TranslationDictionary;
  };
}

export interface I18nConfig {
  locale: string;          // current active locale code (e.g. 'en', 'en-US')
  fallbackLocale: string;  // fallback when key missing in current locale
  resources: I18nResources; // registered resources
  onMissingKey?: (key: string, locale: string) => void; // diagnostics hook
  pluralSeparator?: string; // default: '::'
}

export interface I18nContextValue {
  locale: string;
  setLocale: (next: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  formatNumber: (value: number, opts?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date, opts?: Intl.DateTimeFormatOptions) => string;
  formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit, opts?: Intl.RelativeTimeFormatOptions) => string;
  hasKey: (key: string) => boolean;
}
