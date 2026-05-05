import { useMemo } from "react";
import { PLANNED_MEAL_KEYS } from "../constants/mealKeys";
import { getShoppingListSummary } from "../utils/shoppingList";
import { getSlotRecipeIds, getWeekRecipeIds } from "../utils/mealSlots";

const DAYS_IN_WEEK = 7;

export const useHomePageSummary = (weeklyMenu, recipeList) =>
  useMemo(() => {
    const recipesById = new Map(recipeList.map((recipe) => [recipe.id, recipe]));
    const filledSlots = getWeekRecipeIds(
      weeklyMenu.week.map((day) => Object.fromEntries(PLANNED_MEAL_KEYS.map(({ key }) => [key, day?.[key]]))),
    );
    const occupiedSlotCount = weeklyMenu.week.flatMap((day) =>
      PLANNED_MEAL_KEYS.filter(({ key }) => getSlotRecipeIds(day?.[key]).length > 0),
    ).length;
    const completion = Math.round((occupiedSlotCount / (DAYS_IN_WEEK * PLANNED_MEAL_KEYS.length)) * 100);
    const repeatedRecipes = [...filledSlots.reduce((counts, recipeId) => {
      counts.set(recipeId, (counts.get(recipeId) ?? 0) + 1);
      return counts;
    }, new Map()).values()].filter((count) => count > 1).length;
    const sweetMeals = filledSlots.filter((recipeId) =>
      (recipesById.get(recipeId)?.tags ?? []).includes("moučníky"),
    ).length;
    const lunchRecipeIds = weeklyMenu.week
      .flatMap((day) => getSlotRecipeIds(day?.lunch));
    const veganLunches = lunchRecipeIds.filter((recipeId) =>
      recipesById.get(recipeId)?.suitableFor?.includes("veganské"),
    ).length;
    const meatLunches = Math.max(lunchRecipeIds.length - veganLunches, 0);
    const shoppingSummary = getShoppingListSummary(weeklyMenu.shopping, weeklyMenu.week, recipeList);

    return {
      completion,
      filledSlots,
      meatLunches,
      occupiedSlotCount,
      repeatedRecipes,
      shoppingSummary,
      sweetMeals,
      veganLunches,
    };
  }, [recipeList, weeklyMenu]);
