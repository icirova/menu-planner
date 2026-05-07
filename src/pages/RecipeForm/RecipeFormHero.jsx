import { Link } from "react-router-dom";

export const RecipeFormHero = ({
  canDeleteRecipe,
  heroImageSrc,
  isEditMode,
  onDeleteClick,
  recipeTitle,
}) => (
  <section
    className="recipe-form-page__hero page-hero page-hero--split page-hero--image-layer"
  >
    <img className="page-hero__image" src={heroImageSrc} alt="" aria-hidden="true" />
    <div className="recipe-form-page__hero-content page-hero__content">
      <Link to="/recipes" className="recipe-form-page__back-link">
        <span aria-hidden="true">←</span>
        Zpět do katalogu
      </Link>
      <h1 className="page-hero__title">
        {isEditMode ? `Upravit: ${recipeTitle}` : "Vložit recept"}
      </h1>
      <p className="page-hero__text">
        {isEditMode
          ? "Tady můžeš recept upravit, doplnit a připravit ho pro katalog i týdenní plán."
          : "Tady můžeš vložit nový recept a připravit ho pro katalog i týdenní plán."}
      </p>
      {canDeleteRecipe && (
        <div className="page-hero__actions recipe-form-page__hero-actions">
          <button
            type="button"
            className="button button--danger"
            onClick={onDeleteClick}
          >
            Smazat recept
          </button>
        </div>
      )}
    </div>
  </section>
);
