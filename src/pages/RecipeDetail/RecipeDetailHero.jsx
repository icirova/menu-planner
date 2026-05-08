import { Link } from "react-router-dom";

export const RecipeDetailHero = ({
  canDeleteRecipe,
  canEditRecipe,
  coverSrc,
  onDeleteClick,
  recipe,
}) => {
  const heroTags = (recipe.tags ?? []).filter(Boolean).join(" • ");
  const heroSuitableFor = (recipe.suitableFor ?? []).filter(Boolean).join(" • ");

  return (
    <section className="recipe-detail-page__hero page-hero page-hero--split page-hero--image-layer">
      <img className="page-hero__image" src={coverSrc} alt="" aria-hidden="true" />
      <div className="recipe-detail-page__hero-content page-hero__content">
        <Link to="/recipes" className="recipe-detail-page__hero-back">
          <span className="recipe-detail-page__hero-back-arrow" aria-hidden="true">
            ←
          </span>
          Zpět na recepty
        </Link>

        <div className="recipe-detail-page__hero-header">
          <h1 className="page-hero__title">{recipe.title}</h1>

          <div className="recipe-detail-page__hero-aside page-hero__aside">
            {(heroTags || heroSuitableFor) && (
              <div className="recipe-detail-page__hero-meta">
                <div className="recipe-detail-page__hero-meta-text">
                  {heroTags && <p className="page-hero__text">{heroTags}</p>}
                  {heroSuitableFor && <p className="page-hero__text">{heroSuitableFor}</p>}
                </div>
              </div>
            )}

            <div className="recipe-detail__actions page-hero__actions">
              {canEditRecipe && (
                <Link to={`/recipe-form/${recipe.id}/edit`} className="button button--ghost">
                  Upravit recept
                </Link>
              )}
              {canDeleteRecipe && (
                <button type="button" className="button button--danger" onClick={onDeleteClick}>
                  Smazat recept
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
