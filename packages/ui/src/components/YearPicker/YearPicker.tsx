import React, { useCallback, useMemo, useState } from 'react';
import { View, Pressable, useWindowDimensions } from 'react-native';
import { Text } from '../Text';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useTheme } from '../../core/theme';
import { DESIGN_TOKENS } from '../../core';
import { resolveResponsiveProp, type ResponsiveProp } from '../../core/theme/breakpoints';
import type { YearPickerProps } from './types';

const DEFAULT_YEARS_PER_ROW: ResponsiveProp<number> = { base: 3, md: 4 };

export const YearPicker: React.FC<YearPickerProps> = ({
  value,
  onChange,
  decade: controlledDecade,
  onDecadeChange,
  minDate,
  maxDate,
  size = 'md',
  yearsPerRow,
  hideHeader = false,
  totalYears = 20,
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const currentYear = value?.getFullYear() || new Date().getFullYear();
  const [internalDecade, setInternalDecade] = useState(
    controlledDecade || Math.floor(currentYear / 10) * 10
  );

  const currentDecade = controlledDecade || internalDecade;

  const resolvedYearsPerRow = useMemo(() => {
    const fallback = size === 'xs' || size === 'sm' ? 3 : 4;
    const resolved = resolveResponsiveProp<number>(yearsPerRow ?? DEFAULT_YEARS_PER_ROW, width);
    const candidate = resolved ?? (width < 640 ? 3 : fallback);
    return Math.max(1, Math.floor(candidate));
  }, [yearsPerRow, size, width]);

  const years = useMemo(() => {
    const startYear = currentDecade;
    const rowCount = Math.ceil(totalYears / resolvedYearsPerRow);
    const count = rowCount * resolvedYearsPerRow;
    return Array.from({ length: count }, (_, i) => startYear + i);
  }, [currentDecade, totalYears, resolvedYearsPerRow]);

  const handleDecadeChange = useCallback(
    (newDecade: number) => {
      if (!controlledDecade) {
        setInternalDecade(newDecade);
      }
      onDecadeChange?.(newDecade);
    },
    [controlledDecade, onDecadeChange]
  );

  const handlePreviousDecade = () => {
    handleDecadeChange(currentDecade - 10);
  };

  const handleNextDecade = () => {
    handleDecadeChange(currentDecade + 10);
  };

  const handleYearPress = useCallback(
    (year: number) => {
      if (minDate && year < minDate.getFullYear()) return;
      if (maxDate && year > maxDate.getFullYear()) return;

      const newDate = new Date(
        year,
        value?.getMonth() ?? 0,
        value?.getDate() ?? 1
      );
      onChange?.(newDate);
    },
    [onChange, minDate, maxDate, value]
  );

  const isYearDisabled = useCallback(
    (year: number): boolean => {
      if (minDate && year < minDate.getFullYear()) return true;
      if (maxDate && year > maxDate.getFullYear()) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const isYearSelected = useCallback(
    (year: number): boolean => {
      if (!value) return false;
      return value.getFullYear() === year;
    },
    [value]
  );

  const rows = Math.ceil(years.length / resolvedYearsPerRow);

  return (
    <View>
      {!hideHeader && (
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          style={{ marginBottom: DESIGN_TOKENS.spacing.xl }}
        >
          <Pressable
            onPress={handlePreviousDecade}
            accessibilityRole="button"
            accessibilityLabel="Previous decade"
            style={({ pressed }) => [
              {
                padding: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.radius.sm,
                backgroundColor: pressed ? theme.colors.gray[2] : 'transparent',
              },
            ]}
          >
            <Icon name="chevron-left" size={20} color={theme.colors.gray[6]} />
          </Pressable>

          <Text
            size="xl"
            weight="bold"
            style={{
              color: theme.colors.gray[9],
            }}
          >
            {currentDecade}s
          </Text>

          <Pressable
            onPress={handleNextDecade}
            accessibilityRole="button"
            accessibilityLabel="Next decade"
            style={({ pressed }) => [
              {
                padding: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.radius.sm,
                backgroundColor: pressed ? theme.colors.gray[2] : 'transparent',
              },
            ]}
          >
            <Icon name="chevron-right" size={20} color={theme.colors.gray[6]} />
          </Pressable>
        </Flex>
      )}

      <View>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <Flex
            key={rowIndex}
            direction="row"
            justify="space-between"
            style={{ marginBottom: DESIGN_TOKENS.spacing.md }}
          >
            {Array.from({ length: resolvedYearsPerRow }, (_, colIndex) => {
              const yearIndex = rowIndex * resolvedYearsPerRow + colIndex;

              if (yearIndex >= years.length) {
                return <View key={colIndex} style={{ flex: 1, marginHorizontal: DESIGN_TOKENS.spacing.xs }} />;
              }

              const year = years[yearIndex];
              const disabled = isYearDisabled(year);
              const isSelected = isYearSelected(year);

              return (
                <Pressable
                  key={year}
                  onPress={() => handleYearPress(year)}
                  disabled={disabled}
                  accessibilityRole="button"
                  accessibilityLabel={String(year)}
                  accessibilityState={{ disabled, selected: isSelected }}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      marginHorizontal: DESIGN_TOKENS.spacing.xs,
                      aspectRatio: 1.4,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected
                        ? theme.colors.primary[5]
                        : pressed && !disabled
                        ? theme.colors.gray[2]
                        : 'transparent',
                      borderRadius: DESIGN_TOKENS.radius.md,
                      opacity: disabled ? 0.5 : 1,
                      shadowColor: isSelected ? theme.colors.primary[5] : 'transparent',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isSelected ? 0.2 : 0,
                      shadowRadius: 4,
                      elevation: isSelected ? 2 : 0,
                    },
                  ]}
                >
                  <Text
                    size={size === 'xs' ? 'sm' : size === 'sm' ? 'md' : 'lg'}
                    weight={isSelected ? 'semibold' : 'medium'}
                    style={{
                      color: isSelected
                        ? 'white'
                        : disabled
                        ? theme.colors.gray[4]
                        : theme.colors.gray[9],
                      textAlign: 'center',
                    }}
                  >
                    {year}
                  </Text>
                </Pressable>
              );
            })}
          </Flex>
        ))}
      </View>
    </View>
  );
};
