import { MAX_SERVINGS, MIN_SERVINGS } from "../../constants/servings.js";

export const RecipeBasicFields = ({ form, setField }) => (
  <section className="recipe-form-page__panel">
    <div className="recipe-form-page__section-header">
      <h2>Základní údaje</h2>
    </div>

    <div className="recipe-form-page__field-grid recipe-form-page__field-grid--top">
      <div className="recipe-form-page__subsection form__item">
        <label htmlFor="name" className="form__label">
          Název{" "}
          <span className="form__required-mark" aria-hidden="true">
            *
          </span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="form__input"
          placeholder="Např. Dýňová polévka"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />
      </div>

      <div className="recipe-form-page__subsection form__item">
        <label htmlFor="servings" className="form__label">
          Počet porcí{" "}
          <span className="form__required-mark" aria-hidden="true">
            *
          </span>
        </label>
        <input
          type="number"
          id="servings"
          name="servings"
          min={MIN_SERVINGS}
          max={MAX_SERVINGS}
          step="1"
          className="form__input"
          placeholder="Např. 4"
          value={form.servings}
          onChange={(e) => setField("servings", e.target.value)}
        />
      </div>

      <div className="recipe-form-page__subsection form__item">
        <label htmlFor="calories" className="form__label">
          Kalorie na porci
        </label>
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
  </section>
);
