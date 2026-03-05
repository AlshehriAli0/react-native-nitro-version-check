import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VersionCheck } from "react-native-nitro-version-check";
import BenchmarkScreen from "./BenchmarkScreen";

export default function App() {
  const [screen, setScreen] = useState<"main" | "benchmark">("main");
  const [loading, setLoading] = useState(true);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [updateLevel, setUpdateLevel] = useState<"major" | "minor" | "patch" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [url, latest] = await Promise.all([VersionCheck.getStoreUrl(), VersionCheck.getLatestVersion()]);
        setStoreUrl(url);
        setLatestVersion(latest);

        // Check each level to determine the most specific update type
        const isMajor = await VersionCheck.needsUpdate({ level: "major" });
        if (isMajor) {
          setUpdateLevel("major");
        } else {
          const isMinor = await VersionCheck.needsUpdate({ level: "minor" });
          if (isMinor) {
            setUpdateLevel("minor");
          } else {
            const isPatch = await VersionCheck.needsUpdate({ level: "patch" });
            if (isPatch) setUpdateLevel("patch");
          }
        }
      } catch {
        setError("App not found in store");
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (screen === "benchmark") {
    return <BenchmarkScreen onBack={() => setScreen("main")} />;
  }

  return (
    <View style={styles.container}>
      {/* Sync properties — available immediately */}
      <Text style={styles.label}>Version: {VersionCheck.version}</Text>
      <Text style={styles.label}>Build: {VersionCheck.buildNumber}</Text>
      <Text style={styles.label}>Package: {VersionCheck.packageName}</Text>
      <Text style={styles.label}>Country: {VersionCheck.getCountry()}</Text>
      <Text style={styles.label}>Install: {VersionCheck.installSource ?? "Dev Build"}</Text>

      <View style={styles.divider} />

      {/* Async data — shows loading spinner while fetching */}
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.label}>Latest: {latestVersion}</Text>
          <Text style={styles.label}>Store URL: {storeUrl}</Text>

          {updateLevel && storeUrl && (
            <TouchableOpacity onPress={() => Linking.openURL(storeUrl)}>
              <Text style={styles.updateText}>
                {updateLevel === "major" ? "Major" : updateLevel === "minor" ? "Minor" : "Patch"} update available — tap
                to open store
              </Text>
            </TouchableOpacity>
          )}

          {!updateLevel && <Text style={styles.upToDate}>App is up to date</Text>}
        </>
      )}

      <View style={styles.divider} />

      <TouchableOpacity style={styles.benchmarkButton} onPress={() => setScreen("benchmark")}>
        <Text style={styles.benchmarkButtonText}>Run Benchmark</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  label: {
    fontSize: 15,
    marginVertical: 2,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    alignSelf: "stretch",
    marginVertical: 16,
  },
  loader: {
    marginTop: 8,
  },
  updateText: {
    color: "#007AFF",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  upToDate: {
    color: "#34C759",
    marginTop: 12,
    fontSize: 15,
  },
  errorText: {
    color: "#999",
    fontSize: 14,
  },
  benchmarkButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 8,
  },
  benchmarkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
