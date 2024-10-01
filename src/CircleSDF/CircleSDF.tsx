import {
  Skia,
  Canvas,
  Fill,
  Shader,
  Uniforms,
  vec,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

import CircleSDFSource from "./CircleSDF.sksl";

const colors = ["#dafb61", "#61dafb", "#fb61da", "#61fbcf"].map((c) =>
  Skia.Color(c)
);

export const CircleSDF = () => {
  const headerHeight = useHeaderHeight();
  const { width, height: windowHeight } = useWindowDimensions();
  const height = windowHeight - headerHeight;
  const center = vec(width / 2, height / 2);

  const pointer = useSharedValue(vec(width / 2, height / 2));

  const onTouch = useTouchHandler({
    onActive: (event) => {
      pointer.value = vec(event.x, event.y);
    },
  });

  const uniforms = useDerivedValue<Uniforms>(
    () => ({
      colors,
      center,
      radius: width / 3,
      strokeWidth: 2,
      pointer: pointer.value,
    }),
    [pointer]
  );

  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch}>
      <Fill>
        <Shader source={CircleSDFSource} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
};
