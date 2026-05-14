export const RecipeDetailGallery = ({
  gallery,
  lightboxIndex,
  onCloseLightbox,
  onNext,
  onOpenLightbox,
  onPrevious,
  recipeTitle,
  recipeId,
}) => {
  if (gallery.length === 0) return null;

  return (
    <>
      <section className="recipe-detail-page__panel">
        <div className="recipe-detail__section-header">
          <h2>Galerie</h2>
        </div>
        <div className="recipe-detail__gallery recipe-detail__subsection">
          {gallery.map((src, index) => (
            <button
              key={`${recipeId}-${index}`}
              className="recipe-detail__thumb-btn"
              onClick={() => onOpenLightbox(index)}
              aria-label={`Otevřít foto ${index + 1}`}
            >
              <img
                src={src}
                alt={`${recipeTitle} – foto ${index + 1}`}
                className="recipe-detail__thumb"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div className="lightbox" onClick={onCloseLightbox} role="dialog" aria-modal="true">
          <button className="lightbox__close" onClick={onCloseLightbox} aria-label="Zavřít">
            ×
          </button>
          {gallery.length > 1 && (
            <>
              <button
                className="lightbox__nav lightbox__nav--prev"
                onClick={(event) => {
                  event.stopPropagation();
                  onPrevious();
                }}
                aria-label="Předchozí"
              >
                ‹
              </button>
              <button
                className="lightbox__nav lightbox__nav--next"
                onClick={(event) => {
                  event.stopPropagation();
                  onNext();
                }}
                aria-label="Další"
              >
                ›
              </button>
            </>
          )}
          <img
            className="lightbox__img"
            src={gallery[lightboxIndex]}
            alt={`${recipeTitle} – foto ${lightboxIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
