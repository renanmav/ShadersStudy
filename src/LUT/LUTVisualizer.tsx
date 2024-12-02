import { StyleSheet } from "react-native";
import { Canvas, Image, SkImage } from "@shopify/react-native-skia";

const SIZE = 64;

export function LUTVisualizer({ imageLUT }: { imageLUT: SkImage }) {
  return (
    <Canvas style={styles.container}>
      {imageLUT && (
        <Image
          image={imageLUT}
          fit="contain"
          x={0}
          y={0}
          width={SIZE}
          height={SIZE}
        />
      )}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,
  },
});
