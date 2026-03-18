const CUSTOM_RECIPES_STORAGE_KEY = "customRecipes";

export const normalizeBuiltinRecipe = (recipe) => ({
  ...recipe,
  source: "builtin",
});

export const normalizeCustomRecipe = (recipe) => ({
  ...recipe,
  source: "custom",
});

export const loadCustomRecipes = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_RECIPES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeCustomRecipe) : [];
  } catch {
    return [];
  }
};

export const saveCustomRecipes = (recipes) => {
  try {
    localStorage.setItem(CUSTOM_RECIPES_STORAGE_KEY, JSON.stringify(recipes));
  } catch {}
};
