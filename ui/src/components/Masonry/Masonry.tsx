import React from 'react';
import { View, ViewStyle } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { factory, Factory } from '../../core/factory';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils/spacing';
import { getSpacing } from '../../core/theme/sizes';
import { Text } from '../Text';
import { Loader } from '../Loader';
import type { MasonryProps, MasonryItem } from './types';
import { Block } from '../Block';

export type { MasonryProps, MasonryItem } from './types';

const DefaultItemRenderer: React.FC<{ item: MasonryItem; index: number; gap: number }> = ({
  item,
  index,
  gap
}) => {
  return (
    <View style={{ padding: gap / 2, ...item.style }} key={item.id}>
      {item.content}
    </View>
  );
};

export const Masonry = factory<Factory<{ props: MasonryProps; ref: View }>>(
  (props, ref) => {
    // const { width } = useWindowDimensions();
    const { spacingProps, otherProps } = extractSpacingProps(props);
    
    const {
      data = [],
      numColumns = 2,
      gap = 'sm',
      optimizeItemArrangement = true,
      renderItem,
      contentContainerStyle,
      style,
      testID,
      loading = false,
      emptyContent,
      flashListProps = {},
      ...restProps
    } = otherProps;

    const resolvedGap = getSpacing(gap);
    const spacingStyle = getSpacingStyles(spacingProps);

    // FlashList performance hints (overridable via flashListProps). Use loose typing to avoid version/type mismatches.
    const finalFlashListProps = React.useMemo(() => {
      const p: any = { ...flashListProps };
      if (p.estimatedItemSize == null) p.estimatedItemSize = 180;
      if (p.keyExtractor == null) p.keyExtractor = (item: MasonryItem) => item.id;
      return p;
    }, [flashListProps]);

    const renderMasonryItem = ({ item, index }: { item: MasonryItem; index: number }): React.ReactElement => {
      if (renderItem) {
        return (
          <View>
            {renderItem(item, index)}
          </View>
        );
      }

      return (
        <DefaultItemRenderer item={item} index={index} gap={resolvedGap} />
      );
    };

    const masonryStyle: ViewStyle = {
      flex: 1,
      width: '100%',
    };

    const containerStyle: ViewStyle = {
      ...spacingStyle,
      ...style,
    };

    // Show loading state
    if (loading) {
      return (
        <View ref={ref} style={[containerStyle, { justifyContent: 'center', alignItems: 'center', minHeight: 200 }]} testID={testID}>
          <Loader size="lg" />
        </View>
      );
    }

    // Show empty state
    if (data.length === 0) {
      const defaultEmptyContent = (
        <View style={{ justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <Text variant="p" style={{ color: '#888' }}>No items to display</Text>
        </View>
      );

      return (
        <View ref={ref} style={containerStyle} testID={testID}>
          {emptyContent || defaultEmptyContent}
        </View>
      );
    }

    return (
        <FlashList
        masonry
          data={data}
          renderItem={renderMasonryItem}
          numColumns={numColumns}
          
          key={`masonry-${numColumns}`} // Force re-render when numColumns changes
          contentContainerStyle={[
            {
            //   paddingHorizontal: resolvedGap / 2,
            //   paddingVertical: resolvedGap / 2,
            },
            contentContainerStyle as any
          ]}
          style={masonryStyle}
          {...(optimizeItemArrangement && {
            // Enable staggered grid layout for true masonry effect
            getItemType: (item: MasonryItem) => 
              item.heightRatio ? `height-${Math.ceil(item.heightRatio * 10)}` : 'default'
          })}
          {...finalFlashListProps}
        />
    );
  }
);

Masonry.displayName = 'Masonry';