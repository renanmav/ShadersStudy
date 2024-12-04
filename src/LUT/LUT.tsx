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
import { useLUTTexture } from "./useLUTTexture";
import { useLUTFrameProcessor } from "./useLUTFrameProcessor";
import { LUTVisualizer } from "./LUTVisualizer";
import { LUTStaticImageDeclarative } from "./LUTStaticImageDeclarative";
import { LUTStaticImageImperative } from "./LUTStaticImageImperative";
import { SelectedLUT } from "./types";

import LUTShader from "./LUTShader.sksl";

const SIZE = 33;

export default function LUTScreen() {
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();

  const [selectedLUT, setSelectedLUT] = useState<SelectedLUT>(null);
  const { textureLUT } = useLUTTexture(selectedLUT);

  const frameProcessor = useLUTFrameProcessor(textureLUT);

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDevicePage />;

  const lutProps = {
    cameraShader: LUTShader,
    uniforms: { lutSize: textureLUT?.height() ?? 0 },
    lutTexture: textureLUT,
    lutSize: textureLUT?.height() ?? 0,
  };

  return (
    <View style={styles.container}>
      <LUTPicker value={selectedLUT} onChange={setSelectedLUT} />

      <LUTVisualizer lutTexture={textureLUT} />
      <LUTStaticImageDeclarative lutTexture={textureLUT} />
      <LUTStaticImageImperative lutTexture={textureLUT} />

      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFillObject}
          device={device}
          isActive={true}
          pixelFormat="rgb"
          frameProcessor={frameProcessor}
          {...lutProps}
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
