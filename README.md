# react-native-nitro-version-check

A React Native module to check app version info, built with [Nitro Modules](https://github.com/mrousavy/nitro).

## Installation

```sh
bun add react-native-nitro-version-check react-native-nitro-modules
```

## Usage

```tsx
import { VersionCheck } from "react-native-nitro-version-check";

// Static properties
VersionCheck.version;       // "1.0.0"
VersionCheck.buildNumber;   // "42"
VersionCheck.packageName;   // "com.example.app"
VersionCheck.getCountry();  // "US"

// Async methods
const storeUrl = await VersionCheck.getStoreUrl();
const latest = await VersionCheck.getLatestVersion();

if (await VersionCheck.needsUpdate()) {
  Linking.openURL(await VersionCheck.getStoreUrl());
}
```

Or import individually:

```tsx
import { version, buildNumber, getCountry, needsUpdate } from "react-native-nitro-version-check";
```

## API

### Properties

| API | Type | Description |
|-----|------|-------------|
| `version` | `string` | App version |
| `buildNumber` | `string` | Build number |
| `packageName` | `string` | Bundle ID / package name |

### Methods

| API | Returns | Description |
|-----|---------|-------------|
| `getCountry()` | `string` | Current device country code |
| `getStoreUrl()` | `Promise<string>` | App Store / Play Store URL |
| `getLatestVersion()` | `Promise<string>` | Latest version from the store |
| `needsUpdate()` | `Promise<boolean>` | Whether an update is available |

## License

MIT
