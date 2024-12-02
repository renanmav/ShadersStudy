import { Asset } from "expo-asset";

export type SelectedLUT = Asset | null;

export type ParsedLUT = {
  data: number[];
  size: number;
};
