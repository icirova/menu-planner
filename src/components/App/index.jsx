
import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { useEffect, useState } from "react";
import { recipes as defaultRecipes } from "../../../data/recipes";

const CUSTOM_RECIPES_STORAGE_KEY = "customRecipes";


export const App = () => {
  const [customRecipes, setCustomRecipes] = useState(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_RECIPES_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const recipeList = [...defaultRecipes, ...customRecipes];

  const addRecipe = (newRecipe) => {
    setCustomRecipes((prev) => [...prev, newRecipe]);
  };

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_RECIPES_STORAGE_KEY, JSON.stringify(customRecipes));
    } catch {}
  }, [customRecipes]);

  return (
    <div className="container">
      <Header />
      <Outlet context={{ recipeList, addRecipe }} />
      <Footer />
    </div>
  );
};
