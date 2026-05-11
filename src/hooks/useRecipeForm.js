import { useEffect, useRef, useState } from "react";
import {
  isAllergenOptionDisabled,
  normalizeAllergenValuesForSuitability,
  normalizeSuitableForValues,
} from "../constants/recipeMetadata.js";
import { prepareCustomRecipeForRuntime } from "../storage/recipesStorage.js";
import {
  buildRecipeDraft,
  createEmptyRecipeFormState,
  mapRecipeToFormState,
  normalizeRecipeFormIngredients,
  toggleInArray,
  validateRecipeForm,
} from "../utils/recipeFormDraft.js";
import { isSeedRecipe } from "../utils/recipeSource.js";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const useRecipeForm = ({
  recipeToEdit,
  isEditMode,
  addRecipe,
  updateRecipe,
  navigate,
  onValidationError,
}) => {
  const [form, setForm] = useState(createEmptyRecipeFormState);
  const fileInputRef = useRef(null);
  const ingredientInputsRef = useRef(null);

  useEffect(() => {
    if (!isEditMode) {
      setForm(createEmptyRecipeFormState());
      return;
    }

    if (!recipeToEdit) return;

    setForm(mapRecipeToFormState(recipeToEdit));
  }, [isEditMode, recipeToEdit]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (field, value) => {
    setForm((prev) => {
      if (field === "selectedSuitableFor") {
        const selectedSuitableFor = normalizeSuitableForValues(toggleInArray(prev[field], value));

        return {
          ...prev,
          selectedSuitableFor,
          selectedAllergens: normalizeAllergenValuesForSuitability(
            prev.selectedAllergens,
            selectedSuitableFor,
          ),
        };
      }

      if (field === "selectedAllergens") {
        if (isAllergenOptionDisabled(value, prev.selectedSuitableFor)) {
          return {
            ...prev,
            selectedAllergens: normalizeAllergenValuesForSuitability(
              prev.selectedAllergens,
              prev.selectedSuitableFor,
            ),
          };
        }

        return {
          ...prev,
          selectedAllergens: toggleInArray(prev[field], value),
        };
      }

      return {
        ...prev,
        [field]: toggleInArray(prev[field], value),
      };
    });
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

    const fieldValidation = validateRecipeForm(submittedForm, { validateIngredients: false });
    if (!fieldValidation.isValid) {
      reportValidationError(fieldValidation.message, fieldValidation.fieldName);
      return;
    }

    const flushedIngredients = ingredientInputsRef.current?.flushDraftIngredient(
      submittedForm.ingredients,
    );
    if (flushedIngredients === null) return;

    const nextIngredients = flushedIngredients ?? submittedForm.ingredients;
    const normalizedIngredients = normalizeRecipeFormIngredients(nextIngredients);
    const fullValidation = validateRecipeForm(submittedForm, { normalizedIngredients });

    if (!fullValidation.isValid) {
      reportValidationError(fullValidation.message, fullValidation.fieldName);
      if (fullValidation.focusIngredient) {
        ingredientInputsRef.current?.focusItemField();
      }
      return;
    }

    const draftRecipe = buildRecipeDraft(submittedForm, {
      calories: fullValidation.calories,
      normalizedIngredients: fullValidation.normalizedIngredients,
      recipeToEdit,
      servings: fullValidation.servings,
    });

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
