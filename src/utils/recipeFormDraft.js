import {
  normalizeAllergenValuesForSuitability,
  normalizeSuitableForValues,
} from "../constants/recipeMetadata.js";
import { createNumericId } from "./createId.js";
import { getCanonicalIngredientName } from "./ingredientNames.js";
import { normalizeRecipePreTasks } from "./normalizeRecipePreTasks.js";

export const DEFAULT_RECIPE_SERVINGS = 4;

export const createEmptyRecipeFormState = () => ({
  name: "",
  servings: "",
  selectedTags: [],
  selectedSuitableFor: [],
  selectedAllergens: [],
  calories: "",
  method: "",
  preTasksText: "",
  ingredients: [],
  photos: [],
});

const mapRecipePhotosToForm = (recipe) =>
  (recipe.photo_urls ?? []).map((url, index) => ({
    url,
    name: `obrazek-${index + 1}`,
  }));

export const mapRecipeToFormState = (recipe) => {
  const selectedSuitableFor = normalizeSuitableForValues(recipe.suitableFor ?? []);

  return {
    name: recipe.title ?? "",
    servings: String(recipe.servings ?? DEFAULT_RECIPE_SERVINGS),
    selectedTags: recipe.tags ?? [],
    selectedSuitableFor,
    selectedAllergens: normalizeAllergenValuesForSuitability(
      recipe.allergens ?? [],
      selectedSuitableFor,
    ),
    calories: recipe.calories == null ? "" : String(recipe.calories),
    method: recipe.workflow ?? "",
    preTasksText: normalizeRecipePreTasks(recipe.preTasks).join("\n"),
    ingredients: recipe.ingredients ?? [],
    photos: mapRecipePhotosToForm(recipe),
  };
};

export const toggleInArray = (items = [], value) =>
  items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

export const normalizeRecipeFormIngredients = (ingredients = []) =>
  ingredients
    .map((ingredient) => ({
      ...ingredient,
      item: getCanonicalIngredientName(ingredient.item),
    }))
    .filter((ingredient) => ingredient.item !== "");

export const validateRecipeForm = (
  form,
  {
    validateIngredients = true,
    normalizedIngredients = normalizeRecipeFormIngredients(form.ingredients),
  } = {},
) => {
  if (!form.name.trim()) {
    return { isValid: false, message: "Vyplň název receptu.", fieldName: "name" };
  }

  const servings = Number(form.servings);
  const trimmedCalories = form.calories.trim();
  const calories = trimmedCalories === "" ? null : Number(trimmedCalories);

  if (!Number.isFinite(servings) || servings < 1) {
    return { isValid: false, message: "Počet porcí musí být alespoň 1.", fieldName: "servings" };
  }

  if (trimmedCalories !== "" && (!Number.isFinite(calories) || calories < 0)) {
    return {
      isValid: false,
      message: "Kalorie musí být 0 nebo kladné číslo.",
      fieldName: "calories",
    };
  }

  if (!form.method.trim()) {
    return { isValid: false, message: "Vyplň postup přípravy.", fieldName: "method" };
  }

  if (validateIngredients && normalizedIngredients.length === 0) {
    return { isValid: false, message: "Přidej alespoň jednu surovinu.", focusIngredient: true };
  }

  return {
    isValid: true,
    calories,
    normalizedIngredients,
    servings,
  };
};

export const buildRecipeDraft = (
  form,
  {
    calories,
    idFactory = createNumericId,
    normalizedIngredients = normalizeRecipeFormIngredients(form.ingredients),
    now = () => new Date().toISOString(),
    recipeToEdit = null,
    servings,
  } = {},
) => {
  const suitableFor = normalizeSuitableForValues(form.selectedSuitableFor);

  return {
    id: recipeToEdit?.id ?? idFactory(),
    createdAt: recipeToEdit?.createdAt ?? now(),
    title: form.name.trim(),
    servings: servings ?? Number(form.servings),
    tags: form.selectedTags,
    photo_urls: form.photos.map((photo) => photo.url),
    ingredients: normalizedIngredients,
    suitableFor,
    calories: calories ?? (form.calories.trim() === "" ? null : Number(form.calories)),
    workflow: form.method.trim(),
    preTasks: normalizeRecipePreTasks(form.preTasksText),
    allergens: normalizeAllergenValuesForSuitability(form.selectedAllergens, suitableFor),
  };
};
