import React from 'react';
import { View, Platform } from 'react-native';
import { Flex, Avatar, Text, Button, Icon, Indicator, useTheme } from '@platform-blocks/ui';
import { styles } from './styles';

export interface ChatroomHeaderProps {
  title?: string;
  subtitle?: string;
}

// Local mock members (could be lifted to parent later)
const buildTeamMembers = (theme: any) => [
  { id: '1', initials: 'DS', color: '#25D366', online: true },
  { id: '2', initials: 'AL', color: theme.colors.primary[6], online: true },
  { id: '3', initials: 'RB', color: theme.colors.secondary[6], online: false },
  { id: '4', initials: 'MK', color: theme.colors.tertiary[6], online: true },
  { id: '5', initials: 'JL', color: theme.colors.gray[7], online: false },
  { id: '6', initials: '+', color: theme.colors.gray[5], online: false }
];

export function ChatroomHeader({ title = 'Design System Team', subtitle = '6 members, 4 online' }: ChatroomHeaderProps) {
  const theme = useTheme();
  const teamMembers = buildTeamMembers(theme);
  const onlineCount = teamMembers.filter(m => m.online).length;

  return (
    <View style={[
      styles.chatHeader, 
      { 
        backgroundColor: '#075E54', 
        borderBottomColor: 'rgba(255,255,255,0.1)',
        // Android-specific fixes
        ...(Platform.OS === 'android' && {
          flexShrink: 0,
          flexGrow: 0,
          overflow: 'hidden'
        })
      }
    ]}>      
      <Flex direction="row" align="center" gap={14} style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', paddingRight: 8 }}>
          {teamMembers.slice(0, 5).map((m, idx) => (
            <View
              key={m.id}
              style={{
                marginLeft: idx === 0 ? 0 : -10,
                borderWidth: 2,
                borderColor: '#075E54',
                borderRadius: 999,
                overflow: 'visible'
              }}
            >
              <View style={{ position: 'relative' }}>
                <Avatar
                  size="sm"
                  fallback={m.initials}
                  backgroundColor={m.color}
                  textColor="white"
                  online={m.online}
                  style={{ boxShadow: 'none' }}
                />
              </View>
            </View>
          ))}
          {teamMembers.length > 5 && (
            <View
              key="overflow"
              style={{
                marginLeft: -10,
                borderWidth: 2,
                borderColor: '#075E54',
                borderRadius: 999,
                overflow: 'visible'
              }}
            >
              <Avatar
                size="sm"
                fallback="+"
                backgroundColor={theme.colors.gray[6]}
                textColor="white"
                online={false}
                style={{ boxShadow: 'none' }}
              />
            </View>
          )}
          <Indicator
            size={18}
            color={theme.colors.success[6]}
            // borderColor="#075E54"
            placement="top-right"
            offset={4}
            style={{
              paddingHorizontal: 4,
              minWidth: 18,
              justifyContent: 'center'
            }}
          >
            <Text size="xs" weight="bold" color="white">{onlineCount}</Text>
          </Indicator>
        </View>
        <View style={{ flex: 1 }}>
          <Text size="lg" weight="semibold" color="white">{title}</Text>
          <Text size="sm" color="white" style={{ opacity: 0.8 }}>{subtitle}</Text>
        </View>
      </Flex>

      <Flex direction="row" gap={8}>
        <Button
          variant="ghost"
          size="sm"
          startIcon={<Icon name="star" size="sm" color="white" />}
          onPress={() => {}}
          title=""
        />
        <Button
          variant="ghost"
          size="sm"
          startIcon={<Icon name="check" size="sm" color="white" />}
          onPress={() => {}}
          title=""
        />
      </Flex>
    </View>
  );
}
