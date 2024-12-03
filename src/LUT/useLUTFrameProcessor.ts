import { useSkiaFrameProcessor } from "react-native-vision-camera";
import {
  Skia,
  SkImage,
  TileMode,
  FilterMode,
  MipmapMode,
} from "@shopify/react-native-skia";

import LUTShader from "./LUTShader.sksl";

export function useLUTFrameProcessor(lutTexture: SkImage) {
  const paint = Skia.Paint();

  if (lutTexture) {
    const lutsShader = lutTexture.makeShaderOptions(
      TileMode.Clamp,
      TileMode.Clamp,
      FilterMode.Linear,
      MipmapMode.None
    );

    const lutShader = LUTShader.makeShaderWithChildren(
      [lutTexture.height()],
      [lutsShader]
    );

    paint.setShader(lutShader);
  }

  return useSkiaFrameProcessor(
    (frame) => {
      "worklet";

      frame.render(paint);
    },
    [lutTexture]
  );
}
