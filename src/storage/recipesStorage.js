import { isSeedRecipe } from "../utils/recipeSource.js";
import {
  normalizeCustomRecipe,
  normalizeRecipeForRuntime,
  normalizeSeedRecipe,
} from "./recipeNormalization.js";
import { readSessionJson, writeSessionJson } from "./sessionJsonStorage.js";
import { recipes as defaultRecipes } from "../../data/recipes.js";

const CUSTOM_RECIPES_STORAGE_KEY = "customRecipes";
const CUSTOM_RECIPES_SESSION_KEY = "customRecipesSession";
const CUSTOM_RECIPES_DB_NAME = "menuPlanner";
const CUSTOM_RECIPES_DB_VERSION = 1;
const CUSTOM_RECIPES_STORE_NAME = "json";

const getIndexedDb = () => (typeof indexedDB === "undefined" ? null : indexedDB);

const openCustomRecipesDb = () =>
  new Promise((resolve, reject) => {
    const dbFactory = getIndexedDb();
    if (!dbFactory) {
      resolve(null);
      return;
    }

    const request = dbFactory.open(CUSTOM_RECIPES_DB_NAME, CUSTOM_RECIPES_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CUSTOM_RECIPES_STORE_NAME)) {
        db.createObjectStore(CUSTOM_RECIPES_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const readIndexedDbJson = async (key) => {
  let db = null;
  try {
    db = await openCustomRecipesDb();
  } catch (error) {
    return {
      value: undefined,
      warning:
        error instanceof Error && error.message
          ? `Nepodařilo se otevřít IndexedDB. ${error.message}`
          : "Nepodařilo se otevřít IndexedDB.",
      isSupported: true,
    };
  }

  if (!db) return { value: undefined, warning: null, isSupported: false };

  return new Promise((resolve) => {
    const transaction = db.transaction(CUSTOM_RECIPES_STORE_NAME, "readonly");
    const store = transaction.objectStore(CUSTOM_RECIPES_STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () =>
      resolve({ value: request.result, warning: null, isSupported: true });
    request.onerror = () =>
      resolve({
        value: undefined,
        warning:
          request.error instanceof Error && request.error.message
            ? `Nepodařilo se načíst recepty z IndexedDB. ${request.error.message}`
            : "Nepodařilo se načíst recepty z IndexedDB.",
        isSupported: true,
      });
  }).finally(() => db.close());
};

const deleteIndexedDbJson = async (key) => {
  let db = null;
  try {
    db = await openCustomRecipesDb();
  } catch (error) {
    return {
      warning:
        error instanceof Error && error.message
          ? `Nepodařilo se otevřít IndexedDB. ${error.message}`
          : "Nepodařilo se otevřít IndexedDB.",
      isSupported: true,
    };
  }

  if (!db) return { warning: null, isSupported: false };

  return new Promise((resolve) => {
    const transaction = db.transaction(CUSTOM_RECIPES_STORE_NAME, "readwrite");
    const store = transaction.objectStore(CUSTOM_RECIPES_STORE_NAME);
    const request = store.delete(key);

    request.onsuccess = () => resolve({ warning: null, isSupported: true });
    request.onerror = () =>
      resolve({
        warning:
          request.error instanceof Error && request.error.message
            ? `Nepodařilo se vyčistit recepty z IndexedDB. ${request.error.message}`
            : "Nepodařilo se vyčistit recepty z IndexedDB.",
        isSupported: true,
      });
  }).finally(() => db.close());
};

const writeIndexedDbJson = async (key, value) => {
  let db = null;
  try {
    db = await openCustomRecipesDb();
  } catch (error) {
    return {
      warning:
        error instanceof Error && error.message
          ? `Nepodařilo se otevřít IndexedDB. ${error.message}`
          : "Nepodařilo se otevřít IndexedDB.",
      isSupported: true,
    };
  }

  if (!db) return { warning: null, isSupported: false };

  return new Promise((resolve) => {
    const transaction = db.transaction(CUSTOM_RECIPES_STORE_NAME, "readwrite");
    const store = transaction.objectStore(CUSTOM_RECIPES_STORE_NAME);
    const request = store.put(value, key);

    request.onsuccess = () => resolve({ warning: null, isSupported: true });
    request.onerror = () =>
      resolve({
        warning:
          request.error instanceof Error && request.error.message
            ? `Nepodařilo se uložit recepty do IndexedDB. ${request.error.message}`
            : "Nepodařilo se uložit recepty do IndexedDB.",
        isSupported: true,
      });
  }).finally(() => db.close());
};

const ensureCustomRecipesSession = async () => {
  try {
    if (sessionStorage.getItem(CUSTOM_RECIPES_SESSION_KEY)) return { warning: null };

    sessionStorage.setItem(CUSTOM_RECIPES_SESSION_KEY, "1");
    const deleteResult = await deleteIndexedDbJson(CUSTOM_RECIPES_STORAGE_KEY);
    return { warning: deleteResult.warning };
  } catch (error) {
    return {
      warning:
        error instanceof Error && error.message
          ? `Nepodařilo se připravit relaci receptů. ${error.message}`
          : "Nepodařilo se připravit relaci receptů.",
    };
  }
};

export { normalizeCustomRecipe };

export const prepareCustomRecipeForRuntime = async (recipe) => {
  return normalizeRecipeForRuntime(recipe);
};

const serializeCustomRecipe = async (recipe) => {
  return normalizeRecipeForRuntime(recipe);
};

const mergeRecipeLists = (...recipeLists) => {
  const merged = new Map();

  recipeLists.flat().forEach((recipe) => {
    merged.set(recipe.id, recipe);
  });

  return Array.from(merged.values());
};

export const loadCustomRecipes = async () => {
  const sessionResult = await ensureCustomRecipesSession();
  const indexedDbResult = await readIndexedDbJson(CUSTOM_RECIPES_STORAGE_KEY);
  const sessionStorageResult =
    indexedDbResult.value === undefined
      ? readSessionJson(CUSTOM_RECIPES_STORAGE_KEY, [])
      : { value: indexedDbResult.value, warning: null };
  const storedRecipes = sessionStorageResult.value;
  const warning = sessionResult.warning || indexedDbResult.warning || sessionStorageResult.warning;
  const normalizedDefaultRecipes = defaultRecipes.map((recipe) => normalizeSeedRecipe(recipe));
  const normalizedStoredRecipes = Array.isArray(storedRecipes)
    ? await Promise.all(storedRecipes.map((recipe) => prepareCustomRecipeForRuntime(recipe)))
    : [];

  return {
    recipes: mergeRecipeLists(normalizedStoredRecipes, normalizedDefaultRecipes),
    warning,
  };
};

export const saveCustomRecipes = async (recipes) => {
  const result = {
    warning: null,
  };
  const persistedRecipes = await Promise.all(
    recipes
      .filter((recipe) => !isSeedRecipe(recipe))
      .map((recipe) => serializeCustomRecipe(recipe)),
  );

  const indexedDbResult = await writeIndexedDbJson(CUSTOM_RECIPES_STORAGE_KEY, persistedRecipes);
  if (!indexedDbResult.isSupported || indexedDbResult.warning) {
    const sessionResult = writeSessionJson(CUSTOM_RECIPES_STORAGE_KEY, persistedRecipes, "recepty");
    result.warning = indexedDbResult.warning || sessionResult.warning;
    return result;
  }

  result.warning = null;

  return result;
};
