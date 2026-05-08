import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  filterRecipes,
  getRecipeCatalogStats,
  sortRecipes,
} from "../src/selectors/recipeSelectors.js";
import { RECIPE_SOURCE } from "../src/utils/recipeSource.js";

const recipes = [
  {
    id: 1,
    title: "Čočková polévka",
    createdAt: "2024-01-01T10:00:00.000Z",
    tags: ["polévky", "obědy"],
    suitableFor: ["veganské"],
    source: RECIPE_SOURCE.SEED,
  },
  {
    id: 2,
    title: "Lasagne",
    createdAt: "2024-03-01T10:00:00.000Z",
    tags: ["obědy", "večeře"],
    suitableFor: [],
    source: RECIPE_SOURCE.CUSTOM,
  },
  {
    id: 3,
    title: "Bezlepkové lívance",
    createdAt: "2024-02-01T10:00:00.000Z",
    tags: ["breakfast"],
    suitableFor: ["bez lepku"],
    source: RECIPE_SOURCE.CUSTOM,
  },
];

describe("recipe selectors", () => {
  it("filters recipes by query, normalized tags, and derived suitability values", () => {
    assert.deepEqual(
      filterRecipes(recipes, { query: "polévka" }).map((recipe) => recipe.id),
      [1],
    );

    assert.deepEqual(
      filterRecipes(recipes, { selectedTags: ["snídaně"] }).map((recipe) => recipe.id),
      [3],
    );

    assert.deepEqual(
      filterRecipes(recipes, { selectedSuitabilities: ["bez mléka"] }).map((recipe) => recipe.id),
      [1],
    );
  });

  it("sorts recipes without mutating the source list", () => {
    const source = [recipes[0], recipes[1], recipes[2]];

    assert.deepEqual(
      sortRecipes(source, { sortOrder: "newest" }).map((recipe) => recipe.id),
      [2, 3, 1],
    );
    assert.deepEqual(
      source.map((recipe) => recipe.id),
      [1, 2, 3],
    );

    assert.deepEqual(
      sortRecipes(source, { sortOrder: "title-desc" }).map((recipe) => recipe.id),
      [2, 1, 3],
    );
  });

  it("keeps a priority recipe first before applying the selected sort", () => {
    assert.deepEqual(
      sortRecipes(recipes, { priorityRecipeId: "1", sortOrder: "newest" }).map(
        (recipe) => recipe.id,
      ),
      [1, 2, 3],
    );
  });

  it("summarizes catalog counts", () => {
    assert.deepEqual(getRecipeCatalogStats(recipes), {
      totalCount: 3,
      customCount: 2,
      glutenFreeCount: 1,
      veganCount: 1,
    });
  });
});
