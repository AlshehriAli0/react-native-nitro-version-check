import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getLatestVersion, getStoreUrl, needsUpdate, VersionCheck } from "react-native-nitro-version-check";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all async data on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [update, url, latest] = await Promise.all([needsUpdate(), getStoreUrl(), getLatestVersion()]);
        setUpdateAvailable(update);
        setStoreUrl(url);
        setLatestVersion(latest);
      } catch {
        setError("App not found in store"); // this is not an error, it's just a fallback
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <View style={styles.container}>
      {/* Sync properties — available immediately */}
      <Text style={styles.label}>Version: {VersionCheck.version}</Text>
      <Text style={styles.label}>Build: {VersionCheck.buildNumber}</Text>
      <Text style={styles.label}>Package: {VersionCheck.packageName}</Text>
      <Text style={styles.label}>Country: {VersionCheck.getCountry()}</Text>

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

          {updateAvailable && storeUrl && (
            <TouchableOpacity onPress={() => Linking.openURL(storeUrl)}>
              <Text style={styles.updateText}>Update available — tap to open store</Text>
            </TouchableOpacity>
          )}

          {!updateAvailable && <Text style={styles.upToDate}>App is up to date</Text>}
        </>
      )}

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
});
