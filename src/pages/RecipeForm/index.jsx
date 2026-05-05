import "./style.css";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { IngredientInputs } from "../../components/IngredientInputs/index";
import {
  ALLERGEN_OPTIONS,
  isSuitabilityOptionDisabled,
  SUITABILITY_OPTIONS,
  TAG_OPTIONS,
} from "../../constants/recipeMetadata";
import { useRecipeForm } from "../../hooks/useRecipeForm";
import { areRecipeIdsEqual, normalizeRecipeIdValue } from "../../utils/recipeIds";
import { resolveImageSrc } from "../../utils/resolveImageSrc";

export const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipeList, addRecipe, updateRecipe } = useOutletContext();
  const routeRecipeId = normalizeRecipeIdValue(id);
  const recipeToEdit = id
    ? recipeList.find((recipe) => areRecipeIdsEqual(recipe.id, routeRecipeId ?? id))
    : null;
  const isEditMode = Boolean(id);
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
  });

  const suitabilityOptions = SUITABILITY_OPTIONS.map((option) => ({
    ...option,
    disabled: isSuitabilityOptionDisabled(option.value, form.selectedSuitableFor),
  }));
  const heroImageSrc =
    isEditMode && recipeToEdit
      ? resolveImageSrc(recipeToEdit.photo_urls?.[0] || "/form.webp")
      : "/form.webp";

  if (isEditMode && !recipeToEdit) {
    return (
      <div className="main recipe-form-page">
        <section
          className="recipe-form-page__hero page-hero page-hero--split"
          style={{ "--page-hero-image": 'url("/form.webp")' }}
        >
          <div className="recipe-form-page__heroContent page-hero__content">
            <p className="page-hero__eyebrow">Editor receptů</p>
            <h1 className="page-hero__title">Úprava receptu</h1>
            <p className="page-hero__text">Požadovaný recept se v katalogu nenašel.</p>
          </div>
        </section>

        <section className="recipe-form-page__panel recipe-form-page__panel--empty">
          <p>Recept nebyl nalezen.</p>
          <Link to="/recipes" className="button button--ghost">Zpět na recepty</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="main recipe-form-page">
      <section
        className="recipe-form-page__hero page-hero page-hero--split"
        style={{ "--page-hero-image": `url("${heroImageSrc}")` }}
      >
        <div className="recipe-form-page__heroContent page-hero__content">
          <Link to="/recipes" className="recipe-form-page__backLink">
            <span aria-hidden="true">←</span>
            Zpět do katalogu
          </Link>
          <h1 className="page-hero__title">
            {isEditMode ? "Upravit recept" : "Vložit recept"}
          </h1>
          <p className="page-hero__text">
            {isEditMode
              ? "Tady můžeš recept upravit, doplnit a připravit ho pro katalog i týdenní plán."
              : "Tady můžeš vložit nový recept a připravit ho pro katalog i týdenní plán."}
          </p>
        </div>
      </section>

      <form id="form" className="form recipe-form-page__form" onSubmit={handleSubmit}>
        <div className="recipe-form-page__topGrid">
          <section className="recipe-form-page__panel">
            <div className="recipe-form-page__sectionHeader">
              <h2>Základ</h2>
              <p>Název, porce a stručné zařazení receptu.</p>
            </div>

            <div className="recipe-form-page__fieldGrid recipe-form-page__fieldGrid--top">
              <div className="form__item">
                <label htmlFor="name" className="form__label">Název</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="form__input"
                  placeholder="Např. Dýňová polévka"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
              </div>

              <div className="form__item">
                <label htmlFor="servings" className="form__label">Počet porcí</label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  required
                  min="1"
                  step="1"
                  className="form__input"
                  placeholder="Např. 4"
                  value={form.servings}
                  onChange={(e) => setField("servings", e.target.value)}
                />
              </div>

              <div className="form__item">
                <label htmlFor="calories" className="form__label">Kalorie na porci</label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  className="form__input"
                  placeholder="Např. 420"
                  value={form.calories}
                  onChange={(e) => setField("calories", e.target.value)}
                />
              </div>
            </div>

            <CheckboxGroup
              legend="Tagy"
              name="tags"
              options={TAG_OPTIONS}
              selectedValues={form.selectedTags}
              onToggle={(value) => toggleSelection("selectedTags", value)}
            />

            <CheckboxGroup
              legend="Vhodné pro"
              name="suitableFor"
              options={suitabilityOptions}
              selectedValues={form.selectedSuitableFor}
              onToggle={(value) => toggleSelection("selectedSuitableFor", value)}
            />

            <CheckboxGroup
              legend="Alergeny"
              name="allergens"
              options={ALLERGEN_OPTIONS}
              selectedValues={form.selectedAllergens}
              onToggle={(value) => toggleSelection("selectedAllergens", value)}
            />
          </section>

          <aside className="recipe-form-page__panel recipe-form-page__panel--summary">
            <div className="recipe-form-page__sectionHeader">
              <h2>Přehled</h2>
              <p>Rychlá kontrola před uložením.</p>
            </div>

            <div className="recipe-form-page__summaryList">
              <article className="recipe-form-page__summaryItem">
                <span className="recipe-form-page__summaryLabel">Režim</span>
                <strong className="recipe-form-page__summaryValueText">
                  {isEditMode ? "Upravit existující recept" : "Vytvořit nový recept"}
                </strong>
              </article>

              <article className="recipe-form-page__summaryItem">
                <span className="recipe-form-page__summaryLabel">Tagy</span>
                <strong className="recipe-form-page__summaryValueText">
                  {form.selectedTags.length > 0 ? form.selectedTags.join(" • ") : "Zatím nevybrané"}
                </strong>
              </article>

              <article className="recipe-form-page__summaryItem">
                <span className="recipe-form-page__summaryLabel">Vhodné pro</span>
                <strong className="recipe-form-page__summaryValueText">
                  {form.selectedSuitableFor.length > 0
                    ? form.selectedSuitableFor.join(" • ")
                    : "Bez omezení"}
                </strong>
              </article>

              <article className="recipe-form-page__summaryItem">
                <span className="recipe-form-page__summaryLabel">Fotky</span>
                <strong className="recipe-form-page__summaryValueText">
                  {form.photos.length > 0
                    ? `${form.photos.length} souborů, první je obálka`
                    : "Bez fotografie"}
                </strong>
              </article>
            </div>

            <div className="recipe-form-page__summaryActions">
              <Link to="/recipes" className="button button--ghost">
                Zrušit
              </Link>
              <button type="submit" className="button button--new-recipe">
                {isEditMode ? "Uložit změny" : "Vytvořit recept"}
              </button>
            </div>
          </aside>
        </div>

        <section className="recipe-form-page__panel">
          <div className="recipe-form-page__sectionHeader">
            <h2>Suroviny</h2>
            <p>Přidávej položky postupně. Enter vloží aktuální řádek bez odeslání formuláře.</p>
          </div>

          <IngredientInputs
            ref={ingredientInputsRef}
            ingredients={form.ingredients}
            setIngredients={setIngredients}
          />
        </section>

        <section className="recipe-form-page__panel">
          <div className="recipe-form-page__sectionHeader">
            <h2>Postup a příprava</h2>
            <p>Texty, které se zobrazí na detailu receptu a v týdenních úkolech.</p>
          </div>

          <div className="recipe-form-page__fieldGrid recipe-form-page__fieldGrid--text">
            <div className="form__item">
              <label htmlFor="method" className="form__label">Postup</label>
              <textarea
                id="method"
                name="method"
                className="form__input form__textarea"
                placeholder="Popiš postup přípravy"
                required
                value={form.method}
                onChange={(e) => setField("method", e.target.value)}
              />
            </div>

            <div className="form__item">
              <label htmlFor="preTasks" className="form__label">Předpříprava k receptu</label>
              <textarea
                id="preTasks"
                name="preTasks"
                className="form__input form__textarea"
                placeholder={"Každý úkol na nový řádek\nNapř. Večer předem namočit cizrnu."}
                value={form.preTasksText}
                onChange={(e) => setField("preTasksText", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="recipe-form-page__panel">
          <div className="recipe-form-page__sectionHeader">
            <h2>Fotogalerie</h2>
            <p>První nahraná fotka se použije jako obálka v detailu a katalogu.</p>
          </div>

          <div className="form__item form__item--photos">
            <input
              type="file"
              id="photos"
              name="photos"
              accept="image/*"
              multiple
              onChange={handlePhotosChange}
              className="visually-hidden"
              aria-describedby="photos-note"
              ref={fileInputRef}
            />

            <div className="recipe-form-page__uploadRow">
              <button
                type="button"
                className="button button--add button--file"
                onClick={() => fileInputRef.current?.click()}
                aria-controls="photos"
                aria-label="Vybrat obrázky"
              >
                Přidat fotky
              </button>

              <p id="photos-note" className="form__note">
                Vyber jednu či více fotek. První bude hlavička.
              </p>
            </div>

            {form.photos.length > 0 && (
              <div className="form__filenames" aria-live="polite">
                {form.photos.map((p, i) => (
                  <div key={`${p.name}-${i}`} className="form__filename">
                    {i === 0 ? "Obálka: " : ""}{p.name}
                  </div>
                ))}
              </div>
            )}

            {form.photos.length > 0 && (
              <div className="form__previews">
                {form.photos.map((p, i) => (
                  <div key={`${p.url}-${i}`} className="form__preview-wrap">
                    <img
                      src={resolveImageSrc(p.url)}
                      alt={`Náhled ${i + 1}`}
                      className={`form__preview ${i === 0 ? "form__preview--cover" : ""}`}
                    />
                    <div className="form__preview-meta">
                      {i === 0 ? "Obálka (hlavička)" : `Galerie #${i}`}
                      <button
                        type="button"
                        className="button--remove-control form__preview-remove"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          removePhotoAt(i);
                        }}
                        aria-label={`Odebrat náhled ${i + 1}`}
                        title="Odebrat náhled"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="form__button--div recipe-form-page__footerActions">
          <Link to="/recipes" className="button button--ghost">Zrušit</Link>
          <button type="submit" className="button button--new-recipe">
            {isEditMode ? "Uložit změny" : "Vytvořit recept"}
          </button>
        </div>
      </form>
    </div>
  );
};
