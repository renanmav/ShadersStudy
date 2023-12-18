import React from "react";
import {
  Skia,
  Canvas,
  Fill,
  Shader,
  Uniforms,
} from "@shopify/react-native-skia";

import ShaderDotSKSL from "./SDF.sksl";

const source = Skia.RuntimeEffect.Make(ShaderDotSKSL);

const colors = ["#dafb61", "#61dafb", "#fb61da", "#61fbcf"].map((c) =>
  Skia.Color(c)
);

const uniforms: Uniforms = {
  colors,
};

export const SDF = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill>
        <Shader source={source} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
};
