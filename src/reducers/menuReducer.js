import { autoFillWeekByTags } from "../utils/autoFill";
import { SLOT_TAGS } from "../constants/slotTags";
import { MEAL_KEYS } from "../constants/mealKeys";
import { DEFAULT_DAY } from "../constants/defaultDay";

const DAYS = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];

export const makeEmptyWeek = () => DAYS.map(() => ({ ...DEFAULT_DAY }));

export const initialMenuState = {
  week: makeEmptyWeek(),
  notes: "",
  shopping: "",
};

export const migrateWeekToRecipeIds = (week, recipes) => {
  if (!Array.isArray(week)) return makeEmptyWeek();

  const titleToId = new Map(recipes.map((recipe) => [recipe.title, recipe.id]));
  const validRecipeIds = new Set(recipes.map((recipe) => recipe.id));

  return week.map((day) => {
    const migratedDay = { ...DEFAULT_DAY, ...(day || {}) };

    for (const { key } of MEAL_KEYS) {
      const value = migratedDay[key];

      if (typeof value === "number" && !validRecipeIds.has(value)) {
        migratedDay[key] = "";
        continue;
      }

      if (typeof value === "string" && titleToId.has(value)) {
        migratedDay[key] = titleToId.get(value);
      }
    }

    return migratedDay;
  });
};

export const menuReducer = (state, action) => {
  switch (action.type) {
    case "INIT_FROM_STORAGE": {
      const { payload, recipes } = action;

      if (Array.isArray(payload)) {
        return {
          week: migrateWeekToRecipeIds(payload, recipes),
          notes: "",
          shopping: "",
        };
      }

      if (payload && Array.isArray(payload.week)) {
        return {
          week: migrateWeekToRecipeIds(payload.week, recipes),
          notes: payload.notes ?? "",
          shopping: payload.shopping ?? "",
        };
      }

      return state;
    }

    case "UPDATE_MEAL": {
      const { dayIndex, mealKey, value } = action;
      const nextWeek = state.week.map((day, index) =>
        index === dayIndex ? { ...day, [mealKey]: value } : day,
      );
      return { ...state, week: nextWeek };
    }

    case "CLEAR_MEAL": {
      const { dayIndex, mealKey } = action;
      const nextWeek = state.week.map((day, index) =>
        index === dayIndex ? { ...day, [mealKey]: "" } : day,
      );
      return { ...state, week: nextWeek };
    }

    case "CLEAR_DAY": {
      const { dayIndex } = action;
      const nextWeek = state.week.map((day, index) =>
        index === dayIndex ? { ...DEFAULT_DAY } : day,
      );
      return { ...state, week: nextWeek };
    }

    case "MOVE_MEAL": {
      const { fromDay, fromKey, toDay, toKey } = action;
      const value = state.week[fromDay][fromKey];

      if (!value || (fromDay === toDay && fromKey === toKey)) return state;

      const nextWeek = state.week.map((day) => ({ ...day }));

      if (nextWeek[toDay][toKey]) {
        const swappedValue = nextWeek[toDay][toKey];
        nextWeek[toDay][toKey] = value;
        nextWeek[fromDay][fromKey] = swappedValue;
      } else {
        nextWeek[toDay][toKey] = value;
        nextWeek[fromDay][fromKey] = "";
      }

      return { ...state, week: nextWeek };
    }

    case "UPDATE_NOTES":
      return { ...state, notes: action.value };

    case "UPDATE_SHOPPING":
      return { ...state, shopping: action.value };

    case "RESET_WEEK":
      return initialMenuState;

    case "AUTO_FILL_WEEK": {
      const { recipes, fillOnlyEmpty = true } = action.payload;
      const weekFilled = autoFillWeekByTags({
        week: state.week,
        recipes,
        slotTagsMap: SLOT_TAGS,
        fillOnlyEmpty,
      });

      return { ...state, week: weekFilled };
    }

    default:
      return state;
  }
};
