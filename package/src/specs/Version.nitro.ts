import type { HybridObject } from "react-native-nitro-modules";

export type InstallSource = "appstore" | "testflight" | "playstore";

export interface VersionCheck
  extends HybridObject<{
    ios: "swift";
    android: "kotlin";
  }> {
  readonly version: string;
  readonly buildNumber: string;
  readonly packageName: string;
  readonly installSource: InstallSource | undefined;
  getCountry(): string;
  getStoreUrl(countryCode?: string): Promise<string>;
  getLatestVersion(countryCode?: string): Promise<string>;
  needsUpdate(): Promise<boolean>;
}
