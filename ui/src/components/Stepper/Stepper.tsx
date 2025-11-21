import React, { createContext, useContext, forwardRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { StepperProps, StepperStepProps, StepperCompletedProps, StepperContextValue, type StepperMetrics } from './types';
import { useTheme } from '../../core/theme/ThemeProvider';
import { Loader } from '../Loader';
import { resolveComponentSize, type ComponentSize, type ComponentSizeValue } from '../../core/theme/componentSize';
import { getComponentSize } from '../../core/theme/unified-sizing';

// Create Stepper Context
const StepperContext = createContext<StepperContextValue | null>(null);

const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('Stepper components must be used within a Stepper');
  }
  return context;
};

const STEPPER_ALLOWED_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
const STEPPER_ALLOWED_SIZES_ARRAY: ComponentSize[] = [...STEPPER_ALLOWED_SIZES];

const MIN_STEPPER_METRICS = {
  iconSize: 20,
  fontSize: 12,
  descriptionFontSize: 10,
  spacing: 8,
} as const;

const STEPPER_SIZE_SCALE: Partial<Record<ComponentSize, StepperMetrics>> = STEPPER_ALLOWED_SIZES_ARRAY.reduce(
  (acc, token) => {
    acc[token] = createMetricsForToken(token);
    return acc;
  },
  {} as Partial<Record<ComponentSize, StepperMetrics>>
);

const BASE_STEPPER_METRICS = STEPPER_SIZE_SCALE.md ?? createMetricsForToken('md');
const BASE_STEPPER_HEIGHT = getComponentSize('md').height;

function createMetricsForToken(size: ComponentSize): StepperMetrics {
  const config = getComponentSize(size);

  const fontSize = Math.max(MIN_STEPPER_METRICS.fontSize, config.fontSize);
  const descriptionFontSize = Math.max(
    MIN_STEPPER_METRICS.descriptionFontSize,
    Math.min(fontSize - 1, Math.round(config.fontSize * 0.9))
  );

  return {
    iconSize: Math.max(MIN_STEPPER_METRICS.iconSize, Math.round(config.height * 0.8)),
    fontSize,
    descriptionFontSize,
    spacing: Math.max(MIN_STEPPER_METRICS.spacing, Math.round(config.padding * 1.25) + 1),
  };
}

function resolveStepperMetrics(value: ComponentSizeValue | undefined): StepperMetrics {
  const resolved = resolveComponentSize(value, STEPPER_SIZE_SCALE, {
    allowedSizes: STEPPER_ALLOWED_SIZES_ARRAY,
    fallback: 'md',
  });

  if (typeof resolved === 'number') {
    return calculateNumericMetrics(resolved);
  }

  return resolved;
}

function calculateNumericMetrics(height: number): StepperMetrics {
  const normalizedHeight = Math.max(MIN_STEPPER_METRICS.iconSize + 4, Math.round(height));
  const scale = normalizedHeight / BASE_STEPPER_HEIGHT;

  const fontSize = Math.max(MIN_STEPPER_METRICS.fontSize, Math.round(BASE_STEPPER_METRICS.fontSize * scale));
  const descriptionFontSize = Math.max(
    MIN_STEPPER_METRICS.descriptionFontSize,
    Math.min(fontSize - 1, Math.round(BASE_STEPPER_METRICS.descriptionFontSize * scale))
  );

  return {
    iconSize: Math.max(MIN_STEPPER_METRICS.iconSize, Math.round(normalizedHeight * 0.8)),
    fontSize,
    descriptionFontSize,
    spacing: Math.max(MIN_STEPPER_METRICS.spacing, Math.round(BASE_STEPPER_METRICS.spacing * scale)),
  };
}

