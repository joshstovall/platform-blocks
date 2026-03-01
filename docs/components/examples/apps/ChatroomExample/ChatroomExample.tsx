import React, { useState, useRef } from 'react';
import { SectionList, View, TextInput } from 'react-native';
import { Text, Button, Flex, Icon, useTheme, Block, Chip } from '@platform-blocks/ui';
import { platformShadow } from '../../../../utils/platformShadow';
import { ChatroomHeader } from './ChatroomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Message, MessageStatus } from './types';
import { USER_COLORS } from './types';
import { mockMessages } from './mockData';
import { styles } from './styles';
import { ChatMessageBubble } from './ChatMessageBubble';

export function ChatroomExample() {
  const [message, setMessage] = useState('');
  const [height, setHeight] = useState(40);
  const [recording, setRecording] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<TextInput | null>(null);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // Mock group members (would come from API in real app)
  const teamMembers = [
    { id: '1', initials: 'DS', color: '#25D366', online: true },
    { id: '2', initials: 'AL', color: theme.colors.primary[6], online: true },
    { id: '3', initials: 'RB', color: theme.colors.secondary[6], online: false },
    { id: '4', initials: 'MK', color: theme.colors.tertiary[6], online: true },
    { id: '5', initials: 'JL', color: theme.colors.gray[7], online: false },
    { id: '6', initials: '+', color: theme.colors.gray[5], online: false } // overflow indicator not really online
  ];
  const onlineCount = teamMembers.filter(m => m.online).length;

  // Function to get a consistent color for a user based on their name
  const getUserColor = (userName: string): string => {
    if (userName === 'You') return theme.colors.primary[5]; // Special color for the current user

    // Create a simple hash from the username to ensure consistency
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      const char = userName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use absolute value and modulo to get a valid index
    const colorIndex = Math.abs(hash) % USER_COLORS.length;
    return USER_COLORS[colorIndex];
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const toggleRecording = () => {
    setRecording(r => !r);
  };

  const onContentSizeChange = (e: any) => {
    const next = Math.min(140, Math.max(40, e.nativeEvent.contentSize.height + 8));
    setHeight(next);
  };

  // Group messages by date for SectionList
  const groupedMessages = () => {
    const grouped: { title: string; data: Message[] }[] = [];
    let currentDateGroup: { title: string; data: Message[] } | null = null;

    mockMessages.forEach((msg) => {
      const dateObj = new Date(msg.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let label = '';
      if (msg.date === today.toISOString().split('T')[0]) {
        label = 'Today';
      } else if (msg.date === yesterday.toISOString().split('T')[0]) {
        label = 'Yesterday';
      } else {
        label = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }

      if (!currentDateGroup || currentDateGroup.title !== label) {
        currentDateGroup = { title: label, data: [] };
        grouped.push(currentDateGroup);
      }

      currentDateGroup.data.push(msg);
    });

    return grouped;
  };

  // Flatten messages with date headers for FlatList
  const getMessagesWithDates = () => {
    const items: Array<{ type: 'date' | 'message'; data: any; id: string }> = [];
    const grouped = groupedMessages();

    grouped.forEach((section: { title: string; data: Message[] }) => {
      // Add date header
      items.push({
        type: 'date',
        data: { title: section.title },
        id: `date-${section.title}`
      });

      // Add messages
      section.data.forEach((message: Message) => {
        items.push({
          type: 'message',
          data: message,
          id: `message-${message.id}`
        });
      });
    });

    return items;
  };

  const backgroundImage = {
    uri: 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png',
    opacity: 1,
    overlay: {
      color: theme.colors.primary[8],
      opacity: 0.0
    }
  };
  return (
    <Block
      // @ts-ignore - backgroundImage not yet in BlockProps
      backgroundImage={backgroundImage}
      style={styles.chatBlock}
    >
  <ChatroomHeader />

      <SectionList
        sections={groupedMessages()}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesContainer}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.stickyDateHeader}>
            <Chip
              variant="outline"
              color="muted"
              size="sm"
              shadow="lg"
              style={{
                width: 200,
                backgroundColor: 'rgba(255,255,255,1)',
                borderColor: 'rgba(0,0,0,0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                elevation: 5,
                ...platformShadow({ color: '#000', opacity: 0.25, offsetY: 2, radius: 4, elevation: 5 })
              }}
            >
              {title}
            </Chip>
          </View>
        )}
        renderItem={({ item: msg }) => (
          <ChatMessageBubble
            message={msg}
            getUserColor={getUserColor}
          />
        )}
      />

      {/* Composer (dark-mode adaptive) */}
      {(() => {
        const isDark = theme.colorScheme === 'dark';
        const barBg = isDark ? theme.colors.surface[2] : theme.colors.surface[0];
        const actionBg = isDark ? theme.colors.surface[3] : theme.colors.surface[0];
        const chipShadow = isDark ? 'rgba(0,0,0,0.4)' : '#000';
        const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
        const inputBg = isDark ? theme.colors.surface[3] : theme.colors.surface[0];
        const inputBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
        const iconColor = isDark ? theme.colors.gray[3] : '#555';
        const recordingBg = isDark ? theme.colors.error[7] : '#d9534f';
        const sendBg = theme.colors.primary[6];
        return (
          <View style={{ paddingBottom: insets.bottom || 8, backgroundColor: barBg, borderTopWidth: 1, borderTopColor: borderColor }}>
         
            <Flex direction="row" align="flex-end" gap={8} style={{ paddingHorizontal: 12, paddingTop: 8 }}>
            
              <Button
                variant="ghost"
                size="sm"
                startIcon={<Icon name="paper" size="sm" color={iconColor} />}
                onPress={() => {}}
                title=""
                style={{ width: 36, height: 36, minWidth: 36, borderRadius: 18 }}
              />
              <View
                style={{
                  flex: 1,
                  backgroundColor: inputBg,
                  borderRadius: 20,
                  maxHeight: 160,
                  paddingHorizontal: 14,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: inputBorder,
                  ...platformShadow({
                    color: chipShadow,
                    opacity: isDark ? 0.3 : 0.04,
                    offsetY: 1,
                    radius: 2,
                    elevation: 1
                  })
                }}
              >
                <TextInput
                  ref={inputRef}
                  multiline
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Message #design-system"
                  placeholderTextColor={isDark ? theme.colors.gray[4] : theme.colors.gray[5]}
                  onContentSizeChange={onContentSizeChange}
                  style={{ padding: 0, fontSize: 16, color: theme.text.primary, minHeight: 40, maxHeight: 140 }}
                />
              </View>
              {message.trim().length === 0 && !recording && (
                <Button
                  variant="ghost"
                  size="sm"
                  startIcon={<Icon name="success" size="sm" color={iconColor} />}
                  onPress={() => setShowEmoji(e => !e)}
                  title=""
                  style={{ width: 36, height: 36, minWidth: 36, borderRadius: 18 }}
                />
              )}
              {message.trim().length === 0 ? (
                <Button
                  variant={recording ? 'filled' : 'ghost'}
                  size="sm"
                  startIcon={<Icon name={recording ? 'close' : 'knobs'} size="sm" color={recording ? 'white' : iconColor} />}
                  onPress={toggleRecording}
                  title=""
                  style={{ width: 40, height: 40, minWidth: 40, borderRadius: 20, backgroundColor: recording ? recordingBg : 'transparent' }}
                />
              ) : (
                <Button
                  variant="filled"
                  size="sm"
                  startIcon={<Icon name="chevronRight" size="sm" color="white" />}
                  onPress={handleSendMessage}
                  disabled={!message.trim()}
                  title=""
                  style={{ backgroundColor: sendBg, borderRadius: 20, width: 44, height: 44, minWidth: 44 }}
                />
              )}
            </Flex>
            {recording && (
              <Flex direction="row" align="center" gap={8} style={{ paddingHorizontal: 20, paddingTop: 6 }}>
                <Icon name="knobs" size="sm" color="error" />
                <Text size="xs" weight="500" color="error">Recording... tap again to stop</Text>
              </Flex>
            )}
          </View>
        );
      })()}
      
    </Block>
  );
}
