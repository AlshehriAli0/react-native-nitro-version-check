---
sidebar_position: 4
title: Migration Guide
---

# Migration from react-native-version-check

This library is a drop-in replacement for [`react-native-version-check`](https://github.com/kimxogus/react-native-version-check). Here's how to migrate.

## 1. Swap packages

Remove the old package and install the new one:

```sh
# Remove old
npm uninstall react-native-version-check

# Install new
bun add react-native-nitro-version-check react-native-nitro-modules
```

## 2. Update imports

```ts
// diff-remove
import VersionCheck from 'react-native-version-check'
// diff-add
import { VersionCheck } from 'react-native-nitro-version-check'
```

## 3. API changes

Most APIs are the same or simpler. Key differences:

### Sync vs Async

The old library required async calls for basic info. This library caches everything at module init:

```ts
// diff-remove
const version = await VersionCheck.getCurrentVersion()
// diff-add
const version = VersionCheck.version // sync!

// diff-remove
const buildNumber = await VersionCheck.getCurrentBuildNumber()
// diff-add
const buildNumber = VersionCheck.buildNumber // sync!

// diff-remove
const packageName = await VersionCheck.getPackageName()
// diff-add
const packageName = VersionCheck.packageName // sync!
```

### Update checking

```ts
// diff-remove
const update = await VersionCheck.needUpdate()
// diff-remove
if (update.isNeeded) { ... }
// diff-add
if (await VersionCheck.needsUpdate()) { ... }

// Granular update level (new!)
// diff-add
if (await VersionCheck.needsUpdate({ level: 'major' })) { ... }
```

### Country code

```ts
// diff-remove
const country = await VersionCheck.getCountry()
// diff-add
const country = VersionCheck.getCountry() // sync!
```

## 4. New features

These are new and have no equivalent in the old library:

| Feature | API |
|---------|-----|
| Install source detection | `VersionCheck.installSource` |
| Granular update levels | `needsUpdate({ level: 'major' })` |
| Region-specific version lookups | `getLatestVersion({ countryCode: 'US' })` |
| Version comparison utility | `compareVersions(v1, v2)` |

## 5. Rebuild

For Expo:

```sh
npx expo prebuild --clean
```

For bare React Native:

```sh
cd ios && pod install
```
