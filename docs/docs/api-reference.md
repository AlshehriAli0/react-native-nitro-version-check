---
sidebar_position: 2
title: API Reference
---

# API Reference

## `VersionCheck`

The main object that provides all version-check APIs. Sync properties are cached at module init, so repeated reads have zero native overhead.

```ts
import { VersionCheck } from 'react-native-nitro-version-check'
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `version` | `string` | App version (`CFBundleShortVersionString` on iOS, `versionName` on Android) |
| `buildNumber` | `string` | Build number (`CFBundleVersion` on iOS, `versionCode` on Android) |
| `packageName` | `string` | Bundle ID (iOS) / Application ID (Android) |
| `installSource` | `string` | `"appstore"`, `"testflight"`, `"playstore"`, or `"sideloaded"`. On iOS, `"sideloaded"` indicates a dev build. On Android, it means the app was installed via APK/ADB (dev or release). |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getCountry()` | `string` | Device's 2-letter ISO country code (sync) |
| `getStoreUrl(options?)` | `Promise<string>` | App Store / Play Store URL with optional country code |
| `getLatestVersion(options?)` | `Promise<string>` | Latest version available in the store with optional country code |
| `needsUpdate(options?)` | `Promise<boolean>` | Whether an update is available with optional level filtering |

### `VersionCheck.getCountry()`

Returns the device's current 2-letter ISO country code. This is a **synchronous** call.

```ts
const country = VersionCheck.getCountry() // "US"
```

### `VersionCheck.getStoreUrl(options?)`

Returns the store URL for this app. Automatically resolves to the App Store on iOS and Play Store on Android.

```ts
const url = await VersionCheck.getStoreUrl()
const urlUS = await VersionCheck.getStoreUrl({ countryCode: 'US' })
Linking.openURL(url)
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `countryCode` | `string` | device country | 2-letter ISO country code (iOS only, ignored on Android) |

### `VersionCheck.getLatestVersion(options?)`

Fetches the latest version of this app available in the store. Queries the iTunes API on iOS and the Play Store on Android.

```ts
const latest = await VersionCheck.getLatestVersion() // "1.3.0"
const latestUS = await VersionCheck.getLatestVersion({ countryCode: 'US' })
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `countryCode` | `string` | device country | 2-letter ISO country code (iOS only, ignored on Android) |

### `VersionCheck.needsUpdate(options?)`

Checks whether an app update is available using semantic version comparison.

```ts
// Any version increase
if (await VersionCheck.needsUpdate()) {
  const url = await VersionCheck.getStoreUrl()
  Linking.openURL(url)
}

// Only prompt for major updates (1.x → 2.x)
if (await VersionCheck.needsUpdate({ level: 'major' })) {
  // ...
}

// Check against a specific App Store region
if (await VersionCheck.needsUpdate({ countryCode: 'US' })) {
  // ...
}
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | `"major" \| "minor" \| "patch"` | `"patch"` | Minimum version bump to trigger `true` |
| `countryCode` | `string` | device country | 2-letter ISO country code (iOS only, ignored on Android) |

- `"major"` — only returns `true` for major bumps (1.x → 2.x)
- `"minor"` — returns `true` for major or minor bumps
- `"patch"` — returns `true` for any version increase (default)

### `VersionCheck.compareVersions(v1, v2)`

Compare two semantic version strings. Returns `-1` (first is older), `0` (equal), or `1` (first is newer).

```ts
VersionCheck.compareVersions('1.0.0', '1.0.1') // -1
VersionCheck.compareVersions('2.0.0', '2.0.0') //  0
VersionCheck.compareVersions('3.0.0', '2.9.9') //  1
```

## Types

### `UpdateLevel`

```ts
type UpdateLevel = 'major' | 'minor' | 'patch'
```
