# @platform-blocks/ui

Minimal, tree-shakeable icon library for the PlatformBlocks UI framework.

## Installation

```bash
npm install @platform-blocks/ui
```

## Usage

```tsx
import { Icon } from '@platform-blocks/ui';

// Basic usage
<Icon name="chevronDown" size="md" color="#666" />

// With custom size
<Icon name="search" size={20} />

// With accessibility
<Icon name="user" label="User profile" />

// Decorative icon (skip a11y)
<Icon name="star" decorative />
```

## Custom Icons

```tsx
import { registerIcon } from '@platform-blocks/ui';

registerIcon('customIcon', {
  content: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z',
  viewBox: '0 0 24 24',
  variant: 'outlined'
});
```

## License

MIT



## TODO
- ethernet
- battery

- google play (brand)
- gmail
- gdrive
- zoom
- snapchat
- instagram
- wikipedia
- soundcloud
- messenger
- xbox
- playstation
- steam
- figma
- deezer


- firefox
- edge
- opera
- vscode
- claude 