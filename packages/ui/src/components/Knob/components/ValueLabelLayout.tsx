import React from 'react';
import { View, ViewStyle } from 'react-native';

import { FieldHeader } from '../../_internal/FieldHeader';
import { Row, Column } from '../../Layout';
import type { SpacingProps, LayoutProps } from '../../../core/utils';
import type { KnobProps, KnobValueLabelPosition } from '../types';
import type { ValueLabelSlots } from '../hooks/useKnobValueLabels';

const hasStyleEntries = (style?: ViewStyle | null) =>
  !!style && Object.keys(style).length > 0;

export type ValueLabelLayoutProps = {
  knobElement: React.ReactNode;
  valueLabelSlots: ValueLabelSlots;
  spacingStyles?: ViewStyle;
  layoutStyles?: ViewStyle;
  spacingProps: SpacingProps;
  layoutProps: LayoutProps;
  hasLabelContent: boolean;
  label?: KnobProps['label'];
  description?: KnobProps['description'];
  labelPosition: KnobValueLabelPosition;
};

export const ValueLabelLayout: React.FC<ValueLabelLayoutProps> = ({
  knobElement,
  valueLabelSlots,
  spacingStyles,
  layoutStyles,
  spacingProps,
  layoutProps,
  hasLabelContent,
  label,
  description,
  labelPosition,
}) => {
  let composed = knobElement;

  if (valueLabelSlots.left || valueLabelSlots.right) {
    composed = (
      <Row gap="sm" align="center">
        {valueLabelSlots.left}
        {composed}
        {valueLabelSlots.right}
      </Row>
    );
  }

  if (valueLabelSlots.top || valueLabelSlots.bottom) {
    composed = (
      <Column gap="xs" align="center">
        {valueLabelSlots.top}
        {composed}
        {valueLabelSlots.bottom}
      </Column>
    );
  }

  if (!hasLabelContent) {
    const hasOuterStyles = hasStyleEntries(spacingStyles) || hasStyleEntries(layoutStyles);
    if (hasOuterStyles) {
      return <View style={[spacingStyles, layoutStyles]}>{composed}</View>;
    }
    return <>{composed}</>;
  }

  const labelNode = (
    <FieldHeader
      label={label}
      description={description}
      size="md"
      marginBottom={labelPosition === 'top' || labelPosition === 'bottom' ? undefined : 0}
    />
  );

  const isVertical = labelPosition === 'top' || labelPosition === 'bottom';
  const LayoutComponent = isVertical ? Column : Row;
  const layoutGap = isVertical ? 'xs' : 'sm';
  const layoutAlign = isVertical ? 'stretch' : 'center';

  return (
    <LayoutComponent gap={layoutGap} align={layoutAlign} {...spacingProps} {...layoutProps}>
      {labelPosition === 'top' && labelNode}
      {labelPosition === 'left' && labelNode}
      {composed}
      {labelPosition === 'right' && labelNode}
      {labelPosition === 'bottom' && labelNode}
    </LayoutComponent>
  );
};
