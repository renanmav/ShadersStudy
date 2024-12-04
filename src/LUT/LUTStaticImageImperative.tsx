import { View, StyleSheet, Dimensions } from "react-native";
import {
  Canvas,
  SkImage,
  useImage,
  Skia,
  MipmapMode,
  FilterMode,
  TileMode,
  createPicture,
  Picture,
  Fit,
  fitRects,
  rect as XYWHRect,
} from "@shopify/react-native-skia";

import LUTShader from "./LUTShader.sksl";

const STATIC_IMAGE = require("../../assets/cars-rgb.jpeg");

const SIZE = 33;

export function fitImage(
  fit: Fit,
  image: SkImage,
  width: number,
  height: number
) {
  "worklet";

  const imgWidth = image.width();
  const imgHeight = image.height();

  const { src, dst } = fitRects(fit, XYWHRect(0, 0, imgWidth, imgHeight), {
    x: 0,
    y: 0,
    width,
    height,
  });

  return {
    src: XYWHRect(src.x, src.y, src.width, src.height),
    dst: XYWHRect(dst.x, dst.y, dst.width, dst.height),
  };
}

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
    [lutTexture.height()], // uniforms
    [imageShader, lutsShader] // children
  );

  const paint = Skia.Paint();
  paint.setShader(lutShader);

  const { src, dst } = fitImage("contain", image, WIDTH, HEIGHT);

  const skPicture = createPicture((canvas) => {
    canvas.drawImageRect(image, src, dst, paint);
  });

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Picture picture={skPicture} />
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
    top: SIZE + HEIGHT,
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
