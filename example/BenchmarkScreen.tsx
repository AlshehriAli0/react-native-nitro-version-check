import { useCallback, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VersionCheck as NitroVC } from "react-native-nitro-version-check";
import RNVersionCheck from "react-native-version-check";

const ITERATIONS = 100_000;
const RUNS = 5;

type BenchmarkResult = {
  id: string;
  name: string;
  nitroMs: number;
  bridgeMs: number;
  note?: string;
  section?: string;
};

function measureSync(fn: () => unknown, iterations: number): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  return performance.now() - start;
}

function averageSync(fn: () => unknown, iterations: number, runs: number): number {
  // Warmup
  for (let i = 0; i < 1_000; i++) {
    fn();
  }

  let total = 0;
  for (let r = 0; r < runs; r++) {
    total += measureSync(fn, iterations);
  }
  return total / runs;
}

export default function BenchmarkScreen({ onBack }: { onBack: () => void }) {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [running, setRunning] = useState(false);

  const runBenchmark = useCallback(async () => {
    setRunning(true);
    setResults([]);

    const benchmarks: BenchmarkResult[] = [];
    const iter = ITERATIONS.toLocaleString();

    // Local refs to avoid module namespace overhead
    const nitro = NitroVC;
    const bridge = RNVersionCheck;

    // ────────────────────────────────────────────
    // Section 1: "Get all version info" — realistic usage
    // Nitro: everything sync (property reads + sync JSI call)
    // Bridge: 3 sync reads + 1 forced async (getCountry)
    // Expected: ~3-4x faster with Nitro
    // ────────────────────────────────────────────

    // Warmup both paths
    for (let i = 0; i < 100; i++) {
      nitro.packageName;
      nitro.version;
      nitro.buildNumber;
      nitro.getCountry();
      bridge.getPackageName();
      bridge.getCurrentVersion();
      bridge.getCurrentBuildNumber();
      await bridge.getCountry();
    }

    let nitroAllTotal = 0;
    let bridgeAllTotal = 0;
    for (let r = 0; r < RUNS; r++) {
      const ns = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        nitro.packageName;
        nitro.version;
        nitro.buildNumber;
        nitro.getCountry();
      }
      nitroAllTotal += performance.now() - ns;

      const bs = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        bridge.getPackageName();
        bridge.getCurrentVersion();
        bridge.getCurrentBuildNumber();
        await bridge.getCountry();
      }
      bridgeAllTotal += performance.now() - bs;
    }

    benchmarks.push({
      id: "all-info",
      name: `getAllInfo (${iter}x)`,
      nitroMs: nitroAllTotal / RUNS,
      bridgeMs: bridgeAllTotal / RUNS,
      note: `pkg + version + build + country (avg of ${RUNS} runs)`,
      section: "Real-world Usage",
    });

    setResults([...benchmarks]);

    // ────────────────────────────────────────────
    // Section 2: Individual method breakdown
    // ────────────────────────────────────────────

    benchmarks.push({
      id: "pkg",
      name: `packageName (${iter}x)`,
      nitroMs: averageSync(() => nitro.packageName, ITERATIONS, RUNS),
      bridgeMs: averageSync(() => bridge.getPackageName(), ITERATIONS, RUNS),
      note: `Nitro: property | Bridge: fn call (avg of ${RUNS} runs)`,
      section: "Individual Methods",
    });

    benchmarks.push({
      id: "ver",
      name: `version (${iter}x)`,
      nitroMs: averageSync(() => nitro.version, ITERATIONS, RUNS),
      bridgeMs: averageSync(() => bridge.getCurrentVersion(), ITERATIONS, RUNS),
      note: `Nitro: property | Bridge: fn call (avg of ${RUNS} runs)`,
    });

    benchmarks.push({
      id: "build",
      name: `buildNumber (${iter}x)`,
      nitroMs: averageSync(() => nitro.buildNumber, ITERATIONS, RUNS),
      bridgeMs: averageSync(() => bridge.getCurrentBuildNumber(), ITERATIONS, RUNS),
      note: `Nitro: property | Bridge: fn call (avg of ${RUNS} runs)`,
    });

    // getCountry — average over RUNS
    const nitroCountry = averageSync(() => nitro.getCountry(), ITERATIONS, RUNS);
    let bridgeCountryTotal = 0;
    for (let r = 0; r < RUNS; r++) {
      const s = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        await bridge.getCountry();
      }
      bridgeCountryTotal += performance.now() - s;
    }

    benchmarks.push({
      id: "country",
      name: `getCountry (${iter}x)`,
      nitroMs: nitroCountry,
      bridgeMs: bridgeCountryTotal / RUNS,
      note: `Nitro: sync JSI | Bridge: async (avg of ${RUNS} runs)`,
    });

    setResults([...benchmarks]);
    setRunning(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Benchmark</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>Nitro (JSI) vs react-native-version-check (Bridge) — up to 3.7x faster</Text>

      <TouchableOpacity
        style={[styles.runButton, running && styles.runButtonDisabled]}
        onPress={runBenchmark}
        disabled={running}
      >
        {running ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.runButtonText}>Run Benchmark</Text>
        )}
      </TouchableOpacity>

      <ScrollView style={styles.resultsContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.cellName, styles.headerText]}>Method</Text>
          <Text style={[styles.cell, styles.cellValue, styles.headerText]}>Nitro</Text>
          <Text style={[styles.cell, styles.cellValue, styles.headerText]}>Bridge</Text>
          <Text style={[styles.cell, styles.cellSpeed, styles.headerText]}>Diff</Text>
        </View>

        {results.map(r => {
          const speedup = r.bridgeMs > 0 && r.nitroMs > 0 ? r.bridgeMs / r.nitroMs : null;

          return (
            <View key={r.id}>
              {r.section && <Text style={styles.sectionHeader}>{r.section}</Text>}
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.cellName]} numberOfLines={2}>
                  {r.name}
                </Text>
                <Text style={[styles.cell, styles.cellValue]}>
                  {r.nitroMs < 0 ? "err" : `${r.nitroMs.toFixed(1)}ms`}
                </Text>
                <Text style={[styles.cell, styles.cellValue]}>
                  {r.bridgeMs < 0 ? "err" : `${r.bridgeMs.toFixed(1)}ms`}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    styles.cellSpeed,
                    speedup != null && speedup > 1 ? styles.faster : styles.slower,
                  ]}
                >
                  {speedup != null ? `${speedup.toFixed(1)}x` : "-"}
                </Text>
              </View>
              {r.note && <Text style={styles.note}>{r.note}</Text>}
            </View>
          );
        })}

        {results.length === 0 && !running && <Text style={styles.placeholder}>Tap "Run Benchmark" to start</Text>}
      </ScrollView>

      <Text style={styles.footer}>
        {ITERATIONS.toLocaleString()} iterations x {RUNS} runs (averaged){"\n"}
        {Platform.OS} | RN {Platform.constants.reactNativeVersion.major}.{Platform.constants.reactNativeVersion.minor}.
        {Platform.constants.reactNativeVersion.patch}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  backButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginBottom: 16,
  },
  runButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  runButtonDisabled: {
    opacity: 0.6,
  },
  runButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#007AFF",
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cell: {
    fontSize: 13,
  },
  cellName: {
    flex: 3,
    fontWeight: "500",
    color: "#333",
  },
  cellValue: {
    flex: 2,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
    color: "#555",
  },
  cellSpeed: {
    flex: 1.5,
    textAlign: "right",
    fontWeight: "700",
  },
  headerText: {
    fontWeight: "700",
    color: "#000",
    fontSize: 12,
    textTransform: "uppercase",
  },
  faster: {
    color: "#34C759",
  },
  slower: {
    color: "#FF3B30",
  },
  note: {
    fontSize: 11,
    color: "#aaa",
    marginTop: -2,
    marginBottom: 4,
  },
  placeholder: {
    textAlign: "center",
    color: "#bbb",
    marginTop: 40,
    fontSize: 15,
  },
  footer: {
    fontSize: 11,
    color: "#aaa",
    textAlign: "center",
    paddingVertical: 12,
    lineHeight: 16,
  },
});
