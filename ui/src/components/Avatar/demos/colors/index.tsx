import { Avatar, Column } from '@platform-blocks/ui';

export default function ColorsAvatarDemo() {
  return (
    <Column align="flex-start">
     <Avatar
        // src="https://randomuser.me/api/portraits/men/1.jpg"
        fallback="AB"
        backgroundColor="#FF6B6B"
        label="Custom Red Background"
      />
    </Column>
  )
}
