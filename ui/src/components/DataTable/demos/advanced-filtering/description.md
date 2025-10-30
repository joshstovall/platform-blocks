# Advanced Per-Column Filtering Demo

This demo showcases the DataTable's advanced filtering system with intelligent, context-aware filter controls that adapt to each column's data type.

## Features Demonstrated

### Context-Aware Filter Controls
- **Text Columns**: Contains, equals, starts with, ends with operators
- **Number Columns**: Equals, not equals, greater than, less than, greater than or equal, less than or equal operators
- **Date Columns**: Equals, before, after, contains operators with flexible date parsing
- **Select Columns**: Auto-generated dropdown options from actual data values or predefined choices
- **Boolean Columns**: Yes/No/Any toggle options with smart matching

### Advanced Operator Selection
- Settings icon (⚙️) provides access to advanced operators for text, number, and date columns
- Visual operator symbols (>, <, =, ≠, etc.) for intuitive filtering
- Smart defaults with ability to customize operators per column type

### Filter Management
- Visual filter status indicator showing active conditions
- One-click filter clearing (individual or bulk operations)
- Real-time filter application with optimized performance
- Filter summary with human-readable descriptions

## Technical Implementation

### Filter Types
Each column can specify a `filterType` that determines the appropriate filter control:
- `text`: Text input with string operators
- `number`: Numeric input with comparison operators  
- `date`: Date input with temporal operators
- `select`: Dropdown with predefined or auto-generated options
- `boolean`: Toggle control for true/false/any states

### Data Types
Additional `dataType` specification provides enhanced formatting and validation:
- `currency`: Number formatting with currency symbols
- `date`: Date parsing and display formatting
- `percentage`: Percentage display formatting

### Auto-Generated Options
Select filters automatically generate options by:
1. Extracting unique values from the column data
2. Sorting and deduplicating options
3. Providing user-friendly display labels

### Operator System
The filtering system supports multiple operators per type:
- **Text**: `contains`, `eq`, `ne`, `startsWith`, `endsWith`
- **Number**: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`
- **Date**: `eq`, `ne`, `gt`, `lt`, `contains`
- **Boolean**: `eq` with special true/false/any handling

## Usage Examples

### Sample Employee Data
The demo uses a comprehensive employee dataset with:
- Mixed data types (text, numbers, dates, booleans, enums)
- Realistic business scenarios
- Visual indicators and formatting
- Representative data volumes

### Interactive Examples
- **Salary Filtering**: Try ">100000" to find high earners
- **Name Filtering**: Use the settings icon to try "starts with" filters
- **Department Selection**: Choose specific departments from dropdown
- **Date Filtering**: Filter by year like "2020" to find employees from that period
- **Status Toggle**: Switch between Active/Inactive/Any status filters

## Key Benefits

1. **Intuitive UX**: Context-aware controls that adapt to data types
2. **Powerful Filtering**: Advanced operators for precise data querying
3. **Visual Feedback**: Clear indicators of active filters and their effects
4. **Performance**: Optimized filtering with real-time updates
5. **Flexibility**: Support for custom operators and data type extensions

This demo represents a production-ready filtering system suitable for enterprise applications requiring sophisticated data exploration capabilities.