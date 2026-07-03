---
title: Column Menu & Persistence
category: behavior
order: 65
tags: [datatable, menu, pin, reorder, persistence]
status: stable
since: 1.0.0
hidden: false
---

Each column header has a `⋯` menu with sort, pin left/right, move, hide, and settings actions. Pinning (`sticky`) and ordering can be driven from the menu at runtime. When the table has a stable `id`, view preferences — hidden columns, column order, widths, and pins — are persisted to `localStorage` and restored on reload.
