import { normalizeSuitableForValues } from "../constants/recipeMetadata";
import { normalizeRecipePreTasks } from "../utils/normalizeRecipePreTasks";
import { normalizeRecipeTags } from "../utils/normalizeRecipeTag";
import { createNumericId } from "../utils/createId";
import { clampRecipeId } from "../utils/recipeIds";
import { readJsonFile, writeJsonFile } from "./fileStorage";
import {
  materializeRecipeImageUrls,
  serializeRecipeImageUrls,
} from "./imageStorage";
import { recipes as defaultRecipes } from "../../data/recipes";

const CUSTOM_RECIPES_STORAGE_KEY = "customRecipes";
const CUSTOM_RECIPES_FILE = "custom-recipes.json";
const DEFAULT_RECIPE_SOURCE = "seed";
const CUSTOM_RECIPE_SOURCE = "custom";

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

export const normalizeCustomRecipe = (recipe) => normalizeRecipe(recipe, CUSTOM_RECIPE_SOURCE);

export const prepareCustomRecipeForRuntime = async (recipe) => {
  const normalizedRecipe = normalizeCustomRecipe(recipe);

  return {
    ...normalizedRecipe,
    photo_urls: await materializeRecipeImageUrls(normalizedRecipe.photo_urls ?? []),
  };
};

const serializeCustomRecipe = async (recipe) => {
  const normalizedRecipe = normalizeCustomRecipe(recipe);

  return {
    ...normalizedRecipe,
    photo_urls: await serializeRecipeImageUrls(normalizedRecipe.photo_urls ?? []),
  };
};

const mergeRecipeLists = (...recipeLists) => {
  const merged = new Map();

  recipeLists.flat().forEach((recipe) => {
    merged.set(recipe.id, recipe);
  });

  return Array.from(merged.values());
};

const loadCustomRecipesFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_RECIPES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const loadCustomRecipes = async () => {
  const fallbackRecipes = loadCustomRecipesFromLocalStorage();
  const { data: storedRecipes, error, status } = await readJsonFile(CUSTOM_RECIPES_FILE);
  const parsed = Array.isArray(storedRecipes) ? storedRecipes : fallbackRecipes;
  const normalizedDefaultRecipes = defaultRecipes.map((recipe) =>
    normalizeRecipe(recipe, DEFAULT_RECIPE_SOURCE),
  );
  const normalizedStoredRecipes = Array.isArray(parsed)
    ? await Promise.all(parsed.map((recipe) => prepareCustomRecipeForRuntime(recipe)))
    : [];

  return {
    recipes: mergeRecipeLists(normalizedStoredRecipes, normalizedDefaultRecipes),
    warning: error && status !== "not_found"
      ? `${error} Používám záložní data z localStorage.`
      : null,
  };
};

export const saveCustomRecipes = async (recipes) => {
  const result = {
    warning: null,
  };
  const persistedRecipes = await Promise.all(
    recipes
      .filter((recipe) => recipe.source !== DEFAULT_RECIPE_SOURCE)
      .map((recipe) => serializeCustomRecipe(recipe)),
  );

  const fileWriteResult = await writeJsonFile(CUSTOM_RECIPES_FILE, persistedRecipes);

  if (fileWriteResult.error) {
    result.warning = `${fileWriteResult.error} Data zůstala uložená jen v localStorage.`;
  }

  try {
    localStorage.setItem(CUSTOM_RECIPES_STORAGE_KEY, JSON.stringify(persistedRecipes));
  } catch (error) {
    const localStorageWarning =
      error instanceof Error && error.message
        ? `Nepodařilo se uložit recepty ani do localStorage. ${error.message}`
        : "Nepodařilo se uložit recepty ani do localStorage.";

    result.warning = result.warning
      ? `${result.warning} ${localStorageWarning}`
      : localStorageWarning;
  }

  return result;
};
