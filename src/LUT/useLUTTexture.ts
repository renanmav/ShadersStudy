import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import {
  AlphaType,
  clamp,
  ColorType,
  Skia,
  SkImage,
} from "@shopify/react-native-skia";

import { SelectedLUT, ParsedLUT } from "./types";

async function loadAndParseCubeLUT(
  lutFile: SelectedLUT
): Promise<ParsedLUT | null> {
  try {
    const content = await FileSystem.readAsStringAsync(lutFile.localUri);

    const lines = content.split("\n");
    const lutData: number[] = [];
    let size = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("#") || trimmed.length === 0) continue;

      if (trimmed.startsWith("LUT_3D_SIZE")) {
        size = parseInt(trimmed.split(" ")[1]);
        continue;
      }

      const lutDataRegex = /^[\d.-]+\s+[\d.-]+\s+[\d.-]+$/;
      if (!lutDataRegex.test(trimmed)) {
        console.log("Invalid LUT data read:", trimmed);
        continue;
      }

      const [r, g, b] = trimmed.split(" ").map(Number);
      lutData.push(r, g, b);
    }

    return { data: lutData, size };
  } catch (error) {
    console.error("Error loading and parsing LUT file", error);
    return null;
  }
}

async function transformLutToImage(parsedLUT: ParsedLUT) {
  const width = parsedLUT.size * parsedLUT.size;
  const height = parsedLUT.size;

  const pixels = new Uint8Array(width * height * 4);

  for (let z = 0; z < parsedLUT.size; z++) {
    for (let y = 0; y < parsedLUT.size; y++) {
      for (let x = 0; x < parsedLUT.size; x++) {
        const lutIndex =
          (z * parsedLUT.size * parsedLUT.size + y * parsedLUT.size + x) * 3;
        const pixelIndex = (y * width + z * parsedLUT.size + x) * 4;

        pixels[pixelIndex + 0] = Math.round(
          clamp(parsedLUT.data[lutIndex] * 255, 0, 255)
        ); // R
        pixels[pixelIndex + 1] = Math.round(
          clamp(parsedLUT.data[lutIndex + 1] * 255, 0, 255)
        ); // G
        pixels[pixelIndex + 2] = Math.round(
          clamp(parsedLUT.data[lutIndex + 2] * 255, 0, 255)
        ); // B
        pixels[pixelIndex + 3] = 255; // Alpha
      }
    }
  }

  const skData = Skia.Data.fromBytes(pixels);

  const skImage = Skia.Image.MakeImage(
    {
      width: width,
      height: height,
      alphaType: AlphaType.Unpremul,
      colorType: ColorType.RGBA_8888,
    },
    skData,
    4 * width
  );

  if (!skImage) {
    throw new Error("Failed to create Skia image");
  }

  console.log("Created SkImage:", {
    width: skImage.width(),
    height: skImage.height(),
  });

  return { skImage };
}

export function useLUTTexture(selectedLUT: SelectedLUT) {
  const [textureLUT, setTextureLUT] = useState<SkImage | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLUT() {
      if (!selectedLUT) return;
      const result = await loadAndParseCubeLUT(selectedLUT);
      if (result && isMounted) {
        const { skImage } = await transformLutToImage(result);
        setTextureLUT(skImage);
      }
    }

    loadLUT();

    return () => {
      isMounted = false;
    };
  }, [selectedLUT]);

  return { textureLUT };
}
