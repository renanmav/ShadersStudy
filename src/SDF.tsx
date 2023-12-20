import React from "react";
import {
  Skia,
  Canvas,
  Fill,
  Shader,
  Uniforms,
} from "@shopify/react-native-skia";

import ShaderDotSKSL from "./SDF.sksl";

const uniforms: Uniforms = {
  colors: ["#dafb61", "#61dafb", "#fb61da", "#61fbcf"].map((c) =>
    Skia.Color(c)
  ),
};

export const SDF = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill>
        <Shader source={ShaderDotSKSL} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
};
