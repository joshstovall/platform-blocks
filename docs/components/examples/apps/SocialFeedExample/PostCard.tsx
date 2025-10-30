import React, { useCallback, useRef } from 'react';
import { View, Pressable, Animated, Dimensions } from 'react-native';
import { Card, Flex, Text, Avatar, Icon, Menu, MenuItem, MenuDivider, MenuDropdown, useTheme, Button, Image, Carousel } from '@platform-blocks/ui';
import { getUser } from './mockData';
import type { FeedPost } from './types';

export interface PostCardProps {
  post: FeedPost;
  liked: boolean;
  saved: boolean;
  maxWidth: number;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = React.memo(function PostCard({
  post,
  liked,
  saved,
  maxWidth,
  onToggleLike,
  onToggleSave,
}) {
  const theme = useTheme();
  const user = getUser(post.userId);

  const handleLike = useCallback(() => onToggleLike(post.id), [onToggleLike, post.id]);
  const handleSave = useCallback(() => onToggleSave(post.id), [onToggleSave, post.id]);

  const images = post.images && post.images.length > 0 ? post.images : [post.image];
  const isAlbum = images.length > 1;
  const [index, setIndex] = React.useState(0);
  const [carouselSize, setCarouselSize] = React.useState(0);
  const lastTapRef = useRef<number | null>(null);
  const likeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    setIndex(0);
  }, [images.length]);

  const animateLike = useCallback(() => {
    likeAnim.setValue(0);
    Animated.timing(likeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [likeAnim]);

  const handleDoubleTap = useCallback(() => {
    if (!liked) handleLike();
    animateLike();
  }, [liked, handleLike, animateLike]);

  const handleImagePress = useCallback(() => {
    const now = Date.now();
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      handleDoubleTap();
    }
    lastTapRef.current = now;
  }, [handleDoubleTap]);

  const handleSlideChange = useCallback((nextIndex: number) => {
    setIndex(nextIndex);
  }, []);

  const likeScale = likeAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.3, 1, 0.9] });
  const likeOpacity = likeAnim.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 1, 0] });

  // Ensure maxWidth doesn't exceed screen width
  const screenWidth = Dimensions.get('window').width;
  const safeMaxWidth = Math.min(maxWidth, screenWidth - 16); // Leave 16px margin on each side

  return (
    <Card
      p={0}
      variant="outline"
      style={{
        marginBottom: 20,
        overflow: 'hidden',
        width: safeMaxWidth,
        alignSelf: 'center',
        backgroundColor: theme.colors.surface[1],
      }}
      
    >
      <Flex direction="row" align="center" justify="space-between" p={12}>
        <Flex direction="row" align="center" gap={10}>
          <Avatar size={40} src={user.avatar} />
          <Flex direction="column" gap={2}>
            <Flex direction="row" align="center" gap={4}>
              <Text weight="semibold">{user.handle}</Text>
              {user.verified && <Icon name="success" size={14} color={theme.colors.primary[6]} variant='filled'/>}
            </Flex>
            <Text size="xs" colorVariant="muted">{timeAgo(post.createdAt)}</Text>
          </Flex>
        </Flex>
        {/* Post action menu (horizontal ellipsis) */}
        <Menu position="bottom-end">
          <Button
            variant="ghost"
            size="sm"
            icon={<Icon name="dots" size={18} color={theme.colors.gray[6]} />}
            style={{ padding: 4, minWidth: undefined }}
          />
          <MenuDropdown>
            <MenuItem onPress={() => console.log('Share post', post.id)} leftSection={<Icon name="share" size={14} color={theme.colors.gray[7]} />}>Share</MenuItem>
            <MenuItem onPress={() => console.log('Copy link', post.id)} leftSection={<Icon name="link" size={14} color={theme.colors.gray[7]} />}>Copy Link</MenuItem>
            <MenuItem onPress={() => console.log('Bookmark', post.id)} leftSection={<Icon name="bookmark" size={14} color={theme.colors.gray[7]} />}>Bookmark</MenuItem>
            <MenuDivider />
            <MenuItem color="danger" onPress={() => console.log('Report post', post.id)} leftSection={<Icon name="trash" size={14} color={theme.colors.error[6]} />}>Report</MenuItem>
          </MenuDropdown>
        </Menu>
      </Flex>
      {/* Image / Album */}
      <View
        style={{ width: '100%', aspectRatio: 1, backgroundColor: theme.colors.gray[2], position: 'relative' }}
        onLayout={e => {
          const width = e.nativeEvent.layout.width;
          setCarouselSize(width);
        }}
      >
        {isAlbum ? (
          carouselSize > 0 && (
            <Carousel
              height={carouselSize}
              loop={false}
              showDots={true}
              showArrows={true}
              onSlideChange={handleSlideChange}
              slideGap={0}
              style={{ flex: 1, width: '100%' }}
            >
              {images.map((img, i) => (
                <Pressable key={img + i} style={{ flex: 1 }} onPress={handleImagePress}>
                  <Image
                    src={img}
                    style={{ width: '100%', height: '100%' }}
                    imageStyle={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </Carousel>
          )
        ) : (
          <Pressable style={{ flex: 1 }} onPress={handleImagePress}>
            <Image
              src={images[0]}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              imageStyle={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </Pressable>
        )}
        {/* Like burst */}
        <Animated.View pointerEvents="none" style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -50, marginTop: -50, opacity: likeOpacity, transform: [{ scale: likeScale }], width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="heart" size={80} color={theme.colors.error[5]} />
        </Animated.View>
      
      </View>
      <Flex direction="row" align="center" justify="space-between" p={12}>
        <Flex direction="row" align="center" gap={16}>
          <Pressable onPress={handleLike} style={{ padding: 4 }}>
            <Icon name="heart" size={24}
              color={liked ? theme.colors.error[6] : theme.colors.gray[7]}
              variant={liked ? 'filled' : 'outlined'}
            />
          </Pressable>
          <Pressable style={{ padding: 4 }}>
            <Icon name="paper" size={24} color={theme.colors.gray[7]} />
          </Pressable>
          <Pressable style={{ padding: 4 }}>
            <Icon name="chat" size={24} color={theme.colors.gray[7]} />
          </Pressable>
        </Flex>
        <Pressable onPress={handleSave} style={{ padding: 4 }}>
          <Icon name="bookmark" size={24}
            color={saved ? theme.colors.warning[6] : theme.colors.gray[7]}
            variant={saved ? 'filled' : 'outlined'}
          />
        </Pressable>
      </Flex>
      <Flex px={12} pb={14} gap={6} direction='column'>

        <Flex direction="row" align="center" justify="space-between" gap={8} fullWidth>
        <Text weight="semibold">{formatLikes(post.likeCount, liked)}</Text>
        <Pressable><Text size="xs" colorVariant="muted">View all {post.commentCount} comments</Text></Pressable>
     
      </Flex>
        <Text><Text weight="semibold">{user.handle}</Text> {post.caption}</Text>
      </Flex>
    </Card>
  );
});

function timeAgo(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatLikes(base: number, liked: boolean) {
  const count = liked ? base + 1 : base;
  if (count < 1000) return `${count} likes`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}k likes`;
  return `${(count / 1000000).toFixed(1)}M likes`;
}
