import { NitroModules } from "react-native-nitro-modules";
import type { UpdateLevel } from "./semver";
import { compareVersions, isNewerVersion } from "./semver";
import type { VersionCheck as VersionCheckType } from "./specs/Version.nitro";

const VersionCheck = NitroModules.createHybridObject<VersionCheckType>("VersionCheck");

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
export const version = VersionCheck.version;

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
export const buildNumber = VersionCheck.buildNumber;

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
export const packageName = VersionCheck.packageName;

/**
 * Returns the device's current 2-letter ISO country code.
 *
 * @example
 * ```ts
 * getCountry() // "US"
 * ```
 */
export const getCountry = () => VersionCheck.getCountry();

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
export const getStoreUrl = () => VersionCheck.getStoreUrl();

/**
 * Fetches the latest version of this app available in the store.
 *
 * @example
 * ```ts
 * const latest = await getLatestVersion(); // "1.3.0"
 * ```
 */
export const getLatestVersion = () => VersionCheck.getLatestVersion();

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
  const latest = await VersionCheck.getLatestVersion();
  return isNewerVersion(VersionCheck.version, latest, options?.level ?? "patch");
};

export { compareVersions, VersionCheck };
export type { UpdateLevel };
