# Portal-Based Column Settings

A demonstration of DataTable's portal-based column configuration system that eliminates layout shifting and provides a superior user experience.

## Features Demonstrated

### 🚀 **Portal-Based Architecture**
- **No Layout Disruption**: Settings open in floating overlay, maintaining table structure
- **Better UX**: No awkward inline rows that push content around
- **Smooth Interactions**: Clean modal-style settings panel

### ⚙️ **Column Configuration**
- **Dynamic Header Editing**: Change column headers on-the-fly
- **Column Visibility**: Hide/show columns without layout shifts
- **Property Inspector**: View column capabilities (sortable, filterable, etc.)
- **Visual Feedback**: Color-coded property badges

### 🎯 **User Experience**
- **Intuitive Access**: Click column menu → "Column settings"
- **Easy Dismissal**: Click outside or press Escape to close
- **Contextual Positioning**: Settings appear near the target column
- **Responsive Design**: Works across different screen sizes

## Technical Implementation

### Portal System Integration
The demo uses the platform's built-in `OverlayProvider` system to render settings in a portal:

```tsx
const columnSettings = useColumnSettings({
  columns,
  onColumnUpdate: (columnKey, updates) => {
    // Handle column updates
  },
  onHideColumn: (columnKey) => {
    // Handle column hiding
  }
});
```

### Key Benefits Over Inline Settings
1. **No Layout Reflow**: Table structure remains stable during configuration
2. **Better Focus Management**: Modal-style interaction patterns
3. **Improved Accessibility**: Proper focus trapping and keyboard navigation
4. **Cleaner Visual Design**: No jarring interface changes

### Architecture Components
- **ColumnSettings Component**: Rich settings UI with form controls
- **useColumnSettings Hook**: Portal management and positioning logic
- **OverlayProvider Integration**: Cross-platform modal rendering

## Usage Patterns

This implementation is perfect for:
- **Data-heavy applications** where table stability is critical
- **User-configurable dashboards** with frequent column adjustments
- **Enterprise applications** requiring polished UX
- **Responsive interfaces** that work across device sizes

The portal-based approach represents a significant UX improvement over traditional inline settings panels.