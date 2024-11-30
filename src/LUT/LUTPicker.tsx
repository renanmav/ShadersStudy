import { useEffect, useState, useMemo, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

// TODO: automatically load all LUT files from the assets folder
// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system";
// import RNFS from "react-native-fs";

import { useLUTFiles } from "./useLUTFiles";
import { SelectedLUT } from "./types";

interface Props {
  value: SelectedLUT;
  onChange: (lut: SelectedLUT) => void;
}

export function LUTPicker({ value, onChange }: Props) {
  const lutFiles = useLUTFiles();

  const LUTs = useMemo(() => lutFiles?.map((lut) => lut.name), [lutFiles]);

  useEffect(
    function initalizeValueOnAssetLoad() {
      // if lutFiles is not loaded or value is already set, do nothing
      if (!lutFiles || value) return;

      onChange(lutFiles[0]);
    },
    [lutFiles]
  );

  const handleChange = useCallback(
    (lutNameSelected: string) => {
      if (!lutFiles) return;

      const lutFile = lutFiles.find((lut) => lut.name === lutNameSelected);
      onChange(lutFile);
    },
    [lutFiles]
  );

  if (!LUTs) return null;

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value?.name}
        onValueChange={handleChange}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        numberOfLines={1}
      >
        {LUTs.map((file) => (
          <Picker.Item key={file} label={file} value={file} />
        ))}
      </Picker>
    </View>
  );
}

const OFFSET = 20;
const PICKER_HEIGHT = 50;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: OFFSET,
    left: OFFSET,
    right: OFFSET,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
    padding: 10,
  },
  picker: {
    flex: 1,
    height: PICKER_HEIGHT,
  },
  pickerItem: {
    height: PICKER_HEIGHT,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "white",
    borderRadius: 8,
    fontWeight: "bold",
    color: "white",
  },
});
