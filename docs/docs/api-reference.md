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
| `installSource` | `string \| undefined` | `"appstore"`, `"testflight"`, `"playstore"`, or `undefined` for dev/sideloaded builds |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getCountry()` | `string` | Device's 2-letter ISO country code (sync) |
| `getStoreUrl()` | `Promise<string>` | App Store / Play Store URL |
| `getLatestVersion()` | `Promise<string>` | Latest version available in the store |
| `needsUpdate()` | `Promise<boolean>` | Whether an update is available |

## Standalone Exports

All methods are also available as individual named exports:

```ts
import {
  getCountry,
  getStoreUrl,
  getLatestVersion,
  needsUpdate,
  compareVersions,
} from 'react-native-nitro-version-check'
```

### `getCountry()`

Returns the device's current 2-letter ISO country code. This is a **synchronous** call.

```ts
const country = getCountry() // "US"
```

### `getStoreUrl()`

Returns the store URL for this app. Automatically resolves to the App Store on iOS and Play Store on Android.

```ts
const url = await getStoreUrl()
Linking.openURL(url)
```

### `getLatestVersion()`

Fetches the latest version of this app available in the store. Queries the iTunes API on iOS and the Play Store on Android.

```ts
const latest = await getLatestVersion() // "1.3.0"
```

### `needsUpdate(options?)`

Checks whether an app update is available using semantic version comparison.

```ts
// Any version increase
if (await needsUpdate()) {
  const url = await getStoreUrl()
  Linking.openURL(url)
}

// Only prompt for major updates (1.x → 2.x)
if (await needsUpdate({ level: 'major' })) {
  // ...
}
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | `"major" \| "minor" \| "patch"` | `"patch"` | Minimum version bump to trigger `true` |

- `"major"` — only returns `true` for major bumps (1.x → 2.x)
- `"minor"` — returns `true` for major or minor bumps
- `"patch"` — returns `true` for any version increase (default)

### `compareVersions(v1, v2)`

Compare two semver strings. Returns `-1`, `0`, or `1`.

```ts
import { compareVersions } from 'react-native-nitro-version-check'

compareVersions('1.0.0', '1.0.1') // -1
compareVersions('2.0.0', '2.0.0') //  0
compareVersions('3.0.0', '2.9.9') //  1
```

## Types

### `UpdateLevel`

```ts
type UpdateLevel = 'major' | 'minor' | 'patch'
```
