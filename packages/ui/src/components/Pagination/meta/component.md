---
displayName: Pagination
description: A navigation component for dividing content across multiple pages with customizable controls.
category: navigation
status: stable
since: 1.0.0
tags: [pagination, navigation, pages, data]
playground: true
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
