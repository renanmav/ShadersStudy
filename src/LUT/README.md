# LUTs

LUTs (Look-Up Tables) are tools used in image and video processing to transform and enhance colors. They act as predefined color maps, allowing you to apply specific color grades or styles to your visuals quickly. Commonly used in filmmaking, photography, and design, LUTs can adjust tones, create cinematic effects, or convert between color spaces. They come in various formats like `.cube` and `.3dl`, and are supported by editing software like Adobe Premiere, DaVinci Resolve, and Final Cut Pro.

The goal is to use Skia as the rendering engine over the React Native Vision Camera to enable live preview of `.cube` LUTs in real time and provide the ability to capture snapshots of the current frame.

## Resources

- https://github.com/Shopify/react-native-skia/discussions/1436#discussioncomment-5573786
- https://skia.org/docs/user/sksl/#evaluating-sampling-other-skshaders
- https://lettier.github.io/3d-game-shaders-for-beginners/lookup-table.html
- https://github.com/thiagoamendola/godot-color-lut-shader

## AI prompt

Write your own implementation from .cube to SkColorFilter.

These are the available color filters: https://api.skia.org/classSkColorFilters.html#ad5bf3e8f6c59685e9a1d5e0571d11400
I found this test in the Skia source code: https://github.com/google/skia/blob/main/src/effects/colorfilters/SkTableColorFilter.cpp

Shader Toy offers examples of LUT https://www.shadertoy.com/view/wtKSWw which can "easily" be converted to Skia runtime effects.
