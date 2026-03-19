import { FilterToggleGroup } from "../../components/FilterToggleGroup";
import { RecipeCard } from "../../components/RecipeCard";
import "./style.css";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import {
  getRecipeSuitableForFilterValues,
  SUITABILITY_OPTIONS,
  TAG_OPTIONS,
} from "../../constants/recipeMetadata";
import { normalizeRecipeTags } from "../../utils/normalizeRecipeTag";

export const Recipes = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSuitabilities, setSelectedSuitabilities] = useState([]);
  const [sortOrder, setSortOrder] = useState("alpha");
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

  const filteredRecipes = recipeList
    .filter((recipe) => {
      const normalizedRecipeTags = normalizeRecipeTags(recipe.tags);
      const suitabilityFilterValues = getRecipeSuitableForFilterValues(recipe.suitableFor);

      return (
        selectedTags.every((tag) => normalizedRecipeTags.includes(tag)) &&
        selectedSuitabilities.every((suit) =>
          suitabilityFilterValues.includes(suit)
        )
      );
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.id - a.id;
      }

      return a.title.localeCompare(b.title, "cs");
    });

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

      <div className="recipes__sort">
        <label htmlFor="recipe-sort" className="recipes__sort-label">Řazení</label>
        <select
          id="recipe-sort"
          className="recipes__sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="alpha">A–Z</option>
          <option value="newest">Nově přidané</option>
        </select>
      </div>

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
