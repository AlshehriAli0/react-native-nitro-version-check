---
sidebar_position: 5
title: Contributing
---

# Contributing

Thanks for your interest in contributing! This project uses a Bun monorepo.

## Repository Structure

```
react-native-nitro-version-check/
├── package/         # Main library
│   ├── src/         # TypeScript source
│   ├── ios/         # Swift implementation
│   ├── android/     # Kotlin implementation
│   └── nitrogen/    # Generated Nitro specs
├── example/         # Demo React Native app
└── docs/            # This documentation site
```

## Setup

### Prerequisites

- [Bun](https://bun.sh)
- [Xcode](https://developer.apple.com/xcode/) (for iOS)
- [Android Studio](https://developer.android.com/studio) (for Android)

### Clone and install

```sh
git clone https://github.com/AlshehriAli0/react-native-nitro-version-check.git
cd react-native-nitro-version-check
bun install
```

## Running the Example App

### iOS

```sh
cd example
bunx expo prebuild
bun run ios
```

### Android

```sh
cd example
bunx expo prebuild
bun run android
```

## Running the Docs

```sh
cd docs
bun install
bun start
```

This starts a local Docusaurus dev server at `http://localhost:3000`.

## Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```sh
# Lint
bun run lint

# Lint and auto-fix
bun run lint:fix

# Format
bun run format
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are validated by commitlint.

```
feat: add install source detection
fix: correct version comparison for pre-release tags
docs: update API reference
chore: bump dependencies
```

## Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run `bun run lint` and `bun run typecheck`
5. Commit with a conventional commit message
6. Push and open a PR

## Releases

Releases are automated via GitHub Actions using `release-it`. Only maintainers can trigger releases.
