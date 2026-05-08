import { DAYS } from "../constants/days.js";
import { DEFAULT_DAY } from "../constants/defaultDay.js";
import { MEAL_KEYS } from "../constants/mealKeys.js";
import { normalizeSlotValue } from "../utils/mealSlots.js";
import { createEmptyShoppingState, normalizeShoppingState } from "../utils/shoppingList.js";

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const makeEmptyWeek = () => DAYS.map(() => ({ ...DEFAULT_DAY }));

export const createInitialMenuState = () => ({
  week: makeEmptyWeek(),
  tasks: [],
  prepDone: {},
  extraDone: {},
  shopping: createEmptyShoppingState(),
});

export const normalizeTaskItems = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === "string") {
          const text = item.trim();
          return text ? { id: `task-${index}-${text}`, text, done: false } : null;
        }

        if (isPlainObject(item)) {
          const text = typeof item.text === "string" ? item.text.trim() : "";
          if (!text) return null;
          const id = typeof item.id === "string" && item.id ? item.id : `task-${index}-${text}`;
          return { id, text, done: Boolean(item.done) };
        }

        return null;
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item, index) => {
        const text = item.trim();
        return text ? { id: `task-${index}-${text}`, text, done: false } : null;
      })
      .filter(Boolean);
  }

  return [];
};

export const normalizeDoneMap = (value) => {
  if (!isPlainObject(value)) return {};

  return Object.fromEntries(Object.entries(value).filter(([, done]) => Boolean(done)));
};

export const normalizeShoppingSelections = (value) => {
  if (!isPlainObject(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, selected]) => {
        const normalizedKey = typeof key === "string" ? key.trim() : "";
        return normalizedKey ? [normalizedKey, selected !== false] : null;
      })
      .filter(Boolean),
  );
};

export const migrateWeekToRecipeIds = (week, recipes = []) => {
  if (!Array.isArray(week)) return makeEmptyWeek();

  const titleToId = new Map(recipes.map((recipe) => [recipe.title, recipe.id]));
  const validRecipeIds = new Set(recipes.map((recipe) => recipe.id));

  return makeEmptyWeek().map((emptyDay, index) => {
    const day = week[index];
    const migratedDay = { ...emptyDay, ...(day || {}) };
    migratedDay.shoppingSelections = normalizeShoppingSelections(migratedDay.shoppingSelections);

    for (const { key } of MEAL_KEYS) {
      const value = migratedDay[key];

      const migratedIds = (Array.isArray(value) ? value : [value]).flatMap((item) => {
        if (typeof item === "number") {
          return validRecipeIds.has(item) ? [item] : [];
        }

        if (typeof item === "string" && titleToId.has(item)) {
          return [titleToId.get(item)];
        }

        return [];
      });

      migratedDay[key] = normalizeSlotValue(migratedIds);
    }

    return migratedDay;
  });
};

export const normalizeMenuState = (payload, recipes = []) => {
  if (Array.isArray(payload)) {
    return {
      ...createInitialMenuState(),
      week: migrateWeekToRecipeIds(payload, recipes),
    };
  }

  if (payload && Array.isArray(payload.week)) {
    return {
      week: migrateWeekToRecipeIds(payload.week, recipes),
      tasks: normalizeTaskItems(payload.tasks),
      prepDone: normalizeDoneMap(payload.prepDone),
      extraDone: normalizeDoneMap(payload.extraDone),
      shopping: normalizeShoppingState(payload.shopping),
    };
  }

  return null;
};
