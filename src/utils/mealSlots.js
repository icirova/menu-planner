import { MEAL_KEYS } from "../constants/mealKeys";

const isValidRecipeId = (value) => typeof value === "number" && Number.isFinite(value);

export const getSlotRecipeIds = (value) => {
  if (Array.isArray(value)) {
    return [...new Set(value.filter(isValidRecipeId))];
  }

  return isValidRecipeId(value) ? [value] : [];
};

export const normalizeSlotValue = (value) => {
  const recipeIds = getSlotRecipeIds(value);
  return recipeIds.length ? recipeIds : "";
};

export const slotHasRecipes = (value) => getSlotRecipeIds(value).length > 0;

export const slotContainsRecipeId = (value, recipeId) => getSlotRecipeIds(value).includes(recipeId);

export const addRecipeIdToSlot = (value, recipeId) => {
  if (!isValidRecipeId(recipeId)) return normalizeSlotValue(value);
  return normalizeSlotValue([...getSlotRecipeIds(value), recipeId]);
};

export const removeRecipeIdFromSlot = (value, recipeId) => {
  if (!isValidRecipeId(recipeId)) return normalizeSlotValue(value);
  return normalizeSlotValue(getSlotRecipeIds(value).filter((id) => id !== recipeId));
};

export const getWeekRecipeIds = (week = []) =>
  week.flatMap((day) =>
    MEAL_KEYS.flatMap(({ key }) => getSlotRecipeIds(day?.[key])),
  );
