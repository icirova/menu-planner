import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatIngredient } from "../src/utils/formatIngredient.js";

describe("ingredient formatting", () => {
  it("shows alternative ingredients with nebo in recipes", () => {
    assert.equal(
      formatIngredient({ amount: 2, unit: "lžíce", item: "máslo/olej" }, 1, 1),
      "2 lžíce másla nebo oleje",
    );
    assert.equal(
      formatIngredient({ amount: 1, unit: "lžíce", item: "pažitka/petrželka" }, 1, 1),
      "1 lžíce pažitky nebo petrželky",
    );
  });
});
