<h1 align="center">
  react-native-nitro-version-check
</h1>

<p align="center">
  <b>A lightweight, fast version-checking library for React Native, powered by <a href="https://github.com/mrousavy/nitro">Nitro Modules</a>.</b>
</p>

<p align="center">
  A drop-in replacement for the unmaintained <a href="https://github.com/kimxogus/react-native-version-check"><code>react-native-version-check</code></a> — rewritten from scratch with <a href="https://github.com/mrousavy/nitro">Nitro Modules</a>.
</p>

<br />

## Example

```ts
import { VersionCheck, needsUpdate, getStoreUrl } from 'react-native-nitro-version-check'

// Sync — no bridge, no async
VersionCheck.version       // "1.2.0"
VersionCheck.buildNumber   // "42"
VersionCheck.packageName   // "com.example.app"
VersionCheck.installSource // "appstore" | "testflight" | "playstore" | undefined

// Check for updates
if (await needsUpdate()) {
  Linking.openURL(await getStoreUrl())
}
```

## Installation

```sh
bun add react-native-nitro-version-check
```

> Check the [full installation guide](https://alshehriali0.github.io/react-native-nitro-version-check/docs/installation) for platform setup and additional dependencies.

## Documentation

- [**Nitro Version Check** docs 📚](https://alshehriali0.github.io/react-native-nitro-version-check/)
- [**Getting Started** guide](https://alshehriali0.github.io/react-native-nitro-version-check/docs/getting-started)
- [**Installation** guide](https://alshehriali0.github.io/react-native-nitro-version-check/docs/installation)
- [**API Reference**](https://alshehriali0.github.io/react-native-nitro-version-check/docs/api-reference)
- [**Migration Guide** from react-native-version-check](https://alshehriali0.github.io/react-native-nitro-version-check/docs/migration-guide)

## Contributing

See the [contributing guide](https://alshehriali0.github.io/react-native-nitro-version-check/docs/contributing) to learn how to contribute to the repository and the development workflow.

## License

MIT
