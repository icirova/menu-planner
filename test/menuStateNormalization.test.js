import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { initialMenuState } from "../src/reducers/menuReducer.js";
import {
  migrateWeekToRecipeIds,
  normalizeMenuState,
  normalizeTaskItems,
} from "../src/storage/menuStateNormalization.js";

const recipes = [
  { id: 1, title: "Polévka" },
  { id: 2, title: "Rizoto" },
];

describe("menu state normalization", () => {
  it("migrates legacy week slots from recipe titles to recipe ids", () => {
    const week = migrateWeekToRecipeIds(
      [
        {
          breakfast: "Polévka",
          lunch: ["Rizoto", "Neexistující recept", 999],
          shoppingSelections: { " mrkev ": false, cibule: true, "": false },
        },
      ],
      recipes,
    );

    assert.equal(week.length, initialMenuState.week.length);
    assert.deepEqual(week[0].breakfast, [1]);
    assert.deepEqual(week[0].lunch, [2]);
    assert.deepEqual(week[0].shoppingSelections, { mrkev: false, cibule: true });
  });

  it("normalizes task items from legacy strings and stored objects", () => {
    assert.deepEqual(normalizeTaskItems("  Nakoupit\n\nUvařit "), [
      { id: "task-0-Nakoupit", text: "Nakoupit", done: false },
      { id: "task-2-Uvařit", text: "Uvařit", done: false },
    ]);

    assert.deepEqual(
      normalizeTaskItems([
        " Připravit ",
        { id: "custom-id", text: " Hotovo ", done: true },
        { text: "Bez id" },
        { text: "" },
      ]),
      [
        { id: "task-0-Připravit", text: "Připravit", done: false },
        { id: "custom-id", text: "Hotovo", done: true },
        { id: "task-2-Bez id", text: "Bez id", done: false },
      ],
    );
  });

  it("normalizes full stored menu state and rejects invalid payloads", () => {
    const normalized = normalizeMenuState(
      {
        week: [{ dinner: "Rizoto" }],
        tasks: [{ text: " Poznámka ", done: true }],
        prepDone: { a: true, b: false },
        extraDone: { c: 1, d: 0 },
        shopping: "mléko\nchléb",
      },
      recipes,
    );

    assert.deepEqual(normalized.week[0].dinner, [2]);
    assert.deepEqual(normalized.tasks, [{ id: "task-0-Poznámka", text: "Poznámka", done: true }]);
    assert.deepEqual(normalized.prepDone, { a: true });
    assert.deepEqual(normalized.extraDone, { c: 1 });
    assert.equal(normalized.shopping.customItems.length, 2);
    assert.equal(normalizeMenuState({ week: null }, recipes), null);
  });
});
