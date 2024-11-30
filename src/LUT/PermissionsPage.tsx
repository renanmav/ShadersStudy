import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useCameraPermission } from "react-native-vision-camera";

export default function PermissionsPage() {
  const { requestPermission } = useCameraPermission();

  const handleRequestPermission = async () => {
    const permission = await requestPermission();
    Alert.alert("Camera permission status", `${permission}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Camera permission is required to use this app
      </Text>
      <Button title="Grant Permission" onPress={handleRequestPermission} />
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
