import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { initialMenuState, menuReducer } from "../src/reducers/menuReducer.js";

const recipes = [
  { id: 1, title: "Polévka" },
  { id: 2, title: "Rizoto" },
  { id: 3, title: "Koláč" },
];

const createState = () => ({
  ...initialMenuState,
  week: initialMenuState.week.map((day) => ({ ...day })),
});

describe("menuReducer", () => {
  it("migrates legacy stored recipe titles to recipe ids", () => {
    const legacyWeek = [
      {
        breakfast: "Polévka",
        lunch: ["Rizoto", "Neexistující recept", 3, 999],
        shoppingSelections: { " mrkev ": false, cibule: true, "": false },
      },
    ];

    const nextState = menuReducer(createState(), {
      type: "INIT_FROM_STORAGE",
      payload: legacyWeek,
      recipes,
    });

    assert.equal(nextState.week.length, initialMenuState.week.length);
    assert.deepEqual(nextState.week[0].breakfast, [1]);
    assert.deepEqual(nextState.week[0].lunch, [2, 3]);
    assert.deepEqual(nextState.week[0].shoppingSelections, { mrkev: false, cibule: true });
  });

  it("appends recipes, removes one recipe from a slot, and clears the whole slot", () => {
    const withLunch = menuReducer(createState(), {
      type: "UPDATE_MEAL",
      dayIndex: 0,
      mealKey: "lunch",
      value: 1,
      append: true,
    });
    const withTwoLunches = menuReducer(withLunch, {
      type: "UPDATE_MEAL",
      dayIndex: 0,
      mealKey: "lunch",
      value: 2,
      append: true,
    });

    assert.deepEqual(withTwoLunches.week[0].lunch, [1, 2]);

    const afterRecipeClear = menuReducer(withTwoLunches, {
      type: "CLEAR_MEAL",
      dayIndex: 0,
      mealKey: "lunch",
      recipeId: 1,
    });

    assert.deepEqual(afterRecipeClear.week[0].lunch, [2]);

    const afterSlotClear = menuReducer(afterRecipeClear, {
      type: "CLEAR_MEAL",
      dayIndex: 0,
      mealKey: "lunch",
    });

    assert.equal(afterSlotClear.week[0].lunch, "");
  });

  it("moves one recipe by appending and swaps an entire slot with the target", () => {
    const state = createState();
    state.week[0].lunch = [1, 2];
    state.week[1].dinner = [3];

    const afterSingleMove = menuReducer(state, {
      type: "MOVE_MEAL",
      fromDay: 0,
      fromKey: "lunch",
      toDay: 1,
      toKey: "dinner",
      recipeId: 2,
    });

    assert.deepEqual(afterSingleMove.week[0].lunch, [1]);
    assert.deepEqual(afterSingleMove.week[1].dinner, [3, 2]);

    const afterMoveAll = menuReducer(afterSingleMove, {
      type: "MOVE_MEAL",
      fromDay: 1,
      fromKey: "dinner",
      toDay: 2,
      toKey: "extra",
      moveAll: true,
    });

    assert.equal(afterMoveAll.week[1].dinner, "");
    assert.deepEqual(afterMoveAll.week[2].extra, [3, 2]);

    const afterSwap = menuReducer(afterMoveAll, {
      type: "MOVE_MEAL",
      fromDay: 2,
      fromKey: "extra",
      toDay: 0,
      toKey: "lunch",
      moveAll: true,
    });

    assert.deepEqual(afterSwap.week[2].extra, [1]);
    assert.deepEqual(afterSwap.week[0].lunch, [3, 2]);
  });

  it("removes a deleted recipe from every slot", () => {
    const state = createState();
    state.week[0].breakfast = [1, 2];
    state.week[2].extra = [2, 3];

    const nextState = menuReducer(state, {
      type: "REMOVE_RECIPE_FROM_WEEK",
      recipeId: 2,
    });

    assert.deepEqual(nextState.week[0].breakfast, [1]);
    assert.deepEqual(nextState.week[2].extra, [3]);
  });
});
