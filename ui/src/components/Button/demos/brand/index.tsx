import { BrandButton, Column, useToast } from '@platform-blocks/ui'
export default function Demo() {
  const toast = useToast()
  return (
    <Column>
      <BrandButton brand="discord" title="Sign in with Discord" />
      <BrandButton brand="youtube" title="Sign in with YouTube" />
      <BrandButton brand="instagram" title="Sign in with Instagram" onPress={() => toast.show({ message: 'Instagram button clicked!' })} />
      <BrandButton brand="google" title="Sign in with Google" />
      <BrandButton brand="apple" title="Sign in with Apple" />
      <BrandButton brand="facebook" title="Sign in with Facebook" />
      <BrandButton brand="github" title="Sign in with GitHub" />
      <BrandButton brand="linkedin" title="Sign in with LinkedIn" />
    </Column>
  )
}
