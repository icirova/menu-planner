import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getOutsideCancelActionType,
  getSuggestedPlannerTarget,
  initialPlannerUiState,
  plannerUiReducer,
} from "../src/reducers/plannerUiReducer.js";

describe("planner UI reducer", () => {
  it("suggests preferred empty targets from selected recipe tags", () => {
    const week = [
      { breakfast: [1], lunch: "" },
      { breakfast: "", lunch: "" },
    ];

    assert.deepEqual(getSuggestedPlannerTarget(week, ["snídaně"]), {
      dayIndex: 1,
      slotKey: "breakfast",
    });
    assert.deepEqual(getSuggestedPlannerTarget(week, ["obědy"]), {
      dayIndex: 0,
      slotKey: "lunch",
    });
    assert.deepEqual(getSuggestedPlannerTarget(week, []), {
      dayIndex: 0,
      slotKey: "snack1",
    });
  });

  it("tracks recipe selection and target cancellation", () => {
    const selected = plannerUiReducer(initialPlannerUiState, {
      type: "SELECT_RECIPE",
      recipeId: 42,
      recipeTitle: "Rizoto",
      suggestedTarget: { dayIndex: 2, slotKey: "lunch" },
    });

    assert.equal(selected.selectedRecipeId, 42);
    assert.deepEqual(selected.selectedTarget, { dayIndex: 2, slotKey: "lunch" });
    assert.match(selected.planMessage, /Rizoto/);

    const cancelled = plannerUiReducer(selected, {
      type: "CANCEL_SELECTED_RECIPE",
      recipeTitle: "Rizoto",
    });

    assert.equal(cancelled.selectedRecipeId, null);
    assert.equal(cancelled.selectedTarget, null);
    assert.equal(cancelled.duplicateMessage, null);
    assert.match(cancelled.planMessage, /zrušen/);
  });

  it("reports assign results and duplicate recipe rejection", () => {
    const duplicate = plannerUiReducer(initialPlannerUiState, {
      type: "ASSIGN_DUPLICATE_RECIPE",
      dayIndex: 0,
      recipeTitle: "Polévka",
      slotKey: "lunch",
    });

    assert.match(duplicate.planMessage, /už ve slotu/);

    const assigned = plannerUiReducer(
      {
        ...initialPlannerUiState,
        selectedRecipeId: 1,
        selectedTarget: { dayIndex: 0, slotKey: "lunch" },
      },
      {
        type: "ASSIGN_RECIPE",
        dayIndex: 0,
        hadExistingRecipes: true,
        recipeTitle: "Polévka",
        slotKey: "lunch",
      },
    );

    assert.equal(assigned.selectedRecipeId, null);
    assert.equal(assigned.selectedTarget, null);
    assert.match(assigned.duplicateMessage, /další recept/);
    assert.match(assigned.planMessage, /přidán/);
  });

  it("tracks duplicate-slot flow", () => {
    const started = plannerUiReducer(initialPlannerUiState, {
      type: "START_DUPLICATE_SLOT",
      dayIndex: 1,
      recipeIds: [1, 2],
      slotKey: "dinner",
    });

    assert.deepEqual(started.duplicateSource, {
      dayIndex: 1,
      recipeIds: [1, 2],
      slotKey: "dinner",
    });
    assert.equal(started.selectedRecipeId, null);
    assert.match(started.planMessage, /zdroj pro duplikování/);

    const rejected = plannerUiReducer(started, { type: "REJECT_DUPLICATE_TARGET" });
    assert.equal(rejected.duplicateSource, started.duplicateSource);
    assert.match(rejected.planMessage, /prázdného slotu/);

    const committed = plannerUiReducer(started, {
      type: "COMMIT_DUPLICATE_SLOT",
      dayIndex: 2,
      slotKey: "lunch",
    });
    assert.equal(committed.duplicateSource, null);
    assert.match(committed.planMessage, /zkopírován/);
  });

  it("resolves outside-click cancellation priority", () => {
    assert.equal(getOutsideCancelActionType(initialPlannerUiState), null);
    assert.equal(
      getOutsideCancelActionType({
        ...initialPlannerUiState,
        selectedTarget: { dayIndex: 0, slotKey: "lunch" },
      }),
      "CANCEL_SELECTED_TARGET",
    );
    assert.equal(
      getOutsideCancelActionType({
        ...initialPlannerUiState,
        selectedRecipeId: 1,
        selectedTarget: { dayIndex: 0, slotKey: "lunch" },
      }),
      "CANCEL_SELECTED_RECIPE",
    );
    assert.equal(
      getOutsideCancelActionType({
        ...initialPlannerUiState,
        duplicateSource: { dayIndex: 0, slotKey: "lunch", recipeIds: [1] },
        selectedRecipeId: 1,
      }),
      "CANCEL_DUPLICATE",
    );
  });

  it("clears cell and week UI state", () => {
    const clearedCell = plannerUiReducer(initialPlannerUiState, {
      type: "CLEAR_CELL",
      dayIndex: 0,
      recipeId: 1,
      slotKey: "dinner",
    });

    assert.deepEqual(clearedCell.selectedTarget, { dayIndex: 0, slotKey: "dinner" });
    assert.match(clearedCell.planMessage, /odebrána/);

    const clearedWeek = plannerUiReducer(
      {
        ...clearedCell,
        duplicateSource: { dayIndex: 0, slotKey: "dinner", recipeIds: [1] },
        selectedRecipeId: 1,
      },
      { type: "CLEAR_WEEK" },
    );

    assert.equal(clearedWeek.duplicateSource, null);
    assert.equal(clearedWeek.selectedRecipeId, null);
    assert.match(clearedWeek.planMessage, /Celý týdenní plán/);
  });
});
