import { Buttons } from "../../components/Buttons"
import { RecipeCard } from "../../components/RecipeCard"
import "./style.css"
import { recipes } from "../../../data/recipes"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export const Recipes = () => {

  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);

  const openDetail= (recipeId) => {
    navigate(`/recipe-detail/${recipeId}`)
  };
  

  const handleTagSelection = (tag) => {


    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([tag]);
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    selectedTags.every((tag) => recipe.tags.includes(tag))
  );

  return <div className="main">
    <h1 className="title">Recepty</h1>
    <Buttons 
      handleTagSelection={handleTagSelection}
      selectedTags={selectedTags}
    />

    <div className="recipes section--grid">

      {
        filteredRecipes.map(oneRecipe => {
          return <RecipeCard 
          key={oneRecipe.id}
          photo_url={oneRecipe.photo_url}
          title={oneRecipe.title}
          openDetail={() => openDetail(oneRecipe.id)}
          />
        })
      };
    
    </div>


  </div>
}
