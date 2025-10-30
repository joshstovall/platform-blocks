import { Blockquote } from '@platform-blocks/ui'

export default function BlockquoteBasicDemo() {
  return (
    <Blockquote
      author={{ name: 'Jane Doe' }}
    >
      This is an amazing product that changed my life.
    </Blockquote>
  )
}