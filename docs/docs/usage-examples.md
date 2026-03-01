---
sidebar_position: 3
title: Usage Examples
---

# Usage Examples

## Basic Version Info

Display the current app version and build number:

```ts
import { VersionCheck } from 'react-native-nitro-version-check'

// All sync — no await needed
const info = {
  version: VersionCheck.version,         // "1.2.0"
  build: VersionCheck.buildNumber,       // "42"
  package: VersionCheck.packageName,     // "com.example.app"
  source: VersionCheck.installSource,    // "appstore" | undefined
  country: VersionCheck.getCountry(),    // "US"
}
```

## Force Update Flow

Prompt the user to update when a new version is available:

```ts
import { Alert, Linking } from 'react-native'
import { needsUpdate, getStoreUrl } from 'react-native-nitro-version-check'

async function checkForUpdates() {
  if (await needsUpdate()) {
    const url = await getStoreUrl()
    Alert.alert(
      'Update Available',
      'A new version is available. Please update to continue.',
      [{ text: 'Update', onPress: () => Linking.openURL(url) }]
    )
  }
}
```

## Major-Only Update Prompts

Only prompt users for major version bumps (e.g., 1.x → 2.x):

```ts
import { needsUpdate } from 'react-native-nitro-version-check'

// Only returns true for major version bumps
const hasMajorUpdate = await needsUpdate({ level: 'major' })

// Returns true for major OR minor bumps
const hasMinorUpdate = await needsUpdate({ level: 'minor' })

// Returns true for any version increase (default)
const hasAnyUpdate = await needsUpdate({ level: 'patch' })
```

## Detect Install Source

Show different UI for TestFlight or sideloaded builds:

```ts
import { VersionCheck } from 'react-native-nitro-version-check'

switch (VersionCheck.installSource) {
  case 'testflight':
    console.log('Running TestFlight build')
    break
  case 'appstore':
    console.log('Running App Store build')
    break
  case 'playstore':
    console.log('Running Play Store build')
    break
  default:
    console.log('Development or sideloaded build')
}
```

## Compare Versions Manually

Use `compareVersions` for custom version logic:

```ts
import { compareVersions } from 'react-native-nitro-version-check'

const result = compareVersions('1.2.0', '1.3.0')
// result === -1 (first is older)

if (compareVersions(currentVersion, minimumVersion) < 0) {
  // Current version is below minimum — force update
}
```

## Use with React Hook

Wrap the async check in a custom hook:

```ts
import { useEffect, useState } from 'react'
import { needsUpdate, getLatestVersion } from 'react-native-nitro-version-check'

function useUpdateCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [latestVersion, setLatestVersion] = useState<string | null>(null)

  useEffect(() => {
    async function check() {
      const [needs, latest] = await Promise.all([
        needsUpdate(),
        getLatestVersion(),
      ])
      setUpdateAvailable(needs)
      setLatestVersion(latest)
    }
    check()
  }, [])

  return { updateAvailable, latestVersion }
}
```
