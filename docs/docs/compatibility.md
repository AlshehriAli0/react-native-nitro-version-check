---
sidebar_position: 3
title: Compatibility
---

# Compatibility

This page documents the compatibility between different versions of `react-native-nitro-version-check` and the Nitro ecosystem.

## Version Matrix

| `react-native-nitro-version-check` Version | `react-native-nitro-modules` | Status |
|---|---|---|
| v1.x | 0.33.0 - 0.34.x | Stable |
| v2.x+ | 0.35.0+ | Current |

## Nitro 0.35.0 and Later

**Version 2.x and newer is fully built around Nitro 0.35+ support.** All v1.x versions work with Nitro 0.33.0 - 0.34.x.


### Upgrading from v1.x to v2.0.0+

When you're ready to upgrade to v2.0.0+, ensure you have `react-native-nitro-modules` 0.35.0+:

```sh
bun add react-native-nitro-modules@latest
bun add react-native-nitro-version-check@latest
```

Then rebuild your app:

```sh
# For Expo
bunx expo prebuild --clean

# For bare React Native
cd ios && pod install
```

### Staying on v1.x

All v1.x versions work with Nitro 0.33.0 - 0.34.x. When you upgrade to Nitro 0.35.0+, you'll need to upgrade to v2.x+.