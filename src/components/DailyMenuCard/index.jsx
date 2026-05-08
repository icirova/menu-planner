import "./style.css";
import { useMemo } from "react";
import { MEAL_KEYS } from "../../constants/mealKeys.js";
import { DEFAULT_DAY } from "../../constants/defaultDay.js";
import { CardToolbar } from "../CardToolbar/index.jsx";
import { CardHeader } from "../CardHeader/index.jsx";
import { DailyMealSlots } from "../DailyMealSlots/index.jsx";
import { DayShoppingPreview } from "../DayShoppingPreview/index.jsx";
import { getDayShoppingItems } from "../../utils/shoppingList.js";
import { getSlotRecipeIds } from "../../utils/mealSlots.js";

export const DailyMenuCard = ({
  day,
  imageSrc,
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
  const model = useMemo(() => ({ ...DEFAULT_DAY, ...(data || {}) }), [data]);
  const recipesById = useMemo(
    () => new Map(recipes.map((recipe) => [recipe.id, recipe])),
    [recipes],
  );
  const visibleMealKeys = useMemo(
    () =>
      hideEmptySlots
        ? MEAL_KEYS.filter(({ key }) => {
            const recipeIds = getSlotRecipeIds(model[key]);
            return recipeIds.some((recipeId) => recipesById.has(recipeId));
          })
        : MEAL_KEYS,
    [hideEmptySlots, model, recipesById],
  );
  const dayShoppingItems = useMemo(() => getDayShoppingItems(model, recipes), [model, recipes]);

  const handleHtmlDragStart = (e, mealKey, options = {}) => {
    const { recipeId, moveAll = false } = options;

    if (!moveAll && typeof recipeId !== "number") {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData("text/plain", JSON.stringify({ dayIndex, mealKey, recipeId, moveAll }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleHtmlDropTo = (e, toKey) => {
    e.preventDefault();
    let payload = null;
    try {
      payload = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch {}
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
    MEAL_KEYS.forEach(({ key }) => dispatch({ type: "CLEAR_MEAL", dayIndex, mealKey: key }));
  };

  const clearSlot = (slotKey, label) => {
    if (!window.confirm(`Opravdu chceš smazat položku „${label}“?`)) return;
    dispatch({ type: "UPDATE_MEAL", dayIndex, mealKey: slotKey, value: "" });
  };

  const clearRecipeFromSlot = (slotKey, recipeId, label) => {
    if (!window.confirm(`Opravdu chceš smazat položku „${label}“?`)) return;
    dispatch({ type: "CLEAR_MEAL", dayIndex, mealKey: slotKey, recipeId });
  };

  const toggleDayShoppingItem = (itemDayIndex, itemKey) => {
    dispatch({ type: "TOGGLE_DAY_SHOPPING_SELECTION", dayIndex: itemDayIndex, itemKey });
  };

  return (
    <div
      className={`card ${variant === "overview" ? "card--overview" : ""}`}
      role="region"
      aria-label={`Denní plán: ${day}`}
    >
      <CardHeader
        imageSrc={imageSrc}
        day={day}
        showTitle={showHeaderTitle}
        titleAboveImage={titleAboveImage}
      />
      {showDayReset && <CardToolbar clearDay={clearDay} />}

      <div className="card__content" id={`day-${dayIndex}`}>
        <DailyMealSlots
          announce={announce}
          day={day}
          dayIndex={dayIndex}
          dispatch={dispatch}
          kbdDrag={kbdDrag}
          model={model}
          onClearRecipeFromSlot={clearRecipeFromSlot}
          onClearSlot={clearSlot}
          onDragStart={handleHtmlDragStart}
          onDropTo={handleHtmlDropTo}
          readOnly={readOnly}
          recipesById={recipesById}
          setKbdDrag={setKbdDrag}
          showDetailLink={showDetailLink}
          visibleMealKeys={visibleMealKeys}
          variant={variant}
        />

        {showShoppingSection && (
          <DayShoppingPreview
            day={day}
            dayIndex={dayIndex}
            items={dayShoppingItems}
            onToggleItem={toggleDayShoppingItem}
          />
        )}
      </div>
    </div>
  );
};
