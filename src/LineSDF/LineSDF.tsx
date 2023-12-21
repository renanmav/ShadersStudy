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
  useClockValue,
} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

import LineSDFSource from "./LineSDF.sksl";

const colors = ["#dafb61", "#61dafb", "#fb61da", "#61fbcf"].map((c) =>
  Skia.Color(c)
);

export const LineSDF = () => {
  const headerHeight = useHeaderHeight();
  const { width, height: windowHeight } = useWindowDimensions();
  const height = windowHeight - headerHeight;
  const center = vec(width / 2, height / 2);

  const pointer = useValue(vec(width / 2, height / 2));

  const clock = useClockValue();

  const onTouch = useTouchHandler({
    onActive: (event) => {
      pointer.current = vec(event.x, event.y);
    },
  });

  const uniforms = useComputedValue<Uniforms>(
    () => ({
      colors,
      center,
      radius: width / 2,
      strokeWidth: 15,
      pointer: pointer.current,
      clock: clock.current,
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
