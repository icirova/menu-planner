import { MEAL_KEYS } from "../constants/mealKeys";
import { createStableId } from "./createId";
import { getSlotRecipeIds } from "./mealSlots";

const DAYS = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];

const isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const buildCustomItemId = () => createStableId("custom");

const normalizeKey = (value) =>
  normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatLabel = (value) => {
  const text = normalizeText(value);
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
};

const getDayShoppingSelections = (day) => (isPlainObject(day?.shoppingSelections) ? day.shoppingSelections : {});

const isIngredientSelectedForDay = (day, key) => getDayShoppingSelections(day)[key] !== false;

const normalizeCustomItem = (item) => {
  if (typeof item === "string") {
    const label = normalizeText(item);
    if (!label) return null;

    return {
      id: buildCustomItemId(),
      label,
      done: false,
    };
  }

  if (!isPlainObject(item)) return null;

  const label = normalizeText(item.label ?? item.item ?? item.text);
  if (!label) return null;

  return {
    id: normalizeText(item.id) || buildCustomItemId(),
    label,
    done: Boolean(item.done),
  };
};

const normalizeOverride = (value) => {
  if (typeof value === "boolean") return { done: value };
  if (!isPlainObject(value)) return null;

  return {
    done: Boolean(value.done),
  };
};

const normalizeLegacyShoppingString = (value) => ({
  overrides: {},
  customItems: value
    .split("\n")
    .map((item) => normalizeCustomItem(item))
    .filter(Boolean),
});

export const createEmptyShoppingState = () => ({
  overrides: {},
  customItems: [],
});

export const normalizeShoppingState = (value) => {
  if (typeof value === "string") {
    return normalizeLegacyShoppingString(value);
  }

  if (!isPlainObject(value)) {
    return createEmptyShoppingState();
  }

  return {
    overrides: isPlainObject(value.overrides)
      ? Object.fromEntries(
          Object.entries(value.overrides)
            .map(([id, override]) => {
              const normalizedId = normalizeText(id);
              const normalizedOverride = normalizeOverride(override);
              return normalizedId && normalizedOverride ? [normalizedId, normalizedOverride] : null;
            })
            .filter(Boolean),
        )
      : {},
    customItems: Array.isArray(value.customItems)
      ? value.customItems.map(normalizeCustomItem).filter(Boolean)
      : [],
  };
};

export const buildGeneratedShoppingItems = (week, recipes) => {
  if (!Array.isArray(week) || !Array.isArray(recipes)) return [];

  const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const merged = new Map();

  week.forEach((day, dayIndex) => {
    if (!isPlainObject(day)) return [];

    const aggregated = new Map();

    MEAL_KEYS.forEach(({ key: mealKey }) => {
      getSlotRecipeIds(day[mealKey]).forEach((recipeId) => {
        const recipe = recipesById.get(recipeId);
        if (!recipe || !Array.isArray(recipe.ingredients)) return;

        recipe.ingredients.forEach((ingredient) => {
          if (!isPlainObject(ingredient)) return;

          const itemName = normalizeText(ingredient.item);
          const key = normalizeKey(itemName);
          if (!itemName || !key) return;
          if (!isIngredientSelectedForDay(day, key)) return;

          if (!aggregated.has(key)) {
            aggregated.set(key, {
              id: key,
              dayIndex,
              dayLabel: DAYS[dayIndex],
              key,
              label: formatLabel(itemName),
            });
          }
        });
      });
    });

    aggregated.forEach((item) => {
      const current = merged.get(item.key);
      if (current) {
        current.dayIndexes.push(item.dayIndex);
        current.dayLabels.push(item.dayLabel);
        return;
      }

      merged.set(item.key, {
        ...item,
        dayIndexes: [item.dayIndex],
        dayLabels: [item.dayLabel],
      });
    });
  });

  return [...merged.values()].sort((a, b) => {
    if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
    return a.label.localeCompare(b.label, "cs");
  });
};

export const getDayShoppingItems = (day, recipes) => {
  if (!isPlainObject(day) || !Array.isArray(recipes)) return [];

  const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const aggregated = new Map();

  MEAL_KEYS.forEach(({ key: mealKey }) => {
    getSlotRecipeIds(day[mealKey]).forEach((recipeId) => {
      const recipe = recipesById.get(recipeId);
      if (!recipe || !Array.isArray(recipe.ingredients)) return;

      recipe.ingredients.forEach((ingredient) => {
        if (!isPlainObject(ingredient)) return;

        const itemName = normalizeText(ingredient.item);
        const key = normalizeKey(itemName);
        if (!itemName || !key || aggregated.has(key)) return;

        aggregated.set(key, {
          id: key,
          key,
          label: formatLabel(itemName),
          selected: isIngredientSelectedForDay(day, key),
        });
      });
    });
  });

  return [...aggregated.values()].sort((a, b) => a.label.localeCompare(b.label, "cs"));
};

export const getShoppingStateForWeek = (shopping, week, recipes) => {
  const persistedShopping = normalizeShoppingState(shopping);
  const generatedItems = buildGeneratedShoppingItems(week, recipes);
  const validGeneratedIds = new Set(generatedItems.map((item) => item.id));

  return {
    generatedItems,
    overrides: Object.fromEntries(
      Object.entries(persistedShopping.overrides).filter(([id]) => validGeneratedIds.has(id)),
    ),
    customItems: persistedShopping.customItems,
  };
};

export const getShoppingListItems = (shopping, week, recipes) => {
  const normalizedShopping = getShoppingStateForWeek(shopping, week, recipes);

  const generatedItems = normalizedShopping.generatedItems.map((item) => ({
    ...item,
    done: Boolean(normalizedShopping.overrides[item.id]?.done),
    kind: "generated",
  }));

  const customItems = normalizedShopping.customItems.map((item) => ({
    ...item,
    kind: "custom",
  }));

  return {
    generatedItems,
    customItems,
    allItems: [...generatedItems, ...customItems],
  };
};

export const getShoppingListSummary = (shopping, week, recipes) => {
  const { allItems } = getShoppingListItems(shopping, week, recipes);
  const toBuyCount = allItems.filter((item) => !item.done).length;

  return {
    totalCount: allItems.length,
    toBuyCount,
    doneCount: allItems.length - toBuyCount,
  };
};
