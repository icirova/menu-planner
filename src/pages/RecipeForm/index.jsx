import "./style.css";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { IngredientInputs } from "../../components/IngredientInputs/index";
import {
  ALLERGEN_OPTIONS,
  SUITABILITY_OPTIONS,
  TAG_OPTIONS,
} from "../../constants/recipeMetadata";
import { useRecipeForm } from "../../hooks/useRecipeForm";

export const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipeList, addRecipe, updateRecipe } = useOutletContext();
  const recipeToEdit = id ? recipeList.find((recipe) => recipe.id === Number(id)) : null;
  const isEditMode = Boolean(id);
  const isEditableRecipe = !isEditMode || recipeToEdit?.source === "custom";
  const {
    fileInputRef,
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

  if (isEditMode && !isEditableRecipe) {
    return (
      <div className="main">
        <h1 className="title">Úprava receptu</h1>
        <p>Tento recept nelze upravovat, protože je součástí vestavěného katalogu.</p>
        <Link to="/recipes" className="menu__item button">Zpět</Link>
      </div>
    );
  }

  return (
    <div className="main">
      <h1 className="title">{isEditMode ? "Upravit recept" : "Nový recept"}</h1>
      <img className="form__img" src="./form.webp" alt="" />

      <form id="form" className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <label htmlFor="name" className="form__label">Název</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="form__input"
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
            value={form.servings}
            onChange={(e) => setField("servings", e.target.value)}
          />
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
          options={SUITABILITY_OPTIONS}
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

        {/* Kalorie */}
        <div className="form__item">
          <label htmlFor="calories" className="form__label">Kalorie (kcal na 1 porci)</label>
          <input
            type="number"
            id="calories"
            name="calories"
            className="form__input"
            value={form.calories}
            onChange={(e) => setField("calories", e.target.value)}
          />
        </div>

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

        <IngredientInputs ingredients={form.ingredients} setIngredients={setIngredients} />

        {/* Upload fotek */}
        <div className="form__item">
          <label htmlFor="photos" className="form__label">Nahrát obrázky</label>

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

          <button
            type="button"
            className="button button--file"
            onClick={() => fileInputRef.current?.click()}
            aria-controls="photos"
            aria-label="Vybrat obrázky"
          >
            +
          </button>

          {form.photos.length > 0 ? (
            <div className="form__filenames" aria-live="polite">
              {form.photos.map((p, i) => (
                <div key={`${p.name}-${i}`} className="form__filename">
                  {i === 0 ? "Obálka: " : ""}{p.name}
                </div>
              ))}
            </div>
          ) : (
            <p id="photos-note" className="form__note">
              Vyber jednu či více fotek. První bude hlavička.
            </p>
          )}

          {form.photos.length > 0 && (
            <div className="form__previews">
              {form.photos.map((p, i) => (
                <div key={`${p.url}-${i}`} className="form__preview-wrap">
                  <img
                    src={p.url}
                    alt={`Náhled ${i + 1}`}
                    className={`form__preview ${i === 0 ? "form__preview--cover" : ""}`}
                  />
                  <div className="form__preview-meta">
                    {i === 0 ? "Obálka (hlavička)" : `Galerie #${i}`}
                    <button
                      type="button"
                      className="button button--icon button--danger form__preview-remove"
                      onClick={() => removePhotoAt(i)}
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

        <div className="form__button--div">
          <button type="submit" className="button button--new-recipe">
            {isEditMode ? "Uložit změny" : "Vytvořit"}
          </button>
        </div>
      </form>
    </div>
  );
};
