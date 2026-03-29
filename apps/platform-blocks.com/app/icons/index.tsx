import { Flex, Card, Text, Title, Grid } from '@platform-blocks/ui';
import { Icon } from '@platform-blocks/ui';
import { getIconNames } from 'platform-blocks/components/Icon/registry';
import { PageWrapper } from 'components/PageWrapper';
import { useBrowserTitle, formatPageTitle } from 'hooks/useBrowserTitle';

export default function IconsScreen() {
  // Update browser title
  useBrowserTitle(formatPageTitle('Icons'));

  const ICONS = getIconNames();
  return (
    <PageWrapper>
      <Title afterline>Icon Library</Title>
      <Grid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} gap="md" mt="md">
        {ICONS.sort().map(name => (
          <Card key={name} p="md" style={{}}>
            <Flex direction="column" align="center" gap="xs">
              <Icon name={name as any} size={36} />
              <Text size="xs" align="center">{name}</Text>
            </Flex>
          </Card>
        ))}
      </Grid>
    </PageWrapper>
  );
}
