import React from 'react';
import { View, StyleSheet, Platform, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { usePathname } from 'expo-router';
import { usePersistentScroll, getSavedScroll } from '../utils/usePersistentScroll';
import { KeyboardAwareLayout, useTheme } from '@platform-blocks/ui';
import { FooterContent } from './layout/FooterPage';

interface PageLayoutProps {
  children: React.ReactNode;
  style?: any;
  contentContainerStyle?: any;
}

export function PageLayout({ children, style, contentContainerStyle }: PageLayoutProps) {
  const theme = useTheme();
  // Use broader ref type to satisfy usePersistentScroll expectations across platforms
  const scrollRef = React.useRef<any>(null);
  const { onScroll: onPersistScroll } = usePersistentScroll(scrollRef, { delayFrames: 2 });
  const pathname = usePathname();
  const dynamicStyles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgrounds.base,
      // backgroundColor: theme.colorScheme === 'dark' ? '#000000' : '#FAFAFA',
      // ...(Platform.OS === 'web' && {
      //   backgroundColor: 'transparent', // allow gradient to define appearance
      //   backgroundImage: theme.colorScheme === 'dark'
      //     ? 'linear-gradient(rgba(0,0,0,0.8), #000000 140px)'
      //     : 'linear-gradient(rgba(250,250,250,0.8), #eaeaeaff 140px)',
      // } as any),
    },
    contentContainer: {
      flexGrow: 1,
      paddingBottom: Platform.OS === 'web' ? 0 : 20, // Add padding for mobile
    },
   
    footerWrapper: {
      marginTop: 'auto', // This pushes footer to bottom when content is short
    },
  }), [theme.colorScheme]);

  // Track scroll position persistently
  const handleScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    onPersistScroll(e.nativeEvent.contentOffset.y);
  }, [onPersistScroll]);

  // Multi-frame restore on theme change to combat layout thrash
  React.useEffect(() => {
    if (!pathname) return;
    let frames = 5;
    const saved = getSavedScroll(pathname) ?? 0;
    const restore = () => {
      if (!scrollRef.current) return;
      try {
        scrollRef.current.scrollTo({ y: saved, animated: false });
      } catch {
        console.warn('PageLayout: scrollTo failed, ref may be invalid');
      }
      if (frames-- > 0) requestAnimationFrame(restore);
    };
    requestAnimationFrame(restore);
  }, [theme.colorScheme, pathname]);

  return (
    <KeyboardAwareLayout
      style={dynamicStyles.container}
      contentContainerStyle={[dynamicStyles.contentContainer, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      scrollRef={scrollRef}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        onScroll: handleScroll,
        scrollEventThrottle: 16,
      }}
    >
      <View style={style}>
        {children}
      </View>
      <View style={dynamicStyles.footerWrapper}>
        <FooterContent />
      </View>
    </KeyboardAwareLayout>
  );
}
