import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import {
  normalizeCustomRecipe,
  prepareCustomRecipeForRuntime,
  saveCustomRecipes,
} from "../src/storage/recipesStorage.js";
import { RECIPE_SOURCE } from "../src/utils/recipeSource.js";

const createSessionStorageMock = () => {
  const store = new Map();

  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
};

describe("recipes storage normalization", () => {
  beforeEach(() => {
    globalThis.sessionStorage = createSessionStorageMock();
  });

  it("normalizes custom recipe metadata", () => {
    const recipe = normalizeCustomRecipe({
      id: "42",
      title: "Test",
      createdAt: " ",
      tags: ["breakfast", "polévka"],
      suitableFor: ["veganské", "bez mléka"],
      preTasks: "  Namočit čočku  \n\nNakrájet zeleninu",
    });

    assert.equal(recipe.id, 42);
    assert.equal(recipe.source, RECIPE_SOURCE.CUSTOM);
    assert.equal(recipe.createdAt, null);
    assert.deepEqual(recipe.tags, ["snídaně", "polévky"]);
    assert.deepEqual(recipe.suitableFor, ["veganské"]);
    assert.deepEqual(recipe.preTasks, ["Namočit čočku", "Nakrájet zeleninu"]);
  });

  it("repairs invalid ids and keeps explicit source values", () => {
    const recipe = normalizeCustomRecipe({
      id: "not-a-number",
      title: "Imported seed",
      source: RECIPE_SOURCE.SEED,
    });

    assert.equal(Number.isSafeInteger(recipe.id), true);
    assert.notEqual(recipe.id, "not-a-number");
    assert.equal(recipe.source, RECIPE_SOURCE.SEED);
  });

  it("prepares runtime recipes with normalized photo urls", async () => {
    const recipe = await prepareCustomRecipeForRuntime({
      id: 5,
      title: "Foto recept",
      photo_urls: ["  /imgRecipe/pizza.webp ", "", null, "custom.webp"],
      preTasks: ["  Den předem  ", ""],
    });

    assert.deepEqual(recipe.photo_urls, ["/imgRecipe/pizza.webp", "custom.webp"]);
    assert.deepEqual(recipe.preTasks, ["Den předem"]);
  });

  it("saves only custom recipes to session storage", async () => {
    await saveCustomRecipes([
      {
        id: 1,
        title: "Seed",
        source: RECIPE_SOURCE.SEED,
        photo_urls: ["/imgRecipe/pizza.webp"],
      },
      {
        id: "2",
        title: "Custom",
        source: RECIPE_SOURCE.CUSTOM,
        tags: ["dinner"],
        suitableFor: ["bez mléka"],
        photo_urls: [" /imgRecipe/ramen.webp ", ""],
      },
    ]);

    const persistedRecipes = JSON.parse(sessionStorage.getItem("customRecipes"));

    assert.equal(persistedRecipes.length, 1);
    assert.deepEqual(persistedRecipes[0], {
      id: 2,
      title: "Custom",
      source: RECIPE_SOURCE.CUSTOM,
      tags: ["večeře"],
      suitableFor: ["bez mléka"],
      photo_urls: ["/imgRecipe/ramen.webp"],
      createdAt: null,
      preTasks: [],
    });
  });
});
