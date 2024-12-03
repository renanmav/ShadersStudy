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
      TileMode.Repeat,
      TileMode.Repeat,
      FilterMode.Nearest,
      MipmapMode.None
    );

    const lutShader = LUTShader.makeShaderWithChildren([], [lutsShader]);

    // const lutImageFilter = Skia.ImageFilter.MakeShader(lutShader, null);
    // paint.setImageFilter(lutImageFilter);

    paint.setShader(lutShader);
  }

  return useSkiaFrameProcessor(
    (frame) => {
      "worklet";
      frame.render(paint);
    },
    [lutTexture, paint]
  );
}
