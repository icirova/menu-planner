import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  addRecipeIdToSlot,
  getSlotRecipeIds,
  getWeekRecipeIds,
  normalizeSlotValue,
  removeRecipeIdFromSlot,
} from "../src/utils/mealSlots.js";

describe("meal slot helpers", () => {
  it("normalizes slot values to unique finite recipe ids", () => {
    assert.deepEqual(getSlotRecipeIds([1, 2, 2, Number.NaN, "3", null]), [1, 2]);
    assert.deepEqual(getSlotRecipeIds(4), [4]);
    assert.deepEqual(normalizeSlotValue([]), "");
    assert.deepEqual(normalizeSlotValue([5, 5]), [5]);
  });

  it("adds and removes recipe ids without duplicates", () => {
    assert.deepEqual(addRecipeIdToSlot([1, 2], 2), [1, 2]);
    assert.deepEqual(addRecipeIdToSlot(1, 3), [1, 3]);
    assert.deepEqual(removeRecipeIdFromSlot([1, 2, 3], 2), [1, 3]);
    assert.equal(removeRecipeIdFromSlot([2], 2), "");
  });

  it("collects recipe ids from every meal slot in a week", () => {
    const week = [
      { breakfast: 1, lunch: [2, 3], extra: "" },
      { dinner: [3, 4], snack1: "legacy title" },
    ];

    assert.deepEqual(getWeekRecipeIds(week), [1, 2, 3, 3, 4]);
  });
});
