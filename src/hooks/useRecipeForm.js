import { useEffect, useRef, useState } from "react";
import { normalizeSuitableForValues } from "../constants/recipeMetadata";
import { prepareCustomRecipeForRuntime } from "../storage/recipesStorage";
import { createNumericId } from "../utils/createId";
import { normalizeRecipePreTasks } from "../utils/normalizeRecipePreTasks";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const servings = Number(form.servings);
    const trimmedCalories = form.calories.trim();
    const calories = trimmedCalories === "" ? null : Number(trimmedCalories);

    if (!Number.isFinite(servings) || servings < 1) {
      window.alert("Počet porcí musí být alespoň 1.");
      return;
    }

    if (trimmedCalories !== "" && (!Number.isFinite(calories) || calories < 0)) {
      window.alert("Kalorie musí být 0 nebo kladné číslo.");
      return;
    }

    const nextIngredients =
      ingredientInputsRef.current?.flushDraftIngredient(form.ingredients) ?? form.ingredients;

    const draftRecipe = {
      id: recipeToEdit?.id ?? createNumericId(),
      createdAt: recipeToEdit?.createdAt ?? new Date().toISOString(),
      title: form.name.trim(),
      servings,
      tags: form.selectedTags,
      photo_urls: form.photos.map((photo) => photo.url),
      ingredients: nextIngredients.filter((ingredient) => ingredient.item.trim() !== ""),
      suitableFor: normalizeSuitableForValues(form.selectedSuitableFor),
      calories,
      workflow: form.method.trim(),
      preTasks: normalizeRecipePreTasks(form.preTasksText),
      allergens: form.selectedAllergens,
    };

    try {
      const newRecipe = await prepareCustomRecipeForRuntime(draftRecipe);

      if (isEditMode) {
        updateRecipe(newRecipe);
        navigate(`/recipe-detail/${newRecipe.id}`);
        return;
      }

      addRecipe(newRecipe);
      navigate("/recipes");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Nepodařilo se připravit recept k uložení.";
      window.alert(message);
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
