---
displayName: Pagination
description: A navigation component for dividing content across multiple pages with customizable controls.
category: navigation
status: stable
since: 1.0.0
tags: [pagination, navigation, pages, data]
props:
  currentPage: The currently active page number
  totalPages: Total number of pages available
  onPageChange: Callback fired when page changes
  showFirstLast: Whether to show first/last page buttons
  showPrevNext: Whether to show previous/next buttons
  size: Size variant of the pagination component
  variant: Visual style variant
  maxVisiblePages: Maximum number of page buttons to show
  disabled: Whether pagination is disabled
  loading: Whether pagination is in loading state
related:
  - Table
  - List
  - DataTable
examples:
  - Basic pagination with page numbers
  - Pagination with first/last buttons
  - Different size variants
  - Advanced pagination with custom controls
---

A comprehensive pagination component that provides intuitive navigation through large datasets. The component offers flexible configuration options and consistent styling across different use cases.

## Features

- **Flexible Navigation**: Support for various navigation patterns (numbered, arrow-only, etc.)
- **Size Variants**: Multiple size options to fit different UI contexts
- **Customizable Controls**: Configurable first/last and previous/next buttons
- **Responsive Design**: Adapts to different screen sizes with smart page number truncation
- **Accessibility**: Full keyboard support and ARIA labels

## Usage

The Pagination component is ideal for breaking down large datasets into manageable chunks, commonly used with tables, lists, and search results.

```tsx
import { Pagination } from '@platform-blocks/ui';

function DataList() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      showFirstLast
      maxVisiblePages={5}
    />
  );
}
```
