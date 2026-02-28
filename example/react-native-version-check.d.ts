declare module "react-native-version-check" {
  interface VersionCheckStatic {
    getCountry(): Promise<string>;
    getPackageName(): string;
    getCurrentBuildNumber(): number;
    getCurrentVersion(): string;
    getStoreUrl(option?: { appID?: string; appName?: string }): Promise<string>;
    getAppStoreUrl(option?: { appID?: string; appName?: string }): Promise<string>;
    getPlayStoreUrl(option?: { packageName?: string }): Promise<string>;
    getLatestVersion(option?: {
      forceUpdate?: boolean;
      provider?: () => Promise<string>;
      fetchOptions?: RequestInit;
      ignoreErrors?: boolean;
    }): Promise<string>;
    needUpdate(option?: {
      currentVersion?: string;
      latestVersion?: string;
      depth?: number;
      forceUpdate?: boolean;
      provider?: () => Promise<string>;
      ignoreErrors?: boolean;
    }): Promise<{
      isNeeded: boolean;
      storeUrl: string;
      currentVersion: string;
      latestVersion: string;
    }>;
  }

  const VersionCheck: VersionCheckStatic;
  export default VersionCheck;
}
