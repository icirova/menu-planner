import { Buttons } from "../../components/Buttons"
import { RecipeCard } from "../../components/RecipeCard"
import "./style.css"

export const Recipes = () => {
  return <div className="main">
    <h1 className="title">Recepty</h1>
    <Buttons />

    <div className="recipes section--grid">
      <RecipeCard />
      <RecipeCard />
      <RecipeCard />
      <RecipeCard />
      <RecipeCard />
  
    </div>


  </div>
}
