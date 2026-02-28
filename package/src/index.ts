import { NitroModules } from "react-native-nitro-modules";
import type { UpdateLevel } from "./semver";
import { compareVersions, isNewerVersion } from "./semver";
import type { VersionCheck as VersionCheckType } from "./specs/Version.nitro";

const HybridVersionCheck = NitroModules.createHybridObject<VersionCheckType>("VersionCheck");

// Cached at module init — plain JS values, no JSI overhead on repeated access.
const version = HybridVersionCheck.version;
const buildNumber = HybridVersionCheck.buildNumber;
const packageName = HybridVersionCheck.packageName;
const installSource = HybridVersionCheck.installSource;

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
 * All version-check APIs in one object.
 *
 * @example
 * ```ts
 * VersionCheck.version      // "1.2.0"
 * VersionCheck.buildNumber  // "42"
 * VersionCheck.packageName  // "com.example.app"
 * VersionCheck.getCountry() // "US"
 *
 * const url = await VersionCheck.getStoreUrl();
 * ```
 */
export const VersionCheck = {
  /**
   * The current app version string.
   *
   * Read from `CFBundleShortVersionString` on iOS and `versionName` on Android.
   * Cached at module init, so repeated reads have zero native overhead.
   *
   * @example
   * ```ts
   * VersionCheck.version // "1.2.0"
   * ```
   */
  version,
  /**
   * The current build number.
   *
   * Read from `CFBundleVersion` on iOS and `versionCode` on Android.
   * Cached at module init.
   *
   * @example
   * ```ts
   * VersionCheck.buildNumber // "42"
   * ```
   */
  buildNumber,
  /**
   * The app's unique identifier.
   *
   * This is the Bundle ID on iOS and the Application ID on Android.
   * Cached at module init.
   *
   * @example
   * ```ts
   * VersionCheck.packageName // "com.example.app"
   * ```
   */
  packageName,
  /**
   * Where the app was installed from, or `undefined` for dev/sideloaded builds.
   *
   * - iOS: `"appstore"` | `"testflight"` | `undefined`
   * - Android: `"playstore"` | `undefined`
   *
   * @example
   * ```ts
   * if (VersionCheck.installSource === "testflight") {
   *   // running a TestFlight build
   * }
   * ```
   */
  installSource,
  /**
   * Returns the device's current 2-letter ISO country code.
   *
   * This is a synchronous Nitro call, no `await` needed.
   *
   * @example
   * ```ts
   * VersionCheck.getCountry() // "US"
   * ```
   */
  getCountry,
  /**
   * Returns the App Store (iOS) or Play Store (Android) URL for this app.
   *
   * @example
   * ```ts
   * const url = await VersionCheck.getStoreUrl();
   * Linking.openURL(url);
   * ```
   */
  getStoreUrl,
  /**
   * Fetches the latest version of this app available in the store.
   *
   * Queries the iTunes API on iOS and the Play Store on Android.
   *
   * @example
   * ```ts
   * const latest = await VersionCheck.getLatestVersion(); // "1.3.0"
   * ```
   */
  getLatestVersion,
  /**
   * Checks whether an app update is available by comparing the current
   * version against the latest store version.
   *
   * @example
   * ```ts
   * if (await VersionCheck.needsUpdate()) {
   *   const url = await VersionCheck.getStoreUrl();
   *   Linking.openURL(url);
   * }
   * ```
   */
  needsUpdate: () => HybridVersionCheck.needsUpdate(),
} as const;

export { compareVersions };
export type { UpdateLevel };
