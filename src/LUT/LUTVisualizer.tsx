import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { Canvas, Image, SkImage } from "@shopify/react-native-skia";

const SIZE = 33;

const { width } = Dimensions.get("screen");

export function LUTVisualizer({ lutTexture }: { lutTexture: SkImage }) {
  if (!lutTexture) return null;

  return (
    <ScrollView
      horizontal
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Canvas style={styles.canvas}>
        <Image
          image={lutTexture}
          fit="none"
          x={0}
          y={0}
          width={SIZE * SIZE}
          height={SIZE}
        />
      </Canvas>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: SIZE,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,
  },
  canvas: {
    width: SIZE * SIZE,
    height: SIZE,
  },
});
