import { View, Text, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

import PermissionsPage from "./PermissionsPage";
import NoCameraDeviceError from "./NoCameraDeviceError";

export default function LUTScreen() {
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <View>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
    </View>
  );
}
