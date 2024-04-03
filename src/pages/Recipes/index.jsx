import { Buttons } from "../../components/Buttons"
import { RecipeCard } from "../../components/RecipeCard"
import "./style.css"
import { recipes } from "../../../data/recipes"
import { useNavigate } from "react-router-dom"


export const Recipes = () => {

  const navigate = useNavigate()

  const openDetail= (recipeId) => {
    navigate(`/recipe-detail/${recipeId}`)
  }

  return <div className="main">
    <h1 className="title">Recepty</h1>
    <Buttons />

    <div className="recipes section--grid">

      {
        recipes.map(oneRecipe => {
          return <RecipeCard 
          key={oneRecipe.id}
          photo_url={oneRecipe.photo_url}
          title={oneRecipe.title}
          openDetail={() => openDetail(oneRecipe.id)}
          />
        })
      }
    
    </div>


  </div>
}
