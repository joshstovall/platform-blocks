---
name: AppStoreButton
title: AppStoreButton (deprecated)
status: deprecated
since: 1.0.0
category: component
---

# AppStoreButton (deprecated)

This component is deprecated in favor of `AppStoreBadge`, which provides the same visual badge pattern with a simpler, more flexible API and broader brand coverage.

Use `AppStoreBadge` going forward. `AppStoreButton` remains available for backward compatibility in existing codebases.

Pre-styled app store download badges with proper branding and localization support for major app stores including Apple App Store, Google Play, Microsoft Store, Amazon Appstore, Mac App Store, and F-Droid.

## Features

- **Multiple App Stores**: Support for 6 major app stores
- **Localization**: Multi-language support for 10 languages
- **Responsive Sizes**: Four size variants (sm, md, lg, xl)
- **Proper Branding**: Follows official app store branding guidelines
- **Accessibility**: Full accessibility support with proper labels
- **Cross-Platform**: Works on iOS, Android, and Web

## App Stores Supported

- **App Store** - Apple's iOS App Store
- **Google Play** - Google's Android app store
- **Microsoft Store** - Microsoft's app store for Windows
- **Amazon Appstore** - Amazon's alternative Android app store
- **Mac App Store** - Apple's macOS App Store
- **F-Droid** - Open-source Android app repository

## Languages Supported

English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese

## Usage Guidelines

Follow official app store guidelines when using these buttons:
- Use appropriate button for each platform
- Maintain proper sizing and spacing
- Include required legal text where applicable
- Link to correct app store pages

## Migration

- New implementations should use `AppStoreBadge` and its convenience variants (e.g., `AppStoreDownloadBadge`, `GooglePlayDownloadBadge`).
- Existing `AppStoreButton` usages can be migrated by swapping to the closest `AppStoreBadge` variant. The visual output remains equivalent.