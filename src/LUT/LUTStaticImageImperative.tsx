import { View, StyleSheet, Dimensions } from "react-native";
import {
  Canvas,
  Fill,
  SkImage,
  useImage,
  Skia,
  MipmapMode,
  FilterMode,
  TileMode,
} from "@shopify/react-native-skia";

import LUTShader from "./LUTShader.sksl";

const STATIC_IMAGE = require("../../assets/cars-rgb.jpeg");

const SIZE = 33;

interface Props {
  lutTexture: SkImage;
}

export function LUTStaticImageImperative({ lutTexture }: Props) {
  const image = useImage(STATIC_IMAGE);

  if (!image || !lutTexture) return null;

  const imageShader = image.makeShaderOptions(
    TileMode.Clamp,
    TileMode.Clamp,
    FilterMode.Linear,
    MipmapMode.None
  );

  const lutsShader = lutTexture.makeShaderOptions(
    TileMode.Clamp,
    TileMode.Clamp,
    FilterMode.Linear,
    MipmapMode.None
  );

  const lutShader = LUTShader.makeShaderWithChildren(
    [lutTexture.height()],
    [imageShader, lutsShader]
  );

  const paint = Skia.Paint();
  paint.setShader(lutShader);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        {/* TODO: resize fill */}
        <Fill paint={paint} />
      </Canvas>
    </View>
  );
}

const { width } = Dimensions.get("screen");

const WIDTH = width;
const HEIGHT = width * (880 / 1580);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: SIZE,
    right: 0,
    width: WIDTH,
    height: HEIGHT,
    zIndex: 4,
  },
  canvas: {
    position: "absolute",
    width: WIDTH,
    height: HEIGHT,
  },
  staticImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: WIDTH,
    height: HEIGHT,
    opacity: 0.1,
  },
});
