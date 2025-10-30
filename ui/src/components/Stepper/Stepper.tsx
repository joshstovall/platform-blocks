import React, { createContext, useContext, forwardRef } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { StepperProps, StepperStepProps, StepperCompletedProps, StepperContextValue } from './types';
import { useTheme } from '../../core/theme/ThemeProvider';
import { Loader } from '../Loader';

// Create Stepper Context
const StepperContext = createContext<StepperContextValue | null>(null);

const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('Stepper components must be used within a Stepper');
  }
  return context;
};

// Size configurations
const STEPPER_SIZES = {
  xs: { iconSize: 24, fontSize: 12, spacing: 8 },
  sm: { iconSize: 28, fontSize: 14, spacing: 12 },
  md: { iconSize: 32, fontSize: 16, spacing: 16 },
  lg: { iconSize: 36, fontSize: 18, spacing: 20 },
  xl: { iconSize: 40, fontSize: 20, spacing: 24 },
};

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
    size,
    color: contextColor,
    completedIcon: contextCompletedIcon,
    allowNextStepsSelect,
  } = useStepperContext();

  const sizeConfig = STEPPER_SIZES[size];
  const finalIconSize = contextIconSize || sizeConfig.iconSize;
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
    fontSize: sizeConfig.fontSize,
    fontWeight: '600',
    color: isCompleted || isActive ? '#FFFFFF' : theme.colors.gray[6],
  });

  const getStepLabelStyles = (): TextStyle => ({
    fontSize: sizeConfig.fontSize,
    fontWeight: isActive ? '600' : '500',
    color: isActive ? stepColor : theme.text.primary,
    marginBottom: description ? 4 : 0,
  });

  const getStepDescriptionStyles = (): TextStyle => ({
    fontSize: sizeConfig.fontSize - 2,
    color: theme.text.secondary,
  });

  const getSeparatorStyles = (): ViewStyle => {
    const isLastStep = false; // We'll need to determine this from parent
    if (isLastStep) return { display: 'none' };

    if (orientation === 'vertical') {
      return {
        width: 2,
        height: sizeConfig.spacing * 2,
        backgroundColor: isCompleted ? stepColor : theme.colors.gray[3],
        marginLeft: finalIconSize / 2 - 1,
        marginVertical: 8,
      };
    }

    return {
      flex: 1,
      height: 2,
      backgroundColor: isCompleted ? stepColor : theme.colors.gray[3],
      marginHorizontal: sizeConfig.spacing,
      alignSelf: 'center',
    };
  };

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
      <View style={{ marginLeft: iconPosition === 'left' ? sizeConfig.spacing : 0, marginRight: iconPosition === 'right' ? sizeConfig.spacing : 0 }}>
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

  const contextValue: StepperContextValue = {
    active,
    onStepClick,
    orientation,
    iconPosition,
    iconSize: iconSize || STEPPER_SIZES[size].iconSize,
    size,
    color: color || theme.colors.primary[5],
    completedIcon,
    allowNextStepsSelect,
  };

  const getStepperStyles = (): ViewStyle => ({
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    alignItems: orientation === 'vertical' ? 'flex-start' : 'center',
  });

  const getContentStyles = (): ViewStyle => ({
    marginTop: orientation === 'horizontal' ? STEPPER_SIZES[size].spacing * 2 : 0,
    marginLeft: orientation === 'vertical' ? STEPPER_SIZES[size].spacing * 2 : 0,
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
              height: orientation === 'vertical' ? STEPPER_SIZES[size].spacing * 2 : 2,
              width: orientation === 'horizontal' ? undefined : 2,
              backgroundColor: index < active ? (color || theme.colors.primary[5]) : theme.colors.gray[3],
              marginHorizontal: orientation === 'horizontal' ? STEPPER_SIZES[size].spacing : 0,
              marginVertical: orientation === 'vertical' ? 8 : 0,
              marginLeft: orientation === 'vertical' ? (iconSize || STEPPER_SIZES[size].iconSize) / 2 - 1 : 0,
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
