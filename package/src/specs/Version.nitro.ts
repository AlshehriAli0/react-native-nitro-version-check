import type { HybridObject } from "react-native-nitro-modules";

export interface VersionCheck
  extends HybridObject<{
    ios: "swift";
    android: "kotlin";
  }> {
  readonly version: string;
  readonly buildNumber: string;
  readonly packageName: string;
  getCountry(): string;
}
