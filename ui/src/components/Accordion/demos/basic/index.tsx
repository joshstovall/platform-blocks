import { Accordion, Text } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Accordion
      type="single"
      items={[
        {
          key: 'what-is',
          title: 'What is React Native?',
          content: (
            <Text>
              React Native is a framework for building mobile applications using React. 
            </Text>
          )
        },
        {
          key: 'why-use',
          title: 'Why use a design system?',
          content: (
            <Text>
              Design systems provide consistency, efficiency, and scalability to development.
            </Text>
          )
        },
        {
          key: 'getting-started',
          title: 'How do I get started?',
          content: (
            <Text>
              Install the PlatformBlocks package, start building! 
              Check our documentation for detailed setup instructions.
            </Text>
          )
        }
      ]}
    />
  )
}