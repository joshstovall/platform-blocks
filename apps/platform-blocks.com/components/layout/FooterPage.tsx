import { Linking } from 'react-native';
import { Text, BrandButton, Flex, Divider, Block, useI18n, Grid, GridItem, Link, Title, BrandIcon, Image, Space } from '@platform-blocks/ui';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { DISCORD_INVITE, GITHUB_REPO, NPM_PACKAGE, TWITTER_PROFILE } from 'config/urls';
import { useResponsive } from '../../hooks/useResponsive';

export function FooterContent() {
  const { t } = useI18n();
  const router = useRouter();
  const responsive = useResponsive();

  const handleLinkPress = (href: string, isRoute: boolean = false) => {
    if (isRoute) router.push(href); else {
      if (Platform.OS === 'web') window.open(href, '_blank');
      else Linking.openURL(href).catch(err => console.error('Failed to open URL:', href, err));
    }
  };

  return (
    <Block mt={64}>
      {/* <Divider
        colorVariant='primary'
        size={3}
        mb={48}
      /> */}
      <Flex direction="column" gap="2xl" px={responsive.isMobile ? 12 : 28}>
        {/* Top grid */}

        <Grid columns={12} gap={responsive.isMobile ? 'xs' : 'xl'} style={{ width: '100%', rowGap: responsive.isMobile ? 32 : 48 }}>
          <GridItem span={responsive.isMobile ? 12 : 6}>
            <Title
              // mb={8}
              startIcon={(
                <Image
                  source={require('../../assets/favicon.png')}
                  src="footer-logo"
                  w={26}
                  h={26}
                  resizeMode="contain"
                />
              )}
              // underline
              afterline
              size={36} weight="bold">{t('footer.app.title')}</Title>
            <Flex direction="column" gap="xs">

              <Text size="sm" colorVariant="secondary">{t('footer.app.tagline')}</Text>
              <Flex direction="row" align="center" gap="sm">
                <BrandButton title={t('actions.starOnGithub')} brand="github" variant="ghost" iconPosition="left" size="sm" onPress={() => handleLinkPress(GITHUB_REPO)} />
                <BrandButton title={t('actions.followOnX')} brand="x" variant="ghost" iconPosition="left" size="xs" onPress={() => handleLinkPress(TWITTER_PROFILE)} />
                <BrandButton title={t('actions.joinDiscord')} brand="discord" variant="ghost" iconPosition="left" size="xs" onPress={() => handleLinkPress(DISCORD_INVITE)} />
              </Flex>
            </Flex>
          </GridItem>

          {/* Quick Links */}
          <GridItem span={responsive.isMobile ? 4 : 2}>
            <Flex direction="column" gap="sm">
              <Text size="xs" weight="semibold" colorVariant="info" tracking={1} uppercase>Quick Links</Text>
              <Flex direction="column" gap="xs">
                <Link href={undefined} onPress={() => handleLinkPress('/components', true)} variant="hover-underline" size="sm" color="gray">Components</Link>
                <Link href={undefined} onPress={() => handleLinkPress('/charts', true)} variant="hover-underline" size="sm" color="gray">Charts</Link>
                <Link href={undefined} onPress={() => handleLinkPress('/examples', true)} variant="hover-underline" size="sm" color="gray">Example Apps</Link>
                <Link href={undefined} onPress={() => handleLinkPress('/hooks', true)} variant="hover-underline" size="sm" color="gray">Hooks</Link>
                {/* <Link href={undefined} onPress={() => handleLinkPress('/icons', true)} variant="hover-underline" size="sm" color="gray">Icons</Link> */}
              </Flex>
            </Flex>
          </GridItem>

          {/* Documentation */}
          <GridItem span={responsive.isMobile ? 4 : 2}>
            <Flex direction="column" gap="sm">
              <Text size="xs" weight="semibold" colorVariant="info" tracking={1} uppercase>Documentation</Text>
              <Flex direction="column" gap="xs">
                <Link href={undefined} onPress={() => handleLinkPress('/getting-started', true)} variant="hover-underline" size="sm" color="gray">Getting Started</Link>
                <Link href={undefined} onPress={() => handleLinkPress('/installation', true)} variant="hover-underline" size="sm" color="gray">Installation</Link>
                {/* <Link href={undefined} onPress={() => handleLinkPress('/platforms', true)} variant='hover-underline' size='sm' color='gray'>Platforms</Link> */}
                <Link href={undefined} onPress={() => handleLinkPress('/theming', true)} variant="hover-underline" size="sm" color="gray">Theming</Link>
                <Link href={undefined} onPress={() => handleLinkPress('/localization', true)} variant="hover-underline" size="sm" color="gray">Localization</Link>
                <Link href="/llms.txt" target="_blank" variant="hover-underline" size="sm" color="gray">llms.txt</Link>
              </Flex>
            </Flex>
          </GridItem>

          {/* Resources */}
          <GridItem span={responsive.isMobile ? 4 : 2}>
            <Flex direction="column" gap="sm">
              <Text size="xs" weight="semibold" colorVariant="info" tracking={1} uppercase>Resources</Text>
              <Flex direction="column" gap="xs">
                <Link href={undefined} onPress={() => handleLinkPress('/faq', true)} variant="hover-underline" size="sm" color="gray">FAQ</Link>
                <Link href={undefined} onPress={() => handleLinkPress('/support', true)} variant="hover-underline" size="sm" color="gray">Support</Link>
                <Link href={undefined} onPress={() => handleLinkPress(GITHUB_REPO + '/releases', true)} variant="hover-underline" size="sm" color="gray">Changelog</Link>
                <Link href={undefined} onPress={() => handleLinkPress('/accessibility', true)} variant="hover-underline" size="sm" color="gray">Accessibility</Link>
                <Link href={undefined} onPress={() => handleLinkPress('/sitemap.xml', true)} variant="hover-underline" size="sm" color="gray">Sitemap</Link>
              </Flex>
            </Flex>
          </GridItem>

          {/* Community */}
          {/* <GridItem span={responsive.isMobile ? 4 : 2}>
            <Flex direction='column' gap='sm'>
              <Text size='xs' weight='semibold' colorVariant='info' tracking={1}>COMMUNITY</Text>
              <Flex direction='column' gap='xs'>
                <Flex direction='row' align='center' gap='xs'>
                  <BrandIcon brand='github' size={12} />
                  <Link href={GITHUB_REPO} target='_blank' variant='hover-underline' size='sm' color='gray'>GitHub</Link>
                </Flex>
                <Flex direction='row' align='center' gap='xs'>
                  <BrandIcon brand='npm' size={12} />
                  <Link href={NPM_PACKAGE} target='_blank' variant='hover-underline' size='sm' color='gray'>NPM</Link>
                </Flex>
                <Flex direction='row' align='center' gap='xs'>
                  <BrandIcon brand='discord' size={12} />
                  <Link href={DISCORD_INVITE} target='_blank' variant='hover-underline' size='sm' color='gray'>Discord</Link>
                </Flex>
              </Flex>
            </Flex>
          </GridItem> */}
        </Grid>
      </Flex>
    </Block>
  );
}
