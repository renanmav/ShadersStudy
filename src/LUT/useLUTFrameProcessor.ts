import { useMemo } from "react";
import { useFrameProcessor } from "react-native-vision-camera";
import { Skia } from "@shopify/react-native-skia";

import LUTShaderSource from "./LUTShader.sksl";
import { SelectedLUT } from "./types";

export function useLUTFrameProcessor(selectedLUT: SelectedLUT) {
  const shader = useMemo(() => LUTShaderSource, []);

  console.log("selectedLUT", selectedLUT);

  return useFrameProcessor((frame) => {
    "worklet";

    if (!shader) {
      console.error("Shader not initialized");
      return;
    }

    // const skiaImage = Skia.Image.MakeImageFromNativeBuffer(
    //   frame.getNativeBuffer()
    // );

    // console.log("frame", frame.width, frame.height, frame.pixelFormat);
    // console.log("skiaImage", skiaImage);
    // console.log("lutFile", lutFile);

    // TODO: apply LUT to the frame
  }, []);
}
