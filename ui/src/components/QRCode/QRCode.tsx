import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { extractSpacingProps, extractLayoutProps } from '../../core/utils';
import type { QRCodeProps } from './types';
import { QRCodeSVG } from './QRCodeSVG';
import { CopyButton } from '../CopyButton/CopyButton';
import { useClipboard } from '../../hooks';
import { useToast } from '../Toast/ToastProvider';
import { useTheme } from '../../core/theme';

/**
 * QRCode Component
 * 
 * Generates QR codes using the internal full-spec SVG engine.
 */
export function QRCode(props: QRCodeProps) {
  const theme = useTheme();
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(props);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterSpacing);
  
  const {
    value,
    size = 400,
    backgroundColor = 'transparent',
    color,
    errorCorrectionLevel = 'M',
    quietZone = 4,
    logo,
    style,
    testID,
    accessibilityLabel,
    onError,
    onLoadStart, // deprecated noop
    onLoadEnd,   // deprecated noop
    ...rest
  } = otherProps;

  // Default color to theme's primary text color for dark mode support
  const resolvedColor = color ?? theme.text.primary;

  const { copy } = useClipboard();
  const toast = useToast();

  const shouldCopyOnPress = !!otherProps.copyOnPress;
  const copyValue = typeof otherProps.copyOnPress === 'object' && otherProps.copyOnPress?.value
    ? otherProps.copyOnPress.value
    : value;

  const handleCopy = useCallback(async () => {
    await copy(copyValue);
    if (toast) {
      toast.show({
        title: otherProps.copyToastTitle || 'Copied',
        message: otherProps.copyToastMessage || (copyValue.length > 60 ? copyValue.slice(0,57)+'…' : copyValue)
      });
    }
  }, [copy, copyValue, toast, otherProps.copyToastMessage, otherProps.copyToastTitle]);

  const content = (
    <View
      style={{ borderRadius: 8, overflow: 'hidden'}}>
      <QRCodeSVG
        value={value}
        size={size}
        maxWidth={'100%'}
        backgroundColor={backgroundColor}
        color={resolvedColor}
        errorCorrectionLevel={errorCorrectionLevel}
        quietZone={quietZone}
        logo={logo}
        style={style}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        onError={onError}
        {...spacingProps}
        {...layoutProps}
        {...rest}
      />
      {otherProps.showCopyButton && (
        <CopyButton
          value={copyValue}
          iconOnly
          size="sm"
          style={{ position: 'absolute', top: 8, right: 8 }}
          onCopy={() => { /* toast handled in button itself via provider */ }}
        />
      )}
    </View>
  );

  if (shouldCopyOnPress) {
    return (
      <Pressable onPress={handleCopy} accessibilityLabel={accessibilityLabel || 'QR code'}>
        {content}
      </Pressable>
    );
  }
  return content;
}

QRCode.displayName = 'QRCode';
