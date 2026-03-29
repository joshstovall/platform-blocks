import { NativeModules } from 'react-native';
import { __deviceInfoInternals } from '..';

const getGlobal = () => globalThis as typeof globalThis & { navigator?: any };

const setNavigator = (value: any) => {
  const globalWithNavigator = getGlobal();
  if (typeof value === 'undefined') {
    delete globalWithNavigator.navigator;
  } else {
    globalWithNavigator.navigator = value;
  }
};

describe('detectLocale', () => {
  const originalNavigator = getGlobal().navigator;
  const originalSettingsManager = NativeModules.SettingsManager;

  afterEach(() => {
    setNavigator(originalNavigator);
    NativeModules.SettingsManager = originalSettingsManager;
  });

  it('falls back to en-US when no locale is available', () => {
    setNavigator(undefined);
    (NativeModules as any).SettingsManager = undefined;

    const result = __deviceInfoInternals.detectLocale();

    expect(result.full).toBe('en-US');
    expect(result.language).toBe('en');
    expect(result.region).toBe('US');
  });

  it('uses navigator.languages when navigator.language is missing', () => {
    setNavigator({ languages: ['fr-CA'] });

    const result = __deviceInfoInternals.detectLocale();

    expect(result.full).toBe('fr-CA');
    expect(result.language).toBe('fr');
    expect(result.region).toBe('CA');
  });

  it('falls back to navigator.userLanguage when provided', () => {
    setNavigator({ userLanguage: 'es_MX' });

    const result = __deviceInfoInternals.detectLocale();

    expect(result.full).toBe('es-MX');
    expect(result.language).toBe('es');
    expect(result.region).toBe('MX');
  });

  it('prefers native locale identifiers over browser values', () => {
    (NativeModules as any).SettingsManager = { settings: { AppleLocale: 'pt_BR' } };
    setNavigator({ language: 'en-GB' });

    const result = __deviceInfoInternals.detectLocale();

    expect(result.full).toBe('pt-BR');
    expect(result.language).toBe('pt');
    expect(result.region).toBe('BR');
  });
});
