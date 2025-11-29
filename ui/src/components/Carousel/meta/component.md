---
name: Carousel
title: Carousel
category: data-display
tags: [carousel, slider, gallery, swipe]
---
The Carousel component displays a series of content in a horizontal scrollable view with optional navigation dots and controls.

### Motion controls
- `dragFree` removes paging locks so swipes coast with inertia.
- `skipSnaps={false}` limits each swipe to a single snap distance, while `dragThreshold` controls how far a gesture must travel before moving.
- `duration` feeds the underlying animation duration for arrow/dot navigation, matching Embla's `duration` option.

### Breakpoint overrides
- Use the Embla-style `breakpoints` prop to override any Carousel prop per CSS media query string (for example `@media (min-width: 992px)`).
- Multiple matches cascade: smaller queries apply first and larger ones win, letting you hide arrows on phones and switch to multi-slide paging on desktop.

```tsx
<Carousel
	itemsPerPage={1}
	showArrows={false}
	breakpoints={{
		'@media (min-width: 768px)': { itemsPerPage: 2, showArrows: true },
		'@media (min-width: 1200px)': { itemsPerPage: 4, slidesToScroll: 2 }
	}}
>
	{/* slides */}
</Carousel>
```
