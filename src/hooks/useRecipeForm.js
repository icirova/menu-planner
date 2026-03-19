import { useEffect, useRef, useState } from "react";

const createEmptyFormState = () => ({
  name: "Název receptu",
  servings: "4",
  selectedTags: [],
  selectedSuitableFor: [],
  selectedAllergens: [],
  calories: "0",
  method: "",
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
  servings: String(recipe.servings ?? 4),
  selectedTags: recipe.tags ?? [],
  selectedSuitableFor: recipe.suitableFor ?? [],
  selectedAllergens: recipe.allergens ?? [],
  calories: String(recipe.calories ?? 0),
  method: recipe.workflow ?? "",
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

const normalizeSuitableFor = (items) => {
  const values = [...items];

  if (values.includes("veganské")) {
    return values.filter((item) => item !== "bez mléka");
  }

  return values;
};

export const useRecipeForm = ({
  recipeToEdit,
  isEditMode,
  addRecipe,
  updateRecipe,
  navigate,
}) => {
  const [form, setForm] = useState(createEmptyFormState);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEditMode) {
      setForm(createEmptyFormState());
      return;
    }

    if (!recipeToEdit || recipeToEdit.source !== "custom") return;

    setForm(mapRecipeToFormState(recipeToEdit));
  }, [isEditMode, recipeToEdit]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "selectedSuitableFor"
        ? normalizeSuitableFor(toggleInArray(prev[field], value))
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
    if (!window.confirm("Opravdu chceš odebrat tento obrázek?")) return;

    setForm((prev) => {
      const nextPhotos = [...prev.photos];
      nextPhotos.splice(index, 1);
      return { ...prev, photos: nextPhotos };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const servings = Number(form.servings);

    if (!Number.isFinite(servings) || servings < 1) {
      window.alert("Počet porcí musí být alespoň 1.");
      return;
    }

    const newRecipe = {
      id: recipeToEdit?.id ?? Date.now(),
      title: form.name.trim(),
      servings,
      tags: form.selectedTags,
      photo_urls: form.photos.map((photo) => photo.url),
      ingredients: form.ingredients.filter((ingredient) => ingredient.item.trim() !== ""),
      suitableFor: normalizeSuitableFor(form.selectedSuitableFor),
      calories: Number(form.calories),
      workflow: form.method.trim(),
      allergens: form.selectedAllergens,
    };

    if (isEditMode) {
      updateRecipe(newRecipe);
      navigate(`/recipe-detail/${newRecipe.id}`);
      return;
    }

    addRecipe(newRecipe);
    navigate("/recipes");
  };

  return {
    fileInputRef,
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
