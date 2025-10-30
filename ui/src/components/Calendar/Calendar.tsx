import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../Text';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Month } from './Month';
import { MonthPicker } from '../MonthPicker';
import { YearPicker } from '../YearPicker';
import { dateUtils } from './utils';
import { useTheme } from '../../core/theme';
import { useDirection } from '../../core/providers/DirectionProvider';
import type { CalendarProps, CalendarLevel } from './types';

export const Calendar: React.FC<CalendarProps> = ({
  // View control
  level = 'month',
  defaultLevel = 'month',
  onLevelChange,
  
  // Date management
  date: controlledDate,
  defaultDate,
  onDateChange,
  
  // Value handling (for selection)
  value,
  onChange,
  type = 'single',
  
  // Constraints
  minDate,
  maxDate,
  excludeDate,
  
  // Localization
  locale = 'en-US',
  firstDayOfWeek = 0,
  weekendDays = [0, 6],
  
  // Display options
  withCellSpacing = true,
  hideOutsideDates = false,
  hideWeekdays = false,
  highlightToday = true,
  numberOfMonths = 1,
  
  // Customization
  getDayProps,
  renderDay,
  size = 'md',
  
  // Static mode (non-interactive)
  static: isStatic = false,
}) => {
  const theme = useTheme();
  const { isRTL } = useDirection();
  
  // Internal state for date navigation
  const [internalDate, setInternalDate] = useState(defaultDate || new Date());
  const currentDate = controlledDate || internalDate;

  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  // Internal state for level if not controlled
  const [internalLevel, setInternalLevel] = useState<CalendarLevel>(defaultLevel);
  const currentLevel = level !== defaultLevel ? level : internalLevel;

  const rangeValue = useMemo(() => (
    Array.isArray(value) && value.length === 2
      ? [value[0] instanceof Date ? value[0] : null, value[1] instanceof Date ? value[1] : null]
      : [null, null]
  ), [value]);

  const rangeStart = rangeValue[0];
  const rangeEnd = rangeValue[1];

  const isRangeSelectionInProgress = type === 'range' && rangeStart instanceof Date && !(rangeEnd instanceof Date);

  const handleDayHover = useCallback((date: Date) => {
    if (!isRangeSelectionInProgress) return;
    setHoveredDate(date);
  }, [isRangeSelectionInProgress]);

  const handleDayHoverEnd = useCallback(() => {
    setHoveredDate(null);
  }, []);

  useEffect(() => {
    if (!isRangeSelectionInProgress) {
      setHoveredDate(null);
    }
  }, [isRangeSelectionInProgress]);

  const monthNames = useMemo(() => dateUtils.getMonthNames(locale), [locale]);

  const handleDateChange = useCallback((newDate: Date) => {
    if (!controlledDate) {
      setInternalDate(newDate);
    }
    onDateChange?.(newDate);
  }, [controlledDate, onDateChange]);

  const handleLevelChange = useCallback((newLevel: CalendarLevel) => {
    if (level === defaultLevel) {
      setInternalLevel(newLevel);
    }
    onLevelChange?.(newLevel);
  }, [level, defaultLevel, onLevelChange]);

  const handlePreviousClick = () => {
    if (isStatic) return;
    
    if (currentLevel === 'month') {
      handleDateChange(dateUtils.addMonths(currentDate, -1));
    } else if (currentLevel === 'year') {
      handleDateChange(dateUtils.addYears(currentDate, -1));
    } else if (currentLevel === 'decade') {
      handleDateChange(dateUtils.addYears(currentDate, -10));
    }
  };

  const handleNextClick = () => {
    if (isStatic) return;
    
    if (currentLevel === 'month') {
      handleDateChange(dateUtils.addMonths(currentDate, 1));
    } else if (currentLevel === 'year') {
      handleDateChange(dateUtils.addYears(currentDate, 1));
    } else if (currentLevel === 'decade') {
      handleDateChange(dateUtils.addYears(currentDate, 10));
    }
  };

  const handleHeaderClick = () => {
    if (isStatic) return;
    
    if (currentLevel === 'month') {
      handleLevelChange('year');
    } else if (currentLevel === 'year') {
      handleLevelChange('decade');
    }
  };

  const getHeaderText = () => {
    if (currentLevel === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (currentLevel === 'year') {
      return currentDate.getFullYear().toString();
    } else if (currentLevel === 'decade') {
      const [start, end] = dateUtils.getDecadeRange(currentDate.getFullYear());
      return `${start} - ${end}`;
    }
    return '';
  };

  const renderMonthLevel = () => {
    if (numberOfMonths === 1) {
      return (
        <Month
          month={currentDate}
          value={value}
          onChange={onChange}
          type={type}
          hoveredDate={hoveredDate}
          onDayHover={handleDayHover}
          onDayHoverEnd={handleDayHoverEnd}
          minDate={minDate}
          maxDate={maxDate}
          firstDayOfWeek={firstDayOfWeek}
          weekendDays={weekendDays}
          locale={locale}
          size={size}
          hideOutsideDates={hideOutsideDates}
          hideWeekdays={hideWeekdays}
          highlightToday={highlightToday}
          withCellSpacing={withCellSpacing}
          excludeDate={excludeDate}
          getDayProps={getDayProps}
          renderDay={renderDay}
        />
      );
    }

    // Multiple months
    const months = Array.from({ length: numberOfMonths }, (_, i) =>
      dateUtils.addMonths(currentDate, i)
    );

    return (
      <Flex direction="row" gap={16} style={{ flexWrap: 'wrap' }}>
        {months.map((monthDate, index) => (
          <View key={index}>
            <Month
              month={monthDate}
              value={value}
              onChange={onChange}
              type={type}
              hoveredDate={hoveredDate}
              onDayHover={handleDayHover}
              onDayHoverEnd={handleDayHoverEnd}
              minDate={minDate}
              maxDate={maxDate}
              firstDayOfWeek={firstDayOfWeek}
              weekendDays={weekendDays}
              locale={locale}
              size={size}
              hideOutsideDates={hideOutsideDates}
              hideWeekdays={hideWeekdays}
              highlightToday={highlightToday}
              withCellSpacing={withCellSpacing}
              excludeDate={excludeDate}
              getDayProps={getDayProps}
              renderDay={renderDay}
            />
          </View>
        ))}
      </Flex>
    );
  };

  const renderContent = () => {
    if (currentLevel === 'month') return renderMonthLevel();
    if (currentLevel === 'year') return renderYearLevel();
    if (currentLevel === 'decade') return renderDecadeLevel();
    return renderMonthLevel();
  };

  const renderYearLevel = () => {
    return (
      <MonthPicker
        value={currentDate}
  onChange={(newDate: Date | null) => {
          if (newDate) {
            handleDateChange(newDate);
            handleLevelChange('month');
          }
        }}
        year={currentDate.getFullYear()}
  onYearChange={(year: number) => {
          const newDate = new Date(year, currentDate.getMonth(), currentDate.getDate());
          handleDateChange(newDate);
        }}
        minDate={minDate}
        maxDate={maxDate}
        size={size}
        hideHeader={true}
      />
    );
  };

  const renderDecadeLevel = () => {
    return (
      <YearPicker
        value={currentDate}
  onChange={(newDate: Date | null) => {
          if (newDate) {
            handleDateChange(newDate);
            handleLevelChange('year');
          }
        }}
        decade={Math.floor(currentDate.getFullYear() / 10) * 10}
  onDecadeChange={(decade: number) => {
          const newDate = new Date(decade, currentDate.getMonth(), currentDate.getDate());
          handleDateChange(newDate);
        }}
        minDate={minDate}
        maxDate={maxDate}
        size={size}
        hideHeader={true}
      />
    );
  };

  return (
    <View
      style={{ width: '100%' }}
      {...(type === 'range' ? { onMouseLeave: handleDayHoverEnd } : {})}
    >
      {/* Header */}
      <Flex 
        direction="row" 
        justify="space-between" 
        align="center" 
        style={{ 
          marginBottom: 20,
          paddingHorizontal: 4,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        <Pressable
          onPress={handlePreviousClick}
          disabled={isStatic}
          style={({ pressed }) => [
            {
              padding: 12,
              borderRadius: 8,
              backgroundColor: pressed && !isStatic ? theme.colors.gray[2] : 'transparent',
              opacity: isStatic ? 0.5 : 1,
            },
          ]}
        >
          <Icon name={isRTL ? 'chevron-right' : 'chevron-left'} size={20} color={theme.colors.gray[6]} />
        </Pressable>

        <Pressable 
          onPress={handleHeaderClick}
          disabled={isStatic || currentLevel === 'decade'}
          style={({ pressed }) => [
            {
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: pressed && !isStatic && currentLevel !== 'decade' 
                ? theme.colors.gray[2] 
                : 'transparent',
            },
          ]}
        >
          <Text 
            size="lg" 
            weight="semibold"
            style={{ 
              color: theme.colors.gray[9],
              textAlign: 'center',
            }}
          >
            {getHeaderText()}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNextClick}
          disabled={isStatic}
          style={({ pressed }) => [
            {
              padding: 12,
              borderRadius: 8,
              backgroundColor: pressed && !isStatic ? theme.colors.gray[2] : 'transparent',
              opacity: isStatic ? 0.5 : 1,
            },
          ]}
        >
          <Icon name={isRTL ? 'chevron-left' : 'chevron-right'} size={20} color={theme.colors.gray[6]} />
        </Pressable>
      </Flex>

      {/* Content */}
      {renderContent()}
    </View>
  );
};
