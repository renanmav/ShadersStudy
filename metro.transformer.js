const upstreamTransformer = require("metro-react-native-babel-transformer");

const escape = (src) => src.replace(/`/g, "\\`");

const toShaderModule = (src) => {
  return `export default require('@shopify/react-native-skia').Skia.RuntimeEffect.Make(String.raw\`${escape(
    src
  )}\`);`;
};

const skslTransformer = async (props) => {
  if (props.filename.endsWith(".sksl")) {
    props.src = toShaderModule(props.src);
  }
  return props;
};

module.exports.transform = async (props) => {
  return upstreamTransformer.transform(await skslTransformer(props));
};
