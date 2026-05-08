import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { initialMenuState, menuReducer } from "../reducers/menuReducer.js";
import {
  loadCustomRecipes,
  normalizeCustomRecipe,
  saveCustomRecipes,
} from "../storage/recipesStorage.js";
import {
  loadStoredMenuState,
  removeRecipeFromStoredMenu,
  saveMenuState,
} from "../storage/menuStorage.js";
import { areRecipeIdsEqual } from "../utils/recipeIds.js";
import { isSeedRecipe } from "../utils/recipeSource.js";

export const useAppDataStore = () => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [isRecipesReady, setIsRecipesReady] = useState(false);
  const [weeklyMenu, menuDispatch] = useReducer(menuReducer, initialMenuState);
  const [isMenuReady, setIsMenuReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState(null);
  const hasInitializedMenu = useRef(false);

  const recipeList = useMemo(() => allRecipes, [allRecipes]);

  const addRecipe = useCallback((newRecipe) => {
    setAllRecipes((prev) => [...prev, normalizeCustomRecipe(newRecipe)]);
  }, []);

  const updateRecipe = useCallback((updatedRecipe) => {
    setAllRecipes((prev) =>
      prev.some((recipe) => areRecipeIdsEqual(recipe.id, updatedRecipe.id))
        ? prev.map((recipe) =>
            areRecipeIdsEqual(recipe.id, updatedRecipe.id)
              ? normalizeCustomRecipe(updatedRecipe)
              : recipe,
          )
        : [...prev, normalizeCustomRecipe(updatedRecipe)],
    );
  }, []);

  const deleteRecipe = useCallback(
    async (recipeId) => {
      const recipeToDelete = allRecipes.find((recipe) => areRecipeIdsEqual(recipe.id, recipeId));
      if (isSeedRecipe(recipeToDelete)) return false;

      const nextRecipes = allRecipes.filter((recipe) => !areRecipeIdsEqual(recipe.id, recipeId));
      if (nextRecipes.length === allRecipes.length) return false;

      setAllRecipes(nextRecipes);
      menuDispatch({ type: "REMOVE_RECIPE_FROM_WEEK", recipeId });

      const [recipeSaveResult] = await Promise.all([
        saveCustomRecipes(nextRecipes),
        removeRecipeFromStoredMenu(recipeId),
      ]);

      setStorageWarning((prev) => recipeSaveResult.warning || prev);
      return true;
    },
    [allRecipes],
  );

  useEffect(() => {
    let ignore = false;

    const hydrateRecipes = async () => {
      const { recipes: storedRecipes, warning } = await loadCustomRecipes();
      if (!ignore) {
        setAllRecipes(storedRecipes);
        setStorageWarning(warning);
        setIsRecipesReady(true);
      }
    };

    void hydrateRecipes();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isRecipesReady || hasInitializedMenu.current) return;

    let ignore = false;

    const hydrateMenuState = async () => {
      const { state: storedState, warning } = await loadStoredMenuState();
      if (ignore) return;

      if (storedState) {
        menuDispatch({ type: "INIT_FROM_STORAGE", payload: storedState, recipes: recipeList });
      }

      setStorageWarning((prev) => warning || prev);
      hasInitializedMenu.current = true;
      setIsMenuReady(true);
    };

    void hydrateMenuState();

    return () => {
      ignore = true;
    };
  }, [isRecipesReady, recipeList]);

  useEffect(() => {
    if (!isRecipesReady) return;

    const persistRecipes = async () => {
      const { warning } = await saveCustomRecipes(allRecipes);
      setStorageWarning(warning);
    };

    void persistRecipes();
  }, [allRecipes, isRecipesReady]);

  useEffect(() => {
    if (!isMenuReady) return;

    const persistMenuState = async () => {
      const { warning } = await saveMenuState(weeklyMenu);
      setStorageWarning((prev) => warning || prev);
    };

    void persistMenuState();
  }, [weeklyMenu, isMenuReady]);

  const outletContext = useMemo(
    () => ({
      recipeList,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      weeklyMenu,
      menuDispatch,
    }),
    [addRecipe, deleteRecipe, recipeList, updateRecipe, weeklyMenu],
  );

  return {
    isMenuReady,
    isRecipesReady,
    outletContext,
    storageWarning,
  };
};
