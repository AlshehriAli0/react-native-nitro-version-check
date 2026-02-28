import type { HybridObject } from "react-native-nitro-modules";

export interface VersionCheck
  extends HybridObject<{
    ios: "swift";
    android: "kotlin";
  }> {
  getVersion(): string;
}
