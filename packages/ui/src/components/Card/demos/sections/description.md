---
title: Card.Section
order: 40
tags: [section, full-bleed, card-section, slot]
highlightLines: []
status: stable
since: 1.0.0
hidden: false
---

`Card.Section` opts out of the parent Card's padding for full-bleed images, dividers, or banded content. Position-aware — the first/last sections also escape the top/bottom padding so the bleed reaches all four edges. Pass `withBorder` on a section to add a divider line where it abuts other content. Use `inheritPadding` to align inner content with the rest of the Card while keeping the section edge-to-edge.

**Direct children only** — wrapping a Section in a fragment or another View breaks position detection (matches Mantine's behaviour).
