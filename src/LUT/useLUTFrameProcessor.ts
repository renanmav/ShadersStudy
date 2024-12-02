import { useSkiaFrameProcessor } from "react-native-vision-camera";
import { Skia } from "@shopify/react-native-skia";

import LUTShader from "./LUTShader.sksl";

export function useLUTFrameProcessor(luts: any) {
  const shaderBuilder = Skia.RuntimeShaderBuilder(LUTShader);

  // if (luts.length > 0) {
  //   console.log("luts.length", luts.length);
  //   shaderBuilder.setUniform("luts", luts);
  // }

  const imageFilter = Skia.ImageFilter.MakeRuntimeShader(
    shaderBuilder,
    null,
    null
  );

  const paint = Skia.Paint();
  paint.setImageFilter(imageFilter);

  return useSkiaFrameProcessor(
    (frame) => {
      "worklet";
      frame.render(paint);
    },
    [luts]
  );
}
