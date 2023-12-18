import React from "react";
import { Canvas, Fill, Shader, Skia } from "@shopify/react-native-skia";

import ShaderDotSKSL from "./SDF.sksl";

// console.log(
//   "ShaderDotSKSL",
//   "\n\nstring value: \n\n",
//   ShaderDotSKSL.toString(),
//   "\nlength:",
//   ShaderDotSKSL.length
// );

// const source = Skia.RuntimeEffect.Make(`
// // kind=shader
// uniform float4 colors[4];

// vec4 main(vec2 xy) {
//     return colors[1];
// }
// `);

const source = Skia.RuntimeEffect.Make(ShaderDotSKSL);

const colors = ["#dafb61", "#61dafb", "#fb61da", "#61fbcf"].map((c) =>
  Skia.Color(c)
);

export const SDF = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill>
        <Shader source={source} uniforms={{ colors }} />
      </Fill>
    </Canvas>
  );
};
