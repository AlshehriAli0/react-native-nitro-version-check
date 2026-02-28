<h1 align="center">
  react-native-nitro-version-check
</h1>

<p align="center">
  <b>A fast, modern version-checking library for React Native, powered by <a href="https://github.com/mrousavy/nitro">Nitro Modules</a>.</b>
</p>

<p align="center">
  A drop-in replacement for the unmaintained <a href="https://github.com/kimxogus/react-native-version-check"><code>react-native-version-check</code></a> — rewritten from scratch with <a href="https://github.com/mrousavy/nitro">Nitro Modules</a>.
</p>

<br />

## Features

- ⚡ **Synchronous access** to version, build number, package name, and country
- 🏪 **Store version lookup** from the App Store or Play Store
- 🔍 **Granular update checks** — major, minor, or patch
- 📦 **Install source detection** — TestFlight, App Store, Play Store, or sideloaded
- 🪶 **Tiny footprint** — pure Swift on iOS, Kotlin on Android

## Performance

Benchmarked against [`react-native-version-check`](https://github.com/kimxogus/react-native-version-check). 100,000 iterations averaged over 5 runs on an iPhone 12:

| Method | Speedup |
|--------|---------|
| `getAllInfo` | **~3.1x faster** |
| `packageName` | **~1.6x faster** |
| `version` | **~1.6x faster** |
| `buildNumber` | **~1.6x faster** |
| `getCountry` | **~3.1x faster** |

## Installation

```sh
bun add react-native-nitro-version-check react-native-nitro-modules
```

For Expo projects, run prebuild:
```sh
npx expo prebuild
```

For bare React Native projects:
```sh
cd ios && pod install
```

## Usage

```ts
import { VersionCheck, getCountry, getStoreUrl, getLatestVersion, needsUpdate } from 'react-native-nitro-version-check'

// Sync properties
VersionCheck.version       // "1.2.0"
VersionCheck.buildNumber   // "42"
VersionCheck.packageName   // "com.example.app"
VersionCheck.installSource // "appstore" | "testflight" | "playstore" | undefined
getCountry()               // "US"

// Async
const url    = await getStoreUrl()       // App Store / Play Store URL
const latest = await getLatestVersion()  // "1.3.0"

if (await needsUpdate()) {
  Linking.openURL(await getStoreUrl())
}

// Only prompt for major updates
if (await needsUpdate({ level: 'major' })) {
  // 1.x → 2.x
}
```

## API

### `VersionCheck`

| Property | Type | Description |
|----------|------|-------------|
| `version` | `string` | App version |
| `buildNumber` | `string` | Build number |
| `packageName` | `string` | Bundle ID / Application ID |
| `installSource` | `string \| undefined` | `"appstore"` `"testflight"` `"playstore"` or `undefined` |
| `getCountry()` | `string` | Device's 2-letter ISO country code |
| `getStoreUrl()` | `Promise<string>` | App Store / Play Store URL |
| `getLatestVersion()` | `Promise<string>` | Latest version in the store |
| `needsUpdate()` | `Promise<boolean>` | Whether an update is available |

### Standalone exports

Also available as individual named exports:

| Export | Returns | Description |
|--------|---------|-------------|
| `getCountry()` | `string` | Device's 2-letter ISO country code |
| `getStoreUrl()` | `Promise<string>` | App Store / Play Store URL |
| `getLatestVersion()` | `Promise<string>` | Latest version in the store |
| `needsUpdate(options?)` | `Promise<boolean>` | Whether an update is available |

#### `needsUpdate` options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | `"major" \| "minor" \| "patch"` | `"patch"` | Minimum version bump to trigger `true` |

### Utilities

| Function | Returns | Description |
|----------|---------|-------------|
| `compareVersions(v1, v2)` | `-1 \| 0 \| 1` | Compare two semver strings |

## License

MIT
