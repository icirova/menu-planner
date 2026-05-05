import "./style.css";
import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FilterToggleGroup } from "../../components/FilterToggleGroup";
import {
  getRecipeSuitableForFilterValues,
  SUITABILITY_OPTIONS,
  TAG_OPTIONS,
} from "../../constants/recipeMetadata";
import { normalizeRecipeTags } from "../../utils/normalizeRecipeTag";
import { isSeedRecipe } from "../../utils/recipeSource";
import { resolveImageSrc } from "../../utils/resolveImageSrc";

const SORT_OPTIONS = [
  { value: "newest", label: "Nejnovější" },
  { value: "title-asc", label: "Abecedně A-Z" },
  { value: "title-desc", label: "Abecedně Z-A" },
];
const RECIPES_BATCH_SIZE = 24;

const getRecipeSortTimestamp = (recipe) => {
  const parsed = recipe.createdAt ? Date.parse(recipe.createdAt) : NaN;
  if (Number.isFinite(parsed)) return parsed;
  return typeof recipe.id === "number" ? recipe.id : 0;
};

export const RecipeLibrary = () => {
  const { recipeList } = useOutletContext();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSuitabilities, setSelectedSuitabilities] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(RECIPES_BATCH_SIZE);
  const hasActiveFilters =
    query.trim() !== "" || selectedTags.length > 0 || selectedSuitabilities.length > 0;
  const activeFiltersCount =
    (query.trim() !== "" ? 1 : 0) + selectedTags.length + selectedSuitabilities.length;

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("cs-CZ");

    return recipeList
      .filter((recipe) => {
        const normalizedRecipeTags = normalizeRecipeTags(recipe.tags);
        const suitabilityFilterValues = getRecipeSuitableForFilterValues(recipe.suitableFor);
        const matchesQuery =
          normalizedQuery === "" ||
          recipe.title.toLocaleLowerCase("cs-CZ").includes(normalizedQuery);

        return (
          matchesQuery &&
          selectedTags.every((tag) => normalizedRecipeTags.includes(tag)) &&
          selectedSuitabilities.every((suit) => suitabilityFilterValues.includes(suit))
        );
      })
      .sort((a, b) => {
        if (sortOrder === "title-asc") {
          return a.title.localeCompare(b.title, "cs");
        }

        if (sortOrder === "title-desc") {
          return b.title.localeCompare(a.title, "cs");
        }

        const byDate = getRecipeSortTimestamp(b) - getRecipeSortTimestamp(a);
        if (byDate !== 0) return byDate;
        return a.title.localeCompare(b.title, "cs");
      });
  }, [query, recipeList, selectedSuitabilities, selectedTags, sortOrder]);
  const glutenFreeRecipesCount = recipeList.filter((recipe) =>
    recipe.suitableFor?.includes("bez lepku"),
  ).length;
  const veganRecipesCount = recipeList.filter((recipe) =>
    recipe.suitableFor?.includes("veganské"),
  ).length;
  const recipeCountLabel =
    filteredRecipes.length === 1
      ? "recept"
      : filteredRecipes.length < 5
        ? "recepty"
        : "receptů";
  const visibleRecipes = filteredRecipes.slice(0, visibleCount);
  const hasMoreRecipes = visibleRecipes.length < filteredRecipes.length;

  useEffect(() => {
    setVisibleCount(RECIPES_BATCH_SIZE);
  }, [query, selectedSuitabilities, selectedTags, sortOrder, recipeList.length]);

  const handleTagSelection = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const handleSuitabilitySelection = (value) => {
    setSelectedSuitabilities((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedTags([]);
    setSelectedSuitabilities([]);
  };

  const showMoreRecipes = () => {
    setVisibleCount((current) => current + RECIPES_BATCH_SIZE);
  };

  return (
    <div className="main recipe-library-page">
      <section
        className="recipe-library__hero page-hero page-hero--catalog"
        style={{ "--page-hero-image": 'url("/shopping.webp")' }}
      >
        <div className="recipe-library__heroContent page-hero__content">
          <p className="page-hero__eyebrow">Katalog receptů</p>
          <h1 className="page-hero__title">Recepty</h1>
          <p className="page-hero__text">
            Vlastní katalog receptů pro plánování týdne. Tady recepty procházíš, hledáš a upravuješ.
          </p>
        </div>
        <div className="page-hero__actions">
          <Link to="/recipe-form" className="button button--new-recipe recipe-library__action">
            Vložit recept
          </Link>
        </div>
      </section>

      <div className="recipe-library__topGrid">
        <section className="recipe-library__panel recipe-library__panel--controls">
          <div className="recipe-library__panelHeader recipe-library__panelHeader--filters">
            <div>
              <h2>Hledání a filtry</h2>
              <p>Vyber si jen recepty, se kterými chceš právě pracovat.</p>
            </div>
          </div>

          <div className="recipe-library__search">
            <label htmlFor="recipe-search" className="recipe-library__searchLabel">
              Hledat recept
            </label>
            <input
              id="recipe-search"
              type="search"
              className="recipe-library__searchInput"
              placeholder="Např. lasagne, salát, polévka..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="recipe-library__filters">
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

          {hasActiveFilters && (
            <div className="recipe-library__filterSummary">
              <p className="recipe-library__filterSummaryText">
                Aktivní filtry: {activeFiltersCount}
              </p>
              <button
                type="button"
                className="button button--ghost recipe-library__clearButton"
                onClick={resetFilters}
              >
                Vyčistit filtry
              </button>
            </div>
          )}
        </section>

        <aside className="recipe-library__panel recipe-library__panel--summary">
          <div className="recipe-library__panelHeader">
            <div>
              <h2>Katalog v kostce</h2>
              <p>Rychlý souhrn nad celou databází receptů.</p>
            </div>
          </div>

          <div className="recipe-library__summaryGrid">
            <article className="recipe-library__summaryBox">
              <span className="recipe-library__summaryValue">{recipeList.length}</span>
              <span className="recipe-library__summaryLabel">receptů celkem</span>
            </article>

            <article className="recipe-library__summaryBox">
              <span className="recipe-library__summaryValue">{glutenFreeRecipesCount}</span>
              <span className="recipe-library__summaryLabel">bezlepkových receptů</span>
            </article>

            <article className="recipe-library__summaryBox">
              <span className="recipe-library__summaryValue">{veganRecipesCount}</span>
              <span className="recipe-library__summaryLabel">veganských receptů</span>
            </article>
          </div>
        </aside>
      </div>

      <section className="recipe-library__panel">
        <div className="recipe-library__panelHeader recipe-library__panelHeader--catalog">
          <div>
            <h2>Katalog</h2>
            <p>
              {filteredRecipes.length} {recipeCountLabel}
              {hasActiveFilters ? " po filtrování" : ""}
            </p>
          </div>
          <div className="recipe-library__sort recipe-library__sort--header">
            <label htmlFor="recipe-sort" className="recipe-library__sortLabel">
              Řazení
            </label>
            <select
              id="recipe-sort"
              className="recipe-library__sortSelect"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="recipe-library__headerSpacer" aria-hidden="true" />
        </div>

        {filteredRecipes.length > 0 ? (
          <>
            <ul className="recipe-library__grid" role="list">
              {visibleRecipes.map((recipe) => {
              const cover = resolveImageSrc(recipe.photo_urls?.[0] || "/image/placeholder.png");
              const tags = recipe.tags ?? [];
              const suitableFor = recipe.suitableFor ?? [];

              return (
                <li key={recipe.id} className="recipe-library__card">
                  <Link to={`/recipe-detail/${recipe.id}`} className="recipe-library__coverLink">
                    <img src={cover} alt={recipe.title} className="recipe-library__image" />
                    <div className="recipe-library__body">
                    <div className="recipe-library__bodyHeader">
                      <h3 className="recipe-library__cardTitle">{recipe.title}</h3>
                    </div>

                    {(tags.length > 0 || suitableFor.length > 0) && (
                      <div className="recipe-library__metaGroup">
                        {tags.length > 0 && (
                          <p className="recipe-library__meta">{tags.join(" • ")}</p>
                        )}
                        {suitableFor.length > 0 && (
                          <p className="recipe-library__meta">{suitableFor.join(" • ")}</p>
                        )}
                        {tags.length === 0 || suitableFor.length === 0 ? (
                          <p className="recipe-library__meta recipe-library__meta--placeholder" aria-hidden="true">
                            &nbsp;
                          </p>
                        ) : null}
                      </div>
                    )}

                    {!isSeedRecipe(recipe) && (
                      <div className="recipe-library__actions">
                        <Link to={`/recipe-form/${recipe.id}/edit`} className="button recipe-library__link">
                          Upravit
                        </Link>
                      </div>
                    )}
                    </div>
                  </Link>
                </li>
              );
              })}
            </ul>

            {hasMoreRecipes && (
              <div className="recipe-library__loadMore">
                <p className="recipe-library__loadMoreText">
                  Zobrazeno {visibleRecipes.length} z {filteredRecipes.length} receptů.
                </p>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={showMoreRecipes}
                >
                  Načíst další
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="recipe-library__empty">
            <p>Filtry zatím nevrátily žádný recept.</p>
            <button
              type="button"
              className="button button--ghost"
              onClick={resetFilters}
            >
              Vyčistit filtry
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
