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

async function transformLutToImage(parsedLUT: ParsedLUT) {
  const lutSize = 512;
  const blockSize = 64;

  const lutData = new Uint8Array(lutSize * lutSize * 4);

  for (let by = 0; by < lutSize; by += blockSize) {
    for (let bx = 0; bx < lutSize; bx += blockSize) {
      for (let y = 0; y < blockSize; y++) {
        for (let x = 0; x < blockSize; x++) {
          const b = (by + y) / (lutSize - 1);
          const g = (bx + x) / (lutSize - 1);
          const r =
            (Math.floor(by / blockSize) * blockSize +
              Math.floor(bx / blockSize)) /
            (lutSize / blockSize - 1);

          const pixelIndex = ((by + y) * lutSize + (bx + x)) * 4;

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
    size: lutSize,
    totalPixels: lutSize * lutSize,
    bytesPerPixel: 4,
    totalBytes: lutData.length,
  });

  const skData = Skia.Data.fromBytes(lutData);

  const skImage = Skia.Image.MakeImage(
    {
      width: lutSize,
      height: lutSize,
      alphaType: AlphaType.Unpremul,
      colorType: ColorType.RGBA_8888,
    },
    skData,
    4 * lutSize
  );

  if (!skImage) {
    throw new Error("Failed to create Skia image");
  }

  const bytes = Array.from(skImage.encodeToBytes());
  if (!bytes) {
    throw new Error("Failed to encode image");
  }

  return { data: bytes, skImage };
}

export function useLUTTransformer(selectedLUT: SelectedLUT) {
  const [dataLUT, setDataLUT] = useState<any>();
  const [imageLUT, setImageLUT] = useState<SkImage>();

  useEffect(() => {
    let isMounted = true;

    async function loadLUT() {
      if (!selectedLUT) return;
      const result = await loadAndParseCubeLUT(selectedLUT);
      if (result && isMounted) {
        const { data, skImage } = await transformLutToImage(result);
        setDataLUT(data);
        setImageLUT(skImage);
      }
    }

    loadLUT();

    return () => {
      isMounted = false;
    };
  }, [selectedLUT]);

  return { dataLUT, imageLUT };
}
