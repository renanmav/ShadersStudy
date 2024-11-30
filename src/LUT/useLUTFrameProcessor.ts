import { useFrameProcessor } from "react-native-vision-camera";

export function useLUTFrameProcessor() {
  return useFrameProcessor((frame) => {
    "worklet";
    console.log(`Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})`);

    // TODO: apply LUT to the frame
  }, []);
}
