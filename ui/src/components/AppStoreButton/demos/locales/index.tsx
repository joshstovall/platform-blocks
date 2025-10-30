import React, { useState } from 'react';
import { AppStoreButton, Column, Row, Text, Select } from '@platform-blocks/ui';

export default function AppStoreButtonLocalesDemo() {
  const [selectedLocale, setSelectedLocale] = useState('en');

  const localeOptions = [
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

  return (
    <Column gap="2xl" p="lg">
      <Column gap="sm">
        <Text weight="semibold" size="lg">Localization Support</Text>
        <Text colorVariant="secondary" size="sm">
          App store buttons with multi-language support. Change the locale to see different text.
        </Text>
      </Column>

      <Column gap="lg">
        <Row align="center" gap="md">
          <Text weight="medium" size="sm">Language:</Text>
          <Select
            value={selectedLocale}
            onChange={(value) => setSelectedLocale(value)}
            options={localeOptions}
          />
        </Row>

        <Column gap="lg">
          <Text weight="medium" size="sm">App Store Buttons in {localeOptions.find(l => l.value === selectedLocale)?.label}</Text>
          <Row gap="md" wrap="wrap">
            <AppStoreButton
              store="app-store"
              locale={selectedLocale as any}
            />
            <AppStoreButton
              store="google-play"
              locale={selectedLocale as any}
            />
            <AppStoreButton
              store="microsoft-store"
              locale={selectedLocale as any}
            />
          </Row>
        </Column>

        <Column gap="lg">
          <Text weight="medium" size="sm">Alternative Stores</Text>
          <Row gap="md" wrap="wrap">
            <AppStoreButton
              store="amazon-appstore"
              locale={selectedLocale as any}
              size="md"
            />
            <AppStoreButton
              store="f-droid"
              locale={selectedLocale as any}
              size="md"
            />
          </Row>
        </Column>

  <Column gap="sm">
          <Text weight="medium" size="sm">Note</Text>
          <Text size="xs" colorVariant="secondary">
            Text automatically falls back to English if the selected locale is not available for a specific store.
          </Text>
        </Column>
      </Column>
    </Column>
  );
}