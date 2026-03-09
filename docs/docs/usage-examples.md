---
sidebar_position: 3
title: Usage Examples
---

# Usage Examples

## Basic Version Info

Display the current app version and build number:

```ts
import { VersionCheck } from 'react-native-nitro-version-check'

// Direct access
const info = {
  version: VersionCheck.version,         // "1.2.0"
  build: VersionCheck.buildNumber,       // "42"
  package: VersionCheck.packageName,     // "com.example.app"
  source: VersionCheck.installSource,    // "appstore" | undefined
  country: VersionCheck.getCountry(),    // "US"
}

// Or destructure properties
const { version, buildNumber, packageName, installSource, getCountry } = VersionCheck
const appInfo = {
  version,
  build: buildNumber,
  package: packageName,
  source: installSource,
  country: getCountry(),
}
```

## Force Update Flow

Prompt the user to update when a new version is available:

```ts
import { Alert, Linking } from 'react-native'
import { VersionCheck } from 'react-native-nitro-version-check'

async function checkForUpdates() {
  if (await VersionCheck.needsUpdate()) {
    const url = await VersionCheck.getStoreUrl()
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
import { VersionCheck } from 'react-native-nitro-version-check'

// Only returns true for major version bumps
const hasMajorUpdate = await VersionCheck.needsUpdate({ level: 'major' })

// Returns true for major OR minor bumps
const hasMinorUpdate = await VersionCheck.needsUpdate({ level: 'minor' })

// Returns true for any version increase (default)
const hasAnyUpdate = await VersionCheck.needsUpdate({ level: 'patch' })

// Check against a specific App Store region (iOS only)
const needsUpdateUS = await VersionCheck.needsUpdate({ countryCode: 'US' })
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

## Check Latest Version by Region

By default, `getLatestVersion()` uses the device's country code. You can specify a different region:

```ts
import { VersionCheck } from 'react-native-nitro-version-check'

// Uses device country automatically
const latest = await VersionCheck.getLatestVersion()

// Check version in a specific region (iOS only)
const latestUS = await VersionCheck.getLatestVersion({ countryCode: 'US' })
const latestGB = await VersionCheck.getLatestVersion({ countryCode: 'GB' })
const latestJP = await VersionCheck.getLatestVersion({ countryCode: 'JP' })
```

## Compare Versions Manually

Use `VersionCheck.compareVersions()` for custom version logic:

```ts
import { VersionCheck } from 'react-native-nitro-version-check'

const result = VersionCheck.compareVersions('1.2.0', '1.3.0')
// result === -1 (first is older)

if (VersionCheck.compareVersions(currentVersion, minimumVersion) < 0) {
  // Current version is below minimum — force update
}
```

## Use with React Hook

Wrap the async check in a custom hook:

```ts
import { useEffect, useState } from 'react'
import { VersionCheck } from 'react-native-nitro-version-check'

function useUpdateCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [latestVersion, setLatestVersion] = useState<string | null>(null)

  useEffect(() => {
    async function check() {
      const [needs, latest] = await Promise.all([
        VersionCheck.needsUpdate(),
        VersionCheck.getLatestVersion(),
      ])
      setUpdateAvailable(needs)
      setLatestVersion(latest)
    }
    check()
  }, [])

  return { updateAvailable, latestVersion }
}
```

## Use with TanStack Query

If you're using [TanStack Query (React Query)](https://tanstack.com/query) for modern fetching patterns:

```ts
import { useQuery } from '@tanstack/react-query'
import { VersionCheck } from 'react-native-nitro-version-check'

export const useNeedsUpdate = () => {
  return useQuery({
    queryKey: ['needs-update'],
    queryFn: () => VersionCheck.needsUpdate(),
  })
}
```

Then use it in your component:

```tsx
function UpdateBanner() {
  const { data: shouldUpdate, isLoading } = useNeedsUpdate()

  if (isLoading || !shouldUpdate) return null

  return <Text>A new version is available!</Text>
}
```
