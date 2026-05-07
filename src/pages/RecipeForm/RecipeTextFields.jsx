import { RecipePreTasksEditor } from "./RecipePreTasksEditor.jsx";

export const RecipeTextFields = ({
  addPreTask,
  form,
  handlePreTaskKeyDown,
  preTaskDraft,
  preTaskItems,
  removePreTask,
  setField,
  setPreTaskDraft,
}) => (
  <section className="recipe-form-page__panel">
    <div className="recipe-form-page__section-header">
      <h2>Postup a příprava</h2>
    </div>

    <div className="recipe-form-page__field-grid recipe-form-page__field-grid--text">
      <div className="recipe-form-page__subsection form__item">
        <label htmlFor="method" className="form__label">
          Postup <span className="form__required-mark" aria-hidden="true">*</span>
        </label>
        <textarea
          id="method"
          name="method"
          className="form__input form__textarea"
          placeholder="Popiš postup přípravy"
          value={form.method}
          onChange={(e) => setField("method", e.target.value)}
        />
      </div>

      <RecipePreTasksEditor
        addPreTask={addPreTask}
        handlePreTaskKeyDown={handlePreTaskKeyDown}
        preTaskDraft={preTaskDraft}
        preTaskItems={preTaskItems}
        removePreTask={removePreTask}
        setPreTaskDraft={setPreTaskDraft}
      />
    </div>
  </section>
);
