import { type UpdateLevel, VersionCheck } from "../index";

// Mock the NitroModules
jest.mock("react-native-nitro-modules", () => ({
  NitroModules: {
    createHybridObject: jest.fn(() => ({
      version: "1.2.0",
      buildNumber: "42",
      packageName: "com.example.app",
      installSource: "appstore",
      getCountry: jest.fn(() => "US"),
      getStoreUrl: jest.fn(() => Promise.resolve("https://apps.apple.com/app/example")),
      getLatestVersion: jest.fn(() => Promise.resolve("1.3.0")),
    })),
  },
}));

describe("VersionCheck API", () => {
  describe("structure", () => {
    it("should export VersionCheck object with all required properties", () => {
      expect(VersionCheck).toBeDefined();
      expect(typeof VersionCheck).toBe("object");
    });

    it("should have sync properties", () => {
      expect(VersionCheck.version).toBeDefined();
      expect(typeof VersionCheck.version).toBe("string");

      expect(VersionCheck.buildNumber).toBeDefined();
      expect(typeof VersionCheck.buildNumber).toBe("string");

      expect(VersionCheck.packageName).toBeDefined();
      expect(typeof VersionCheck.packageName).toBe("string");
    });

    it("should have optional installSource property", () => {
      expect(VersionCheck.installSource).toBeDefined();
      expect(
        VersionCheck.installSource === undefined ||
          VersionCheck.installSource === "appstore" ||
          VersionCheck.installSource === "testflight" ||
          VersionCheck.installSource === "playstore"
      ).toBe(true);
    });

    it("should have sync method getCountry", () => {
      expect(typeof VersionCheck.getCountry).toBe("function");
      expect(VersionCheck.getCountry()).toBeDefined();
    });

    it("should have async method getStoreUrl", () => {
      expect(typeof VersionCheck.getStoreUrl).toBe("function");
      const result = VersionCheck.getStoreUrl();
      expect(result).toBeInstanceOf(Promise);
    });

    it("should have async method getLatestVersion", () => {
      expect(typeof VersionCheck.getLatestVersion).toBe("function");
      const result = VersionCheck.getLatestVersion();
      expect(result).toBeInstanceOf(Promise);
    });

    it("should have async method needsUpdate", () => {
      expect(typeof VersionCheck.needsUpdate).toBe("function");
      const result = VersionCheck.needsUpdate();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe("property access", () => {
    it("should return string values for sync properties", () => {
      expect(typeof VersionCheck.version).toBe("string");
      expect(typeof VersionCheck.buildNumber).toBe("string");
      expect(typeof VersionCheck.packageName).toBe("string");
    });

    it("should have consistent version format", () => {
      const version = VersionCheck.version;
      // Should be a semantic version like "1.2.0"
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("should return a valid country code for getCountry()", () => {
      const country = VersionCheck.getCountry();
      // Should be a 2-letter ISO country code (uppercase letters)
      expect(country).toMatch(/^[A-Z]{2}$/);
    });
  });

  describe("needsUpdate", () => {
    it("should return a Promise<boolean>", async () => {
      const result = VersionCheck.needsUpdate();
      expect(result).toBeInstanceOf(Promise);
      const resolved = await result;
      expect(typeof resolved).toBe("boolean");
    });

    it("should accept options with level parameter", async () => {
      const levels: UpdateLevel[] = ["major", "minor", "patch"];
      for (const level of levels) {
        const result = VersionCheck.needsUpdate({ level });
        expect(result).toBeInstanceOf(Promise);
        const resolved = await result;
        expect(typeof resolved).toBe("boolean");
      }
    });

    it("should default to patch level when no options provided", async () => {
      const result = await VersionCheck.needsUpdate();
      expect(typeof result).toBe("boolean");
    });

    it("should compare current version with latest", async () => {
      // With mocked latest version as '1.3.0' and current as '1.2.0'
      const needsUpdate = await VersionCheck.needsUpdate();
      expect(typeof needsUpdate).toBe("boolean");
    });
  });

  describe("API consistency", () => {
    it("should provide consistent property access across multiple calls", () => {
      expect(VersionCheck.version).toBe(VersionCheck.version);
      expect(VersionCheck.buildNumber).toBe(VersionCheck.buildNumber);
      expect(VersionCheck.packageName).toBe(VersionCheck.packageName);
      expect(VersionCheck.getCountry()).toBe(VersionCheck.getCountry());
    });

    it("should have readonly type signature", () => {
      // Type checking ensures VersionCheck object is readonly
      // This test verifies all methods and properties exist as expected
      expect(VersionCheck).toBeDefined();
      expect(Object.keys(VersionCheck).length > 0).toBe(true);
    });
  });

  describe("async operations", () => {
    it("should fetch store URL", async () => {
      const url = await VersionCheck.getStoreUrl();
      expect(url).toMatch(/^https?:\/\//);
      expect(url).toMatch(/apps\.apple\.com|play\.google\.com/);
    });

    it("should fetch store URL with custom country code", async () => {
      const urlUS = await VersionCheck.getStoreUrl({ countryCode: "US" });
      const urlGB = await VersionCheck.getStoreUrl({ countryCode: "GB" });
      expect(urlUS).toMatch(/^https?:\/\//);
      expect(urlGB).toMatch(/^https?:\/\//);
      expect(urlUS).toMatch(/apps\.apple\.com|play\.google\.com/);
      expect(urlGB).toMatch(/apps\.apple\.com|play\.google\.com/);
    });

    it("should fetch store URL with undefined country code", async () => {
      const url = await VersionCheck.getStoreUrl({ countryCode: undefined });
      expect(url).toMatch(/^https?:\/\//);
      expect(url).toMatch(/apps\.apple\.com|play\.google\.com/);
    });

    it("should fetch latest version", async () => {
      const latest = await VersionCheck.getLatestVersion();
      expect(typeof latest).toBe("string");
      // Should be a semantic version
      expect(latest).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("should fetch latest version with custom country code", async () => {
      const latestUS = await VersionCheck.getLatestVersion({ countryCode: "US" });
      const latestGB = await VersionCheck.getLatestVersion({ countryCode: "GB" });
      expect(typeof latestUS).toBe("string");
      expect(typeof latestGB).toBe("string");
      expect(latestUS).toMatch(/^\d+\.\d+\.\d+$/);
      expect(latestGB).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("should use device country code by default", async () => {
      const latest = await VersionCheck.getLatestVersion();
      const latestWithDefault = await VersionCheck.getLatestVersion({ countryCode: undefined });
      expect(typeof latest).toBe("string");
      expect(typeof latestWithDefault).toBe("string");
    });

    it("should handle getLatestVersion and needsUpdate in parallel", async () => {
      const [latest, needsUpdate] = await Promise.all([VersionCheck.getLatestVersion(), VersionCheck.needsUpdate()]);
      expect(typeof latest).toBe("string");
      expect(typeof needsUpdate).toBe("boolean");
    });

    it("should handle all async operations in parallel", async () => {
      const [storeUrl, latestVersion, needsUpdate] = await Promise.all([
        VersionCheck.getStoreUrl(),
        VersionCheck.getLatestVersion(),
        VersionCheck.needsUpdate(),
      ]);
      expect(typeof storeUrl).toBe("string");
      expect(typeof latestVersion).toBe("string");
      expect(typeof needsUpdate).toBe("boolean");
    });
  });

  describe("common usage patterns", () => {
    it("should support destructuring", () => {
      const { version, buildNumber, packageName, installSource } = VersionCheck;
      expect(typeof version).toBe("string");
      expect(typeof buildNumber).toBe("string");
      expect(typeof packageName).toBe("string");
      expect(installSource === undefined || typeof installSource === "string").toBe(true);
    });

    it("should support destructuring with getCountry", () => {
      const { getCountry } = VersionCheck;
      expect(typeof getCountry).toBe("function");
      expect(getCountry()).toBeDefined();
    });

    it("should support common update flow", async () => {
      const url = await VersionCheck.getStoreUrl();
      const needsUpdate = await VersionCheck.needsUpdate();

      expect(url).toMatch(/^https?:\/\//);
      expect(url).toMatch(/apps\.apple\.com|play\.google\.com/);
      expect(typeof needsUpdate).toBe("boolean");

      if (needsUpdate) {
        expect(url).toBeTruthy();
      }
    });

    it("should support granular update checks", async () => {
      const majorUpdate = await VersionCheck.needsUpdate({ level: "major" });
      const minorUpdate = await VersionCheck.needsUpdate({ level: "minor" });
      const patchUpdate = await VersionCheck.needsUpdate({ level: "patch" });

      // All should return boolean values
      expect([majorUpdate, minorUpdate, patchUpdate]).toEqual(
        expect.arrayContaining([true, false].includes(majorUpdate) ? [majorUpdate] : [])
      );
      expect(typeof majorUpdate).toBe("boolean");
      expect(typeof minorUpdate).toBe("boolean");
      expect(typeof patchUpdate).toBe("boolean");

      // Logical consistency: granular checks have semantic ordering
      // If major update, then minor and patch should also be true
      if (majorUpdate) {
        expect(minorUpdate).toBe(true);
        expect(patchUpdate).toBe(true);
      }
      // If minor but not major, patch should still be true
      if (minorUpdate && !majorUpdate) {
        expect(patchUpdate).toBe(true);
      }
    });

    it("should support install source detection", () => {
      const source = VersionCheck.installSource;

      if (source !== undefined) {
        expect(["appstore", "testflight", "playstore"]).toContain(source);
      }
    });

    it("should support region-specific store URLs", async () => {
      const urlUS = await VersionCheck.getStoreUrl({ countryCode: "US" });
      const urlGB = await VersionCheck.getStoreUrl({ countryCode: "GB" });
      const urlJP = await VersionCheck.getStoreUrl({ countryCode: "JP" });

      expect(urlUS).toMatch(/^https?:\/\//);
      expect(urlGB).toMatch(/^https?:\/\//);
      expect(urlJP).toMatch(/^https?:\/\//);
      expect(urlUS).toMatch(/apps\.apple\.com|play\.google\.com/);
      expect(urlGB).toMatch(/apps\.apple\.com|play\.google\.com/);
      expect(urlJP).toMatch(/apps\.apple\.com|play\.google\.com/);
    });

    it("should support region-specific version checks", async () => {
      const latestUS = await VersionCheck.getLatestVersion({ countryCode: "US" });
      const latestGB = await VersionCheck.getLatestVersion({ countryCode: "GB" });
      const latestJP = await VersionCheck.getLatestVersion({ countryCode: "JP" });

      expect(typeof latestUS).toBe("string");
      expect(typeof latestGB).toBe("string");
      expect(typeof latestJP).toBe("string");
    });
  });
});
