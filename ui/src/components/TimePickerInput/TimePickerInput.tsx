import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Pressable, FlatList, ViewStyle } from 'react-native';
// NOTE: Using direct relative imports to avoid barrel (index.ts) circular dependency
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useTheme } from '../../core/theme';
import type { TimePickerValue } from '../TimePicker/types';
import type { TimePickerInputProps } from './types';

const pad = (n: number) => n.toString().padStart(2, '0');

const buildTimeValue = (
  format: 12 | 24,
  withSeconds: boolean,
  source?: TimePickerValue | null
): TimePickerValue => {
  if (source) {
    return {
      hours: source.hours,
      minutes: source.minutes,
      ...(withSeconds ? { seconds: source.seconds ?? 0 } : {}),
    };
  }

  return {
    hours: format === 12 ? 12 : 0,
    minutes: 0,
    ...(withSeconds ? { seconds: 0 } : {}),
  };
};

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  value,
  defaultValue,
  onChange,
  format = 24,
  withSeconds = false,
  allowInput = true,
  minuteStep = 5,
  secondStep = 5,
  panelWidth,
  columnWidth = 88,
  inputWidth,
  disabled,
  size = 'md',
  label = 'Time',
  error,
  helperText,
  style,
  onOpen,
  onClose,
  title,
  autoClose = false,
  fullWidth,
  clearable = false,
  clearButtonLabel = 'Clear time',
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<TimePickerValue>(() =>
    buildTimeValue(format, withSeconds, value ?? defaultValue ?? null)
  );
  const [hasValue, setHasValue] = useState<boolean>(() => (value ?? defaultValue) != null);
  const containerRef = React.useRef<View | null>(null);
  const is12h = format === 12;

  useEffect(() => {
    if (!isControlled) return;

    if (value) {
      setInternal(buildTimeValue(format, withSeconds, value));
      setHasValue(true);
    } else if (value === null) {
      setHasValue(false);
    }
  }, [isControlled, value?.hours, value?.minutes, value?.seconds, value, format, withSeconds]);

  const display = useMemo(() => {
    if (!hasValue) return '';
    const source = (isControlled ? value : internal) ?? internal;
    const displayHours = is12h ? ((source.hours + 11) % 12) + 1 : source.hours;
    const base = `${pad(displayHours)}:${pad(source.minutes)}${
      withSeconds ? ':' + pad(source.seconds ?? 0) : ''
    }`;
    const suffix = is12h ? (source.hours >= 12 ? ' PM' : ' AM') : '';
    return base + suffix;
  }, [hasValue, isControlled, value?.hours, value?.minutes, value?.seconds, internal, is12h, withSeconds]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    onOpen?.();
  }, [disabled, onOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const commit = useCallback(
    (next: Partial<TimePickerValue>, toggleClose = false) => {
      setInternal((prev) => {
        const merged: TimePickerValue = { ...prev, ...next };
        onChange?.(merged);
        return merged;
      });
      setHasValue(true);
      if (toggleClose) {
        handleClose();
      }
    },
    [handleClose, onChange]
  );

  const clearValue = useCallback(() => {
    if (disabled) return;

    const fallback = buildTimeValue(format, withSeconds, defaultValue ?? null);
    setInternal(fallback);
    setHasValue(false);
    onChange?.(null);
  }, [defaultValue, disabled, format, onChange, withSeconds]);

  const hoursOptions = useMemo(() => {
    if (is12h) return Array.from({ length: 12 }, (_, i) => i + 1);
    return Array.from({ length: 24 }, (_, i) => i);
  }, [is12h]);
  const minuteOptions = useMemo(
    () => Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep),
    [minuteStep]
  );
  const secondOptions = useMemo(
    () => Array.from({ length: Math.ceil(60 / secondStep) }, (_, i) => i * secondStep),
    [secondStep]
  );

  const switchMeridiem = () => {
    if (!is12h) return;
    commit({ hours: (internal.hours + 12) % 24 });
  };

  const setHourDisplay = (hDisplay: number) => {
    let hour24 = hDisplay;
    if (is12h) {
      const currentIsPM = internal.hours >= 12;
      if (hDisplay === 12) hour24 = currentIsPM ? 12 : 0;
      else hour24 = currentIsPM ? hDisplay + 12 : hDisplay;
    }
    commit({ hours: hour24 });
  };

  const containerStyles = { position: 'relative' as const };

  const computedPanelWidth: number | string =
    panelWidth !== undefined
      ? panelWidth
      : (() => {
          const cols = withSeconds ? 3 : 2;
          const meridiemWidth = format === 12 ? columnWidth : 0;
          const padding = 48;
          return cols * columnWidth + meridiemWidth + padding;
        })();

  const listCommon: ViewStyle = {
    maxHeight: 200,
    width: '100%',
  };

  const renderNumber = (n: number, active: boolean, onPress: () => void) => (
    <Pressable
      key={n}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: active
          ? theme.colors.primary[5]
          : pressed
          ? theme.colors.gray[2]
          : 'transparent',
        marginVertical: 2,
        marginHorizontal: 4,
        minWidth: 48,
        alignItems: 'center',
        shadowColor: active ? theme.colors.primary[5] : 'transparent',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: active ? 0.2 : 0,
        shadowRadius: 4,
        elevation: active ? 2 : 0,
      })}
    >
      <Text
        size="md"
        weight={active ? 'semibold' : 'medium'}
        style={{
          color: active ? 'white' : theme.colors.gray[8],
          fontSize: 16,
        }}
      >
        {pad(n)}
      </Text>
    </Pressable>
  );

  return (
    <View
      ref={containerRef as any}
      style={[containerStyles, inputWidth != null ? { width: inputWidth } : null, style]}
    >
      <Pressable onPress={handleOpen} disabled={disabled} accessibilityRole="button">
        <Input
          value={display}
          onChangeText={(text) => {
            if (!allowInput) return;
            const trimmed = text.trim();

            if (trimmed.length === 0) {
              clearValue();
              return;
            }

            const match = trimmed.match(
              /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)?$/
            );
            if (match) {
              let h = parseInt(match[1], 10);
              const m = parseInt(match[2], 10);
              const s = match[3] ? parseInt(match[3], 10) : internal.seconds ?? 0;
              if (is12h) {
                const mer = match[4]?.toLowerCase();
                if (mer === 'pm' && h < 12) h += 12;
                if (mer === 'am' && h === 12) h = 0;
              }
              if (h >= 0 && h < 24 && m < 60 && s < 60) {
                commit({ hours: h, minutes: m, seconds: s });
              }
            }
          }}
          label={label}
          placeholder={is12h ? 'hh:mm AM' : 'hh:mm'}
          endSection={
            <Icon name="clock" size={16} color={disabled ? theme.text.disabled : theme.text.muted} />
          }
          disabled={disabled}
          error={error}
          helperText={helperText}
          size={size}
          fullWidth={fullWidth}
          clearable={clearable && hasValue}
          clearButtonLabel={clearButtonLabel}
          onClear={clearValue}
        />
      </Pressable>

      <Dialog
        visible={open}
        // variant="fullscreen"
        onClose={handleClose}
        width={typeof computedPanelWidth === 'number' ? computedPanelWidth : 360}
        title={title || 'Select Time'}
      >
        <Pressable
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Flex direction="row" gap={6} align="flex-start" justify="center">
            <View style={{ width: columnWidth, alignItems: 'center' }}>
              <Text
                size="sm"
                weight="medium"
                style={{
                  marginBottom: 12,
                  textAlign: 'center',
                }}
              >
                Hour
              </Text>
              <FlatList
                data={hoursOptions}
                keyExtractor={(item) => 'h-' + item}
                renderItem={({ item }) =>
                  renderNumber(
                    item,
                    (is12h ? ((internal.hours + 11) % 12) + 1 : internal.hours) === item,
                    () => setHourDisplay(item)
                  )
                }
                style={[listCommon, { borderRadius: 12, backgroundColor: theme.colors.gray[1] }]}
                contentContainerStyle={{ paddingVertical: 8 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View style={{ width: columnWidth, alignItems: 'center' }}>
              <Text
                size="sm"
                weight="medium"
                style={{
                  marginBottom: 12,
                  textAlign: 'center',
                }}
              >
                Minute
              </Text>
              <FlatList
                data={minuteOptions}
                keyExtractor={(item) => 'm-' + item}
                renderItem={({ item }) =>
                  renderNumber(item, internal.minutes === item, () =>
                    commit({ minutes: item }, autoClose && !withSeconds)
                  )
                }
                style={[listCommon, { borderRadius: 12, backgroundColor: theme.colors.gray[1] }]}
                contentContainerStyle={{ paddingVertical: 8 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
            {withSeconds && (
              <View style={{ width: columnWidth, alignItems: 'center' }}>
                <Text
                  size="sm"
                  weight="medium"
                  style={{
                    marginBottom: 12,
                    textAlign: 'center',
                  }}
                >
                  Second
                </Text>
                <FlatList
                  data={secondOptions}
                  keyExtractor={(item) => 's-' + item}
                  renderItem={({ item }) =>
                    renderNumber(item, (internal.seconds ?? 0) === item, () =>
                      commit({ seconds: item }, autoClose)
                    )
                  }
                  style={[listCommon, { borderRadius: 12, backgroundColor: theme.colors.gray[1] }]}
                  contentContainerStyle={{ paddingVertical: 8 }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
            {is12h && (
              <View style={{ alignItems: 'center' }}>
                <Text
                  size="sm"
                  weight="medium"
                  style={{
                    marginBottom: 12,
                    textAlign: 'center',
                  }}
                >
                  Period
                </Text>
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    height: listCommon.maxHeight,
                    paddingVertical: 8,
                  }}
                >
                  <Pressable
                    onPress={switchMeridiem}
                    style={({ pressed }) => ({
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: pressed
                        ? theme.colors.primary[6]
                        : theme.colors.primary[5],
                      minWidth: 60,
                      alignItems: 'center',
                    })}
                  >
                    <Text size="md" weight="semibold" style={{ color: 'white' }}>
                      {internal.hours >= 12 ? 'PM' : 'AM'}
                    </Text>
                  </Pressable>
                </Flex>
              </View>
            )}
          </Flex>
          {!autoClose && (
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 20,
                borderTopWidth: 1,
                borderTopColor: theme.colors.gray[2],
              }}
            >
              <Flex direction="row" justify="flex-end" gap={12} style={{ paddingTop: 16 }}>
                <Pressable
                  onPress={handleClose}
                  style={({ pressed }) => ({
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: pressed
                      ? theme.colors.primary[6]
                      : theme.colors.primary[5],
                    minWidth: 80,
                    alignItems: 'center',
                  })}
                >
                  <Text size="md" weight="semibold" style={{ color: 'white' }}>
                    Done
                  </Text>
                </Pressable>
              </Flex>
            </View>
          )}
        </Pressable>
      </Dialog>
    </View>
  );
};

TimePickerInput.displayName = 'TimePickerInput';
