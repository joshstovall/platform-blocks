---
title: Sticky Columns
category: layout
order: 45
tags: [datatable, sticky, pinned, columns]
status: stable
since: 1.0.0
hidden: false
---

Pin columns to the edges with `sticky: 'left'` or `sticky: 'right'` on the column definition. Pinned columns stay in place while the rest scroll horizontally. Give each pinned column an explicit numeric `width` so its frozen offset lines up exactly. Sticky positioning is web-only (a no-op on native).
