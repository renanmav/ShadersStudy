import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import {
  AlphaType,
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

const LUT_SIZE = 512;
const BLOCK_SIZE = 64;

async function transformLutToImage(parsedLUT: ParsedLUT) {
  const lutData = new Uint8Array(LUT_SIZE * LUT_SIZE * 4);

  for (let by = 0; by < LUT_SIZE; by += BLOCK_SIZE) {
    for (let bx = 0; bx < LUT_SIZE; bx += BLOCK_SIZE) {
      for (let y = 0; y < BLOCK_SIZE; y++) {
        for (let x = 0; x < BLOCK_SIZE; x++) {
          const b = (by + y) / (LUT_SIZE - 1);
          const g = (bx + x) / (LUT_SIZE - 1);
          const r =
            (Math.floor(by / BLOCK_SIZE) * BLOCK_SIZE +
              Math.floor(bx / BLOCK_SIZE)) /
            (LUT_SIZE / BLOCK_SIZE - 1);

          const pixelIndex = ((by + y) * LUT_SIZE + (bx + x)) * 4;

          // Get RGB values from parsed LUT data
          const ri = Math.min(
            Math.floor(r * parsedLUT.size),
            parsedLUT.size - 1
          );
          const gi = Math.min(
            Math.floor(g * parsedLUT.size),
            parsedLUT.size - 1
          );
          const bi = Math.min(
            Math.floor(b * parsedLUT.size),
            parsedLUT.size - 1
          );

          const index =
            (ri * parsedLUT.size * parsedLUT.size + gi * parsedLUT.size + bi) *
            3;

          // Set RGBA values
          lutData[pixelIndex + 0] = parsedLUT.data[index + 0] * 255; // R
          lutData[pixelIndex + 1] = parsedLUT.data[index + 1] * 255; // G
          lutData[pixelIndex + 2] = parsedLUT.data[index + 2] * 255; // B
          lutData[pixelIndex + 3] = 255; // Alpha
        }
      }
    }
  }

  // Log LUT texture stats
  console.log("LUT texture stats:", {
    size: LUT_SIZE,
    totalPixels: LUT_SIZE * LUT_SIZE,
    bytesPerPixel: 4,
    totalBytes: lutData.length,
  });

  const skData = Skia.Data.fromBytes(lutData);

  const skImage = Skia.Image.MakeImage(
    {
      width: LUT_SIZE,
      height: LUT_SIZE,
      alphaType: AlphaType.Unpremul,
      colorType: ColorType.RGBA_8888,
    },
    skData,
    4 * LUT_SIZE
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
  const [textureLUT, setTextureLUT] = useState<SkImage>();

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
