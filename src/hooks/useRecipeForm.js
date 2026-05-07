import { useEffect, useRef, useState } from "react";
import { normalizeSuitableForValues } from "../constants/recipeMetadata";
import { prepareCustomRecipeForRuntime } from "../storage/recipesStorage";
import { createNumericId } from "../utils/createId";
import { getCanonicalIngredientName } from "../utils/ingredientNames";
import { normalizeRecipePreTasks } from "../utils/normalizeRecipePreTasks";
import { isSeedRecipe } from "../utils/recipeSource";

const DEFAULT_SERVINGS = 4;

const createEmptyFormState = () => ({
  name: "",
  servings: "",
  selectedTags: [],
  selectedSuitableFor: [],
  selectedAllergens: [],
  calories: "",
  method: "",
  preTasksText: "",
  ingredients: [],
  photos: [],
});

const mapRecipePhotos = (recipe) =>
  (recipe.photo_urls ?? []).map((url, index) => ({
    url,
    name: `obrazek-${index + 1}`,
  }));

const mapRecipeToFormState = (recipe) => ({
  name: recipe.title ?? "",
  servings: String(recipe.servings ?? DEFAULT_SERVINGS),
  selectedTags: recipe.tags ?? [],
  selectedSuitableFor: recipe.suitableFor ?? [],
  selectedAllergens: recipe.allergens ?? [],
  calories: recipe.calories == null ? "" : String(recipe.calories),
  method: recipe.workflow ?? "",
  preTasksText: normalizeRecipePreTasks(recipe.preTasks).join("\n"),
  ingredients: recipe.ingredients ?? [],
  photos: mapRecipePhotos(recipe),
});

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const toggleInArray = (items, value) =>
  items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];

export const useRecipeForm = ({
  recipeToEdit,
  isEditMode,
  addRecipe,
  updateRecipe,
  navigate,
  onValidationError,
}) => {
  const [form, setForm] = useState(createEmptyFormState);
  const fileInputRef = useRef(null);
  const ingredientInputsRef = useRef(null);

  useEffect(() => {
    if (!isEditMode) {
      setForm(createEmptyFormState());
      return;
    }

    if (!recipeToEdit) return;

    setForm(mapRecipeToFormState(recipeToEdit));
  }, [isEditMode, recipeToEdit]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "selectedSuitableFor"
        ? normalizeSuitableForValues(toggleInArray(prev[field], value))
        : toggleInArray(prev[field], value),
    }));
  };

  const handlePhotosChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const newItems = await Promise.all(
        files.map(async (file) => ({
          url: await readFileAsDataUrl(file),
          name: file.name,
        })),
      );

      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newItems],
      }));
    } catch (error) {
      console.error("Nepodařilo se načíst obrázek.", error);
    }

    e.target.value = "";
  };

  const removePhotoAt = (index) => {
    setForm((prev) => {
      const nextPhotos = [...prev.photos];
      nextPhotos.splice(index, 1);
      return { ...prev, photos: nextPhotos };
    });
  };

  const handleSubmit = async (e, formOverrides = {}) => {
    e.preventDefault();
    const submittedForm = { ...form, ...formOverrides };
    const reportValidationError = (message, fieldName) => {
      onValidationError?.(message);
      if (fieldName) {
        e.currentTarget?.elements?.namedItem(fieldName)?.focus();
      }
    };

    if (isEditMode && isSeedRecipe(recipeToEdit)) {
      reportValidationError("Default recepty v demo projektu nejde upravovat.");
      return;
    }

    if (!submittedForm.name.trim()) {
      reportValidationError("Vyplň název receptu.", "name");
      return;
    }

    const servings = Number(submittedForm.servings);
    const trimmedCalories = submittedForm.calories.trim();
    const calories = trimmedCalories === "" ? null : Number(trimmedCalories);

    if (!Number.isFinite(servings) || servings < 1) {
      reportValidationError("Počet porcí musí být alespoň 1.", "servings");
      return;
    }

    if (trimmedCalories !== "" && (!Number.isFinite(calories) || calories < 0)) {
      reportValidationError("Kalorie musí být 0 nebo kladné číslo.", "calories");
      return;
    }

    if (!submittedForm.method.trim()) {
      reportValidationError("Vyplň postup přípravy.", "method");
      return;
    }

    const flushedIngredients = ingredientInputsRef.current?.flushDraftIngredient(submittedForm.ingredients);
    if (flushedIngredients === null) return;

    const nextIngredients = flushedIngredients ?? submittedForm.ingredients;
    const normalizedIngredients = nextIngredients
      .map((ingredient) => ({
        ...ingredient,
        item: getCanonicalIngredientName(ingredient.item),
      }))
      .filter((ingredient) => ingredient.item !== "");

    if (normalizedIngredients.length === 0) {
      reportValidationError("Přidej alespoň jednu surovinu.");
      ingredientInputsRef.current?.focusItemField();
      return;
    }

    const draftRecipe = {
      id: recipeToEdit?.id ?? createNumericId(),
      createdAt: recipeToEdit?.createdAt ?? new Date().toISOString(),
      title: submittedForm.name.trim(),
      servings,
      tags: submittedForm.selectedTags,
      photo_urls: submittedForm.photos.map((photo) => photo.url),
      ingredients: normalizedIngredients,
      suitableFor: normalizeSuitableForValues(submittedForm.selectedSuitableFor),
      calories,
      workflow: submittedForm.method.trim(),
      preTasks: normalizeRecipePreTasks(submittedForm.preTasksText),
      allergens: submittedForm.selectedAllergens,
    };

    try {
      const newRecipe = await prepareCustomRecipeForRuntime(draftRecipe);

      if (isEditMode) {
        updateRecipe(newRecipe);
        navigate("/recipes", { state: { focusRecipeId: newRecipe.id } });
        return;
      }

      addRecipe(newRecipe);
      navigate("/recipes", { state: { focusRecipeId: newRecipe.id } });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Nepodařilo se připravit recept k uložení.";
      reportValidationError(message);
    }
  };

  return {
    fileInputRef,
    ingredientInputsRef,
    form,
    setField,
    toggleSelection,
    setIngredients: (updater) => {
      setForm((prev) => ({
        ...prev,
        ingredients: typeof updater === "function" ? updater(prev.ingredients) : updater,
      }));
    },
    handlePhotosChange,
    removePhotoAt,
    handleSubmit,
  };
};
