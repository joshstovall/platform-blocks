import { useState } from 'react'
import { Accordion, Text, Column } from '@platform-blocks/ui'

export default function Demo() {
  const [expanded, setExpanded] = useState(['faq1'])

  return (
    <Column>
      <Text mb="md" size="md" color="#666">
        Expanded: {expanded.join(', ') || 'None'}
      </Text>

      <Accordion
        type="multiple"
        variant="separated"
        expanded={expanded}
        onExpandedChange={setExpanded}
        items={[{
            key: 'faq1',
            title: 'What is React Native?',
            content: (
              <Text>
                React Native is a framework for building mobile applications using React.
                It enables cross-platform development with native performance.
              </Text>)
          },{
            key: 'faq2',
            title: 'Why use PlatformBlocks?',
            content: (
              <Text>
                PlatformBlocks provides a complete design system that works across platforms,
                with consistent styling and behavior.
              </Text>)
          },{
            key: 'faq3',
            title: 'How to customize themes?',
            content: (
              <Text>
                You can customize themes by extending the default theme configuration
                and applying your brand colors and typography.
              </Text>)
          }]}
      />
    </Column>
  )
}
