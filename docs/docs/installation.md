---
sidebar_position: 2
title: Installation
---

# Installation

Get up and running with Nitro Version Check in your React Native project. The setup takes less than a minute.

## Install the library

```sh
bun add react-native-nitro-version-check
```

> Or use your preferred package manager (`npm`, `yarn`, etc.)

### Nitro Modules

This library requires [react-native-nitro-modules](https://github.com/mrousavy/nitro). If you don't already have it installed, add it:

```sh
bun add react-native-nitro-modules
```

## Platform setup

### Expo

For Expo projects, run prebuild after installing:

```sh
npx expo prebuild
```

### Bare React Native

For bare React Native projects, install iOS pods:

```sh
cd ios && pod install
```

## Requirements

- React Native 0.76+
- [react-native-nitro-modules](https://github.com/mrousavy/nitro) >= 0.35.0 (for v1.1.0+)
- [react-native-nitro-modules](https://github.com/mrousavy/nitro) >= 0.32.0 (for v1.0.x)

## Verify installation

After installing, verify everything works:

```ts
import { VersionCheck } from 'react-native-nitro-version-check'

console.log(VersionCheck.version)     // "1.2.0"
console.log(VersionCheck.buildNumber) // "42"
console.log(VersionCheck.packageName) // "com.example.app"
```

If you see your app's version info, you're all set.
