export const RecipePreTasksEditor = ({
  addPreTask,
  handlePreTaskKeyDown,
  preTaskDraft,
  preTaskItems,
  removePreTask,
  setPreTaskDraft,
}) => {
  const canAddPreTask = preTaskDraft.trim() !== "";

  return (
    <div className="recipe-form-page__subsection form__item">
      <label htmlFor="preTasks" className="form__label">
        Příprava
      </label>
      <div className="recipe-form-page__task-editor">
        <div className="recipe-form-page__task-form">
          <input
            id="preTasks"
            type="text"
            className="form__input"
            placeholder="Např. Večer předem namočit cizrnu"
            value={preTaskDraft}
            onChange={(event) => setPreTaskDraft(event.target.value)}
            onKeyDown={handlePreTaskKeyDown}
          />
          <button
            type="button"
            className="button button--add"
            onClick={addPreTask}
            disabled={!canAddPreTask}
          >
            Přidat
          </button>
        </div>

        {preTaskItems.length > 0 ? (
          <ul className="recipe-form-page__task-list" aria-live="polite">
            {preTaskItems.map((task, index) => (
              <li key={`${task}-${index}`} className="recipe-form-page__task-item">
                <span className="recipe-form-page__task-text">{task}</span>
                <button
                  type="button"
                  className="button--remove-control"
                  onClick={() => removePreTask(index)}
                  aria-label={`Odebrat úkol ${task}`}
                  title="Odebrat úkol"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="recipe-form-page__task-empty">Zatím bez úkolů přípravy.</p>
        )}
      </div>
    </div>
  );
};
