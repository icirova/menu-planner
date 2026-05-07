import { Link } from "react-router-dom";

export const RecipeFormLockedState = ({ heroImageSrc, recipeId }) => (
  <div className="main recipe-form-page">
    <section
      className="recipe-form-page__hero page-hero page-hero--split page-hero--image-layer"
    >
      <img className="page-hero__image" src={heroImageSrc} alt="" aria-hidden="true" />
      <div className="recipe-form-page__hero-content page-hero__content">
        <p className="page-hero__eyebrow">Editor receptů</p>
        <h1 className="page-hero__title">Recept je zamčený</h1>
        <p className="page-hero__text">
          Default recepty jsou v demo projektu jen pro prohlížení a plánování.
        </p>
      </div>
    </section>

    <section className="recipe-form-page__panel recipe-form-page__panel--empty">
      <p>Tenhle vložený recept nejde upravovat.</p>
      <Link to={`/recipe-detail/${recipeId}`} className="button button--ghost">
        Zpět na detail receptu
      </Link>
    </section>
  </div>
);
