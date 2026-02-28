import { NitroModules } from "react-native-nitro-modules";
import type { UpdateLevel } from "./semver";
import { compareVersions, isNewerVersion } from "./semver";
import type { VersionCheck as VersionCheckType } from "./specs/Version.nitro";

const HybridVersionCheck = NitroModules.createHybridObject<VersionCheckType>("VersionCheck");

/**
 * The current app version.
 *
 * @platform ios - `CFBundleShortVersionString`
 * @platform android - `versionName`
 *
 * @example
 * ```ts
 * version // "1.2.0"
 * ```
 */
export const version = HybridVersionCheck.version;

/**
 * The current app build number.
 *
 * @platform ios - `CFBundleVersion`
 * @platform android - `versionCode`
 *
 * @example
 * ```ts
 * buildNumber // "42"
 * ```
 */
export const buildNumber = HybridVersionCheck.buildNumber;

/**
 * The app's unique identifier.
 *
 * @platform ios - Bundle ID (e.g. `com.example.app`)
 * @platform android - Application ID (e.g. `com.example.app`)
 *
 * @example
 * ```ts
 * packageName // "com.example.app"
 * ```
 */
export const packageName = HybridVersionCheck.packageName;

/**
 * Where the app was installed from, or `undefined` in dev/debug/sideloaded builds.
 *
 * @platform ios - `"testflight"` | `"appstore"` | `undefined`
 * @platform android - `"playstore"` | `undefined` — detects Play Store, Amazon Appstore, Samsung Galaxy Store, Huawei AppGallery, and other store installers
 *
 * @example
 * ```ts
 * if (installSource === "testflight") {
 *   // TestFlight build
 * }
 * if (!installSource) {
 *   // dev / sideloaded build
 * }
 * ```
 */
export const installSource = HybridVersionCheck.installSource;

/**
 * Returns the device's current 2-letter ISO country code.
 *
 * @example
 * ```ts
 * getCountry() // "US"
 * ```
 */
export const getCountry = () => HybridVersionCheck.getCountry();

/**
 * Returns the store URL for this app.
 *
 * Automatically resolves to the App Store on iOS and Play Store on Android.
 *
 * @example
 * ```ts
 * const url = await getStoreUrl();
 * Linking.openURL(url);
 * ```
 */
export const getStoreUrl = () => HybridVersionCheck.getStoreUrl();

/**
 * Fetches the latest version of this app available in the store.
 *
 * @example
 * ```ts
 * const latest = await getLatestVersion(); // "1.3.0"
 * ```
 */
export const getLatestVersion = () => HybridVersionCheck.getLatestVersion();

/**
 * Checks whether an app update is available.
 *
 * Uses semantic version comparison. By default checks for any version
 * increase, but you can filter by granularity:
 *
 * - `"major"` — only returns `true` for major bumps (1.x → 2.x)
 * - `"minor"` — returns `true` for major or minor bumps
 * - `"patch"` — returns `true` for any version increase (default)
 *
 * @example
 * ```ts
 * if (await needsUpdate()) {
 *   const url = await getStoreUrl();
 *   Linking.openURL(url);
 * }
 *
 * // Only prompt for major updates
 * const majorUpdate = await needsUpdate({ level: "major" });
 * ```
 */
export const needsUpdate = async (options?: { level?: UpdateLevel }): Promise<boolean> => {
  const latest = await HybridVersionCheck.getLatestVersion();
  return isNewerVersion(version, latest, options?.level ?? "patch");
};

/**
 * Convenience object with cached static properties.
 *
 * Properties like `version`, `buildNumber`, `packageName`, and `installSource`
 * are read once from native at module init and cached as plain JS values —
 * no JSI overhead on repeated access. Methods still call through JSI.
 */
export const VersionCheck = {
  version,
  buildNumber,
  packageName,
  installSource,
  getCountry,
  getStoreUrl,
  getLatestVersion,
  needsUpdate: () => HybridVersionCheck.needsUpdate(),
} as const;

export { compareVersions };
export type { UpdateLevel };
