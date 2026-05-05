import { normalizeSuitableForValues } from "../constants/recipeMetadata";
import { normalizeRecipePreTasks } from "../utils/normalizeRecipePreTasks";
import { normalizeRecipeTags } from "../utils/normalizeRecipeTag";
import { createNumericId } from "../utils/createId";
import { clampRecipeId } from "../utils/recipeIds";
import { isSeedRecipe, RECIPE_SOURCE } from "../utils/recipeSource";
import { normalizeRecipeImageUrls } from "./imageStorage";
import { readSessionJson, writeSessionJson } from "./sessionJsonStorage";
import { recipes as defaultRecipes } from "../../data/recipes";

const CUSTOM_RECIPES_STORAGE_KEY = "customRecipes";

const normalizeRecipeId = (value) => {
  return clampRecipeId(value) ?? createNumericId();
};

const normalizeRecipe = (recipe, source) => ({
  ...recipe,
  id: normalizeRecipeId(recipe.id),
  source: recipe.source ?? source,
  createdAt:
    typeof recipe.createdAt === "string" && recipe.createdAt.trim()
      ? recipe.createdAt
      : null,
  tags: normalizeRecipeTags(recipe.tags ?? []),
  suitableFor: normalizeSuitableForValues(recipe.suitableFor ?? []),
  preTasks: normalizeRecipePreTasks(recipe.preTasks),
});

export const normalizeCustomRecipe = (recipe) => normalizeRecipe(recipe, RECIPE_SOURCE.CUSTOM);

export const prepareCustomRecipeForRuntime = async (recipe) => {
  const normalizedRecipe = normalizeCustomRecipe(recipe);

  return {
    ...normalizedRecipe,
    photo_urls: normalizeRecipeImageUrls(normalizedRecipe.photo_urls ?? []),
  };
};

const serializeCustomRecipe = async (recipe) => {
  const normalizedRecipe = normalizeCustomRecipe(recipe);

  return {
    ...normalizedRecipe,
    photo_urls: normalizeRecipeImageUrls(normalizedRecipe.photo_urls ?? []),
  };
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
  const normalizedDefaultRecipes = defaultRecipes.map((recipe) =>
    normalizeRecipe(recipe, RECIPE_SOURCE.SEED),
  );
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

  result.warning = writeSessionJson(CUSTOM_RECIPES_STORAGE_KEY, persistedRecipes, "recepty").warning;

  return result;
};
