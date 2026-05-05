import { useMemo, useState } from "react";
import { ExtraSummaryCard } from "../ExtraSummaryCard";
import { DAYS } from "../../constants/days";
import { MEAL_KEYS } from "../../constants/mealKeys";
import { normalizeRecipePreTasks } from "../../utils/normalizeRecipePreTasks";
import { getSlotRecipeIds } from "../../utils/mealSlots";
import "./style.css";

const getWeeklyGeneratedTasks = (week = [], recipes = []) => {
  const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const seen = new Set();

  return week.flatMap((day, dayIndex) => {
    const recipeIdsForDay = [
      ...new Set(
        MEAL_KEYS
          .flatMap(({ key }) => getSlotRecipeIds(day?.[key])),
      ),
    ];

    return recipeIdsForDay.flatMap((recipeId) => {
      const recipe = recipesById.get(recipeId);
      if (!recipe) return [];
      const tasks = normalizeRecipePreTasks(recipe.preTasks);

      return [...new Set(tasks)].flatMap((task, taskIndex) => {
        const dedupeKey = `${dayIndex}-${task.toLowerCase()}`;
        if (seen.has(dedupeKey)) return [];
        seen.add(dedupeKey);

        return [{
          id: `${dayIndex}-${recipeId}-${taskIndex}`,
          dayLabel: DAYS[(dayIndex + DAYS.length - 1) % DAYS.length],
          recipeTitle: recipe.title,
          task,
        }];
      });
    });
  });
};

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
  const generatedTasks = useMemo(
    () => getWeeklyGeneratedTasks(week, recipes),
    [recipes, week],
  );
  const groupedGeneratedTasks = useMemo(() => {
    const groups = new Map();

    generatedTasks.forEach((item) => {
      const group = groups.get(item.dayLabel);
      if (group) {
        group.tasks.push(item);
      } else {
        groups.set(item.dayLabel, {
          dayLabel: item.dayLabel,
          tasks: [item],
        });
      }
    });

    return Array.from(groups.values());
  }, [generatedTasks]);
  const noteItems = Array.isArray(value) ? value : [];

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
                      className={`weekly-tasks-panel__taskItem ${prepDone[id] ? "is-complete" : ""}`}
                    >
                      <button
                        type="button"
                        className="weekly-tasks-panel__toggle"
                        onClick={() => onTogglePrepDone?.(id)}
                      >
                        <span className={`weekly-tasks-panel__check ${prepDone[id] ? "is-complete" : ""}`} aria-hidden="true">
                          {prepDone[id] ? "✓" : ""}
                        </span>
                        <span className="weekly-tasks-panel__taskMain">
                          <strong className="weekly-tasks-panel__taskText">{task}</strong>
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
          <p className="weekly-tasks-panel__empty">
            Zatím bez úkolů z naplánovaných receptů.
          </p>
        )}
      </section>

      <div className="weekly-tasks-panel__column weekly-tasks-panel__column--side">
        <section className="weekly-tasks-panel__block">
          <div className="weekly-tasks-panel__subheader">
            <h3>EXTRA</h3>
          </div>

          <ExtraSummaryCard
            title="EXTRA"
            week={week}
            recipes={recipes}
            showVisualHeader={false}
            completedMap={extraDone}
            onToggleItem={onToggleExtraDone}
          />
        </section>

        <section className="weekly-tasks-panel__block">
          <div className="weekly-tasks-panel__subheader">
            <h3>Poznámky</h3>
          </div>

          <div className="weekly-tasks-panel__notes">
            <form className="weekly-tasks-panel__noteForm" onSubmit={handleAddNote}>
              <input
                type="text"
                className="weekly-tasks-panel__noteInput"
                placeholder="Přidat poznámku nebo úkol"
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
              />
              <button type="submit" className="button button--add">Přidat</button>
            </form>

            {noteItems.length ? (
              <ul className="weekly-tasks-panel__notesList">
                {noteItems.map(({ id, text, done }) => (
                  <li key={id} className={`weekly-tasks-panel__noteItem ${done ? "is-complete" : ""}`}>
                    <span className="weekly-tasks-panel__taskMain">
                      <strong className="weekly-tasks-panel__taskText">{text}</strong>
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
                      className="weekly-tasks-panel__noteCheckButton"
                      onClick={() => onToggleNote?.(id)}
                    >
                      <span className={`weekly-tasks-panel__check ${done ? "is-complete" : ""}`} aria-hidden="true">
                        {done ? "✓" : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="weekly-tasks-panel__empty">Zatím bez vlastních poznámek.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
