---
sidebar_position: 3
title: Compatibility
---

# Compatibility

This page documents the compatibility between different versions of react-native-nitro-version-check and the Nitro ecosystem.

## Version Matrix

| Library Version | Nitro Modules | Status |
|---|---|---|
| v1.0.x | 0.32.0 - 0.34.x | Stable |
| v1.1.0+ | 0.35.0+ | Current |

## Nitro 0.35.0 Breaking Changes

Starting with **v1.1.0**, this library requires [Nitro 0.35.0](https://github.com/mrousavy/nitro/releases/tag/v0.35.0) or later.

### What Changed

Nitro 0.35.0 includes a critical memory leak fix in Kotlin HybridObjects. This required changes to:

- **Kotlin**: Regenerated specs with updated JNI initialization
- **Swift & C++**: No breaking changes, specs regenerated for compatibility

### Migration Path

If you're using v1.0.x and want to upgrade to v1.1.0:

1. Ensure you have Nitro modules 0.35.0+:
   ```sh
   bun add react-native-nitro-modules@latest
   ```

2. Update the library:
   ```sh
   bun add react-native-nitro-version-check@latest
   ```

3. Rebuild your app:
   ```sh
   # For Expo
   npx expo prebuild --clean

   # For bare React Native
   cd ios && pod install && cd ..
   ```

## Staying on v1.0.x

If you need to stay on v1.0.x, no action is required. v1.0.x remains compatible with Nitro 0.32.0 - 0.34.x.

However, we recommend upgrading to v1.1.0+ to benefit from the memory leak fixes and improvements in Nitro 0.35.0.