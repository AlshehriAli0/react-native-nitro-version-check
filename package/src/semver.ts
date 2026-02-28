export type UpdateLevel = "major" | "minor" | "patch";

type SemVer = [major: number, minor: number, patch: number];

function parseVersion(version: string): SemVer {
  const parts = version.split(".");
  return [Number(parts[0]) || 0, Number(parts[1]) || 0, Number(parts[2]) || 0];
}

/**
 * Compares two version strings.
 *
 * @returns `-1` if `v1 < v2`, `0` if equal, `1` if `v1 > v2`
 *
 * @example
 * ```ts
 * compareVersions("1.2.0", "1.3.0") // -1
 * compareVersions("2.0.0", "1.9.9") //  1
 * compareVersions("1.0.0", "1.0.0") //  0
 * ```
 */
export function compareVersions(v1: string, v2: string): -1 | 0 | 1 {
  const a = parseVersion(v1);
  const b = parseVersion(v2);

  for (let i = 0; i < 3; i++) {
    if (a[i]! > b[i]!) return 1;
    if (a[i]! < b[i]!) return -1;
  }

  return 0;
}

/**
 * Checks whether `latest` is newer than `current` at the given granularity.
 *
 * - `"major"` — only returns `true` for major bumps (1.x → 2.x)
 * - `"minor"` — returns `true` for major or minor bumps
 * - `"patch"` — returns `true` for any version increase (default)
 */
export function isNewerVersion(current: string, latest: string, level: UpdateLevel = "patch"): boolean {
  const [curMajor, curMinor, curPatch] = parseVersion(current);
  const [latMajor, latMinor, latPatch] = parseVersion(latest);

  if (latMajor > curMajor) return true;
  if (latMajor < curMajor) return false;
  if (level === "major") return false;

  if (latMinor > curMinor) return true;
  if (latMinor < curMinor) return false;
  if (level === "minor") return false;

  return latPatch > curPatch;
}
