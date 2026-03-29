import React from 'react';

import { Text, type TextProps } from './Text';

// Create component aliases for HTML-like usage
export const H1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h1" {...props} />
);

export const H2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h2" {...props} />
);

export const H3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h3" {...props} />
);

export const H4: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h4" {...props} />
);

export const H5: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h5" {...props} />
);

export const H6: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h6" {...props} />
);

export const P: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="p" {...props} />
);

export const Small: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="small" {...props} />
);

export const Strong: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="strong" {...props} />
);

export const Bold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="b" {...props} />
);

export const Italic: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="i" {...props} />
);

export const Emphasis: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="em" {...props} />
);

export const Underline: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="u" {...props} />
);

export const Code: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="code" {...props} />
);

export const Kbd: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="kbd" {...props} />
);

export const Mark: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="mark" {...props} />
);

export const Blockquote: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="blockquote" {...props} />
);

export const Cite: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="cite" {...props} />
);

export const Sub: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="sub" {...props} />
);

export const Sup: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="sup" {...props} />
);
