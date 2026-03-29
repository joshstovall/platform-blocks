import { useState } from 'react';
import type { AppStoreButtonProps } from '@platform-blocks/ui';
import { AppStoreButton, Column, Row, Select, Text } from '@platform-blocks/ui';

type Locale = NonNullable<AppStoreButtonProps['locale']>;

const localeOptions: { value: Locale; label: string }[] = [
  { value: 'en', label: '🇺🇸 English' },
  { value: 'es', label: '🇪🇸 Español' },
  { value: 'fr', label: '🇫🇷 Français' },
  { value: 'de', label: '🇩🇪 Deutsch' },
  { value: 'it', label: '🇮🇹 Italiano' },
  { value: 'pt', label: '🇵🇹 Português' },
  { value: 'ru', label: '🇷🇺 Русский' },
  { value: 'ja', label: '🇯🇵 日本語' },
  { value: 'ko', label: '🇰🇷 한국어' },
  { value: 'zh', label: '🇨🇳 中文' },
];

const featuredStores: AppStoreButtonProps['store'][] = [
  'app-store',
  'google-play',
  'microsoft-store',
];

const alternativeStores: AppStoreButtonProps['store'][] = [
  'amazon-appstore',
  'f-droid',
];

export default function Demo() {
  const [locale, setLocale] = useState<Locale>('en');
  const activeLocale = localeOptions.find((option) => option.value === locale);

  return (
    <Column gap="lg">
      <Row align="center" gap="md" wrap="wrap">
        <Text size="sm" weight="medium">
          Language
        </Text>

        <Select
          value={locale}
          onChange={(value) => value && setLocale(value)}
          options={localeOptions}
        />
      </Row>

      <Column gap="lg">
        <Column gap="xs">
          <Text size="sm" weight="medium">
            Featured stores — {activeLocale?.label}
          </Text>

          <Row gap="md" wrap="wrap">
            {featuredStores.map((store) => (
              <AppStoreButton key={store} store={store} locale={locale} />
            ))}
          </Row>
        </Column>

        <Column gap="xs">
          <Text size="sm" weight="medium">
            Alternative storefronts
          </Text>

          <Row gap="md" wrap="wrap">
            {alternativeStores.map((store) => (
              <AppStoreButton key={store} store={store} locale={locale} />
            ))}
          </Row>
        </Column>
      </Column>
    </Column>
  );
}