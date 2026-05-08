import { getRecipeSuitableForFilterValues } from "../constants/recipeMetadata.js";
import { normalizeRecipeTags } from "../utils/normalizeRecipeTag.js";
import { isSeedRecipe } from "../utils/recipeSource.js";

const DEFAULT_LOCALE = "cs";
const SEARCH_LOCALE = "cs-CZ";

const getRecipeSortTimestamp = (recipe) => {
  const parsed = recipe.createdAt ? Date.parse(recipe.createdAt) : NaN;
  if (Number.isFinite(parsed)) return parsed;
  return typeof recipe.id === "number" ? recipe.id : 0;
};

export const filterRecipes = (
  recipes = [],
  { query = "", selectedTags = [], selectedSuitabilities = [] } = {},
) => {
  const normalizedQuery = query.trim().toLocaleLowerCase(SEARCH_LOCALE);

  return recipes.filter((recipe) => {
    const normalizedRecipeTags = normalizeRecipeTags(recipe.tags);
    const suitabilityFilterValues = getRecipeSuitableForFilterValues(recipe.suitableFor);
    const matchesQuery =
      normalizedQuery === "" ||
      recipe.title.toLocaleLowerCase(SEARCH_LOCALE).includes(normalizedQuery);

    return (
      matchesQuery &&
      selectedTags.every((tag) => normalizedRecipeTags.includes(tag)) &&
      selectedSuitabilities.every((suitability) => suitabilityFilterValues.includes(suitability))
    );
  });
};

export const sortRecipes = (
  recipes = [],
  { priorityRecipeId = null, sortOrder = "title-asc" } = {},
) => {
  return [...recipes].sort((a, b) => {
    if (priorityRecipeId != null) {
      if (String(a.id) === String(priorityRecipeId)) return -1;
      if (String(b.id) === String(priorityRecipeId)) return 1;
    }

    if (sortOrder === "title-desc") {
      return b.title.localeCompare(a.title, DEFAULT_LOCALE);
    }

    if (sortOrder === "newest") {
      const byDate = getRecipeSortTimestamp(b) - getRecipeSortTimestamp(a);
      if (byDate !== 0) return byDate;
    }

    return a.title.localeCompare(b.title, DEFAULT_LOCALE);
  });
};

export const getRecipeCatalogStats = (recipes = []) => ({
  totalCount: recipes.length,
  customCount: recipes.filter((recipe) => !isSeedRecipe(recipe)).length,
  glutenFreeCount: recipes.filter((recipe) => recipe.suitableFor?.includes("bez lepku")).length,
  veganCount: recipes.filter((recipe) => recipe.suitableFor?.includes("veganské")).length,
});
