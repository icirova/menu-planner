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

  it("shows requested pantry items and ignores their ingredient aliases", () => {
    const pantryLabels = PANTRY_ITEMS.map((item) => item.label);

    assert.deepEqual(
      PANTRY_ITEMS.map((item) => item.category),
      [
        "lednice",
        "lednice",
        "lednice",
        "lednice",
        "lednice",
        "lednice",
        "lednice",
        "lednice",
        "pečení",
        "pečení",
        "pečení",
        "pečení",
        "pečení",
        "pečení",
        "pečení",
        "snídaně a svačiny",
        "snídaně a svačiny",
        "snídaně a svačiny",
        "snídaně a svačiny",
        "snídaně a svačiny",
        "snídaně a svačiny",
        "snídaně a svačiny",
        "suché zásoby",
        "suché zásoby",
        "dochucení",
        "dochucení",
        "suché zásoby",
        "suché zásoby",
        "suché zásoby",
        "suché zásoby",
        "suché zásoby",
        "suché zásoby",
      ],
    );
    assert.equal(pantryLabels.includes("bobkový list"), false);
    assert.equal(pantryLabels.includes("nové koření"), false);
    assert.equal(pantryLabels.includes("pepř"), false);
    assert.deepEqual(
      [
        "olej",
        "sůl",
        "hrubozrnná sůl",
        "koření",
        "cukr",
        "hnědý cukr",
        "prášek do pečiva",
        "jedlá soda",
        "med",
        "javorový sirup",
        "datlový sirup",
        "ovesné vločky",
        "granola",
        "semínka",
        "rozinky",
        "svačinky",
        "ovoce",
        "strouhanka",
        "chléb",
        "těstoviny",
        "rýžové nudle",
        "vejce",
        "rostlinné mléko",
        "česnek",
        "cibule",
        "zelenina",
        "droždí",
        "ocet",
        "jablečný ocet",
        "sojová omáčka",
        "nori",
        "burákové máslo",
      ].every((label) => pantryLabels.includes(label)),
      true,
    );
    assert.equal(pantryLabels.includes("nori vločky"), false);

    const day = {
      lunch: [3],
      shoppingSelections: {},
    };
    const pantryRecipes = [
      {
        id: 3,
        title: "Spížový test",
        ingredients: [
          { amount: 1, unit: "lžíce", item: "rostlinný olej" },
          { amount: 1, unit: "lžička", item: "sůl" },
          { amount: 1, unit: "lžička", item: "hrubozrnná sůl" },
          { amount: 1, unit: "lžíce", item: "cukr" },
          { amount: 1, unit: "lžíce", item: "hnědý cukr" },
          { amount: 1, unit: "balení", item: "prášek do pečiva" },
          { amount: 1, unit: "lžička", item: "kypřící prášek" },
          { amount: 1, unit: "lžička", item: "jedlá soda" },
          { amount: 1, unit: "lžíce", item: "med" },
          { amount: 1, unit: "lžíce", item: "javorový sirup" },
          { amount: 1, unit: "lžíce", item: "datlový sirup" },
          { amount: 1, unit: "lžička", item: "kari koření" },
          { amount: 1, unit: "lžička", item: "mletý kmín" },
          { amount: 1, unit: "lžička", item: "drcený kmín" },
          { amount: 1, unit: "ks", item: "bobkový list" },
          { amount: 1, unit: "ks", item: "pepř celý" },
          { amount: 1, unit: "lžička", item: "pepř mletý" },
          { amount: 1, unit: "ks", item: "nové koření" },
          { amount: 1, unit: "lžička", item: "tymián" },
          { amount: 1, unit: "lžička", item: "sladká paprika" },
          { amount: 1, unit: "lžička", item: "bazalka (sušená)" },
          { amount: 1, unit: "lžička", item: "sušený česnek" },
          { amount: 1, unit: "lžička", item: "skořice" },
          { amount: 1, unit: "lžička", item: "sušená petrželka" },
          { amount: 1, unit: "lžička", item: "římský kmín" },
          { amount: 50, unit: "g", item: "ovesné vločky" },
          { amount: 50, unit: "g", item: "granola" },
          { amount: 1, unit: "lžíce", item: "chia semínka" },
          { amount: 20, unit: "g", item: "rozinky" },
          { amount: 1, unit: "ks", item: "svačinky" },
          { amount: 1, unit: "hrst", item: "ovoce" },
          { amount: 50, unit: "g", item: "strouhanka" },
          { amount: 2, unit: "plátky", item: "chléb" },
          { amount: 2, unit: "plátky", item: "toastový chléb" },
          { amount: 2, unit: "plátky", item: "celozrnný chléb" },
          { amount: 100, unit: "g", item: "těstoviny" },
          { amount: 100, unit: "g", item: "rýžové nudle" },
          { amount: 1, unit: "ks", item: "vejce" },
          { amount: 200, unit: "ml", item: "rostlinné mléko" },
          { amount: 2, unit: "stroužky", item: "česnek" },
          { amount: 1, unit: "ks", item: "cibule" },
          { amount: 1, unit: "ks", item: "cibuli" },
          { amount: 300, unit: "g", item: "zelenina" },
          { amount: 15, unit: "g", item: "čerstvé droždí" },
          { amount: 1, unit: "lžíce", item: "ocet" },
          { amount: 1, unit: "lžíce", item: "jablečný ocet" },
          { amount: 1, unit: "lžíce", item: "sójová omáčka" },
          { amount: 1, unit: "plát", item: "nori" },
          { amount: 1, unit: "plát", item: "řasa nori" },
          { amount: 1, unit: "lžíce", item: "nori vločky" },
          { amount: 1, unit: "lžíce", item: "burákové máslo" },
          { amount: 1, unit: "lžíce", item: "arašídové máslo" },
          { amount: 1, unit: "ks", item: "mrkev" },
        ],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, pantryRecipes), [
      { id: "mrkev", key: "mrkev", label: "Mrkev", selected: true },
      { id: "nori-vlocky", key: "nori-vlocky", label: "Nori vločky", selected: true },
    ]);
  });

  it("keeps special spice mixes in the shopping list", () => {
    const day = {
      dinner: [3],
      shoppingSelections: {},
    };
    const spiceRecipes = [
      {
        id: 3,
        title: "Speciální koření",
        ingredients: [
          { amount: 1, unit: "lžíce", item: "grilovací koření" },
          { amount: 1, unit: "lžíce", item: "perníkové koření" },
        ],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, spiceRecipes), [
      { id: "grilovaci-koreni", key: "grilovaci-koreni", label: "Grilovací koření", selected: true },
      { id: "pernikove-koreni", key: "pernikove-koreni", label: "Perníkové koření", selected: true },
    ]);
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

  it("ignores plant oil as pantry oil", () => {
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

    assert.deepEqual(getDayShoppingItems(day, oilRecipes), []);
  });

  it("ignores ground paprika as pantry sweet paprika", () => {
    const day = {
      lunch: [3, 4],
      shoppingSelections: {},
    };
    const paprikaRecipes = [
      { id: 3, title: "Guláš", ingredients: [{ amount: 1, unit: "lžíce", item: "sladká paprika" }] },
      { id: 4, title: "Tacos", ingredients: [{ amount: 1, unit: "lžíce", item: "mletá paprika" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, paprikaRecipes), []);
  });

  it("ignores baking powder aliases as pantry baking powder", () => {
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

    assert.deepEqual(getDayShoppingItems(day, bakingRecipes), []);
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

  it("shows alternative ingredients with slash in the shopping list", () => {
    const day = {
      dinner: [3, 4, 5],
      shoppingSelections: {},
    };
    const alternativeRecipes = [
      { id: 3, title: "Mozeček", ingredients: [{ amount: 2, unit: "lžíce", item: "máslo nebo olej" }] },
      { id: 4, title: "Smažení", ingredients: [{ amount: 2, unit: "lžíce", item: "máslo/olej" }] },
      {
        id: 5,
        title: "Pomazánka",
        ingredients: [{ amount: 1, unit: "lžíce", item: "pažitka/petrželka" }],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, alternativeRecipes), [
      { id: "maslo-nebo-olej", key: "maslo-nebo-olej", label: "Máslo / olej", selected: true },
      {
        id: "pazitka-nebo-petrzelka",
        key: "pazitka-nebo-petrzelka",
        label: "Pažitka / petrželka",
        selected: true,
      },
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

  it("groups chopped nuts under nuts", () => {
    const day = {
      snack1: [3, 4],
      shoppingSelections: {},
    };
    const nutRecipes = [
      { id: 3, title: "Granola", ingredients: [{ amount: 100, unit: "g", item: "nasekané ořechy" }] },
      { id: 4, title: "Koláč", ingredients: [{ amount: 100, unit: "g", item: "ořechy" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, nutRecipes), [
      { id: "orechy", key: "orechy", label: "Ořechy", selected: true },
    ]);
  });

  it("groups dried cranberries under cranberries", () => {
    const day = {
      snack1: [3, 4],
      shoppingSelections: {},
    };
    const cranberryRecipes = [
      { id: 3, title: "Paštika", ingredients: [{ amount: 1, unit: "lžíce", item: "brusinky" }] },
      {
        id: 4,
        title: "Chléb",
        ingredients: [{ amount: 2, unit: "lžíce", item: "sušené brusinky" }],
      },
    ];

    assert.deepEqual(getDayShoppingItems(day, cranberryRecipes), [
      { id: "brusinky", key: "brusinky", label: "Brusinky", selected: true },
    ]);
  });

  it("ignores fresh yeast aliases as pantry yeast", () => {
    const day = {
      breakfast: [3, 4, 5],
      shoppingSelections: {},
    };
    const yeastRecipes = [
      { id: 3, title: "Donuty", ingredients: [{ amount: 15, unit: "g", item: "čerstvé droždí" }] },
      { id: 4, title: "Focaccia", ingredients: [{ amount: 21, unit: "g", item: "droždí" }] },
      { id: 5, title: "Chléb", ingredients: [{ amount: 8, unit: "g", item: "kvasnice" }] },
    ];

    assert.deepEqual(getDayShoppingItems(day, yeastRecipes), []);
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
        mrkev: { done: true },
        "stará-položka": { done: true },
        ryze: { done: true },
      },
      customItems: [{ id: "custom-1", label: "Čaj", done: false }],
    };

    const state = getShoppingStateForWeek(shopping, week, recipes);
    assert.deepEqual(Object.keys(state.overrides), ["mrkev"]);
    assert.deepEqual(state.customItems, [{ id: "custom-1", label: "Čaj", done: false }]);

    const items = getShoppingListItems(shopping, week, recipes);
    assert.deepEqual(
      items.generatedItems.map(({ key, done }) => ({ key, done })),
      [{ key: "mrkev", done: true }],
    );
    assert.deepEqual(items.customItems, [
      { id: "custom-1", label: "Čaj", done: false, kind: "custom" },
    ]);
  });

  it("summarizes generated and custom shopping items", () => {
    const summary = getShoppingListSummary(
      {
        overrides: { mrkev: { done: true } },
        customItems: [{ id: "custom-1", label: "Čaj", done: false }],
      },
      [{ lunch: [1], shoppingSelections: {} }],
      recipes,
    );

    assert.deepEqual(summary, {
      totalCount: 2,
      toBuyCount: 1,
      doneCount: 1,
    });
  });
});
