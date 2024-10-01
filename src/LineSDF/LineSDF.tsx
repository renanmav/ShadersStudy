import {
  Skia,
  Canvas,
  Fill,
  Shader,
  Uniforms,
  vec,
  useTouchHandler,
  useClock,
} from "@shopify/react-native-skia";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

import LineSDFSource from "./LineSDF.sksl";

const colors = ["#222", "#bbb", "#111", "#fff"].map((c) => Skia.Color(c));

export const LineSDF = () => {
  const headerHeight = useHeaderHeight();
  const { width, height: windowHeight } = useWindowDimensions();
  const height = windowHeight - headerHeight;
  const center = vec(width / 2, height / 2);

  const pointer = useSharedValue(vec(width / 2, height / 2));

  const clock = useClock();

  const onTouch = useTouchHandler({
    onActive: (event) => {
      pointer.value = vec(event.x, event.y);
    },
  });

  const uniforms = useDerivedValue<Uniforms>(
    () => ({
      colors,
      center,
      radius: width / 2,
      strokeWidth: 15,
      pointer: pointer.value,
      clock: clock.value,
    }),
    [pointer, clock]
  );

  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch}>
      <Fill>
        <Shader source={LineSDFSource} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
};
