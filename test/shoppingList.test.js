import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PANTRY_ITEMS } from "../src/constants/pantry.js";
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

  it("ignores water without showing it in pantry items", () => {
    const day = {
      breakfast: [3],
      shoppingSelections: {},
    };
    const waterRecipes = [
      { id: 3, title: "Těsto", ingredients: [{ amount: 100, unit: "g", item: "vlažná voda" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, waterRecipes), []);
    assert.equal(PANTRY_ITEMS.some((item) => item.label === "voda"), false);
  });

  it("keeps wholegrain spelt flour separate and groups its aliases", () => {
    const day = {
      breakfast: [3, 4, 5],
      shoppingSelections: {},
    };
    const flourRecipes = [
      { id: 3, title: "Chléb", ingredients: [{ amount: 100, unit: "g", item: "celozrnná mouka" }] },
      {
        id: 4,
        title: "Špaldový chléb",
        ingredients: [{ amount: 200, unit: "g", item: "celozrnná špaldová mouka" }],
      },
      {
        id: 5,
        title: "Špaldové housky",
        ingredients: [{ amount: 200, unit: "g", item: "celozrnná špalda" }],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, flourRecipes), [
      { id: "celozrnna-mouka", key: "celozrnna-mouka", label: "Celozrnná mouka", selected: true },
      {
        id: "celozrnna-spaldova-mouka",
        key: "celozrnna-spaldova-mouka",
        label: "Celozrnná špaldová mouka",
        selected: true,
      },
    ]);
  });

  it("groups plain spelt aliases under plain spelt flour", () => {
    const day = {
      breakfast: [3, 4],
      shoppingSelections: {},
    };
    const speltRecipes = [
      {
        id: 3,
        title: "Chléb",
        ingredients: [{ amount: 300, unit: "g", item: "hladká špaldová mouka" }],
      },
      {
        id: 4,
        title: "Housky",
        ingredients: [{ amount: 300, unit: "g", item: "hladká špalda" }],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, speltRecipes), [
      {
        id: "hladka-spaldova-mouka",
        key: "hladka-spaldova-mouka",
        label: "Hladká špaldová mouka",
        selected: true,
      },
    ]);
  });

  it("groups plant oil under oil", () => {
    const day = {
      lunch: [3, 4],
      shoppingSelections: {},
    };
    const oilRecipes = [
      { id: 3, title: "Polévka", ingredients: [{ amount: 1, unit: "lžíce", item: "olej" }] },
      {
        id: 4,
        title: "Rizoto",
        ingredients: [{ amount: 2, unit: "lžíce", item: "rostlinný olej" }],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, oilRecipes), [
      { id: "olej", key: "olej", label: "Olej", selected: true },
    ]);
  });

  it("groups ground paprika under sweet paprika", () => {
    const day = {
      lunch: [3, 4],
      shoppingSelections: {},
    };
    const paprikaRecipes = [
      { id: 3, title: "Guláš", ingredients: [{ amount: 1, unit: "lžíce", item: "sladká paprika" }] },
      { id: 4, title: "Tacos", ingredients: [{ amount: 1, unit: "lžíce", item: "mletá paprika" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, paprikaRecipes), [
      { id: "sladka-paprika", key: "sladka-paprika", label: "Sladká paprika", selected: true },
    ]);
  });

  it("groups baking powder aliases under baking powder", () => {
    const day = {
      snack1: [3, 4, 5, 6],
      shoppingSelections: {},
    };
    const bakingRecipes = [
      {
        id: 3,
        title: "Buchta",
        ingredients: [{ amount: 1, unit: "balení", item: "prášek do pečiva" }],
      },
      {
        id: 4,
        title: "Muffiny",
        ingredients: [{ amount: 1, unit: "balení", item: "kypřící prášek" }],
      },
      {
        id: 5,
        title: "Perník",
        ingredients: [{ amount: 1, unit: "balení", item: "prášek do pečení" }],
      },
      {
        id: 6,
        title: "Bábovka",
        ingredients: [{ amount: 1, unit: "balení", item: "prdopeč" }],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, bakingRecipes), [
      { id: "prasek-do-peciva", key: "prasek-do-peciva", label: "Prášek do pečiva", selected: true },
    ]);
  });

  it("groups pudding powder aliases under pudding", () => {
    const day = {
      snack1: [3, 4, 5],
      shoppingSelections: {},
    };
    const puddingRecipes = [
      { id: 3, title: "Pudink", ingredients: [{ amount: 1, unit: "balení", item: "pudink v prášku" }] },
      { id: 4, title: "Krém", ingredients: [{ amount: 1, unit: "balení", item: "pudink" }] },
      {
        id: 5,
        title: "Koláč",
        ingredients: [{ amount: 1, unit: "balení", item: "pudinkový prášek" }],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, puddingRecipes), [
      { id: "pudink", key: "pudink", label: "Pudink", selected: true },
    ]);
  });

  it("shows bread rolls in plural", () => {
    const day = {
      dinner: [3],
      shoppingSelections: {},
    };
    const rollRecipes = [
      { id: 3, title: "Hot dog", ingredients: [{ amount: 4, unit: "ks", item: "rohlík" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, rollRecipes), [
      { id: "rohliky", key: "rohliky", label: "Rohlíky", selected: true },
    ]);
  });

  it("groups generic salad leaves under leaf lettuce", () => {
    const day = {
      lunch: [3, 4, 5, 6],
      shoppingSelections: {},
    };
    const saladRecipes = [
      { id: 3, title: "Burger", ingredients: [{ amount: 2, unit: "listy", item: "salát" }] },
      { id: 4, title: "Sendvič", ingredients: [{ amount: 2, unit: "ks", item: "listy salátu" }] },
      { id: 5, title: "Wrap", ingredients: [{ amount: 2, unit: "listy", item: "ledový salát" }] },
      { id: 6, title: "Bageta", ingredients: [{ amount: 2, unit: "listy", item: "římský salát" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, saladRecipes), [
      { id: "listovy-salat", key: "listovy-salat", label: "Listový salát", selected: true },
    ]);
  });

  it("groups cottage cheese under cottage", () => {
    const day = {
      breakfast: [3, 4],
      shoppingSelections: {},
    };
    const cottageRecipes = [
      { id: 3, title: "Pomazánka", ingredients: [{ amount: 200, unit: "g", item: "cottage sýr" }] },
      { id: 4, title: "Svačina", ingredients: [{ amount: 200, unit: "g", item: "cottage" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, cottageRecipes), [
      { id: "cottage", key: "cottage", label: "Cottage", selected: true },
    ]);
  });

  it("groups grated cheese under cheese and grated specific cheese under its type", () => {
    const day = {
      dinner: [3, 4, 5, 6],
      shoppingSelections: {},
    };
    const cheeseRecipes = [
      { id: 3, title: "Lasagne", ingredients: [{ amount: 150, unit: "g", item: "strouhaný sýr" }] },
      { id: 4, title: "Sendvič", ingredients: [{ amount: 2, unit: "plátky", item: "sýr" }] },
      { id: 5, title: "Řízek", ingredients: [{ amount: 4, unit: "plátky", item: "eidam" }] },
      { id: 6, title: "Těstoviny", ingredients: [{ amount: 100, unit: "g", item: "strouhaný eidam" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, cheeseRecipes), [
      { id: "eidam", key: "eidam", label: "Eidam", selected: true },
      { id: "syr", key: "syr", label: "Sýr", selected: true },
    ]);
  });

  it("groups ripe bananas under bananas", () => {
    const day = {
      snack2: [3, 4],
      shoppingSelections: {},
    };
    const bananaRecipes = [
      { id: 3, title: "Lívance", ingredients: [{ amount: 2, unit: "ks", item: "banány" }] },
      {
        id: 4,
        title: "Banánový chlebíček",
        ingredients: [{ amount: 3, unit: "ks", item: "zralé banány" }],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, bananaRecipes), [
      { id: "banany", key: "banany", label: "Banány", selected: true },
    ]);
  });

  it("groups fresh yeast and yeast aliases under yeast", () => {
    const day = {
      breakfast: [3, 4, 5],
      shoppingSelections: {},
    };
    const yeastRecipes = [
      { id: 3, title: "Donuty", ingredients: [{ amount: 15, unit: "g", item: "čerstvé droždí" }] },
      { id: 4, title: "Focaccia", ingredients: [{ amount: 21, unit: "g", item: "droždí" }] },
      { id: 5, title: "Chléb", ingredients: [{ amount: 8, unit: "g", item: "kvasnice" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, yeastRecipes), [
      { id: "drozdi", key: "drozdi", label: "Droždí", selected: true },
    ]);
  });

  it("groups dried yeast aliases under dried yeast", () => {
    const day = {
      dinner: [3, 4],
      shoppingSelections: {},
    };
    const driedYeastRecipes = [
      { id: 3, title: "Pizza", ingredients: [{ amount: 7, unit: "g", item: "sušené droždí" }] },
      { id: 4, title: "Chléb", ingredients: [{ amount: 7, unit: "g", item: "sušené kvasnice" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, driedYeastRecipes), [
      { id: "susene-drozdi", key: "susene-drozdi", label: "Sušené droždí", selected: true },
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
