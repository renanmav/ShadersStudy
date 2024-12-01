import { Skia, SkColorFilter } from "@shopify/react-native-skia";

import { ParsedLUT } from "./types";

function interpolateTable(lut: ParsedLUT): Uint8Array {
  "worklet";

  const table = new Uint8Array(256);
  const lutSize = lut.size;

  // For each value in our 256-entry table
  for (let i = 0; i < 256; i++) {
    // Convert to float in 0-1 range
    const value = i / 255;

    // Find the position in the LUT
    const lutPos = value * (lutSize - 1);
    const lutIndex = Math.floor(lutPos);
    const fract = lutPos - lutIndex;

    // Get neighboring values
    const lower = lut.data[lutIndex] * 255;
    const upper = lut.data[Math.min(lutIndex + 1, lutSize - 1)] * 255;

    // Linearly interpolate between them
    table[i] = Math.round(lower * (1 - fract) + upper * fract);
  }

  return table;
}

export function createLUTColorFilter(parsedLUT: Required<ParsedLUT>): SkColorFilter {
  "worklet";

  try {
    // Create separate tables for R, G, B channels
    const tableR = interpolateTable({
      ...parsedLUT,
      data: parsedLUT.data.filter((_, i) => i % 3 === 0),
    });
    const tableG = interpolateTable({
      ...parsedLUT,
      data: parsedLUT.data.filter((_, i) => i % 3 === 1),
    });
    const tableB = interpolateTable({
      ...parsedLUT,
      data: parsedLUT.data.filter((_, i) => i % 3 === 2),
    });

    // Create identity table for alpha channel
    const tableA = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      tableA[i] = i;
    }

    // Convert tables to normalized color values
    const r = tableR[128] / 255;
    const g = tableG[128] / 255;
    const b = tableB[128] / 255;

    // Create color matrix for multiplication
    const matrix = [
      r, 0, 0, 0, 0, // R scaling
      0, g, 0, 0, 0, // G scaling
      0, 0, b, 0, 0, // B scaling
      0, 0, 0, 1, 0, // A unchanged
    ];

    return Skia.ColorFilter.MakeMatrix(matrix);
  } catch (error) {
    console.error("Error creating LUT color filter:", error);
    return null;
  }
}
