# Highlight Colors Demo

This demo showcases the new highlight theme colors that can be used for:

- **Text highlighting in autocomplete/search results** - When users type in an autocomplete field, matching text is highlighted using the theme's highlight colors
- **Text selection on web** - Custom selection background color for better brand consistency
- **General highlighting needs** - A full color palette for various highlighting scenarios

## Features

### Semantic Colors
- `theme.states.textSelection` - For text selection background
- `theme.states.highlightText` - For highlighted text color (good contrast)
- `theme.states.highlightBackground` - For highlight background areas

### Color Palette
- `theme.colors.highlight[0-9]` - Full 10-step color palette from light to dark

### CSS Variables (Web)
- `--platform-blocks-text-selection`
- `--platform-blocks-highlight-text` 
- `--platform-blocks-highlight-background`
- `--platform-blocks-color-highlight-0` through `--platform-blocks-color-highlight-9`

### AutoComplete Integration
The AutoComplete component automatically uses these colors when `highlightMatches={true}` is set.