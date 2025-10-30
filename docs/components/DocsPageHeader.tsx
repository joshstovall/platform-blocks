import React from 'react';
import { Title, type TitleProps } from '@platform-blocks/ui';

/**
 * Shared heading used across docs pages to keep hero titles consistent.
 */
export const DocsPageHeader: React.FC<TitleProps> = ({
  order = 1,
  size = 44,
  afterline = true,
  subtitleProps,
  ...rest
}) => {
  const mergedSubtitleProps = {
    variant: 'body',
    colorVariant: 'secondary',
    ...subtitleProps,
  } as TitleProps['subtitleProps'];

  return (
    <Title
      order={order}
      size={size}
      afterline={afterline}
      subtitleProps={mergedSubtitleProps}
      {...rest}
    />
  );
};
