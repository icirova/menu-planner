import { isSeedRecipe } from "../utils/recipeSource.js";
import {
  normalizeCustomRecipe,
  normalizeRecipeForRuntime,
  normalizeSeedRecipe,
} from "./recipeNormalization.js";
import { readSessionJson, writeSessionJson } from "./sessionJsonStorage.js";
import { recipes as defaultRecipes } from "../../data/recipes.js";

const CUSTOM_RECIPES_STORAGE_KEY = "customRecipes";

export { normalizeCustomRecipe };

export const prepareCustomRecipeForRuntime = async (recipe) => {
  return normalizeRecipeForRuntime(recipe);
};

const serializeCustomRecipe = async (recipe) => {
  return normalizeRecipeForRuntime(recipe);
};

const mergeRecipeLists = (...recipeLists) => {
  const merged = new Map();

  recipeLists.flat().forEach((recipe) => {
    merged.set(recipe.id, recipe);
  });

  return Array.from(merged.values());
};

export const loadCustomRecipes = async () => {
  const { value: storedRecipes, warning } = readSessionJson(CUSTOM_RECIPES_STORAGE_KEY, []);
  const normalizedDefaultRecipes = defaultRecipes.map((recipe) => normalizeSeedRecipe(recipe));
  const normalizedStoredRecipes = Array.isArray(storedRecipes)
    ? await Promise.all(storedRecipes.map((recipe) => prepareCustomRecipeForRuntime(recipe)))
    : [];

  return {
    recipes: mergeRecipeLists(normalizedStoredRecipes, normalizedDefaultRecipes),
    warning,
  };
};

export const saveCustomRecipes = async (recipes) => {
  const result = {
    warning: null,
  };
  const persistedRecipes = await Promise.all(
    recipes
      .filter((recipe) => !isSeedRecipe(recipe))
      .map((recipe) => serializeCustomRecipe(recipe)),
  );

  result.warning = writeSessionJson(
    CUSTOM_RECIPES_STORAGE_KEY,
    persistedRecipes,
    "recepty",
  ).warning;

  return result;
};
