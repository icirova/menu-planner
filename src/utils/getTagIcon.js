import { getTagMetadata } from "../constants/recipeMetadata";

export const getTagIcon = (label) =>
  getTagMetadata(label)?.icon ?? "🏷️";
