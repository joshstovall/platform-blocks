import { Button, Flex, Text, useI18n } from '@platform-blocks/ui';

export default function Demo() {
  const { t, locale, setLocale } = useI18n();
  return (
    <Flex direction="column" gap={12}>
      <Flex direction="row" gap={8}>
        <Button size="sm" variant="secondary" onPress={() => setLocale('en')}>EN</Button>
        <Button size="sm" variant="secondary" onPress={() => setLocale('es')}>ES</Button>
        <Button size="sm" variant="secondary" onPress={() => setLocale('fr')}>FR</Button>
      </Flex>
      <Text size="sm">Locale: {locale}</Text>
      <Button variant="gradient" title={t('button.demo.submit')} />
      <Button variant="ghost" title={t('button.demo.cancel')} />
    </Flex>
  );
}
