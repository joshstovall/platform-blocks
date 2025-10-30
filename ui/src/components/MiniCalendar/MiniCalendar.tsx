import React, { useState, useMemo, useCallback } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '../Text';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Day } from '../Calendar/Day';
import { dateUtils } from '../Calendar/utils';
import { useTheme } from '../../core/theme';
import type { MiniCalendarProps } from '../Calendar/types';

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  value,
  onChange,
  numberOfDays = 7,
  defaultDate,
  minDate,
  maxDate,
  nextControlProps,
  previousControlProps,
  getDayProps,
  renderDay,
  locale = 'en-US',
  size = 'md',
}) => {
  const theme = useTheme();
  
  const [currentDate, setCurrentDate] = useState(defaultDate || new Date());
  
  // Calculate the start date for the range
  const startDate = useMemo(() => {
    if (value) {
      // Center around selected date
      const offset = Math.floor(numberOfDays / 2);
      return dateUtils.addDays(value, -offset);
    }
    // Start from current date or default
    return currentDate;
  }, [value, numberOfDays, currentDate]);

  const days = useMemo(() => 
    dateUtils.getDaysInRange(startDate, numberOfDays),
    [startDate, numberOfDays]
  );

  const weekdayNames = useMemo(() => {
    return dateUtils.getWeekdayNames(locale, 'short');
  }, [locale]);

  const handlePrevious = useCallback(() => {
    setCurrentDate(dateUtils.addDays(currentDate, -numberOfDays));
  }, [currentDate, numberOfDays]);

  const handleNext = useCallback(() => {
    setCurrentDate(dateUtils.addDays(currentDate, numberOfDays));
  }, [currentDate, numberOfDays]);

  const handleDayPress = useCallback((date: Date) => {
    if (dateUtils.isDateDisabled(date, minDate, maxDate)) return;
    onChange?.(date);
  }, [onChange, minDate, maxDate]);

  return (
    <View>
      {/* Navigation Header */}
      <Flex 
        direction="row" 
        justify="space-between" 
        align="center" 
        style={{ marginBottom: 16 }}
      >
        <Pressable
          onPress={handlePrevious}
          style={({ pressed }) => [
            {
              padding: 8,
              borderRadius: 6,
              backgroundColor: pressed ? theme.colors.gray[2] : 'transparent',
            },
          ]}
          {...previousControlProps}
        >
          <Icon name="chevron-left" size={16} color={theme.colors.gray[6]} />
        </Pressable>

        <Text size="md" weight="semibold" style={{ color: theme.colors.gray[8] }}>
          {dateUtils.formatDate(startDate, 'MMM yyyy', locale)}
        </Text>

        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            {
              padding: 8,
              borderRadius: 6,
              backgroundColor: pressed ? theme.colors.gray[2] : 'transparent',
            },
          ]}
          {...nextControlProps}
        >
          <Icon name="chevron-right" size={16} color={theme.colors.gray[6]} />
        </Pressable>
      </Flex>

      {/* Days Container */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Flex direction="row" gap={4}>
          {days.map((date, index) => {
            const isSelected = value && dateUtils.isSameDay(date, value);
            const isToday = dateUtils.isToday(date);
            const isWeekend = dateUtils.isWeekend(date);
            const isDisabled = dateUtils.isDateDisabled(date, minDate, maxDate);
            
            const dayProps = getDayProps ? getDayProps(date) : {};
            const weekdayName = weekdayNames[date.getDay()];

            if (renderDay) {
              return (
                <View key={date.toISOString()} style={{ alignItems: 'center' }}>
                  <Text 
                    size="xs" 
                    style={{ 
                      marginBottom: 4, 
                      color: theme.colors.gray[5],
                      textTransform: 'uppercase',
                      fontWeight: '500',
                    }}
                  >
                    {weekdayName}
                  </Text>
                  {renderDay(date)}
                </View>
              );
            }

            return (
              <View key={date.toISOString()} style={{ alignItems: 'center' }}>
                {/* Weekday label */}
                <Text 
                  size="xs" 
                  style={{ 
                    marginBottom: 8, 
                    color: theme.colors.gray[5],
                    textTransform: 'uppercase',
                    fontWeight: '500',
                    letterSpacing: 0.5,
                  }}
                >
                  {weekdayName}
                </Text>

                {/* Day button */}
                <Pressable
                  onPress={() => handleDayPress(date)}
                  disabled={isDisabled}
                  style={({ pressed }) => [
                    {
                      width: size === 'xs' ? 32 : size === 'sm' ? 36 : size === 'md' ? 40 : 44,
                      height: size === 'xs' ? 32 : size === 'sm' ? 36 : size === 'md' ? 40 : 44,
                      borderRadius: size === 'xs' ? 16 : size === 'sm' ? 18 : size === 'md' ? 20 : 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected 
                        ? theme.colors.primary[5] 
                        : isToday && !isSelected 
                        ? theme.colors.gray[2] 
                        : pressed && !isDisabled 
                        ? theme.colors.gray[1] 
                        : 'transparent',
                      borderWidth: isToday && !isSelected ? 1 : 0,
                      borderColor: theme.colors.primary[4],
                      opacity: isDisabled ? 0.5 : 1,
                      shadowColor: isSelected ? theme.colors.primary[5] : 'transparent',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isSelected ? 0.15 : 0,
                      shadowRadius: 3,
                      elevation: isSelected ? 1 : 0,
                    },
                  ]}
                  {...dayProps}
                >
                  <Text
                    size={size === 'xs' ? 'xs' : 'sm'}
                    weight={isSelected || isToday ? 'semibold' : 'medium'}
                    style={{
                      color: isSelected 
                        ? 'white' 
                        : isDisabled 
                        ? theme.colors.gray[4] 
                        : isWeekend && !isSelected 
                        ? theme.colors.gray[6] 
                        : isToday 
                        ? theme.colors.primary[6] 
                        : theme.colors.gray[9],
                    }}
                  >
                    {date.getDate()}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </Flex>
      </ScrollView>
    </View>
  );
};