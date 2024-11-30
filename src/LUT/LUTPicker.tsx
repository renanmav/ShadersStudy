import { useEffect, useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

// TODO: automatically load all LUT files from the assets folder
// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system";
// import RNFS from "react-native-fs";

import { useLUTFiles } from "./useLUTFiles";

export function LUTPicker() {
  const lutFiles = useLUTFiles();

  const LUTs = useMemo(() => lutFiles?.map((lut) => lut.name), [lutFiles]);

  const [selectedLUT, setSelectedLUT] = useState("");

  // useEffect(() => {
  //   async function loadLUTFiles() {
  //     let files = [];
  //     try {
  //       const folderUri = Asset.fromModule(require("../../assets/Waves.cube"));
  //       console.log("folderUri", folderUri);
  //     } catch (error) {
  //       console.error("Error loading LUT files:", error);
  //     }
  //     console.log("files", files);
  //   }
  //   loadLUTFiles();
  // }, []);

  if (!LUTs) return null;

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedLUT}
        onValueChange={(lutSelected) => setSelectedLUT(lutSelected)}
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
