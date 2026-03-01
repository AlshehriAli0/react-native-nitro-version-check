---
sidebar_position: 2
title: Installation
---

# Installation

Get up and running with Nitro Version Check in your React Native project. The setup takes less than a minute.

## Install packages

```sh
bun add react-native-nitro-version-check react-native-nitro-modules
```

or with npm:

```sh
npm install react-native-nitro-version-check react-native-nitro-modules
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
- [react-native-nitro-modules](https://github.com/mrousavy/nitro) >= 0.32.0

## Verify installation

After installing, verify everything works:

```ts
import { VersionCheck } from 'react-native-nitro-version-check'

console.log(VersionCheck.version)     // "1.2.0"
console.log(VersionCheck.buildNumber) // "42"
console.log(VersionCheck.packageName) // "com.example.app"
```

If you see your app's version info, you're all set.
