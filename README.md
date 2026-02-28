# react-native-nitro-version-check

A React Native module to check app version info, built with [Nitro Modules](https://github.com/mrousavy/nitro).

## Installation

```sh
bun add react-native-nitro-version-check react-native-nitro-modules
```

## Usage

```tsx
import VersionCheck from "react-native-nitro-version-check";

const version = VersionCheck.getVersion();
```

Or import individual methods directly:

```tsx
import { getVersion } from "react-native-nitro-version-check";

const version = getVersion();
```

## License

MIT
