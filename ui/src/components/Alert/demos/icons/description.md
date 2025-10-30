---
title: Icons
category: styling
order: 30
tags: [icons, severity, custom]
highlightLines: []
status: stable
since: 1.0.0
hidden: false
---

Alerts support multiple icon types:

- **String icons**: Use `icon="iconName"` to automatically create an Icon component
- **React components**: Pass any React element as the icon
- **Default severity icons**: When using `sev` prop without icon, shows appropriate default icon
- **No icon**: Use `icon={false}` to explicitly hide icons, even with severity
- **Null/undefined**: With severity shows default icon, without severity shows no icon

```
