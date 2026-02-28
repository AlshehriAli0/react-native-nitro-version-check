import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { getVersion } from "react-native-nitro-version-check";

export default function App() {
  const version = getVersion();

  return (
    <View style={styles.container}>
      <Text>Version: {version}</Text>
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
