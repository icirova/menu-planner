import {
  createEmptyShoppingState,
  normalizeShoppingState,
} from "../utils/shoppingList";
import { MEAL_KEYS } from "../constants/mealKeys";
import { DEFAULT_DAY } from "../constants/defaultDay";
import {
  addRecipeIdToSlot,
  getSlotRecipeIds,
  normalizeSlotValue,
  removeRecipeIdFromSlot,
  slotContainsRecipeId,
} from "../utils/mealSlots";
import { createStableId } from "../utils/createId";

const DAYS = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];
const isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeTaskItems = (value) => {
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

const normalizeDoneMap = (value) => {
  if (!isPlainObject(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(([, done]) => Boolean(done)),
  );
};

const normalizeShoppingSelections = (value) => {
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

export const makeEmptyWeek = () => DAYS.map(() => ({ ...DEFAULT_DAY }));

export const initialMenuState = {
  week: makeEmptyWeek(),
  tasks: [],
  prepDone: {},
  extraDone: {},
  shopping: createEmptyShoppingState(),
};

export const migrateWeekToRecipeIds = (week, recipes) => {
  if (!Array.isArray(week)) return makeEmptyWeek();

  const titleToId = new Map(recipes.map((recipe) => [recipe.title, recipe.id]));
  const validRecipeIds = new Set(recipes.map((recipe) => recipe.id));

  return week.map((day) => {
    const migratedDay = { ...DEFAULT_DAY, ...(day || {}) };
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

export const menuReducer = (state, action) => {
  switch (action.type) {
    case "INIT_FROM_STORAGE": {
      const { payload, recipes } = action;

      if (Array.isArray(payload)) {
        const nextWeek = migrateWeekToRecipeIds(payload, recipes);
        return {
          week: nextWeek,
          tasks: [],
          prepDone: {},
          extraDone: {},
          shopping: createEmptyShoppingState(),
        };
      }

      if (payload && Array.isArray(payload.week)) {
        const nextWeek = migrateWeekToRecipeIds(payload.week, recipes);
        return {
          week: nextWeek,
          tasks: normalizeTaskItems(payload.tasks),
          prepDone: normalizeDoneMap(payload.prepDone),
          extraDone: normalizeDoneMap(payload.extraDone),
          shopping: normalizeShoppingState(payload.shopping),
        };
      }

      return state;
    }

    case "UPDATE_MEAL": {
      const { dayIndex, mealKey, value, append = false } = action;
      const nextWeek = state.week.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              [mealKey]: append ? addRecipeIdToSlot(day[mealKey], value) : normalizeSlotValue(value),
            }
          : day,
      );
      return { ...state, week: nextWeek };
    }

    case "REMOVE_RECIPE_FROM_WEEK": {
      const { recipeId } = action;
      const nextWeek = state.week.map((day) => {
        const nextDay = { ...day };

        for (const [slotKey, slotValue] of Object.entries(nextDay)) {
          if (slotContainsRecipeId(slotValue, recipeId)) {
            nextDay[slotKey] = removeRecipeIdFromSlot(slotValue, recipeId);
          }
        }

        return nextDay;
      });

      return { ...state, week: nextWeek };
    }

    case "CLEAR_MEAL": {
      const { dayIndex, mealKey, recipeId } = action;
      const nextWeek = state.week.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              [mealKey]:
                typeof recipeId === "number"
                  ? removeRecipeIdFromSlot(day[mealKey], recipeId)
                  : "",
            }
          : day,
      );
      return { ...state, week: nextWeek };
    }

    case "CLEAR_WEEK":
      return { ...state, week: makeEmptyWeek() };

    case "TOGGLE_DAY_SHOPPING_SELECTION": {
      const { dayIndex, itemKey } = action;
      const currentDay = state.week[dayIndex];
      if (!currentDay || typeof itemKey !== "string" || !itemKey.trim()) return state;

      const normalizedKey = itemKey.trim();
      const currentSelections = normalizeShoppingSelections(currentDay.shoppingSelections);
      const isSelected = currentSelections[normalizedKey] !== false;
      const nextSelections = { ...currentSelections };

      if (isSelected) {
        nextSelections[normalizedKey] = false;
      } else {
        delete nextSelections[normalizedKey];
      }

      const nextWeek = state.week.map((day, index) =>
        index === dayIndex
          ? { ...day, shoppingSelections: nextSelections }
          : day,
      );

      return { ...state, week: nextWeek };
    }

    case "MOVE_MEAL": {
      const { fromDay, fromKey, toDay, toKey, recipeId, moveAll = false } = action;
      const valueIds = getSlotRecipeIds(state.week[fromDay][fromKey]);

      if (!valueIds.length || (fromDay === toDay && fromKey === toKey)) return state;

      const nextWeek = state.week.map((day) => ({ ...day }));

      if (moveAll) {
        nextWeek[fromDay][fromKey] = "";
        nextWeek[toDay][toKey] = normalizeSlotValue([
          ...getSlotRecipeIds(nextWeek[toDay][toKey]),
          ...valueIds,
        ]);
        return { ...state, week: nextWeek };
      }

      const value =
        typeof recipeId === "number" && valueIds.includes(recipeId)
          ? recipeId
          : valueIds[0];

      if (!value) return state;

      nextWeek[fromDay][fromKey] = removeRecipeIdFromSlot(nextWeek[fromDay][fromKey], value);
      nextWeek[toDay][toKey] = addRecipeIdToSlot(nextWeek[toDay][toKey], value);

      return { ...state, week: nextWeek };
    }

    case "ADD_TASK_ITEM": {
      const text = typeof action.text === "string" ? action.text.trim() : "";
      if (!text) return state;

      return {
        ...state,
        tasks: [...state.tasks, { id: createStableId("task"), text, done: false }],
      };
    }

    case "TOGGLE_TASK_ITEM":
      return {
        ...state,
        tasks: state.tasks.map((item) =>
          item.id === action.id ? { ...item, done: !item.done } : item,
        ),
      };

    case "REMOVE_TASK_ITEM":
      return {
        ...state,
        tasks: state.tasks.filter((item) => item.id !== action.id),
      };

    case "TOGGLE_PREP_DONE":
      return {
        ...state,
        prepDone: {
          ...state.prepDone,
          [action.id]: !state.prepDone[action.id],
        },
      };

    case "TOGGLE_EXTRA_DONE":
      return {
        ...state,
        extraDone: {
          ...state.extraDone,
          [action.id]: !state.extraDone[action.id],
        },
      };

    case "UPDATE_SHOPPING":
      return { ...state, shopping: normalizeShoppingState(action.value) };

    default:
      return state;
  }
};
