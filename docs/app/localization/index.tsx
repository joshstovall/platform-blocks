import { Text, Button, useI18n, ToggleBar, Chip, useTheme, Alert, H2, Flex, Block, CodeBlock } from '@platform-blocks/ui';
import { useBrowserTitle, formatPageTitle } from 'hooks/useBrowserTitle';
import { PageLayout } from 'components';
import { DocsPageHeader } from '../../components/DocsPageHeader';

const RESOURCES_SNIPPET = `
import en from './locales/en/common.json';
import fr from './locales/fr/common.json';
import es from './locales/es/common.json';

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es }
};`;

const PROVIDER_SNIPPET = `
import { I18nProvider } from '@platform-blocks/ui';
import { resources } from './resources';

export function App() {
  return (
    <I18nProvider initial={{ resources, locale: 'en', fallbackLocale: 'en' }}>
      <Root />
    </I18nProvider>
  );
}`;

const USAGE_SNIPPET = `
import { Text, useI18n } from '@platform-blocks/ui';

function Greeting() {
  const { t, setLocale, locale } = useI18n();
  return (
    <>
      <Text tx='localization.exampleGreeting' txParams={{ name: 'Ada' }} />
      <Text>{t('localization.current', { locale })}</Text>
      <Button title={t('actions.switchLocale')} onPress={() => setLocale(locale.startsWith('en') ? 'fr' : 'en')} />
    </>
  );
}`;

function LocalizationContent() {
  const { t, setLocale, locale } = useI18n();
  const theme = useTheme();

  const locales = ['en', 'fr', 'es'] as const;

  return (
    <PageLayout>
        <Block gap='md' mb='lg' m={12}>
          <DocsPageHeader
            tx='localization.title'
            action={
              <Alert icon='globe'>
                <Text variant='h4'>{t('localization.helloWorld')}</Text>
              </Alert>
            }
          />
          <Text tx='localization.intro' colorVariant='muted' />
          <Flex direction='row' align='center' justify='space-between' mb="md">
            <Button title={t('actions.switchLocale')} colorVariant='secondary' onPress={() => setLocale(locale.startsWith('en') ? 'fr' : locale.startsWith('fr') ? 'es' : 'en')} />
            <ToggleBar
              value={[locale]}
              onChange={(vals) => { const next = vals[0]; if (typeof next === 'string') setLocale(next); }}
              options={locales.map(l => ({ value: l, label: l.toUpperCase() }))}
            />
          </Flex>

          <Text tx='localization.steps.resources' />
          {/* <Text tx='localization.steps.aggregate' /> */}
          
          <Flex direction="column" gap="xl">
            <CodeBlock title='resources.ts' language='javascript' showLineNumbers highlightLines={['1', '2', '3']}>{RESOURCES_SNIPPET}</CodeBlock>
            <Text tx='localization.steps.provider' />
            <CodeBlock title='App.tsx' language='javascript' showLineNumbers>{PROVIDER_SNIPPET}</CodeBlock>
            {/* <Text tx='localization.steps.usageTx' /> */}
            {/* <Text tx='localization.steps.usageHook' /> */}
            <Text tx='localization.steps.switch' />
            <CodeBlock title='Usage' language='javascript' showLineNumbers>{USAGE_SNIPPET}</CodeBlock>
            {/* <Text tx='localization.steps.format' /> */}
            {/* <Text tx='localization.steps.missing' /> */}
          </Flex>
        </Block>
      </PageLayout>
  );
}

export default function LocalizationPage() {
  // Update browser title
  useBrowserTitle(formatPageTitle('Localization'));
  
  return <LocalizationContent />;
}
