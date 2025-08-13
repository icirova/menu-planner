import "./style.css";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AllergenTags } from "../../components/AllergenTags/index";
import { SuitabilityTags } from "../../components/SuitabilityTags/index";
import { ServingsControl } from "../../components/ServingsControl/index";
import { IngredientsList } from "../../components/IngredientsList/index";
import { RecipeTags } from "../../components/RecipeTags/index";
import { useOutletContext } from "react-router-dom";
import { resolveImageSrc } from "../../utils/resolveImageSrc";

export const RecipeDetail = () => {
  const { id } = useParams();
  const { recipeList } = useOutletContext();
  const [recipeDetail, setRecipeDetail] = useState(null);
  const [desiredServings, setDesiredServings] = useState(4);
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
    const foundRecipe = recipeList.find((r) => r.id === parseInt(id, 10));
    if (foundRecipe) {
      setRecipeDetail(foundRecipe);
      setDesiredServings(foundRecipe.servings || 4);
    } else {
      console.warn("Recept nebyl nalezen.");
    }
  }, [id, recipeList]);

  if (!recipeDetail) {
    return (
      <div className="main">
        <p>Načítání...</p>
        <Link to="/recipes" className="menu__item">Zpět</Link>
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

  return (
    <div className="main">
      <h1 className="title">{recipeDetail.title}</h1>

      <div className="recipe-detail">
        <div className="recipe-detail__img">
          <img
            src={coverSrc || "/placeholder.webp"}
            alt={recipeDetail.title}
            className="recipe-detail__image"
          />
        </div>

        <div className="recipe-detail__text">
          {recipeDetail.calories && (
            <p className="recipe-detail__description">
              ⚖️ {recipeDetail.calories} kcal na 1 porci
            </p>
          )}

          <ServingsControl
            value={desiredServings}
            onChange={(e) => setDesiredServings(parseInt(e.target.value, 10) || 1)}
          />

          <IngredientsList
            ingredients={recipeDetail.ingredients}
            baseServings={recipeDetail.servings}
            desiredServings={desiredServings}
          />

          <h2 className="recipe-detail__subtitle">Postup:</h2>
          <p className="recipe-detail__description">{recipeDetail.workflow}</p>

          {recipeDetail.allergens?.length > 0 && (
            <AllergenTags allergens={recipeDetail.allergens} />
          )}

          {recipeDetail.suitableFor?.length > 0 && (
            <SuitabilityTags suitability={recipeDetail.suitableFor} />
          )}

          {recipeDetail.tags?.length > 0 && <RecipeTags tags={recipeDetail.tags} />}
        </div>
      </div>

      {gallery.length > 0 && (
        <>
          <h2 className="recipe-detail__subtitle">Galerie</h2>
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
        </>
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

      <Link to="/recipes" className="menu__item button">Zpět</Link>
    </div>
  );
};
