import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, FlatList, RefreshControl, Dimensions } from 'react-native';
import { Text, Avatar, useTheme } from '@platform-blocks/ui';
import { feedPosts, getUser, feedUsers } from './mockData';
import { PostCard } from './PostCard';
import type { FeedPost } from './types';

interface ActionState {
  likes: Record<string, boolean>;
  saved: Record<string, boolean>;
}

export  function SocialFeedExample() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [screenWidth, setScreenWidth] = useState(() => Dimensions.get('window').width);
  const [actionState, setActionState] = useState<ActionState>(() => ({
    likes: Object.fromEntries(feedPosts.map(p => [p.id, p.liked])),
    saved: Object.fromEntries(feedPosts.map(p => [p.id, !!p.saved]))
  }));

  // Handle screen dimension changes (orientation, etc.)
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    
    return () => subscription?.remove();
  }, []);

  // Calculate max width based on current screen width
  const MAX_WIDTH = Math.max(280, Math.min(460, screenWidth - 32)); // Min 280px, ideal 460px, but never exceed screen width minus padding

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const toggleLike = (postId: string) => {
    setActionState(s => ({ ...s, likes: { ...s.likes, [postId]: !s.likes[postId] } }));
  };
  const toggleSave = (postId: string) => {
    setActionState(s => ({ ...s, saved: { ...s.saved, [postId]: !s.saved[postId] } }));
  };

  const renderHeader = () => (
    <View style={{ paddingVertical: 12, alignItems: 'center' }}>
      <View style={{ width: MAX_WIDTH, paddingHorizontal: 16 }}>
        <FlatList
          data={feedUsers}
          horizontal
          keyExtractor={u => u.id}
          contentContainerStyle={{ paddingHorizontal: 0 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ alignItems: 'center', marginRight: 16 }}>
              <Avatar size={56} src={item.avatar} />
              <Text size="xs" style={{ marginTop: 6 }}>
                {item.handle}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );

  const renderPost = ({ item }: { item: FeedPost }) => (
    <PostCard
      post={item}
      liked={actionState.likes[item.id]}
      saved={actionState.saved[item.id]}
      maxWidth={MAX_WIDTH}
      onToggleLike={toggleLike}
      onToggleSave={toggleSave}
    />
  );

  return (
    <FlatList
      data={feedPosts}
      keyExtractor={p => p.id}
      ListHeaderComponent={renderHeader}
      renderItem={renderPost}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ 
        paddingBottom: 80, 
        alignItems: 'center', 
        paddingHorizontal: 16 // Fixed padding to ensure consistent layout
      }}
    />
  );
}

function timeAgo(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

// formatLikes now handled in PostCard
