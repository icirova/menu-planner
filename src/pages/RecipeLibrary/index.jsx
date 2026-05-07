import "./style.css";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { FilterToggleGroup } from "../../components/FilterToggleGroup/index.jsx";
import {
  getRecipeSuitableForFilterValues,
  SUITABILITY_OPTIONS,
  TAG_OPTIONS,
} from "../../constants/recipeMetadata.js";
import { normalizeRecipeTags } from "../../utils/normalizeRecipeTag.js";
import { isSeedRecipe } from "../../utils/recipeSource.js";
import { resolveImageSrc } from "../../utils/resolveImageSrc.js";

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

const RecipeLibraryCard = ({ recipe }) => {
  const cover = resolveImageSrc(recipe.photo_urls?.[0] || "/image/placeholder.png");
  const tags = recipe.tags ?? [];
  const suitableFor = recipe.suitableFor ?? [];

  return (
    <li className="recipe-library__card">
      <Link to={`/recipe-detail/${recipe.id}`} className="recipe-library__cover-link">
        <img src={cover} alt={recipe.title} className="recipe-library__image" />
        <div className="recipe-library__body">
          <div className="recipe-library__body-header">
            <h3 className="recipe-library__card-title">{recipe.title}</h3>
          </div>

          {(tags.length > 0 || suitableFor.length > 0) && (
            <div className="recipe-library__meta-group">
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
        </div>
      </Link>

      {!isSeedRecipe(recipe) && (
        <div className="recipe-library__actions">
          <Link to={`/recipe-form/${recipe.id}/edit`} className="button recipe-library__link">
            Upravit
          </Link>
        </div>
      )}
    </li>
  );
};

export const RecipeLibrary = () => {
  const { recipeList } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const catalogSectionRef = useRef(null);
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSuitabilities, setSelectedSuitabilities] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(RECIPES_BATCH_SIZE);
  const [priorityRecipeId, setPriorityRecipeId] = useState(location.state?.focusRecipeId ?? null);
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
        if (priorityRecipeId != null) {
          if (String(a.id) === String(priorityRecipeId)) return -1;
          if (String(b.id) === String(priorityRecipeId)) return 1;
        }

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
  }, [priorityRecipeId, query, recipeList, selectedSuitabilities, selectedTags, sortOrder]);
  const glutenFreeRecipesCount = recipeList.filter((recipe) =>
    recipe.suitableFor?.includes("bez lepku"),
  ).length;
  const customRecipesCount = recipeList.filter((recipe) => !isSeedRecipe(recipe)).length;
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

  useEffect(() => {
    const focusRecipeId = location.state?.focusRecipeId;
    if (focusRecipeId == null) return;

    setPriorityRecipeId(focusRecipeId);
  }, [location.state]);

  useEffect(() => {
    const focusRecipeId = location.state?.focusRecipeId;
    if (focusRecipeId == null) return;

    const targetRecipe = visibleRecipes.find((recipe) => String(recipe.id) === String(focusRecipeId));
    if (!targetRecipe) return;

    catalogSectionRef.current?.scrollIntoView({ behavior: "auto", block: "start" });

    if (location.state?.focusRecipeId != null) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate, visibleRecipes]);

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
        <div className="recipe-library__hero-content page-hero__content">
          <p className="page-hero__eyebrow">Katalog receptů</p>
          <h1 className="page-hero__title">Recepty</h1>
          <p className="page-hero__text">
            Procházej, vkládej a upravuj.
          </p>
        </div>
        <div className="page-hero__actions">
          <Link to="/recipe-form" className="button button--new-recipe recipe-library__action">
            Vložit recept
          </Link>
        </div>
      </section>

      <div className="recipe-library__top-grid">
        <section className="recipe-library__panel recipe-library__panel--controls">
          <div className="recipe-library__panel-header recipe-library__panel-header--filters">
            <div>
              <h2>Hledání a filtry</h2>
            </div>
          </div>

          <div className="recipe-library__search">
            <label htmlFor="recipe-search" className="recipe-library__search-label">
              Hledat recept
            </label>
            <input
              id="recipe-search"
              type="search"
              className="recipe-library__search-input"
              placeholder="Např. lasagne, salát, polévka..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="recipe-library__filters">
            <h3 className="recipe-library__subheading">Filtrovat</h3>

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

          <div
            className={`recipe-library__filter-summary ${
              hasActiveFilters ? "" : "recipe-library__filter-summary--empty"
            }`}
            aria-hidden={!hasActiveFilters}
          >
            <p className="recipe-library__filter-summary-text">
              Aktivní filtry: {activeFiltersCount}
            </p>
            <button
              type="button"
              className="button button--ghost recipe-library__clear-button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              tabIndex={hasActiveFilters ? undefined : -1}
            >
              Vyčistit filtry
            </button>
          </div>
        </section>

        <aside className="recipe-library__panel recipe-library__panel--summary">
          <div className="recipe-library__panel-header">
            <div>
              <h2>Katalog v kostce</h2>
            </div>
          </div>

          <div className="recipe-library__summary-content">
            <div className="recipe-library__summary-grid">
              <article className="recipe-library__summary-box">
                <span className="recipe-library__summary-value">{recipeList.length}</span>
                <span className="recipe-library__summary-label">receptů celkem</span>
              </article>

              <article className="recipe-library__summary-box">
                <span className="recipe-library__summary-value">{customRecipesCount}</span>
                <span className="recipe-library__summary-label">vlastních receptů</span>
              </article>

              <article className="recipe-library__summary-box">
                <span className="recipe-library__summary-value">{glutenFreeRecipesCount}</span>
                <span className="recipe-library__summary-label">bezlepkových receptů</span>
              </article>

              <article className="recipe-library__summary-box">
                <span className="recipe-library__summary-value">{veganRecipesCount}</span>
                <span className="recipe-library__summary-label">veganských receptů</span>
              </article>
            </div>
          </div>
        </aside>
      </div>

      <section className="recipe-library__panel" ref={catalogSectionRef}>
        <div className="recipe-library__panel-header recipe-library__panel-header--catalog">
          <div>
            <h2>Recepty</h2>
            <p>
              {filteredRecipes.length} {recipeCountLabel}
              {hasActiveFilters ? " po filtrování" : ""}
            </p>
          </div>
          <div className="recipe-library__sort">
            <label htmlFor="recipe-sort" className="sr-only">
              Řazení
            </label>
            <select
              id="recipe-sort"
              className="recipe-library__sort-select"
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
        </div>

        {filteredRecipes.length > 0 ? (
          <>
            <ul className="recipe-library__grid" role="list">
              {visibleRecipes.map((recipe) => (
                <RecipeLibraryCard key={recipe.id} recipe={recipe} />
              ))}
            </ul>

            {hasMoreRecipes && (
              <div className="recipe-library__load-more">
                <p className="recipe-library__load-more-text">
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
