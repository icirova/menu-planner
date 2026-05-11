import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getExcludedAllergensForSuitability,
  isAllergenOptionDisabled,
  normalizeAllergenValuesForSuitability,
} from "../src/constants/recipeMetadata.js";

describe("recipe metadata helpers", () => {
  it("excludes allergens that conflict with selected suitability values", () => {
    assert.deepEqual([...getExcludedAllergensForSuitability(["bez lepku"])], ["lepek"]);
    assert.deepEqual([...getExcludedAllergensForSuitability(["bez mléka"])], ["mléko"]);

    assert.deepEqual([...getExcludedAllergensForSuitability(["veganské"])], [
      "korýši",
      "vejce",
      "ryby",
      "mléko",
    ]);
  });

  it("removes conflicting allergens from selected values", () => {
    assert.deepEqual(
      normalizeAllergenValuesForSuitability(["lepek", "mléko", "sója"], [
        "bez lepku",
        "bez mléka",
      ]),
      ["sója"],
    );
  });

  it("disables allergen options when suitability says the recipe is free from them", () => {
    assert.equal(isAllergenOptionDisabled("lepek", ["bez lepku"]), true);
    assert.equal(isAllergenOptionDisabled("mléko", ["veganské"]), true);
    assert.equal(isAllergenOptionDisabled("sója", ["veganské"]), false);
  });
});
