import { View, Text, StyleSheet } from "react-native";

export default function NoCameraDevicePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No camera device found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: "20%",
  },
});
