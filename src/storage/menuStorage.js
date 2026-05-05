import { removeRecipeIdFromSlot, slotContainsRecipeId } from "../utils/mealSlots";
import { readSessionJson, writeSessionJson } from "./sessionJsonStorage";

const WEEKLY_MENU_STORAGE_KEY = "weeklyMenu";

export const loadStoredMenuState = async () => {
  const { value, warning } = readSessionJson(WEEKLY_MENU_STORAGE_KEY, null);

  return {
    state: value,
    warning,
  };
};

export const saveMenuState = async (state) => {
  const result = {
    warning: null,
  };

  result.warning = writeSessionJson(WEEKLY_MENU_STORAGE_KEY, state, "plán").warning;

  return result;
};

export const removeRecipeFromStoredMenu = async (recipeId) => {
  try {
    const { state: parsed } = await loadStoredMenuState();
    if (!parsed) return;

    const week = Array.isArray(parsed) ? parsed : parsed.week;
    if (!Array.isArray(week)) return;

    const nextWeek = week.map((day) => {
      const nextDay = { ...day };
      for (const [slotKey, slotValue] of Object.entries(nextDay)) {
        if (slotContainsRecipeId(slotValue, recipeId)) {
          nextDay[slotKey] = removeRecipeIdFromSlot(slotValue, recipeId);
        }
      }
      return nextDay;
    });

    await saveMenuState(Array.isArray(parsed) ? nextWeek : { ...parsed, week: nextWeek });
  } catch {}
};
