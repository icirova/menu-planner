import "./style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AllergenTags } from "../../components/AllergenTags/index";
import { SuitabilityTags } from "../../components/SuitabilityTags/index";
import { ServingsControl } from "../../components/ServingsControl/index";
import { IngredientsList } from "../../components/IngredientsList/index";
import { RecipeTags } from "../../components/RecipeTags/index";
import { useOutletContext } from "react-router-dom";
import { areRecipeIdsEqual, normalizeRecipeIdValue } from "../../utils/recipeIds";
import { isSeedRecipe } from "../../utils/recipeSource";
import { resolveImageSrc } from "../../utils/resolveImageSrc";

const DEFAULT_SERVINGS = 4;

export const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipeList, deleteRecipe } = useOutletContext();
  const routeRecipeId = normalizeRecipeIdValue(id);
  const recipeDetail = recipeList.find((recipe) => areRecipeIdsEqual(recipe.id, routeRecipeId ?? id)) ?? null;
  const [desiredServings, setDesiredServings] = useState(4);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Lightbox hooky
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = zavřeno
  const galleryLength = Math.max((recipeDetail?.photo_urls?.length || 0) - 1, 0); // bez coveru

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (i === 0 ? galleryLength - 1 : i - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i === galleryLength - 1 ? 0 : i + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, galleryLength]);

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
          <Link to="/recipes" className="button recipe-detail__backLink">Zpět na recepty</Link>
        </section>
      </div>
    );
  }

  // Data pro obrázky (cover + galerie)
  const coverSrc = resolveImageSrc(recipeDetail.photo_urls?.[0] || "/image/placeholder.png");
  const gallery = (recipeDetail.photo_urls ?? []).slice(1).map(resolveImageSrc);

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i === 0 ? gallery.length - 1 : i - 1));
  const next = () => setLightboxIndex((i) => (i === gallery.length - 1 ? 0 : i + 1));
  const caloriesLabel = recipeDetail.calories == null ? "-" : recipeDetail.calories;
  const preTasks = recipeDetail.preTasks ?? [];
  const heroTags = (recipeDetail.tags ?? []).filter(Boolean).join(" • ");
  const heroSuitableFor = (recipeDetail.suitableFor ?? []).filter(Boolean).join(" • ");
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
      <section
        className="recipe-detail-page__hero page-hero page-hero--split"
        style={{ "--page-hero-image": `url("${coverSrc}")` }}
      >
        <div className="recipe-detail-page__heroContent page-hero__content">
          <Link to="/recipes" className="recipe-detail-page__heroBack">
            <span className="recipe-detail-page__heroBackArrow" aria-hidden="true">←</span>
            Zpět na recepty
          </Link>

          <div className="recipe-detail-page__heroHeader">
            <h1 className="page-hero__title">{recipeDetail.title}</h1>

            <div className="recipe-detail-page__heroAside page-hero__aside">
              {(heroTags || heroSuitableFor) && (
                <div className="recipe-detail-page__heroMeta">
                  <div className="recipe-detail-page__heroMetaText">
                    {heroTags && (
                      <p className="page-hero__text">{heroTags}</p>
                    )}
                    {heroSuitableFor && (
                      <p className="page-hero__text">
                        {heroSuitableFor}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="recipe-detail__actions page-hero__actions">
                {canEditRecipe && (
                  <Link
                    to={`/recipe-form/${recipeDetail.id}/edit`}
                    className="button button--ghost"
                  >
                    Upravit recept
                  </Link>
                )}
                {canDeleteRecipe && (
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Smazat recept
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="recipe-detail-page__topGrid">
        <section className="recipe-detail-page__panel">
          <div className="recipe-detail__sectionHeader">
            <h2>Suroviny</h2>
          </div>

          <IngredientsList
            ingredients={recipeDetail.ingredients}
            baseServings={recipeDetail.servings}
            desiredServings={desiredServings}
          />
        </section>

        <section className="recipe-detail-page__panel recipe-detail-page__panel--summary">
          <div className="recipe-detail__sectionHeader">
            <h2>Přehled</h2>
          </div>

          <div className="recipe-detail__content">
            <div className="recipe-detail__section">
              <p className="recipe-detail__description recipe-detail__description--meta">
                {caloriesLabel} kcal na 1 porci
              </p>
              <ServingsControl
                value={desiredServings}
                onChange={(e) => setDesiredServings(parseInt(e.target.value, 10) || 1)}
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
        <div className="recipe-detail__sectionHeader">
          <h2>Postup</h2>
        </div>
        <div className="recipe-detail__section">
          <p className="recipe-detail__description">{recipeDetail.workflow}</p>
        </div>
      </section>

      {preTasks.length > 0 && (
        <section className="recipe-detail-page__panel">
          <div className="recipe-detail__sectionHeader">
            <h2>Předpříprava</h2>
          </div>
          <div className="recipe-detail__section">
            <ul className="recipe-detail__list">
              {preTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="recipe-detail-page__panel">
          <div className="recipe-detail__sectionHeader">
            <h2>Galerie</h2>
          </div>
          <div className="recipe-detail__gallery">
            {gallery.map((src, i) => (
              <button
                key={`${recipeDetail.id}-${i}`}
                className="recipe-detail__thumb-btn"
                onClick={() => openLightbox(i)}
                aria-label={`Otevřít foto ${i + 2}`}
              >
                <img
                  src={src}
                  alt={`${recipeDetail.title} – foto ${i + 2}`}
                  className="recipe-detail__thumb"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <div
          className="lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="lightbox__close"
            onClick={closeLightbox}
            aria-label="Zavřít"
          >
            ×
          </button>
          {gallery.length > 1 && (
            <>
              <button
                className="lightbox__nav lightbox__nav--prev"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Předchozí"
              >
                ‹
              </button>
              <button
                className="lightbox__nav lightbox__nav--next"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Další"
              >
                ›
              </button>
            </>
          )}
          <img
            className="lightbox__img"
            src={gallery[lightboxIndex]}
            alt={`${recipeDetail.title} – foto ${lightboxIndex + 2}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {isDeleteDialogOpen && (
        <div
          className="recipe-confirm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recipe-delete-title"
          onClick={() => {
            if (!isDeleting) {
              setIsDeleteDialogOpen(false);
            }
          }}
        >
          <div className="recipe-confirm__panel" onClick={(event) => event.stopPropagation()}>
            <h2 id="recipe-delete-title" className="recipe-confirm__title">
              Smazat recept?
            </h2>
            <p className="recipe-confirm__text">
              Opravdu chceš smazat recept „{recipeDetail.title}“? Tato akce se nedá vrátit zpět.
            </p>
            <div className="recipe-confirm__actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Zrušit
              </button>
              <button
                type="button"
                className="button button--danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Mazání..." : "Smazat recept"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
