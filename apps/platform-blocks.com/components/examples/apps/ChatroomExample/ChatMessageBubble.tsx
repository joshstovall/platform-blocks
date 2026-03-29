import React, { useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Text, Avatar, Flex, Icon, Chip, useTheme, EmojiPicker } from '@platform-blocks/ui';
import { platformShadow } from '../../../../utils/platformShadow';

import type { Message } from './types';
import { styles } from './styles';

interface ChatMessageBubbleProps {
  message: Message;
  getUserColor: (userName: string) => string;
}

export function ChatMessageBubble({ message: msg, getUserColor }: ChatMessageBubbleProps) {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<string | undefined>(msg.reaction);
  const showTrigger = (hovered || (Platform.OS !== 'web' && showReactions));
  const reactionTrigger = showTrigger ? (
    <View
      style={{
        marginHorizontal: 6,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Pressable
        onPress={() => setShowReactions(r => !r)}
        onLongPress={() => { if (Platform.OS !== 'web') setShowReactions(true); }}
        style={({ pressed }) => ({
          backgroundColor: theme.colors.surface[3],
          borderRadius: 18,
          paddingHorizontal: 10,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          opacity: pressed ? 0.85 : 1,
          borderWidth: 1,
          borderColor: theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          margin: 'auto',
          ...platformShadow({ color: '#000', opacity: 0.15, offsetY: 1, radius: 2, elevation: 1 })
        })}
      >
        <Icon name="smile" size="xs"  />
        <Icon name="chevronDown" size="xs"  />
      </Pressable>
      {showReactions && (
        <View style={{ marginLeft: 6 }}>
          <EmojiPicker
            variant="quick"
            onSelect={(e) => { setReaction(e); setShowReactions(false); }}
          />
        </View>
      )}
    </View>
  ) : null;

  return (
    <View
      style={[
        styles.messageRow,
        msg.isOwn && styles.ownMessageRow,
        { position: 'relative' }
      ]}
      {...(Platform.OS === 'web'
        ? {
            onMouseEnter: () => setHovered(true),
            onMouseLeave: () => { setHovered(false); setShowReactions(false); }
          }
        : {})}
    >
      {!msg.isOwn && (
        <Avatar
          size="sm"
          src={msg.avatarUrl}
          fallback={msg.avatar}
          backgroundColor={getUserColor(msg.user)}
          textColor="white"
          online={msg.isOnline}
          style={styles.messageAvatar}
        />
      )}
  {/* If own message show trigger first on the left */}
  {msg.isOwn && reactionTrigger}
  <View style={[
        styles.messageBubble,
        {
          backgroundColor: msg.isOwn ? '#DCF8C6' : 'white',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          borderBottomLeftRadius: msg.isOwn ? 18 : 4,
          borderBottomRightRadius: msg.isOwn ? 4 : 18,
          elevation: 2,
          ...platformShadow({ color: '#000', opacity: 0.1, offsetY: 1, radius: 2, elevation: 2 })
        }
      ]}>
        {(reaction || msg.reaction) && (
          <Chip
            size="md"
            variant="filled"
            color={theme.colors.surface[9]}
            shadow="md"
            style={
              msg.isOwn ? styles.reactionChipOwn : styles.reactionChip
            }
          >
            {reaction || msg.reaction}
          </Chip>
        )}
        
        {/* Reply section */}
        {msg.replyTo && (
          <View style={[
            styles.replyContainer,
            { 
              backgroundColor: msg.isOwn 
                ? '#B8E6B8'
                : '#F0F0F0',
              borderLeftColor: getUserColor(msg.replyTo.user),
              borderLeftWidth: 4,
              paddingLeft: 12,
            }
          ]}>
            <Text 
              size="xs" 
              weight="semibold"
              color={getUserColor(msg.replyTo.user)}
            >
              {msg.replyTo.user}
            </Text>
            <Text 
              size="xs"
              color={msg.isOwn ? '#666' : '#666'}
              style={styles.replyMessage}
            >
              {msg.replyTo.message.length > 60 
                ? msg.replyTo.message.substring(0, 60) + '...'
                : msg.replyTo.message
              }
            </Text>
          </View>
        )}

        {!msg.isOwn && (
          <Text 
            size="sm" 
            weight="semibold" 
            color={getUserColor(msg.user)}
            style={styles.userName}
          >
            {msg.user}
          </Text>
        )}
        <Text 
          color={msg.isOwn ? '#000' : '#000'}
          style={[styles.messageText, { fontSize: 16 }]}
        >
          {msg.message}
        </Text>
        <Flex direction="row" align="center" justify="flex-end" style={styles.messageFooter}>
          <Text 
            size="xs" 
            color="#666"
            style={[styles.messageTime, { fontSize: 12 }]}
          >
            {msg.time}
          </Text>
          {msg.isOwn && msg.status && (
            <View style={{ marginLeft: 6 }}>
              <Icon
                name={msg.status === 'read' ? 'check' : 'check'}
                size="xs"
                color={msg.status === 'read' ? '#4FC3F7' : '#999'}
              />
            </View>
          )}
        </Flex>
      </View>
  {/* If NOT own message show trigger after bubble on the right */}
  {!msg.isOwn && reactionTrigger}
  {msg.isOwn && (
        <Avatar
          size="sm"
          fallback={msg.avatar}
          backgroundColor="#25D366"
          textColor="white"
          style={styles.messageAvatar}
        />
      )}
    </View>
  );
}
