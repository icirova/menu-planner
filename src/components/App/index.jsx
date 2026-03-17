
import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { useEffect, useState } from "react";
import { recipes as defaultRecipes } from "../../../data/recipes";

const CUSTOM_RECIPES_STORAGE_KEY = "customRecipes";
const WEEKLY_MENU_STORAGE_KEY = "weeklyMenu";

const normalizeBuiltinRecipe = (recipe) => ({
  ...recipe,
  source: "builtin",
});

const normalizeCustomRecipe = (recipe) => ({
  ...recipe,
  source: "custom",
});

const removeRecipeFromWeeklyMenu = (recipeId) => {
  try {
    const raw = localStorage.getItem(WEEKLY_MENU_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const week = Array.isArray(parsed) ? parsed : parsed?.week;
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

    const nextPayload = Array.isArray(parsed)
      ? nextWeek
      : { ...parsed, week: nextWeek };

    localStorage.setItem(WEEKLY_MENU_STORAGE_KEY, JSON.stringify(nextPayload));
  } catch {}
};


export const App = () => {
  const [customRecipes, setCustomRecipes] = useState(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_RECIPES_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeCustomRecipe) : [];
    } catch {
      return [];
    }
  });

  const recipeList = [...customRecipes, ...defaultRecipes.map(normalizeBuiltinRecipe)];

  const addRecipe = (newRecipe) => {
    setCustomRecipes((prev) => [...prev, normalizeCustomRecipe(newRecipe)]);
  };

  const updateRecipe = (updatedRecipe) => {
    setCustomRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === updatedRecipe.id
          ? normalizeCustomRecipe(updatedRecipe)
          : recipe,
      ),
    );
  };

  const deleteRecipe = (recipeId) => {
    let removed = false;
    setCustomRecipes((prev) =>
      prev.filter((recipe) => {
        const shouldKeep = recipe.id !== recipeId;
        if (!shouldKeep) removed = true;
        return shouldKeep;
      }),
    );
    if (removed) removeRecipeFromWeeklyMenu(recipeId);
    return removed;
  };

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_RECIPES_STORAGE_KEY, JSON.stringify(customRecipes));
    } catch {}
  }, [customRecipes]);

  return (
    <div className="container">
      <Header />
      <Outlet context={{ recipeList, addRecipe, updateRecipe, deleteRecipe }} />
      <Footer />
    </div>
  );
};
