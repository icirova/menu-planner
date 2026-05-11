import {
  normalizeAllergenValuesForSuitability,
  normalizeSuitableForValues,
} from "../constants/recipeMetadata.js";
import { normalizeRecipePreTasks } from "../utils/normalizeRecipePreTasks.js";
import { normalizeRecipeTags } from "../utils/normalizeRecipeTag.js";
import { createNumericId } from "../utils/createId.js";
import { clampRecipeId } from "../utils/recipeIds.js";
import { RECIPE_SOURCE } from "../utils/recipeSource.js";
import { normalizeRecipeImageUrls } from "./imageStorage.js";

const normalizeRecipeId = (value) => {
  return clampRecipeId(value) ?? createNumericId();
};

export const normalizeRecipe = (recipe, source) => {
  const suitableFor = normalizeSuitableForValues(recipe.suitableFor ?? []);

  return {
    ...recipe,
    id: normalizeRecipeId(recipe.id),
    source: recipe.source ?? source,
    createdAt:
      typeof recipe.createdAt === "string" && recipe.createdAt.trim() ? recipe.createdAt : null,
    tags: normalizeRecipeTags(recipe.tags ?? []),
    suitableFor,
    ...(recipe.allergens == null
      ? {}
      : { allergens: normalizeAllergenValuesForSuitability(recipe.allergens, suitableFor) }),
    preTasks: normalizeRecipePreTasks(recipe.preTasks),
  };
};

export const normalizeCustomRecipe = (recipe) => normalizeRecipe(recipe, RECIPE_SOURCE.CUSTOM);

export const normalizeSeedRecipe = (recipe) => normalizeRecipe(recipe, RECIPE_SOURCE.SEED);

export const normalizeRecipeForRuntime = (recipe, source = RECIPE_SOURCE.CUSTOM) => {
  const normalizedRecipe = normalizeRecipe(recipe, source);

  return {
    ...normalizedRecipe,
    photo_urls: normalizeRecipeImageUrls(normalizedRecipe.photo_urls ?? []),
  };
};
