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
 * All version-check APIs in one object.
 *
 * Provides access to app version information, store URLs, and update checking.
 * Sync properties are cached at module init for zero native overhead.
 *
 * @example
 * ```ts
 * VersionCheck.version      // "1.2.0"
 * VersionCheck.buildNumber  // "42"
 * VersionCheck.packageName  // "com.example.app"
 * VersionCheck.getCountry() // "US"
 *
 * const url = await VersionCheck.getStoreUrl();
 * if (await VersionCheck.needsUpdate()) {
 *   Linking.openURL(url);
 * }
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
  getCountry: () => HybridVersionCheck.getCountry(),
  /**
   * Returns the App Store (iOS) or Play Store (Android) URL for this app.
   *
   * @param options - Optional configuration
   * @param options.countryCode - 2-letter ISO country code (e.g., "US", "GB")
   *   Defaults to the device's current country from `getCountry()`.
   *   Only used on iOS; ignored on Android.
   *
   * @example
   * ```ts
   * const url = await VersionCheck.getStoreUrl();
   * const urlUS = await VersionCheck.getStoreUrl({ countryCode: "US" });
   * Linking.openURL(url);
   * ```
   */
  getStoreUrl: async (options?: { countryCode?: string }): Promise<string> => {
    return HybridVersionCheck.getStoreUrl(options?.countryCode);
  },
  /**
   * Fetches the latest version of this app available in the store.
   *
   * Queries the iTunes API on iOS and the Play Store on Android.
   * On iOS, uses the device's current country code by default but can be overridden.
   *
   * @param options - Optional configuration
   * @param options.countryCode - 2-letter ISO country code (e.g., "US", "GB")
   *   Defaults to the device's current country from `getCountry()`.
   *   If the device region changes, the next call will use the new country.
   *   Only used on iOS; ignored on Android.
   *
   * @example
   * ```ts
   * const latest = await VersionCheck.getLatestVersion(); // Uses current device country
   * const latestUS = await VersionCheck.getLatestVersion({ countryCode: "US" });
   * const latestGB = await VersionCheck.getLatestVersion({ countryCode: "GB" });
   * ```
   */
  getLatestVersion: async (options?: { countryCode?: string }): Promise<string> => {
    return HybridVersionCheck.getLatestVersion(options?.countryCode);
  },
  /**
   * Checks whether an app update is available by comparing the current
   * version against the latest store version.
   *
   * Uses semantic version comparison. By default checks for any version
   * increase, but you can filter by granularity:
   *
   * - `"major"` — only returns `true` for major bumps (1.x → 2.x)
   * - `"minor"` — returns `true` for major or minor bumps
   * - `"patch"` — returns `true` for any version increase (default)
   *
   * @param options - Optional configuration
   * @param options.level - Update granularity to check for. Defaults to `"patch"`.
   * @param options.countryCode - 2-letter ISO country code (e.g., "US", "GB")
   *   Defaults to the device's current country from `getCountry()`.
   *   Only used on iOS; ignored on Android.
   *
   * @example
   * ```ts
   * if (await VersionCheck.needsUpdate()) {
   *   const url = await VersionCheck.getStoreUrl();
   *   Linking.openURL(url);
   * }
   *
   * // Only prompt for major updates
   * const majorUpdate = await VersionCheck.needsUpdate({ level: "major" });
   *
   * // Check against a specific App Store region
   * const needsUpdateUS = await VersionCheck.needsUpdate({ countryCode: "US" });
   * ```
   */
  needsUpdate: async (options?: { level?: UpdateLevel; countryCode?: string }): Promise<boolean> => {
    const latest = await HybridVersionCheck.getLatestVersion(options?.countryCode);
    return isNewerVersion(version, latest, options?.level ?? "patch");
  },
  /**
   * Compares two semantic version strings.
   *
   * @returns -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
   *
   * @example
   * ```ts
   * VersionCheck.compareVersions('1.0.0', '1.0.1') // -1
   * VersionCheck.compareVersions('2.0.0', '2.0.0') //  0
   * VersionCheck.compareVersions('3.0.0', '2.9.9') //  1
   *
   * if (VersionCheck.compareVersions(currentVersion, minimumVersion) < 0) {
   *   // Current version is below minimum — force update
   * }
   * ```
   */
  compareVersions,
} as const;
export type { UpdateLevel };
