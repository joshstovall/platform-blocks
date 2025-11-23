import React from 'react';
import { View, Pressable } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import { QRCode } from '../QRCode';

const mockQRCodeSVG = jest.fn((props: any) => (
  <View testID="mock-qr-svg" {...props} />
));

jest.mock('../QRCodeSVG', () => ({
  QRCodeSVG: (props: any) => mockQRCodeSVG(props),
}));

const mockCopyButton = jest.fn(({ onCopy }: { onCopy?: () => void }) => (
  <Pressable testID="mock-copy-button" onPress={onCopy} />
));

jest.mock('../../CopyButton/CopyButton', () => ({
  CopyButton: (props: any) => mockCopyButton(props),
}));

const mockCopy = jest.fn();

jest.mock('../../../hooks', () => ({
  useClipboard: () => ({
    copy: mockCopy,
  }),
}));

const mockToastShow = jest.fn();

jest.mock('../../Toast/ToastProvider', () => ({
  useToast: () => ({
    show: mockToastShow,
  }),
}));

describe('QRCode component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCopy.mockResolvedValue(undefined);
  });

  it('passes core props to QRCodeSVG', () => {
    render(
      <QRCode
        value="hello-world"
        size={240}
        color="#123456"
        backgroundColor="#ffffff"
        errorCorrectionLevel="H"
        quietZone={6}
        testID="qr-test"
      />
    );

    expect(mockQRCodeSVG).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'hello-world',
        size: 240,
        color: '#123456',
        backgroundColor: '#ffffff',
        errorCorrectionLevel: 'H',
        quietZone: 6,
        testID: 'qr-test',
      })
    );
  });

  it('forwards advanced appearance props to QRCodeSVG', () => {
    const logo = { uri: 'https://logo.png', size: 48, backgroundColor: '#FFF' };
    const gradient = { type: 'linear' as const, from: '#000', to: '#FFF', rotation: 45 };

    render(
      <QRCode
        value="advanced"
        moduleShape="rounded"
        cornerRadius={0.5}
        gradient={gradient}
        logo={logo}
        quietZone={2}
      />
    );

    expect(mockQRCodeSVG).toHaveBeenCalledWith(
      expect.objectContaining({
        moduleShape: 'rounded',
        cornerRadius: 0.5,
        gradient,
        logo,
        quietZone: 2,
      })
    );
  });

  it('renders copy button when showCopyButton is enabled', () => {
    const { getByTestId } = render(<QRCode value="copy-me" showCopyButton />);

    expect(getByTestId('mock-copy-button')).toBeTruthy();
    expect(mockCopyButton).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'copy-me',
        iconOnly: true,
        size: 'sm',
      })
    );
  });

  it('invokes consumer onError handler when QRCodeSVG reports an error', () => {
    const onError = jest.fn();
    render(<QRCode value="bad" onError={onError} />);

    const passedProps = mockQRCodeSVG.mock.calls[0][0];
    const error = new Error('encode failed');
    passedProps.onError?.(error);

    expect(onError).toHaveBeenCalledWith(error);
  });

  it('copies value and shows toast when pressed with copyOnPress overrides', async () => {
    const customMessage = 'Custom copy message';
    const copyValue = 'overridden';

    const { getAllByLabelText } = render(
      <QRCode
        value="original"
        accessibilityLabel="Scan QR"
        copyOnPress={{ value: copyValue }}
        copyToastTitle="Copied QR"
        copyToastMessage={customMessage}
      />
    );

    const [pressable] = getAllByLabelText('Scan QR');
    fireEvent.press(pressable);

    await waitFor(() => {
      expect(mockCopy).toHaveBeenCalledWith(copyValue);
      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Copied QR',
          message: customMessage,
        })
      );
    });
  });

  it('truncates long values in default copy toast message', async () => {
    const longValue = 'x'.repeat(80);
    const { getAllByLabelText } = render(<QRCode value={longValue} copyOnPress />);

    const [pressable] = getAllByLabelText('QR code');
    fireEvent.press(pressable);

    await waitFor(() => {
      expect(mockCopy).toHaveBeenCalledWith(longValue);
      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Copied',
          message: `${longValue.slice(0, 57)}…`,
        })
      );
    });
  });
});
