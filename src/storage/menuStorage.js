import { readJsonFile, writeJsonFile } from "./fileStorage";
import { removeRecipeIdFromSlot, slotContainsRecipeId } from "../utils/mealSlots";
import { defaultWeeklyMenu } from "../../data/defaultWeeklyMenu";

const WEEKLY_MENU_STORAGE_KEY = "weeklyMenu";
const WEEKLY_MENU_FILE = "weekly-menu.json";

const loadMenuStateFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(WEEKLY_MENU_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const loadStoredMenuState = async () => {
  const { data: storedState, error } = await readJsonFile(WEEKLY_MENU_FILE);
  const localStorageState = loadMenuStateFromLocalStorage();
  const fallbackState = localStorageState ?? defaultWeeklyMenu;
  const fallbackLabel = localStorageState ? "localStorage" : "výchozí seed data";

  return {
    state: storedState ?? fallbackState,
    warning: error
      ? `${error} Používám záložní data z ${fallbackLabel}.`
      : null,
  };
};

export const saveMenuState = async (state) => {
  const result = {
    warning: null,
  };

  const fileWriteResult = await writeJsonFile(WEEKLY_MENU_FILE, state);

  if (fileWriteResult.error) {
    result.warning = `${fileWriteResult.error} Data zůstala uložená jen v localStorage.`;
  }

  try {
    localStorage.setItem(WEEKLY_MENU_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    const localStorageWarning =
      error instanceof Error && error.message
        ? `Nepodařilo se uložit plán ani do localStorage. ${error.message}`
        : "Nepodařilo se uložit plán ani do localStorage.";

    result.warning = result.warning
      ? `${result.warning} ${localStorageWarning}`
      : localStorageWarning;
  }

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
