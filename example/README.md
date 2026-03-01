# Example App

A demo app showcasing all features of `react-native-nitro-version-check`.

## Prerequisites

- [Bun](https://bun.sh)
- [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/)
- Xcode (for iOS) or Android Studio (for Android)

## Getting Started

```sh
# 1. Install dependencies from the monorepo root
cd ..
bun install

# 2. Generate native projects
cd example
npx expo prebuild

# 3. Run the app
bun run ios      # iOS
bun run android  # Android
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun start` | Start the Expo dev server |
| `bun run ios` | Build and run on iOS simulator |
| `bun run android` | Build and run on Android emulator |
