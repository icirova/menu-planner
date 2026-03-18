const WEEKLY_MENU_STORAGE_KEY = "weeklyMenu";

export const loadStoredMenuState = () => {
  try {
    const raw = localStorage.getItem(WEEKLY_MENU_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveMenuState = (state) => {
  try {
    localStorage.setItem(WEEKLY_MENU_STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

export const removeRecipeFromStoredMenu = (recipeId) => {
  try {
    const parsed = loadStoredMenuState();
    if (!parsed) return;

    const week = Array.isArray(parsed) ? parsed : parsed.week;
    if (!Array.isArray(week)) return;

    const nextWeek = week.map((day) => {
      const nextDay = { ...day };
      for (const [slotKey, slotValue] of Object.entries(nextDay)) {
        if (slotValue === recipeId) {
          nextDay[slotKey] = "";
        }
      }
      return nextDay;
    });

    saveMenuState(Array.isArray(parsed) ? nextWeek : { ...parsed, week: nextWeek });
  } catch {}
};
