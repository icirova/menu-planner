import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getDayShoppingItems,
  getShoppingListItems,
  getShoppingListSummary,
  getShoppingStateForWeek,
  normalizeShoppingState,
} from "../src/utils/shoppingList.js";

const recipes = [
  {
    id: 1,
    title: "Polévka",
    ingredients: [
      { amount: 2, unit: "ks", item: "mrkev" },
      { amount: 1, unit: "ks", item: "cibule" },
      { amount: 1, unit: "lžička", item: "sůl" },
    ],
  },
  {
    id: 2,
    title: "Rizoto",
    ingredients: [
      { amount: 1, unit: "ks", item: "mrkve" },
      { amount: 200, unit: "g", item: "rýže" },
    ],
  },
];

describe("shopping list helpers", () => {
  it("normalizes legacy shopping values and filters invalid entries", () => {
    assert.deepEqual(normalizeShoppingState(null), { overrides: {}, customItems: [] });

    const legacy = normalizeShoppingState("  Banány  \n\nMléko");
    assert.equal(legacy.overrides.constructor, Object);
    assert.deepEqual(
      legacy.customItems.map(({ label, done }) => ({ label, done })),
      [
        { label: "Banány", done: false },
        { label: "Mléko", done: false },
      ],
    );

    assert.deepEqual(
      normalizeShoppingState({
        overrides: { mrkev: true, cibule: { done: false }, "": true, rýže: "bad" },
        customItems: [{ id: "x", label: "Káva", done: true }, { label: " " }],
      }),
      {
        overrides: { mrkev: { done: true }, cibule: { done: false } },
        customItems: [{ id: "x", label: "Káva", done: true }],
      },
    );
  });

  it("builds day shopping items without pantry ingredients and respects day selections", () => {
    const day = {
      lunch: [1, 2],
      shoppingSelections: { mrkev: false },
    };

    assert.deepEqual(getDayShoppingItems(day, recipes), [
      { id: "cibule", key: "cibule", label: "Cibule", selected: true },
      { id: "mrkev", key: "mrkev", label: "Mrkev", selected: false },
      { id: "ryze", key: "ryze", label: "Rýže", selected: true },
    ]);
  });

  it("keeps only valid generated overrides and preserves custom items", () => {
    const week = [
      { lunch: [1], shoppingSelections: {} },
      { dinner: [2], shoppingSelections: { ryze: false } },
    ];
    const shopping = {
      overrides: {
        cibule: { done: true },
        "stará-položka": { done: true },
        ryze: { done: true },
      },
      customItems: [{ id: "custom-1", label: "Čaj", done: false }],
    };

    const state = getShoppingStateForWeek(shopping, week, recipes);
    assert.deepEqual(Object.keys(state.overrides), ["cibule"]);
    assert.deepEqual(state.customItems, [{ id: "custom-1", label: "Čaj", done: false }]);

    const items = getShoppingListItems(shopping, week, recipes);
    assert.deepEqual(
      items.generatedItems.map(({ key, done }) => ({ key, done })),
      [
        { key: "cibule", done: true },
        { key: "mrkev", done: false },
      ],
    );
    assert.deepEqual(items.customItems, [
      { id: "custom-1", label: "Čaj", done: false, kind: "custom" },
    ]);
  });

  it("summarizes generated and custom shopping items", () => {
    const summary = getShoppingListSummary(
      {
        overrides: { cibule: { done: true } },
        customItems: [{ id: "custom-1", label: "Čaj", done: false }],
      },
      [{ lunch: [1], shoppingSelections: {} }],
      recipes,
    );

    assert.deepEqual(summary, {
      totalCount: 3,
      toBuyCount: 2,
      doneCount: 1,
    });
  });
});
