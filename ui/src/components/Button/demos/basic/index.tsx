import { Button, useToast } from '@platform-blocks/ui'
export default function Demo() {
  const toast = useToast()
  return (
    <Button
      onPress={
        () => toast.success('Button clicked successfully!')
      } >
      Click Me
    </Button>
  )
}
