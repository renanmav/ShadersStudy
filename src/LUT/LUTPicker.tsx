import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export function LUTPicker() {
  const [selectedLUT, setSelectedLUT] = useState("");
  const lutFiles = ["LUT1.cube", "LUT2.cube", "LUT3.cube"]; // Example LUT files

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedLUT}
        onValueChange={(lutSelected) => setSelectedLUT(lutSelected)}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        numberOfLines={1}
      >
        {lutFiles.map((file) => (
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
