import { FilterToggleGroup } from "../../components/FilterToggleGroup";
import { RecipePlannerGrid } from "../../components/RecipePlannerGrid";
import { RecipeCard } from "../../components/RecipeCard";
import "./style.css";
import { useOutletContext } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  getRecipeSuitableForFilterValues,
  SUITABILITY_OPTIONS,
  TAG_OPTIONS,
} from "../../constants/recipeMetadata";
import { normalizeRecipeTags } from "../../utils/normalizeRecipeTag";
import { useRecipePlanner } from "../../hooks/useRecipePlanner";

export const WeeklyPlanner = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSuitabilities, setSelectedSuitabilities] = useState([]);
  const { recipeList, weeklyMenu, menuDispatch } = useOutletContext();
  const {
    duplicateMessage,
    duplicateSource,
    planMessage,
    plannerCellRefs,
    plannerRef,
    pointerDrag,
    recipesById,
    selectedRecipeId,
    targetDay,
    targetSlot,
    clearPlannerCell,
    clearWholePlan,
    handleDuplicateSlotStart,
    handlePlannerPointerDown,
    handlePlannerCellClick,
    startPlanning,
  } = useRecipePlanner({
    recipeList,
    weeklyMenu,
    menuDispatch,
    selectedTags,
  });

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

  const filteredRecipes = useMemo(
    () => recipeList
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
      .sort((a, b) => a.title.localeCompare(b.title, "cs")),
    [recipeList, selectedSuitabilities, selectedTags],
  );

  return (
    <div className="main recipes-page">
      <section
        className="recipes__hero page-hero page-hero--catalog"
        style={{ "--page-hero-image": 'url("/notes.webp")' }}
      >
        <div className="recipes__heroContent page-hero__content">
          <p className="page-hero__eyebrow">Týdenní přehled</p>
          <h1 className="page-hero__title">Recepty a Plán</h1>
          <p className="page-hero__text">
            Filtruj recepty, vybírej vhodná jídla a rovnou je přiřazuj do týdenního plánu.
          </p>
        </div>
      </section>

      <div id="recipes-planner" className="recipes__planner" ref={plannerRef}>
        <div className="recipes__planner-header">
          <div>
          <h2 className="recipes__planner-title">Plánování týdne</h2>
          <p className="recipes__planner-text">
            Vyber recept a klikni na slot, nebo nejdřív klikni na slot a potom vyber recept. Do jednoho slotu můžeš přidat i více receptů. Přetáhnout můžeš celý slot i jednotlivý recept. Ikonou v pravém horním rohu slot zduplikuješ do prázdného slotu. Aktivní slot zrušíš opětovným klikem nebo klikem mimo plánovač.
          </p>
          </div>
          <button
            type="button"
            className="button button--ghost recipes__planner-clearAll"
            onClick={clearWholePlan}
          >
            Vymazat celý plán
          </button>
        </div>

        {duplicateMessage && (
          <p className="recipes__picker-warning recipes__picker-warning--sticky" role="status">
            {duplicateMessage}
          </p>
        )}

        <RecipePlannerGrid
          weeklyMenu={weeklyMenu}
          recipesById={recipesById}
          duplicateSource={duplicateSource}
          pointerDrag={pointerDrag}
          plannerCellRefs={plannerCellRefs}
          targetDay={targetDay}
          targetSlot={targetSlot}
          clearPlannerCell={clearPlannerCell}
          handleDuplicateSlotStart={handleDuplicateSlotStart}
          handlePlannerPointerDown={handlePlannerPointerDown}
          handlePlannerCellClick={handlePlannerCellClick}
        />

      </div>

      <div className="recipes__filters">
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
      </div>

      {planMessage && (
        <p className="recipes__plan-message" role="status">
          {planMessage}
        </p>
      )}

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
            isSelected={r.id === selectedRecipeId}
            onAddToPlan={startPlanning}
          />
        ))}
      </ul>
    </div>
  );
};
