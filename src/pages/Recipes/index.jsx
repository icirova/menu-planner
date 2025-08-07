import { Buttons } from "../../components/Buttons";
import { RecipeCard } from "../../components/RecipeCard";
import "./style.css";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SuitabilityButtons } from "../../components/SuitabilityButtons";

export const Recipes = () => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  

  const openDetail = (recipeId) => {
    navigate(`/recipe-detail/${recipeId}`);
  };

  const [selectedSuitabilities, setSelectedSuitabilities] = useState([]);

  const handleSuitabilitySelection = (label) => {
    if (selectedSuitabilities.includes(label)) {
      setSelectedSuitabilities(
        selectedSuitabilities.filter((s) => s !== label)
      );
    } else {
      setSelectedSuitabilities([...selectedSuitabilities, label]);
    }
  };
  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([tag]);
    }
  };

  const { recipeList } = useOutletContext();

  const filteredRecipes = recipeList.filter(
  (recipe) =>
    selectedTags.every((tag) => recipe.tags.includes(tag)) &&
    selectedSuitabilities.every((suit) =>
      recipe.suitableFor?.includes(suit)
    )
);

  return (
    <div className="main">
      <h1 className="title">Recepty</h1>
      <Buttons
        handleTagSelection={handleTagSelection}
        selectedTags={selectedTags}
      />

      <SuitabilityButtons
        handleSuitabilitySelection={handleSuitabilitySelection}
        selectedSuitabilities={selectedSuitabilities}
      />

      <div className="recipes section--grid">
        {filteredRecipes.map((oneRecipe) => {
          return (
            <RecipeCard
              key={oneRecipe.id}
              photo_url={oneRecipe.photo_url}
              title={oneRecipe.title}
              openDetail={() => openDetail(oneRecipe.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
