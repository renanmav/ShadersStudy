import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

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

export function useLoadAndParseCubeLUT(selectedLUT: SelectedLUT) {
  const [parsedLUT, setParsedLUT] = useState<ParsedLUT | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLUT() {
      if (!selectedLUT) return;
      const result = await loadAndParseCubeLUT(selectedLUT);
      if (result && isMounted) {
        setParsedLUT(result);
      }
    }

    loadLUT();

    return () => {
      isMounted = false;
    };
  }, [selectedLUT]);

  return parsedLUT;
}
