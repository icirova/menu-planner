import "./style.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { AllergenTags } from "../../components/AllergenTags/index.jsx";
import { SuitabilityTags } from "../../components/SuitabilityTags/index.jsx";
import { ServingsControl } from "../../components/ServingsControl/index.jsx";
import { IngredientsList } from "../../components/IngredientsList/index.jsx";
import { RecipeTags } from "../../components/RecipeTags/index.jsx";
import { MAX_SERVINGS, MIN_SERVINGS } from "../../constants/servings.js";
import { areRecipeIdsEqual, normalizeRecipeIdValue } from "../../utils/recipeIds.js";
import { isSeedRecipe } from "../../utils/recipeSource.js";
import { resolveImageSrc } from "../../utils/resolveImageSrc.js";
import { ConfirmDialog } from "../../components/ConfirmDialog/index.jsx";
import { RecipeDetailGallery } from "./RecipeDetailGallery.jsx";
import { RecipeDetailHero } from "./RecipeDetailHero.jsx";
import { useLightbox } from "./useLightbox.js";

const DEFAULT_SERVINGS = 4;
const KILOJOULES_PER_KILOCALORIE = 4.184;

const clampServings = (value) => {
  const servings = Number.parseInt(value, 10);
  if (!Number.isFinite(servings)) return MIN_SERVINGS;
  return Math.min(Math.max(servings, MIN_SERVINGS), MAX_SERVINGS);
};

const formatEnergyLabel = (calories) => {
  if (calories == null) return "- kcal na 1 porci";

  const kilojoules = Math.round(calories * KILOJOULES_PER_KILOCALORIE);
  const formattedKilojoules = kilojoules.toLocaleString("cs-CZ");

  return `${calories} kcal / ${formattedKilojoules} kJ na 1 porci`;
};

export const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipeList, deleteRecipe } = useOutletContext();
  const routeRecipeId = normalizeRecipeIdValue(id);
  const recipeDetail =
    recipeList.find((recipe) => areRecipeIdsEqual(recipe.id, routeRecipeId ?? id)) ?? null;
  const [desiredServings, setDesiredServings] = useState(4);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const gallery = (recipeDetail?.photo_urls ?? []).map(resolveImageSrc);
  const { closeLightbox, lightboxIndex, openLightbox, showNext, showPrevious } = useLightbox(
    gallery.length,
  );

  useEffect(() => {
    if (recipeDetail) {
      setDesiredServings(recipeDetail.servings || DEFAULT_SERVINGS);
    }
  }, [recipeDetail]);

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

  if (!recipeDetail) {
    return (
      <div className="main recipe-detail-page">
        <section className="recipe-detail-page__panel">
          <p>Recept nebyl nalezen.</p>
          <Link to="/recipes" className="button">
            Zpět na recepty
          </Link>
        </section>
      </div>
    );
  }

  const coverSrc = resolveImageSrc(recipeDetail.photo_urls?.[0] || "/notes.webp");
  const energyLabel = formatEnergyLabel(recipeDetail.calories);
  const preTasks = recipeDetail.preTasks ?? [];
  const isLockedRecipe = isSeedRecipe(recipeDetail);
  const canEditRecipe = !isLockedRecipe;
  const canDeleteRecipe = !isLockedRecipe;
  const handleDelete = async () => {
    if (!canDeleteRecipe) return;

    setIsDeleting(true);
    const deleted = await deleteRecipe(recipeDetail.id);
    setIsDeleting(false);
    if (!deleted) {
      window.alert("Recept se nepodařilo smazat. Zkus aplikaci obnovit.");
      return;
    }
    setIsDeleteDialogOpen(false);
    navigate("/recipes");
  };

  return (
    <div className="main recipe-detail-page">
      <RecipeDetailHero
        canDeleteRecipe={canDeleteRecipe}
        canEditRecipe={canEditRecipe}
        coverSrc={coverSrc}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
        recipe={recipeDetail}
      />

      <div className="recipe-detail-page__top-grid">
        <section className="recipe-detail-page__panel">
          <div className="recipe-detail__section-header">
            <h2>Suroviny</h2>
          </div>

          <div className="recipe-detail__subsection">
            <IngredientsList
              ingredients={recipeDetail.ingredients}
              baseServings={recipeDetail.servings}
              desiredServings={desiredServings}
            />
          </div>
        </section>

        <section className="recipe-detail-page__panel">
          <div className="recipe-detail__section-header">
            <h2>Přehled</h2>
          </div>

          <div className="recipe-detail__content recipe-detail__subsection">
            <div className="recipe-detail__section">
              <p className="recipe-detail__description recipe-detail__description--meta">
                {energyLabel}
              </p>
              <ServingsControl
                value={desiredServings}
                onChange={(e) => setDesiredServings(clampServings(e.target.value))}
              />
            </div>

            {recipeDetail.suitableFor?.length > 0 && (
              <div className="recipe-detail__section">
                <h3 className="recipe-detail__subtitle">Vhodné pro:</h3>
                <SuitabilityTags suitability={recipeDetail.suitableFor} />
              </div>
            )}

            {recipeDetail.tags?.length > 0 && (
              <div className="recipe-detail__section">
                <h3 className="recipe-detail__subtitle">Tagy:</h3>
                <RecipeTags tags={recipeDetail.tags} />
              </div>
            )}

            {recipeDetail.allergens?.length > 0 && (
              <div className="recipe-detail__section">
                <h3 className="recipe-detail__subtitle">Alergeny:</h3>
                <AllergenTags allergens={recipeDetail.allergens} />
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="recipe-detail-page__panel">
        <div className="recipe-detail__section-header">
          <h2>Postup</h2>
        </div>
        <div className="recipe-detail__section recipe-detail__subsection">
          <p className="recipe-detail__description">{recipeDetail.workflow}</p>
        </div>
      </section>

      {preTasks.length > 0 && (
        <section className="recipe-detail-page__panel">
          <div className="recipe-detail__section-header">
            <h2>Příprava</h2>
          </div>
          <div className="recipe-detail__section recipe-detail__subsection">
            <ul className="recipe-detail__list">
              {preTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <RecipeDetailGallery
        gallery={gallery}
        lightboxIndex={lightboxIndex}
        onCloseLightbox={closeLightbox}
        onNext={showNext}
        onOpenLightbox={openLightbox}
        onPrevious={showPrevious}
        recipeId={recipeDetail.id}
        recipeTitle={recipeDetail.title}
      />

      {isDeleteDialogOpen && (
        <ConfirmDialog
          busyLabel="Mazání..."
          confirmLabel="Smazat recept"
          id="recipe-delete-title"
          isBusy={isDeleting}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          text={`Opravdu chceš smazat recept „${recipeDetail.title}“? Tato akce se nedá vrátit zpět.`}
          title="Smazat recept?"
        />
      )}
    </div>
  );
};
