import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { PageLayout } from '../../components/PageLayout';
import { DocsPageHeader } from '../../components/DocsPageHeader';
import { Text, CodeBlock, BrandButton, Block, Notice, Column, Grid, GridItem, Flex, useTheme } from '@platform-blocks/ui';
import { useBrowserTitle, formatPageTitle } from 'hooks/useBrowserTitle';

export default function InstallationScreen() {
  // Update browser title
  useBrowserTitle(formatPageTitle('Installation'));
  const theme = useTheme();
  return (
    <PageLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex direction="column" p="lg">
          <DocsPageHeader
            text="Installation"
            action={<BrandButton
              title="View on NPM"
              brand="npm"
              size="md"
              onPress={() => router.push('https://www.npmjs.com/package/@platform-blocks/ui')}
            />}
            subtitle="Get started with Platform Blocks in your React Native project"
          />

               <Block mb="xl" direction="row" gap="xl" wrap>

              {/* Prerequisites */}
              <Block
                radius="lg"
                // borderWidth={1}
                // borderColor='rgba(15, 23, 42, 0.08)'
                p="lg"
                bg={theme.colors.primary[2]}
              >
                <Text variant="h3" >Prerequisites</Text>
                <Text variant="p" mb="md">
                  Before installing PlatformBlocks, make sure you have:
                </Text>
                <Flex ml="md">
                  <Text variant="blockquote">
                    Node.js and npm installed
                  </Text>
                </Flex>
              </Block>

              {/* NPM Installation */}
              <Notice
                title="Install with NPM"
                variant="light"
                sev="success"
                p="lg"
              >
                <Column>
                  <Text variant="p">
                    Install PlatformBlocks via npm:
                  </Text>
                  <CodeBlock language="javascript">
                    npm install @platform-blocks/ui
                  </CodeBlock>
                  <Text variant="small" colorVariant="secondary">
                    This will install the core Platform Blocks library with all components and utilities.
                  </Text>
                </Column>
              </Notice>
            </Block>

          {/* Setup */}
          <Flex direction="column" p="lg" mb="xl">
            {/* <Text variant='h3' mb="md">
              Setup Provider
            </Text>
            <Text variant='p' mb="md">
              Wrap your root component with PlatformBlocksProvider to enable theming:
            </Text>
            <CodeBlock language='tsx'>
              {`import React from 'react';
import { PlatformBlocksProvider } from '@platform-blocks/ui';
import { YourApp } from './YourApp';

export default function App() {
  return (
    <PlatformBlocksProvider>
      <YourApp />
    </PlatformBlocksProvider>
  );
}`}
            </CodeBlock> */}


            {/* Verification */}
            <Text variant="h3" mb="md">
              Verify Installation
            </Text>
            <Text variant="p" mb="md">
              Test your installation with a simple component:
            </Text>
            <CodeBlock language="tsx" spoiler={false}>
              {`import React from 'react';
import { Text, Button, Card } from '@platform-blocks/ui';

export function TestComponent() {
  return (
    <Card variant='outline'>
      <Text variant='h2'>
        Welcome to PlatformBlocks! 🎉
      </Text>
      <Button 
        title='It works!' 
        variant='primary'
        onPress={() => console.log('Success!')}
      />
    </Card>
  );
}`}
            </CodeBlock>
          </Flex>


        </Flex>
      </ScrollView>
    </PageLayout>
  );
}
