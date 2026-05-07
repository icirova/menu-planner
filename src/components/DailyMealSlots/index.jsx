import { getSlotRecipeIds } from "../../utils/mealSlots.js";
import { MealSlotView } from "../MealSlotView/index.jsx";

export const DailyMealSlots = ({
  announce,
  day,
  dayIndex,
  dispatch,
  kbdDrag,
  model,
  onClearRecipeFromSlot,
  onClearSlot,
  onDragStart,
  onDropTo,
  readOnly,
  recipesById,
  setKbdDrag,
  showDetailLink,
  visibleMealKeys,
  variant,
}) => {
  if (visibleMealKeys.length === 0) {
    return <p className="card__empty-message">Na dnešek zatím není nic naplánováno.</p>;
  }

  return visibleMealKeys.map(({ key, label, optional }) => {
    const hintId = `hint-${dayIndex}-${key}`;
    const carrying = !!kbdDrag;
    const isSource = carrying && kbdDrag.fromDay === dayIndex && kbdDrag.fromKey === key;
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
          onClear={() => onClearSlot(key, slotLabel || label)}
          onClearRecipe={(recipeId, recipeTitle) => onClearRecipeFromSlot(key, recipeId, recipeTitle)}
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
  });
};
