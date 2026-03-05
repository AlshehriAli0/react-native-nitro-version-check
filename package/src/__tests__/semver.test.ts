import { compareVersions, isNewerVersion } from "../semver";

describe("semver", () => {
  describe("compareVersions", () => {
    it("should return -1 when first version is older", () => {
      expect(compareVersions("1.2.0", "1.3.0")).toBe(-1);
      expect(compareVersions("1.2.0", "2.0.0")).toBe(-1);
      expect(compareVersions("1.2.3", "1.2.4")).toBe(-1);
    });

    it("should return 1 when first version is newer", () => {
      expect(compareVersions("2.0.0", "1.9.9")).toBe(1);
      expect(compareVersions("1.3.0", "1.2.0")).toBe(1);
      expect(compareVersions("1.2.4", "1.2.3")).toBe(1);
    });

    it("should return 0 when versions are equal", () => {
      expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
      expect(compareVersions("2.5.10", "2.5.10")).toBe(0);
    });

    it("should handle major version differences", () => {
      expect(compareVersions("1.0.0", "2.0.0")).toBe(-1);
      expect(compareVersions("3.0.0", "2.0.0")).toBe(1);
    });

    it("should handle minor version differences", () => {
      expect(compareVersions("1.2.0", "1.3.0")).toBe(-1);
      expect(compareVersions("1.5.0", "1.3.0")).toBe(1);
    });

    it("should handle patch version differences", () => {
      expect(compareVersions("1.0.5", "1.0.10")).toBe(-1);
      expect(compareVersions("1.0.10", "1.0.5")).toBe(1);
    });

    it("should handle versions with leading zeros", () => {
      expect(compareVersions("01.02.03", "1.2.3")).toBe(0);
    });

    it("should handle malformed versions gracefully", () => {
      // Missing parts should be treated as 0
      expect(compareVersions("1", "1.0.0")).toBe(0);
      expect(compareVersions("1.2", "1.2.0")).toBe(0);
    });

    it("should handle real-world version scenarios", () => {
      // Bug fix scenario
      expect(compareVersions("2.2.0", "2.0.22")).toBe(1); // 2.2.0 is newer than 2.0.22
      expect(compareVersions("2.0.22", "2.2.0")).toBe(-1);

      // Update checks
      expect(compareVersions("1.0.0", "1.0.1")).toBe(-1);
      expect(compareVersions("1.0.0", "1.1.0")).toBe(-1);
      expect(compareVersions("1.0.0", "2.0.0")).toBe(-1);
    });
  });

  describe("isNewerVersion", () => {
    describe("with patch level (default)", () => {
      it("should return true for any version increase", () => {
        expect(isNewerVersion("1.0.0", "1.0.1", "patch")).toBe(true);
        expect(isNewerVersion("1.0.0", "1.1.0", "patch")).toBe(true);
        expect(isNewerVersion("1.0.0", "2.0.0", "patch")).toBe(true);
      });

      it("should return false when current is same or newer", () => {
        expect(isNewerVersion("1.0.0", "1.0.0", "patch")).toBe(false);
        expect(isNewerVersion("1.0.1", "1.0.0", "patch")).toBe(false);
        expect(isNewerVersion("2.0.0", "1.0.0", "patch")).toBe(false);
      });

      it("should use patch level as default", () => {
        expect(isNewerVersion("1.0.0", "1.0.1")).toBe(true);
        expect(isNewerVersion("1.0.0", "1.0.0")).toBe(false);
      });
    });

    describe("with minor level", () => {
      it("should return true for major or minor bumps", () => {
        expect(isNewerVersion("1.0.0", "1.1.0", "minor")).toBe(true);
        expect(isNewerVersion("1.0.0", "2.0.0", "minor")).toBe(true);
      });

      it("should return false for patch-only bumps", () => {
        expect(isNewerVersion("1.0.0", "1.0.1", "minor")).toBe(false);
      });

      it("should return false when current is same or newer", () => {
        expect(isNewerVersion("1.1.0", "1.1.0", "minor")).toBe(false);
        expect(isNewerVersion("1.1.0", "1.0.0", "minor")).toBe(false);
        expect(isNewerVersion("2.0.0", "1.5.0", "minor")).toBe(false);
      });
    });

    describe("with major level", () => {
      it("should return true only for major bumps", () => {
        expect(isNewerVersion("1.0.0", "2.0.0", "major")).toBe(true);
        expect(isNewerVersion("1.5.9", "2.0.0", "major")).toBe(true);
      });

      it("should return false for minor or patch bumps", () => {
        expect(isNewerVersion("1.0.0", "1.1.0", "major")).toBe(false);
        expect(isNewerVersion("1.0.0", "1.0.1", "major")).toBe(false);
      });

      it("should return false when current is same or newer", () => {
        expect(isNewerVersion("1.0.0", "1.0.0", "major")).toBe(false);
        expect(isNewerVersion("2.0.0", "1.0.0", "major")).toBe(false);
      });
    });

    describe("real-world scenarios", () => {
      it("should handle the GitHub issue scenario", () => {
        // From the issue: latest is 2.0.22, current is 2.2.0
        expect(isNewerVersion("2.2.0", "2.0.22", "patch")).toBe(false);
        expect(isNewerVersion("2.2.0", "2.0.22", "minor")).toBe(false);
        expect(isNewerVersion("2.2.0", "2.0.22", "major")).toBe(false);
      });

      it("should handle typical update scenarios", () => {
        // App is on 1.2.0, store has 1.2.1
        expect(isNewerVersion("1.2.0", "1.2.1", "patch")).toBe(true);
        expect(isNewerVersion("1.2.0", "1.2.1", "minor")).toBe(false);
        expect(isNewerVersion("1.2.0", "1.2.1", "major")).toBe(false);

        // App is on 1.2.0, store has 1.3.0
        expect(isNewerVersion("1.2.0", "1.3.0", "patch")).toBe(true);
        expect(isNewerVersion("1.2.0", "1.3.0", "minor")).toBe(true);
        expect(isNewerVersion("1.2.0", "1.3.0", "major")).toBe(false);

        // App is on 1.2.0, store has 2.0.0
        expect(isNewerVersion("1.2.0", "2.0.0", "patch")).toBe(true);
        expect(isNewerVersion("1.2.0", "2.0.0", "minor")).toBe(true);
        expect(isNewerVersion("1.2.0", "2.0.0", "major")).toBe(true);
      });

      it("should correctly identify when app is already up to date", () => {
        expect(isNewerVersion("1.5.0", "1.4.0")).toBe(false);
        expect(isNewerVersion("2.0.0", "1.9.9")).toBe(false);
        expect(isNewerVersion("3.0.0", "2.99.99")).toBe(false);
      });
    });
  });
});