// Step Component
const StepperStep = forwardRef<View, StepperStepProps>((
  {
    children,
    label,
    description,
    icon,
    completedIcon,
    allowStepSelect = true,
    color,
    loading = false,
    'aria-label': ariaLabel,
    title,
    stepIndex = 0,
    ...props
  },
  ref
) => {
  const theme = useTheme();
  const {
    active,
    onStepClick,
    orientation,
    iconPosition,
    iconSize: contextIconSize,
    color: contextColor,
    completedIcon: contextCompletedIcon,
    allowNextStepsSelect,
    metrics,
  } = useStepperContext();

  const finalIconSize = contextIconSize || metrics.iconSize;
  const stepColor = color || contextColor || theme.colors.primary[5];
  const isCompleted = stepIndex < active;
  const isActive = stepIndex === active;
  const isClickable = allowStepSelect && (allowNextStepsSelect || stepIndex <= active) && onStepClick;

  const getStepIconStyles = (): ViewStyle => ({
    width: finalIconSize,
    height: finalIconSize,
    borderRadius: finalIconSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isCompleted || isActive ? stepColor : theme.colors.gray[3],
    backgroundColor: isCompleted || isActive ? stepColor : '#FFFFFF',
  });

  const getStepNumberStyles = (): TextStyle => ({
    fontSize: metrics.fontSize,
    fontWeight: '600',
    color: isCompleted || isActive ? '#FFFFFF' : theme.colors.gray[6],
  });

  const getStepLabelStyles = (): TextStyle => ({
    fontSize: metrics.fontSize,
    fontWeight: isActive ? '600' : '500',
    color: isActive ? stepColor : theme.text.primary,
    marginBottom: description ? 4 : 0,
  });

  const getStepDescriptionStyles = (): TextStyle => ({
    fontSize: metrics.descriptionFontSize,
    color: theme.text.secondary,
  });

  const renderStepIcon = () => {
    if (loading) {
      return <Loader size={finalIconSize * 0.6} color={stepColor} />;
    }

    if (isCompleted && (completedIcon || contextCompletedIcon)) {
      return completedIcon || contextCompletedIcon;
    }

    if (icon) {
      return icon;
    }

    return (
      <Text style={getStepNumberStyles()}>
        {stepIndex + 1}
      </Text>
    );
  };

  const renderStepBody = () => {
    if (!label && !description) return null;

    return (
      <View
        style={{
          marginLeft: iconPosition === 'left' ? metrics.spacing : 0,
          marginRight: iconPosition === 'right' ? metrics.spacing : 0,
        }}
      >
        {label && <Text style={getStepLabelStyles()}>{label}</Text>}
        {description && <Text style={getStepDescriptionStyles()}>{description}</Text>}
      </View>
    );
  };

  const getStepWrapperStyles = (): ViewStyle => {
    if (orientation === 'vertical') {
      return {
        flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      };
    }

    return {
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
    };
  };

  const handlePress = () => {
    if (isClickable) {
      onStepClick!(stepIndex);
    }
  };

  return (
    <TouchableOpacity
      ref={ref}
      onPress={handlePress}
      disabled={!isClickable}
      accessibilityLabel={ariaLabel || label || `Step ${stepIndex + 1}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive, disabled: !isClickable }}
      {...props}
    >
      <View style={getStepWrapperStyles()}>
        <View style={getStepIconStyles()}>
          {renderStepIcon()}
        </View>
        {renderStepBody()}
      </View>
    </TouchableOpacity>
  );
});

// Completed Component
const StepperCompleted: React.FC<StepperCompletedProps> = ({ children }) => {
  return <View>{children}</View>;
};

// Main Stepper Component
const Stepper = forwardRef<View, StepperProps>((
  {
    active,
    onStepClick,
    orientation = 'horizontal',
    iconPosition = 'left',
    iconSize,
    size = 'md',
    color,
    completedIcon,
    allowNextStepsSelect = true,
    children,
    'aria-label': ariaLabel,
    ...props
  },
  ref
) => {
  const theme = useTheme();
  const metrics = useMemo(() => resolveStepperMetrics(size), [size]);
  const resolvedIconSize = iconSize ?? metrics.iconSize;
  const resolvedColor = color ?? theme.colors.primary[5];

  const contextValue: StepperContextValue = {
    active,
    onStepClick,
    orientation,
    iconPosition,
    iconSize: resolvedIconSize,
    size,
    metrics,
    color: resolvedColor,
    completedIcon,
    allowNextStepsSelect,
  };

  const getStepperStyles = (): ViewStyle => ({
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    alignItems: orientation === 'vertical' ? 'flex-start' : 'center',
  });

  const getContentStyles = (): ViewStyle => ({
    marginTop: orientation === 'horizontal' ? metrics.spacing * 2 : 0,
    marginLeft: orientation === 'vertical' ? metrics.spacing * 2 : 0,
  });

  // Process children to add step indices and separate content
  const steps: React.ReactElement[] = [];
  let completedContent: React.ReactElement | null = null;
  let currentStepContent: React.ReactNode = null;

  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child)) {
      if (child.type === StepperCompleted) {
        completedContent = child;
      } else if (child.type === StepperStep) {
        const stepProps = child.props as StepperStepProps;
        steps.push(React.cloneElement(child, { stepIndex: index } as any));
        if (index === active && stepProps.children) {
          currentStepContent = stepProps.children;
        }
      }
    }
  });

  const renderSteps = () => {
    return steps.map((step, index) => {
      const isLastStep = index === steps.length - 1;
      
      return (
        <View key={index} style={{ 
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          alignItems: orientation === 'vertical' ? 'flex-start' : 'center',
          flex: orientation === 'horizontal' && !isLastStep ? 1 : undefined,
        }}>
          {step}
          {!isLastStep && (
            <View style={{
              flex: orientation === 'horizontal' ? 1 : undefined,
              height: orientation === 'vertical' ? metrics.spacing * 2 : 2,
              width: orientation === 'horizontal' ? undefined : 2,
              backgroundColor: index < active ? resolvedColor : theme.colors.gray[3],
              marginHorizontal: orientation === 'horizontal' ? metrics.spacing : 0,
              marginVertical: orientation === 'vertical' ? 8 : 0,
              marginLeft: orientation === 'vertical' ? resolvedIconSize / 2 - 1 : 0,
            }} />
          )}
        </View>
      );
    });
  };

  const renderContent = () => {
    if (active >= steps.length && completedContent) {
      return completedContent;
    }
    if (currentStepContent) {
      return <View style={getContentStyles()}>{currentStepContent}</View>;
    }
    return null;
  };

  return (
    <StepperContext.Provider value={contextValue}>
      <View ref={ref} accessibilityLabel={ariaLabel} {...props}>
        <View style={getStepperStyles()}>
          {renderSteps()}
        </View>
        {renderContent()}
      </View>
    </StepperContext.Provider>
  );
});

// Attach sub-components
const StepperWithSubComponents = Stepper as typeof Stepper & {
  Step: typeof StepperStep;
  Completed: typeof StepperCompleted;
};

StepperWithSubComponents.Step = StepperStep;
StepperWithSubComponents.Completed = StepperCompleted;

StepperStep.displayName = 'Stepper.Step';
StepperCompleted.displayName = 'Stepper.Completed';
Stepper.displayName = 'Stepper';

export { StepperWithSubComponents as Stepper };
export type { StepperProps, StepperStepProps, StepperCompletedProps };
