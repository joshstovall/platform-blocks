---
title: Export & Reorder Columns
category: behavior
order: 55
tags: [datatable, export, csv, reorder, columns, drag]
status: stable
since: 1.0.0
hidden: false
---

Set `exportable` to add a CSV export button that downloads the current view (filtered + sorted, all pages) using the visible columns; provide `onExport` to handle the CSV string yourself (also the path on native). Set `enableColumnReordering` to let users drag column headers to reorder them — use `columnOrder` + `onColumnOrderChange` for controlled order, or leave it uncontrolled.
