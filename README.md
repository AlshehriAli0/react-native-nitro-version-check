# react-native-nitro-version-check

A React Native module to check app version info, built with [Nitro Modules](https://github.com/mrousavy/nitro).

## Installation

```sh
bun add react-native-nitro-version-check react-native-nitro-modules
```

## Usage

```tsx
import VersionCheck from "react-native-nitro-version-check";

VersionCheck.version;       // "1.0.0"
VersionCheck.buildNumber;   // "42"
VersionCheck.packageName;   // "com.example.app"
VersionCheck.getCountry();  // "US"
```

Or import individually:

```tsx
import { version, buildNumber, packageName, getCountry } from "react-native-nitro-version-check";
```

## API

| API | Type | Description |
|-----|------|-------------|
| `version` | `string` | App version |
| `buildNumber` | `string` | Build number |
| `packageName` | `string` | Bundle ID / package name |
| `getCountry()` | `string` | Current device country |

## License

MIT