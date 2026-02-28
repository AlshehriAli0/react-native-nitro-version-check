import { NitroModules } from "react-native-nitro-modules";
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
export const getCountry = VersionCheck.getCountry;

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
export const getStoreUrl = VersionCheck.getStoreUrl;

/**
 * Fetches the latest version of this app available in the store.
 *
 * @example
 * ```ts
 * const latest = await getLatestVersion(); // "1.3.0"
 * ```
 */
export const getLatestVersion = VersionCheck.getLatestVersion;

/**
 * Checks whether an app update is available.
 *
 * Compares the current version against the latest store version.
 *
 * @example
 * ```ts
 * if (await needsUpdate()) {
 *   const url = await getStoreUrl();
 *   Linking.openURL(url);
 * }
 * ```
 */
export const needsUpdate = VersionCheck.needsUpdate;

export { VersionCheck };
