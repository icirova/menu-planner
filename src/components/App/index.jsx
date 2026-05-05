import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  loadCustomRecipes,
  normalizeCustomRecipe,
  saveCustomRecipes,
} from "../../storage/recipesStorage";
import { areRecipeIdsEqual } from "../../utils/recipeIds";
import {
  loadStoredMenuState,
  removeRecipeFromStoredMenu,
  saveMenuState,
} from "../../storage/menuStorage";
import { isSeedRecipe } from "../../utils/recipeSource";
import { initialMenuState, menuReducer } from "../../reducers/menuReducer";

export const App = () => {
  const [customRecipes, setCustomRecipes] = useState([]);
  const [isRecipesReady, setIsRecipesReady] = useState(false);
  const [weeklyMenu, menuDispatch] = useReducer(menuReducer, initialMenuState);
  const [isMenuReady, setIsMenuReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState(null);
  const hasInitializedMenu = useRef(false);

  const recipeList = useMemo(() => customRecipes, [customRecipes]);

  const addRecipe = (newRecipe) => {
    setCustomRecipes((prev) => [...prev, normalizeCustomRecipe(newRecipe)]);
  };

  const updateRecipe = (updatedRecipe) => {
    setCustomRecipes((prev) =>
      prev.some((recipe) => areRecipeIdsEqual(recipe.id, updatedRecipe.id))
        ? prev.map((recipe) =>
            areRecipeIdsEqual(recipe.id, updatedRecipe.id)
              ? normalizeCustomRecipe(updatedRecipe)
              : recipe,
          )
        : [...prev, normalizeCustomRecipe(updatedRecipe)],
    );
  };

  const deleteRecipe = async (recipeId) => {
    const recipeToDelete = customRecipes.find((recipe) => areRecipeIdsEqual(recipe.id, recipeId));
    if (isSeedRecipe(recipeToDelete)) return false;

    const nextRecipes = customRecipes.filter((recipe) => !areRecipeIdsEqual(recipe.id, recipeId));
    if (nextRecipes.length === customRecipes.length) return false;

    setCustomRecipes(nextRecipes);
    menuDispatch({ type: "REMOVE_RECIPE_FROM_WEEK", recipeId });

    const [recipeSaveResult] = await Promise.all([
      saveCustomRecipes(nextRecipes),
      removeRecipeFromStoredMenu(recipeId),
    ]);

    setStorageWarning((prev) => recipeSaveResult.warning || prev);
    return true;
  };

  useEffect(() => {
    let ignore = false;

    const hydrateCustomRecipes = async () => {
      const { recipes: storedRecipes, warning } = await loadCustomRecipes();
      if (!ignore) {
        setCustomRecipes(storedRecipes);
        setStorageWarning(warning);
        setIsRecipesReady(true);
      }
    };

    void hydrateCustomRecipes();

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

    const persistCustomRecipes = async () => {
      const { warning } = await saveCustomRecipes(customRecipes);
      setStorageWarning(warning);
    };

    void persistCustomRecipes();
  }, [customRecipes, isRecipesReady]);

  useEffect(() => {
    if (!isMenuReady) return;

    const persistMenuState = async () => {
      const { warning } = await saveMenuState(weeklyMenu);
      setStorageWarning((prev) => warning || prev);
    };

    void persistMenuState();
  }, [weeklyMenu, isMenuReady]);

  if (!isRecipesReady) {
    return (
      <div className="container">
        <Header />
        <main className="main">
          <p>Načítám uložená data...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isMenuReady) {
    return (
      <div className="container">
        <Header />
        <main className="main">
          <p>Načítám uložený plán...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      {storageWarning && (
        <p className="app-message app-message--warning" role="alert">
          {storageWarning}
        </p>
      )}
      <Outlet
        context={{
          recipeList,
          addRecipe,
          updateRecipe,
          deleteRecipe,
          weeklyMenu,
          menuDispatch,
        }}
      />
      <Footer />
    </div>
  );
};
