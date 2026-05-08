import "./style.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { IngredientInputs } from "../../components/IngredientInputs/index.jsx";
import {
  isSuitabilityOptionDisabled,
  SUITABILITY_OPTIONS,
} from "../../constants/recipeMetadata.js";
import { useRecipeForm } from "../../hooks/useRecipeForm.js";
import { areRecipeIdsEqual, normalizeRecipeIdValue } from "../../utils/recipeIds.js";
import { isSeedRecipe } from "../../utils/recipeSource.js";
import { resolveImageSrc } from "../../utils/resolveImageSrc.js";
import { ConfirmDialog } from "../../components/ConfirmDialog/index.jsx";
import { RecipeBasicFields } from "./RecipeBasicFields.jsx";
import { RecipeClassificationFields } from "./RecipeClassificationFields.jsx";
import { RecipeFormEmptyState } from "./RecipeFormEmptyState.jsx";
import { RecipeFormHero } from "./RecipeFormHero.jsx";
import { RecipeFormLockedState } from "./RecipeFormLockedState.jsx";
import { RecipePhotoInputs } from "./RecipePhotoInputs.jsx";
import { RecipeTextFields } from "./RecipeTextFields.jsx";
import { useRecipePreTasks } from "./useRecipePreTasks.js";

export const RecipeForm = () => {
  const [formMessage, setFormMessage] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipeList, addRecipe, updateRecipe, deleteRecipe } = useOutletContext();
  const routeRecipeId = normalizeRecipeIdValue(id);
  const recipeToEdit = id
    ? recipeList.find((recipe) => areRecipeIdsEqual(recipe.id, routeRecipeId ?? id))
    : null;
  const isEditMode = Boolean(id);
  const isDefaultRecipeEdit = isEditMode && isSeedRecipe(recipeToEdit);
  const canDeleteRecipe = isEditMode && recipeToEdit && !isSeedRecipe(recipeToEdit);
  const {
    fileInputRef,
    ingredientInputsRef,
    form,
    setField,
    toggleSelection,
    setIngredients,
    handlePhotosChange,
    removePhotoAt,
    handleSubmit,
  } = useRecipeForm({
    recipeToEdit,
    isEditMode,
    addRecipe,
    updateRecipe,
    navigate,
    onValidationError: setFormMessage,
  });

  const suitabilityOptions = SUITABILITY_OPTIONS.map((option) => ({
    ...option,
    disabled: isSuitabilityOptionDisabled(option.value, form.selectedSuitableFor),
  }));
  const {
    addPreTask,
    getSubmittedPreTasksText,
    handlePreTaskKeyDown,
    preTaskDraft,
    preTaskItems,
    removePreTask,
    setPreTaskDraft,
  } = useRecipePreTasks({
    preTasksText: form.preTasksText,
    setPreTasksText: (value) => setField("preTasksText", value),
  });

  useEffect(() => {
    if (!isDeleteDialogOpen) return;

    const onKey = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        setIsDeleteDialogOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDeleteDialogOpen, isDeleting]);

  const handleFormSubmit = (event) => {
    setFormMessage("");
    handleSubmit(event, { preTasksText: getSubmittedPreTasksText() });
  };
  const handleDelete = async () => {
    if (!canDeleteRecipe) return;

    setIsDeleting(true);
    const deleted = await deleteRecipe(recipeToEdit.id);
    setIsDeleting(false);
    if (!deleted) {
      setFormMessage("Recept se nepodařilo smazat. Zkus aplikaci obnovit.");
      return;
    }
    setIsDeleteDialogOpen(false);
    navigate("/recipes");
  };
  const heroImageSrc =
    isEditMode && recipeToEdit
      ? resolveImageSrc(recipeToEdit.photo_urls?.[0] || "/notes.webp")
      : "/notes.webp";

  if (isEditMode && !recipeToEdit) {
    return <RecipeFormEmptyState />;
  }

  if (isDefaultRecipeEdit) {
    return <RecipeFormLockedState heroImageSrc={heroImageSrc} recipeId={recipeToEdit.id} />;
  }

  return (
    <div className="main recipe-form-page">
      <RecipeFormHero
        canDeleteRecipe={canDeleteRecipe}
        heroImageSrc={heroImageSrc}
        isEditMode={isEditMode}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
        recipeTitle={recipeToEdit?.title}
      />

      {formMessage && (
        <p className="recipe-form-page__message" role="alert">
          {formMessage}
        </p>
      )}

      <form
        id="form"
        className="form recipe-form-page__form"
        onSubmit={handleFormSubmit}
        noValidate
      >
        <RecipeBasicFields form={form} setField={setField} />

        <RecipeClassificationFields
          form={form}
          suitabilityOptions={suitabilityOptions}
          toggleSelection={toggleSelection}
        />

        <section className="recipe-form-page__panel">
          <div className="recipe-form-page__section-header">
            <h2>Suroviny</h2>
          </div>

          <IngredientInputs
            ref={ingredientInputsRef}
            ingredients={form.ingredients}
            setIngredients={setIngredients}
            onValidationError={setFormMessage}
          />
        </section>

        <RecipeTextFields
          addPreTask={addPreTask}
          form={form}
          handlePreTaskKeyDown={handlePreTaskKeyDown}
          preTaskDraft={preTaskDraft}
          preTaskItems={preTaskItems}
          removePreTask={removePreTask}
          setField={setField}
          setPreTaskDraft={setPreTaskDraft}
        />

        <RecipePhotoInputs
          fileInputRef={fileInputRef}
          handlePhotosChange={handlePhotosChange}
          photos={form.photos}
          removePhotoAt={removePhotoAt}
        />

        <div className="recipe-form-page__footer-actions">
          <Link to="/recipes" className="button button--ghost">
            Zrušit
          </Link>
          <button type="submit" className="button button--new-recipe">
            {isEditMode ? "Uložit změny" : "Vytvořit recept"}
          </button>
        </div>
      </form>

      {isDeleteDialogOpen && (
        <ConfirmDialog
          busyLabel="Mazání..."
          confirmLabel="Smazat recept"
          id="recipe-form-delete-title"
          isBusy={isDeleting}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          text={`Opravdu chceš smazat recept „${recipeToEdit.title}“? Tato akce se nedá vrátit zpět.`}
          title="Smazat recept?"
        />
      )}
    </div>
  );
};
