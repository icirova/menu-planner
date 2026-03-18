import { FilterToggleGroup } from "../../components/FilterToggleGroup";
import { RecipeCard } from "../../components/RecipeCard";
import "./style.css";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import {
  SUITABILITY_OPTIONS,
  TAG_OPTIONS,
} from "../../constants/recipeMetadata";

export const Recipes = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSuitabilities, setSelectedSuitabilities] = useState([]);
  const { recipeList } = useOutletContext();

  const handleSuitabilitySelection = (label) => {
    setSelectedSuitabilities((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleTagSelection = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [tag]
    );
  };

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

      <FilterToggleGroup
        options={TAG_OPTIONS}
        selectedValues={selectedTags}
        onToggle={handleTagSelection}
      />

      <FilterToggleGroup
        options={SUITABILITY_OPTIONS}
        selectedValues={selectedSuitabilities}
        onToggle={handleSuitabilitySelection}
        className="buttons--suitability"
      />

      {/* Semanticky je to seznam karet */}
      <ul className="recipes section--grid" role="list">
        {filteredRecipes.map((r) => (
          <RecipeCard
            key={r.id}
            id={r.id}
            title={r.title}
            photo_urls={r.photo_urls}
            source={r.source}
            servings={r.servings}
            calories={r.calories}
          />
        ))}
      </ul>
    </div>
  );
};
