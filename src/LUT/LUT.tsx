import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

import PermissionsPage from "./PermissionsPage";
import NoCameraDevicePage from "./NoCameraDevicePage";

import { LUTPicker } from "./LUTPicker";
import { useLUTTransformer } from "./useLUTTransformer";
import { useLUTFrameProcessor } from "./useLUTFrameProcessor";
import { LUTVisualizer } from "./LUTVisualizer";
import { SelectedLUT } from "./types";

export default function LUTScreen() {
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();

  const [selectedLUT, setSelectedLUT] = useState<SelectedLUT>(null);
  const { dataLUT, imageLUT } = useLUTTransformer(selectedLUT);

  const frameProcessor = useLUTFrameProcessor(dataLUT);

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDevicePage />;

  return (
    <View style={styles.container}>
      <LUTPicker value={selectedLUT} onChange={setSelectedLUT} />

      <LUTVisualizer imageLUT={imageLUT} />

      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFillObject}
          device={device}
          isActive={true}
          pixelFormat="rgb"
          frameProcessor={frameProcessor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
    zIndex: 1,
  },
});
