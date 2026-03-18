
import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { useEffect, useState } from "react";
import { recipes as defaultRecipes } from "../../../data/recipes";
import {
  loadCustomRecipes,
  normalizeBuiltinRecipe,
  normalizeCustomRecipe,
  saveCustomRecipes,
} from "../../storage/recipesStorage";
import { removeRecipeFromStoredMenu } from "../../storage/menuStorage";


export const App = () => {
  const [customRecipes, setCustomRecipes] = useState(loadCustomRecipes);

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
    if (removed) removeRecipeFromStoredMenu(recipeId);
    return removed;
  };

  useEffect(() => {
    saveCustomRecipes(customRecipes);
  }, [customRecipes]);

  return (
    <div className="container">
      <Header />
      <Outlet context={{ recipeList, addRecipe, updateRecipe, deleteRecipe }} />
      <Footer />
    </div>
  );
};
