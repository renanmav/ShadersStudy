import {
  Skia,
  Canvas,
  Fill,
  Shader,
  Uniforms,
  vec,
  useTouchHandler,
  useValue,
  useComputedValue,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

import ShaderDotSKSL from "./SDF.sksl";

const { width, height } = Dimensions.get("screen");

const colors = ["#dafb61", "#61dafb", "#fb61da", "#61fbcf"].map((c) =>
  Skia.Color(c)
);

export const SDF = () => {
  const pointer = useValue(vec(width / 2, height / 2));

  const onTouch = useTouchHandler({
    onActive: (event) => {
      pointer.current = vec(event.x, event.y);
    },
  });

  const uniforms = useComputedValue<Uniforms>(
    () => ({
      colors,
      radius: width / 3,
      center: vec(width / 2, height / 2),
      strokeWidth: 2,
      pointer: pointer.current,
    }),
    [pointer]
  );

  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch}>
      <Fill>
        <Shader source={ShaderDotSKSL} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
};
