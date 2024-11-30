import { Asset, useAssets } from "expo-asset";

/**
 * TODO: automatically load all LUT files from the assets folder
 */
export function useLUTFiles(): Asset[] | undefined {
  const [assets, error] = useAssets([
    require("../../assets/LUTs/BlueArchitecture.cube"),
    require("../../assets/LUTs/BlueHour.cube"),
    require("../../assets/LUTs/ColdChrome.cube"),
    require("../../assets/LUTs/CrispAutumn.cube"),
    require("../../assets/LUTs/DarkAndSomber.cube"),
    require("../../assets/LUTs/HardBoost.cube"),
    require("../../assets/LUTs/LongBeachMorning.cube"),
    require("../../assets/LUTs/LushGreen.cube"),
    require("../../assets/LUTs/MagicHour.cube"),
    require("../../assets/LUTs/NaturalBoost.cube"),
    require("../../assets/LUTs/OrangeAndBlue.cube"),
    require("../../assets/LUTs/SoftBlackAndWhite.cube"),
    require("../../assets/LUTs/Waves.cube"),
  ]);

  if (error) {
    throw new Error(`Error loading LUT files: ${error.message}`, {
      cause: error,
    });
  }

  return assets as Asset[] | undefined;
}
