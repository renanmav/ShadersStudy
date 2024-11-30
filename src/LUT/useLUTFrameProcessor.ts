import { useSkiaFrameProcessor } from "react-native-vision-camera";
import { Skia } from "@shopify/react-native-skia";

import LUTShader from "./LUTShader.sksl";
import { ParsedLUT } from "./types";

export function useLUTFrameProcessor(parsedLUT: ParsedLUT) {
  return useSkiaFrameProcessor(
    (frame) => {
      "worklet";

      if (!parsedLUT) {
        console.log("LUT data not available");
        return;
      }

      const { width, height, pixelFormat, bytesPerRow } = frame;
      // console.log("frame info", { width, height, pixelFormat, bytesPerRow });

      const shaderBuilder = Skia.RuntimeShaderBuilder(LUTShader);

      // shaderBuilder.setUniform("luts", parsedLUT.data);

      const imageFilter = Skia.ImageFilter.MakeRuntimeShader(
        shaderBuilder,
        null,
        null
      );
      const paint = Skia.Paint();
      paint.setImageFilter(imageFilter);

      frame.render(paint);
    },
    [parsedLUT]
  );
}
