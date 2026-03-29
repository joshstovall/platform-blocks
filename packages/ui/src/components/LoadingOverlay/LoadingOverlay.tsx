import React from 'react';
import { Overlay } from '../Overlay';
import { Loader } from '../Loader';
import type { OverlayProps } from '../Overlay';
import type { LoadingOverlayProps } from './types';

export const LoadingOverlay = React.forwardRef<any, LoadingOverlayProps>((props, ref) => {
  const {
    visible = false,
    zIndex,
    overlayProps,
    loaderProps,
    loader,
    ...rest
  } = props;

  if (!visible) {
    return null;
  }

  const resolvedOverlayProps: OverlayProps = {
    center: true,
    ...overlayProps,
  } as OverlayProps;

  if (zIndex != null && overlayProps?.zIndex == null) {
    resolvedOverlayProps.zIndex = zIndex;
  }

  return (
    <Overlay
      ref={ref}
      {...resolvedOverlayProps}
      {...rest}
    >
      {loader ?? <Loader {...loaderProps} />}
    </Overlay>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';
