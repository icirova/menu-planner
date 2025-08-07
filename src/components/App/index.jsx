
import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { useState } from "react";
import { recipes as defaultRecipes } from "../../../data/recipes";


export const App = () => {
  const [recipeList, setRecipeList] = useState(defaultRecipes);

  const addRecipe = (newRecipe) => {
    setRecipeList((prev) => [...prev, newRecipe]);
  };

  return (
    <div className="container">
      <Header />
      <Outlet context={{ recipeList, addRecipe }} />
      <Footer />
    </div>
  );
};
