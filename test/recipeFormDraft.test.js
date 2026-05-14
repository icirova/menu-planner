import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRecipeDraft,
  createEmptyRecipeFormState,
  mapRecipeToFormState,
  normalizeRecipeFormIngredients,
  validateRecipeForm,
} from "../src/utils/recipeFormDraft.js";

const validForm = {
  ...createEmptyRecipeFormState(),
  name: " Bramborová polévka ",
  servings: "4",
  selectedTags: ["polévky"],
  selectedSuitableFor: ["veganské", "bez mléka"],
  selectedAllergens: ["celer"],
  calories: "120",
  method: " Uvařit. ",
  preTasksText: "  Namočit čočku\n\nNakrájet zeleninu ",
  ingredients: [
    { amount: "2", unit: "ks", item: "brambor" },
    { amount: "", unit: "", item: " " },
  ],
  photos: [{ url: "/imgRecipe/test.webp", name: "test.webp" }],
};

describe("recipe form draft helpers", () => {
  it("maps a recipe to form state", () => {
    assert.deepEqual(
      mapRecipeToFormState({
        title: "Recept",
        servings: 2,
        tags: ["obědy"],
        suitableFor: ["bez lepku"],
        allergens: ["lepek"],
        calories: 300,
        workflow: "Postup",
        preTasks: ["Připravit"],
        ingredients: [{ item: "mrkev" }],
        photo_urls: ["/a.webp", "/b.webp"],
      }),
      {
        name: "Recept",
        servings: "2",
        selectedTags: ["obědy"],
        selectedSuitableFor: ["bez lepku"],
        selectedAllergens: [],
        calories: "300",
        method: "Postup",
        preTasksText: "Připravit",
        ingredients: [{ item: "mrkev" }],
        photos: [
          { url: "/a.webp", name: "obrazek-1" },
          { url: "/b.webp", name: "obrazek-2" },
        ],
      },
    );
  });

  it("validates required fields and numeric values", () => {
    assert.deepEqual(
      validateRecipeForm({ ...validForm, name: "" }, { validateIngredients: false }),
      {
        isValid: false,
        message: "Vyplň název receptu.",
        fieldName: "name",
      },
    );

    assert.deepEqual(
      validateRecipeForm({ ...validForm, servings: "0" }, { validateIngredients: false }),
      {
        isValid: false,
        message: "Počet porcí musí být alespoň 1.",
        fieldName: "servings",
      },
    );

    assert.deepEqual(
      validateRecipeForm({ ...validForm, servings: "101" }, { validateIngredients: false }),
      {
        isValid: false,
        message: "Počet porcí může být maximálně 100.",
        fieldName: "servings",
      },
    );

    assert.deepEqual(
      validateRecipeForm({ ...validForm, calories: "-1" }, { validateIngredients: false }),
      {
        isValid: false,
        message: "Kalorie musí být 0 nebo kladné číslo.",
        fieldName: "calories",
      },
    );

    assert.deepEqual(
      validateRecipeForm({ ...validForm, method: " " }, { validateIngredients: false }),
      {
        isValid: false,
        message: "Vyplň postup přípravy.",
        fieldName: "method",
      },
    );
  });

  it("normalizes and validates ingredients", () => {
    const normalizedIngredients = normalizeRecipeFormIngredients(validForm.ingredients);

    assert.deepEqual(normalizedIngredients, [{ amount: "2", unit: "ks", item: "brambory" }]);

    assert.deepEqual(validateRecipeForm({ ...validForm, ingredients: [] }), {
      isValid: false,
      message: "Přidej alespoň jednu surovinu.",
      focusIngredient: true,
    });
  });

  it("builds a new recipe draft from validated form values", () => {
    const normalizedIngredients = normalizeRecipeFormIngredients(validForm.ingredients);
    const draft = buildRecipeDraft(validForm, {
      calories: 120,
      idFactory: () => 123,
      normalizedIngredients,
      now: () => "2026-05-07T10:00:00.000Z",
      servings: 4,
    });

    assert.deepEqual(draft, {
      id: 123,
      createdAt: "2026-05-07T10:00:00.000Z",
      title: "Bramborová polévka",
      servings: 4,
      tags: ["polévky"],
      photo_urls: ["/imgRecipe/test.webp"],
      ingredients: normalizedIngredients,
      suitableFor: ["veganské"],
      calories: 120,
      workflow: "Uvařit.",
      preTasks: ["Namočit čočku", "Nakrájet zeleninu"],
      allergens: ["celer"],
    });
  });

  it("preserves edited recipe identity and creation date", () => {
    const draft = buildRecipeDraft(validForm, {
      normalizedIngredients: normalizeRecipeFormIngredients(validForm.ingredients),
      recipeToEdit: { id: 55, createdAt: "2025-01-01T00:00:00.000Z" },
    });

    assert.equal(draft.id, 55);
    assert.equal(draft.createdAt, "2025-01-01T00:00:00.000Z");
  });
});
