import { normalizeTagValue } from "../constants/recipeMetadata.js";

const normalizeRecipeTag = (tag) => normalizeTagValue(tag);

export const normalizeRecipeTags = (tags = []) => tags.map(normalizeRecipeTag);
