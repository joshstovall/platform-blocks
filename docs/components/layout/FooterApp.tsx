import { DISCORD_INVITE, GITHUB_REPO, NPM_PACKAGE, TWITTER_PROFILE } from 'config/urls';
import React from 'react';
import { Linking } from 'react-native';
import { Flex, Text, Button, useTheme, Link, useI18n, BrandIcon } from '@platform-blocks/ui';

export const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();
  return (
    <Flex direction="row" justify="space-between" align="center" style={{ padding: 4, width: '100%', backgroundColor: theme.colors.surface[4] + '40' }}>
      {/* <Text size="sm" colorVariant="muted">© {currentYear} Platform Blocks</Text> */}
      <Flex direction="row" gap="xs" align="center" ml="sm">
        <Text size="xs" colorVariant="muted">{t('footer.builtBy')}</Text>
               <Link size="xs" href="https://joshuastovall.com" target="_blank" variant="hover-underline"  color="secondary">Joshua Stovall</Link>
 <Text size="xs" colorVariant="muted">© {currentYear} Platform Blocks</Text>
      </Flex>
      <Flex direction="row" gap="md">
        <Button
          size="xs"
          variant="ghost"
          title="NPM"
          startIcon={<BrandIcon brand="npm" size={16} />}
          onPress={() => Linking.openURL(NPM_PACKAGE)}
        />
        <Button
          size="xs"
          variant="ghost"
          title="GitHub"
          startIcon={<BrandIcon brand="github" size={16} />}
          onPress={() => Linking.openURL(GITHUB_REPO)}
        />
        {/* <Button
          size="xs"
          variant="ghost"
          title="X (Twitter)"
          startIcon={<BrandIcon brand="x" size={16} />}
          onPress={() => Linking.openURL(TWITTER_PROFILE)}
        /> */}
        <Button
          size="xs"
          variant="ghost"
          title="Discord"
          startIcon={<BrandIcon brand="discord" size={16} />}
          onPress={() => Linking.openURL(DISCORD_INVITE)}
        />
      </Flex>
    </Flex>
  );
};
