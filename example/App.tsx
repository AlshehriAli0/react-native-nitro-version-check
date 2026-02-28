import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import VersionCheck from "react-native-nitro-version-check";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Version: {VersionCheck.version}</Text>
      <Text>Build: {VersionCheck.buildNumber}</Text>
      <Text>Package: {VersionCheck.packageName}</Text>
      <Text>Country: {VersionCheck.getCountry()}</Text>
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
  },
});