import { Link } from "react-router-dom";

export const RecipeFormEmptyState = () => (
  <div className="main recipe-form-page">
    <section
      className="recipe-form-page__hero page-hero page-hero--split"
      style={{ "--page-hero-image": 'url("/notes.webp")' }}
    >
      <div className="recipe-form-page__hero-content page-hero__content">
        <p className="page-hero__eyebrow">Editor receptů</p>
        <h1 className="page-hero__title">Úprava receptu</h1>
        <p className="page-hero__text">Požadovaný recept se v katalogu nenašel.</p>
      </div>
    </section>

    <section className="recipe-form-page__panel recipe-form-page__panel--empty">
      <p>Recept nebyl nalezen.</p>
      <Link to="/recipes" className="button button--ghost">
        Zpět na recepty
      </Link>
    </section>
  </div>
);
