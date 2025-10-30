import { Flex, Avatar, Text, Card } from '@platform-blocks/ui';

export default function AvatarStatusDemo() {
  return (
    <Flex direction="column" gap={20}>
      <Flex direction="row" gap={16} wrap="wrap" align="center">
        <Avatar size="sm" fallback="JS" online label="Josh" description="Online" src="https://randomuser.me/api/portraits/men/1.jpg"/>
        <Avatar size="md" fallback="AL" online label="Alice" description="Available"  src="https://randomuser.me/api/portraits/women/1.jpg"/>
        <Avatar size="lg" fallback="MK" online label="Mike" description="Working"  src="https://randomuser.me/api/portraits/men/2.jpg"/>
        <Avatar size="xl" fallback="TR" online label="Tori" description="Online"  src="https://randomuser.me/api/portraits/women/2.jpg"/>
      </Flex>
     
    </Flex>
  );
}
