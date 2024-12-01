import { useSkiaFrameProcessor } from "react-native-vision-camera";
import { Skia } from "@shopify/react-native-skia";

import { createLUTColorFilter } from "./createLUTColorFilter";
import { ParsedLUT } from "./types";

export function useLUTFrameProcessor(parsedLUT: ParsedLUT) {
  return useSkiaFrameProcessor(
    (frame) => {
      "worklet";

      if (!parsedLUT) {
        console.log("LUT data not available");
        return;
      }

      const colorFilter = createLUTColorFilter(parsedLUT);
      const paint = Skia.Paint();
      paint.setColorFilter(colorFilter);

      frame.render(paint);
    },
    [parsedLUT]
  );
}
