import { View, StyleSheet, Image } from "react-native";
import {
  Canvas,
  Fill,
  Group,
  ImageShader,
  Shader,
  Skia,
  SkImage,
  useImage,
} from "@shopify/react-native-skia";

import LUTShader from "./LUTShader.sksl";

const STATIC_IMAGE = require("../../assets/cars-rgb.jpeg");

interface Props {
  lutTexture: SkImage;
}

export function LUTStaticImage({ lutTexture }: Props) {
  const image = useImage(STATIC_IMAGE);

  if (!image || !lutTexture) return null;

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={STATIC_IMAGE}
        style={styles.staticImage}
      />

      <Canvas style={styles.canvas}>
        <Group>
          <Fill />
          <Shader source={LUTShader} uniforms={{}}>
            <ImageShader
              fit="none"
              image={lutTexture}
              rect={{
                x: 0,
                y: 0,
                width: 512,
                height: 512,
              }}
            />

            <ImageShader
              fit="contain"
              image={image}
              rect={{
                x: 0,
                y: 0,
                width: WIDTH,
                height: HEIGHT,
              }}
            />
          </Shader>
        </Group>
      </Canvas>

      {/* Invert colors */}
      {/* <Canvas style={styles.canvas}>
        <Group>
          <Fill />
          <Shader source={invertColorsShader} uniforms={{}}>
            <ImageShader
              fit="contain"
              image={image}
              rect={{
                x: 0,
                y: 0,
                width: WIDTH,
                height: HEIGHT,
              }}
            />
          </Shader>
        </Group>
      </Canvas> */}
    </View>
  );
}

const WIDTH = 200;
const HEIGHT = 150;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "red",
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

const invertColorsSource = `
  uniform shader image;

  // invert colors
  half4 main(vec2 pos) {
    vec4 color = image.eval(pos);
    return vec4((1.0 - color).rgb, 1.0);
  }
`;

const invertColorsShader = Skia.RuntimeEffect.Make(invertColorsSource);
