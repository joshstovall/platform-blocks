import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextInput, Pressable, View, Platform } from 'react-native';
import { factory } from '../../core/factory/factory';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { useTheme } from '../../core/theme';
import { spotlight } from '../Spotlight';
import type { SearchProps, InternalState } from './types';
import { Space } from '../Space';

export const Search = factory<{ props: SearchProps; ref: TextInput }>((props, ref) => {
  const {
    value,
    defaultValue = '',
    onChange,
    onSubmit,
    placeholder = 'Search...',
    size = 'sm',
    radius = 'md',
    autoFocus,
    debounce = 0,
    clearButton = true,
    loading = false,
    rightSection,
    rightComponent,
    accessibilityLabel = 'Search',
    style,
    buttonMode = false,
    onPress,
  } = props;

  const theme = useTheme();
  const inputRef = useRef<TextInput | null>(null);
  const [internal, setInternal] = useState<InternalState>(() => ({
    value: value ?? defaultValue,
    isControlled: value !== undefined
  }));
  const debouncedValueRef = useRef(internal.value);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync controlled value
  useEffect(() => {
    if (internal.isControlled && value !== undefined && value !== internal.value) {
      setInternal(s => ({ ...s, value }));
    }
  }, [value, internal.isControlled, internal.value]);

  const emitChange = useCallback((next: string) => {
    if (onChange) onChange(next);
  }, [onChange]);

  const handleChange = (text: string) => {
    setInternal(s => ({ ...s, value: text }));
    if (debounce > 0) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        debouncedValueRef.current = text;
        emitChange(text);
      }, debounce);
    } else {
      emitChange(text);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(internal.value);
  };

  const clear = () => {
    if (!internal.value) return;
    if (!internal.isControlled) {
      setInternal(s => ({ ...s, value: '' }));
    }
    emitChange('');
    if (onSubmit) onSubmit('');
    // Refocus
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Left search icon
  const left = (
    <Icon name="search" size={size === 'xs' ? 14 : 16} color={theme.text.muted} />
  );

  // Right section logic (clear / loading / custom)
  let finalRight: React.ReactNode = rightSection;
  if (loading) {
    finalRight = <Icon name="loader" size={16} color={theme.text.muted} />;
  } else if (clearButton && internal.value && !buttonMode) {
    finalRight = (
      <Pressable
        onPress={clear}
        accessibilityLabel="Clear search"
        style={{ padding: 4, margin: -4, borderRadius: 6 }}
        hitSlop={6}
      >
        <Icon name="close" size={14} color={theme.text.muted} />
      </Pressable>
    );
  }

  // Handle button press
  const handleButtonPress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      // Default behavior: open spotlight
      spotlight.open();
    }
  }, [onPress]);

  // If in button mode, render as a pressable button
  if (buttonMode) {
    return (
      <Pressable
        onPress={handleButtonPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.xl,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            backgroundColor: theme.colors.surface[1],
            borderRadius: radius === 'md' ? 8 : radius === 'sm' ? 6 : 4,
            borderWidth: 1,
            borderColor: theme.colors.gray[3],
            minHeight: size === 'xs' ? 28 : size === 'sm' ? 32 : size === 'md' ? 36 : 40,
          },
          style
        ]}
      >
        {left}
        <Text
          style={{
            flex: 1,
            marginLeft: theme.spacing.xs,
            color: theme.text.muted,
            fontSize: size === 'xs' ? 12 : size === 'sm' ? 14 : 16,
          }}
        >
          {placeholder}
        </Text>
        <Space w={64} />
        {rightComponent || finalRight}
      </Pressable>
    );
  }

  return <Input
    // @ts-expect-error factory handles ref injection
    ref={ref as any}
    type="search"
    value={internal.value}
    onChangeText={handleChange}
    onEnter={handleSubmit}
    placeholder={placeholder}
    size={size}
    radius={radius}
    leftSection={left}
    rightSection={finalRight}
    accessibilityLabel={accessibilityLabel}
    style={style}
  />;
});

Search.displayName = 'Search';
