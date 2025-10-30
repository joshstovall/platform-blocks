---
name: NavigationProgress
title: NavigationProgress
category: feedback
order: 38
tags: [loading, progress, navigation]
status: stable
since: 0.1.0
---

A lightweight global top progress bar for indicating navigation or route-loading states.

Use the exported controller `navigationProgress` to imperatively manage progress:

```
navigationProgress.start();      // begin (auto-increments toward 99%)
navigationProgress.increment(5); // manual increment
navigationProgress.set(42);      // set exact value
navigationProgress.complete();   // animate to 100 then fade/reset
navigationProgress.reset();      // immediately hide & reset
```

When you supply a `value` prop, the component becomes controlled and ignores the internal global progression.
