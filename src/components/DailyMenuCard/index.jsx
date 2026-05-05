import "./style.css";
import { useMemo } from "react";
import { MEAL_KEYS } from "../../constants/mealKeys";
import { DEFAULT_DAY } from "../../constants/defaultDay";
import { CardToolbar } from "../CardToolbar";
import { CardHeader } from "../CardHeader";
import { MealSlotView } from "../MealSlotView";
import { getDayShoppingItems } from "../../utils/shoppingList";
import { getSlotRecipeIds } from "../../utils/mealSlots";

export const DailyMenuCard = ({
  day,
  img,
  dayIndex,
  data,
  dispatch,
  // klávesnicový přesun
  kbdDrag,
  setKbdDrag,
  announce,
  // našeptávač
  recipes = [],
  variant = "planner",
  showDayReset = true,
  showHeaderTitle = true,
  titleAboveImage = false,
  hideEmptySlots = false,
  readOnly = false,
  showShoppingSection = !readOnly && variant !== "overview",
  showDetailLink = true,
}) => {
  const model = { ...DEFAULT_DAY, ...(data || {}) };
  const recipesById = useMemo(
    () => new Map(recipes.map((recipe) => [recipe.id, recipe])),
    [recipes],
  );
  const visibleMealKeys = hideEmptySlots
    ? MEAL_KEYS.filter(({ key }) => {
        const recipeIds = getSlotRecipeIds(model[key]);
        return recipeIds.some((recipeId) => recipesById.has(recipeId));
      })
    : MEAL_KEYS;
  const dayShoppingItems = useMemo(() => getDayShoppingItems(model, recipes), [model, recipes]);

  const onDragStart = (e, mealKey, options = {}) => {
    const { recipeId, moveAll = false } = options;

    if (!moveAll && typeof recipeId !== "number") {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData("text/plain", JSON.stringify({ dayIndex, mealKey, recipeId, moveAll }));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropTo = (e, toKey) => {
    e.preventDefault();
    let payload = null;
    try { payload = JSON.parse(e.dataTransfer.getData("text/plain")); } catch {}
    if (!payload) return;
    dispatch({
      type: "MOVE_MEAL",
      fromDay: payload.dayIndex,
      fromKey: payload.mealKey,
      toDay: dayIndex,
      toKey,
      recipeId: payload.recipeId,
      moveAll: payload.moveAll === true,
    });
  };

  const clearDay = () => {
    if (!window.confirm(`Opravdu chceš vymazat všechna jídla pro ${day}?`)) return;
    MEAL_KEYS.forEach(({ key }) =>
      dispatch({ type: "CLEAR_MEAL", dayIndex, mealKey: key })
    );
  };

  const clearSlot = (slotKey, label) => {
    if (!window.confirm(`Opravdu chceš smazat položku „${label}“?`)) return;
    dispatch({ type: "UPDATE_MEAL", dayIndex, mealKey: slotKey, value: "" });
  };

  const clearRecipeFromSlot = (slotKey, recipeId, label) => {
    if (!window.confirm(`Opravdu chceš smazat položku „${label}“?`)) return;
    dispatch({ type: "CLEAR_MEAL", dayIndex, mealKey: slotKey, recipeId });
  };

  return (
    <div
      className={`card ${variant === "overview" ? "card--overview" : ""}`}
      role="region"
      aria-label={`Denní plán: ${day}`}
    >
      <CardHeader img={img} day={day} showTitle={showHeaderTitle} titleAboveImage={titleAboveImage} />
      {showDayReset && <CardToolbar clearDay={clearDay} />}

      <div className="card__content" id={`day-${dayIndex}`}>
        {visibleMealKeys.length === 0 && (
          <p className="card__emptyMessage">Na dnešek zatím není nic naplánováno.</p>
        )}

        {visibleMealKeys.map(({ key, label, optional }) => {
          const hintId = `hint-${dayIndex}-${key}`;

          const carrying = !!kbdDrag;
          const isSource =
            carrying && kbdDrag.fromDay === dayIndex && kbdDrag.fromKey === key;
          const slotRecipes = getSlotRecipeIds(model[key])
            .map((recipeId) => recipesById.get(recipeId))
            .filter(Boolean);
          const slotLabel = slotRecipes.map((recipe) => recipe.title).join(", ");

          return (
            <div
              key={key}
              className={`card__text ${key === "dinner" ? "card__text--dinner" : ""} ${optional ? "card__text--optional" : ""}`}
            >
              <p className="card__subtitle">{label}:</p>

              <MealSlotView
                label={label}
                day={day}
                dayIndex={dayIndex}
                mealKey={key}
                recipes={slotRecipes}
                value={slotLabel}
                isSource={isSource}
                carrying={carrying}
                kbdDrag={kbdDrag}
                setKbdDrag={setKbdDrag}
                announce={announce}
                dispatch={dispatch}
                hintId={hintId}
                onDragStart={onDragStart}
                onDropTo={onDropTo}
                onClear={() => clearSlot(key, slotLabel || label)}
                onClearRecipe={(recipeId, recipeTitle) => clearRecipeFromSlot(key, recipeId, recipeTitle)}
                variant={variant}
                isOptional={optional}
                readOnly={readOnly}
                showDetailLink={showDetailLink && slotRecipes.length > 0}
              />

              {!readOnly && (
                <span id={hintId} className="sr-only">
                  Mezerník: zvednout nebo položit recept. Esc: zrušit přesun.
                </span>
              )}
            </div>
          );
        })}

        {showShoppingSection && (
          <section className="card__shopping" aria-label={`Nákup pro ${day}`}>
            <div className="card__shoppingHeader">
              <h3 className="card__shoppingTitle">Nakoupit</h3>
              <p className="card__shoppingHint">Klikem vypni položky, které už máš doma.</p>
            </div>

            {dayShoppingItems.length > 0 ? (
              <ul className="card__shoppingList">
                {dayShoppingItems.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      className={`card__shoppingChip ${item.selected ? "is-selected" : ""}`}
                      aria-pressed={item.selected}
                      onClick={() =>
                        dispatch({ type: "TOGGLE_DAY_SHOPPING_SELECTION", dayIndex, itemKey: item.key })}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="card__shoppingEmpty">Na tento den zatím není nic naplánováno.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
