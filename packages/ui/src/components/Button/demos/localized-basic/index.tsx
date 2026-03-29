import { Button, Column, Row, Text, useI18n } from '@platform-blocks/ui';

export default function Demo() {
  const { t, locale, setLocale } = useI18n();
  const localeVariant = (key: string) => (locale === key ? 'filled' : 'secondary');

  return (
    <Column gap="md">
      <Row gap="sm" wrap="wrap">
        <Button size="sm" variant={localeVariant('en')} onPress={() => setLocale('en')}>
          English
        </Button>
        <Button size="sm" variant={localeVariant('es')} onPress={() => setLocale('es')}>
          Español
        </Button>
        <Button size="sm" variant={localeVariant('fr')} onPress={() => setLocale('fr')}>
          Français
        </Button>
      </Row>
      <Text variant="small" colorVariant="muted">
        Active locale: {locale}
      </Text>
      <Button variant="gradient" title={t('button.demo.submit')} />
      <Button variant="ghost" title={t('button.demo.cancel')} />
    </Column>
  );
}
