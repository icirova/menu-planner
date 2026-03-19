import { normalizeTagValue } from "../constants/recipeMetadata";

export const normalizeRecipeTag = (tag) => normalizeTagValue(tag);

export const normalizeRecipeTags = (tags = []) =>
  tags.map(normalizeRecipeTag);
