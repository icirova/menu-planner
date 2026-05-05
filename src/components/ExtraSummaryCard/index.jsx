import { useMemo } from "react";
import { DAYS } from "../../constants/days";
import { getSlotRecipeIds } from "../../utils/mealSlots";
import "./style.css";

const getExtraSummaryItems = (week = [], recipes = []) => {
  const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));

  return week.flatMap((day, dayIndex) => {
    return getSlotRecipeIds(day?.extra).flatMap((recipeId) => {
      const recipe = recipesById.get(recipeId);
      if (!recipe) return [];

      return [{
        id: `extra-${dayIndex}-${recipe.id}`,
        day: DAYS[dayIndex],
        recipe,
      }];
    });
  });
};

export const ExtraSummaryCard = ({
  title = "EXTRA",
  week = [],
  recipes = [],
  showVisualHeader = true,
  completedMap = {},
  onToggleItem,
}) => {
  const items = useMemo(
    () => getExtraSummaryItems(week, recipes),
    [recipes, week],
  );

  return (
    <div
      className={`card extra-card ${showVisualHeader ? "" : "extra-card--embedded"}`}
    >
      {showVisualHeader && <h1 className="card__title">{title}</h1>}

      <div className="card__content">
        {items.length ? (
          <ul className="extra-card__list">
            {items.map(({ id, day, recipe }) => (
              <li
                key={id}
                className={`extra-card__item ${completedMap[id] ? "is-complete" : ""}`}
              >
                <span className="extra-card__day">{day}</span>
                {onToggleItem ? (
                  <button
                    type="button"
                    className="extra-card__toggle"
                    onClick={() => onToggleItem(id)}
                  >
                    <span className={`extra-card__check ${completedMap[id] ? "is-complete" : ""}`} aria-hidden="true">
                      {completedMap[id] ? "✓" : ""}
                    </span>
                    <strong className="extra-card__name">{recipe.title}</strong>
                  </button>
                ) : (
                  <strong className="extra-card__name">{recipe.title}</strong>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="extra-card__empty">Zatím bez naplánovaného EXTRA receptu.</p>
        )}
      </div>
    </div>
  );
};
