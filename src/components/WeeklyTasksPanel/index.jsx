import { useMemo, useState } from "react";
import {
  getWeeklyExtraItems,
  getWeeklyGeneratedTasks,
  groupWeeklyGeneratedTasks,
} from "../../selectors/weeklyTaskSelectors.js";
import "./style.css";

export const WeeklyTasksPanel = ({
  value = "",
  week = [],
  recipes = [],
  prepDone = {},
  extraDone = {},
  onTogglePrepDone,
  onToggleExtraDone,
  onAddNote,
  onToggleNote,
  onRemoveNote,
}) => {
  const [noteDraft, setNoteDraft] = useState("");
  const generatedTasks = useMemo(() => getWeeklyGeneratedTasks(week, recipes), [recipes, week]);
  const extraItems = useMemo(() => getWeeklyExtraItems(week, recipes), [recipes, week]);
  const groupedGeneratedTasks = useMemo(
    () => groupWeeklyGeneratedTasks(generatedTasks),
    [generatedTasks],
  );
  const noteItems = Array.isArray(value) ? value : [];
  const canAddNote = noteDraft.trim() !== "";

  const handleAddNote = (event) => {
    event.preventDefault();
    const nextValue = noteDraft.trim();
    if (!nextValue) return;
    onAddNote?.(nextValue);
    setNoteDraft("");
  };

  return (
    <div className="weekly-tasks-panel">
      <section className="weekly-tasks-panel__column weekly-tasks-panel__column--prep weekly-tasks-panel__block">
        <div className="weekly-tasks-panel__subheader">
          <h3>Přípravy</h3>
        </div>

        {groupedGeneratedTasks.length ? (
          <ul className="weekly-tasks-panel__list">
            {groupedGeneratedTasks.map(({ dayLabel, tasks }) => (
              <li key={dayLabel} className="weekly-tasks-panel__item">
                <span className="weekly-tasks-panel__day">{dayLabel}</span>
                <ul className="weekly-tasks-panel__tasks">
                  {tasks.map(({ id, recipeTitle, task }) => (
                    <li
                      key={id}
                      className={`weekly-tasks-panel__task-item ${prepDone[id] ? "is-complete" : ""}`}
                    >
                      <button
                        type="button"
                        className="weekly-tasks-panel__toggle"
                        onClick={() => onTogglePrepDone?.(id)}
                      >
                        <span
                          className={`weekly-tasks-panel__check ${prepDone[id] ? "is-complete" : ""}`}
                          aria-hidden="true"
                        >
                          {prepDone[id] ? "✓" : ""}
                        </span>
                        <span className="weekly-tasks-panel__task-main">
                          <strong className="weekly-tasks-panel__task-text">{task}</strong>
                          <span className="weekly-tasks-panel__recipe">{recipeTitle}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="weekly-tasks-panel__empty">Zatím bez úkolů z naplánovaných receptů.</p>
        )}
      </section>

      <div className="weekly-tasks-panel__column weekly-tasks-panel__column--side">
        <section className="weekly-tasks-panel__block">
          <div className="weekly-tasks-panel__subheader">
            <h3>EXTRA</h3>
          </div>

          {extraItems.length ? (
            <ul className="weekly-tasks-panel__list">
              {extraItems.map(({ id, dayLabel, recipeTitle }) => (
                <li
                  key={id}
                  className={`weekly-tasks-panel__item ${extraDone[id] ? "is-complete" : ""}`}
                >
                  <span className="weekly-tasks-panel__day">{dayLabel}</span>
                  <button
                    type="button"
                    className="weekly-tasks-panel__toggle"
                    onClick={() => onToggleExtraDone?.(id)}
                  >
                    <span
                      className={`weekly-tasks-panel__check ${extraDone[id] ? "is-complete" : ""}`}
                      aria-hidden="true"
                    >
                      {extraDone[id] ? "✓" : ""}
                    </span>
                    <span className="weekly-tasks-panel__task-main">
                      <strong className="weekly-tasks-panel__task-text">{recipeTitle}</strong>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="weekly-tasks-panel__empty">Zatím bez naplánovaného EXTRA receptu.</p>
          )}
        </section>

        <section className="weekly-tasks-panel__block">
          <div className="weekly-tasks-panel__subheader">
            <h3>Poznámky</h3>
          </div>

          <div className="weekly-tasks-panel__notes">
            {noteItems.length ? (
              <ul className="weekly-tasks-panel__notes-list">
                {noteItems.map(({ id, text, done }) => (
                  <li
                    key={id}
                    className={`weekly-tasks-panel__note-item ${done ? "is-complete" : ""}`}
                  >
                    <span className="weekly-tasks-panel__task-main">
                      <strong className="weekly-tasks-panel__task-text">{text}</strong>
                    </span>
                    {!done && (
                      <button
                        type="button"
                        className="button--remove-control weekly-tasks-panel__remove"
                        onClick={() => onRemoveNote?.(id)}
                        aria-label={`Smazat poznámku ${text}`}
                        title="Smazat poznámku"
                      >
                        ×
                      </button>
                    )}
                    <button
                      type="button"
                      className="weekly-tasks-panel__note-check-button"
                      onClick={() => onToggleNote?.(id)}
                    >
                      <span
                        className={`weekly-tasks-panel__check ${done ? "is-complete" : ""}`}
                        aria-hidden="true"
                      >
                        {done ? "✓" : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="weekly-tasks-panel__empty">Zatím bez vlastních poznámek.</p>
            )}

            <form className="weekly-tasks-panel__note-form" onSubmit={handleAddNote}>
              <input
                type="text"
                className="weekly-tasks-panel__note-input"
                placeholder="Přidat poznámku nebo úkol"
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
              />
              <button type="submit" className="button button--add" disabled={!canAddNote}>
                Přidat
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
