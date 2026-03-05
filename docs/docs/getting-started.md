---
sidebar_position: 1
title: Getting Started
---

# Getting Started

**react-native-nitro-version-check** is a lightweight, fast version-checking library for React Native, powered by [Nitro Modules](https://github.com/mrousavy/nitro).

It's a drop-in replacement for the unmaintained [`react-native-version-check`](https://github.com/kimxogus/react-native-version-check) — rewritten from scratch for performance.

## Features

- **Synchronous access** to version, build number, package name, and country
- **Store version lookup** from the App Store or Play Store
- **Granular update checks** — major, minor, or patch
- **Install source detection** — TestFlight, App Store, Play Store, or sideloaded
- **Lightweight** — minimal footprint, pure Swift on iOS, Kotlin on Android

## Performance

Benchmarked against [`react-native-version-check`](https://github.com/kimxogus/react-native-version-check). 100,000 iterations averaged over 5 runs on an iPhone 12:

| Method | Speedup |
|--------|---------|
| `getAllInfo` | **~3.1x faster** |
| `packageName` | **~1.6x faster** |
| `version` | **~1.6x faster** |
| `buildNumber` | **~1.6x faster** |
| `getCountry` | **~3.1x faster** |

## Quick Start

First, [install the package](/docs/installation).

```ts
import { VersionCheck } from 'react-native-nitro-version-check'

// Direct access
console.log(VersionCheck.version)       // "1.2.0"
console.log(VersionCheck.buildNumber)   // "42"
console.log(VersionCheck.packageName)   // "com.example.app"
console.log(VersionCheck.installSource) // "appstore" | "testflight" | "playstore" | undefined
console.log(VersionCheck.getCountry())  // "US"

// Or destructure properties
const { version, buildNumber, packageName, installSource } = VersionCheck

// Async operations
const url    = await VersionCheck.getStoreUrl()       // App Store / Play Store URL
const latest = await VersionCheck.getLatestVersion()  // "1.3.0" (uses device country)

// Specify a different region for version lookup (iOS only)
const latestUS = await VersionCheck.getLatestVersion({ countryCode: 'US' })

// Check for updates
if (await VersionCheck.needsUpdate()) {
  Linking.openURL(await VersionCheck.getStoreUrl())
}
```

