import { Fragment } from "react";
import { MEAL_KEYS, PLANNED_MEAL_KEYS } from "../../constants/mealKeys";
import { getSlotRecipeIds, slotHasRecipes } from "../../utils/mealSlots";
import { DAYS, MEAL_LABELS } from "../../hooks/useRecipePlanner";

export const RecipePlannerGrid = ({
  weeklyMenu,
  recipesById,
  duplicateSource,
  pointerDrag,
  plannerCellRefs,
  targetDay,
  targetSlot,
  clearPlannerCell,
  handleDuplicateSlotStart,
  handlePlannerPointerDown,
  handlePlannerCellClick,
}) => {
  return (
    <div
      className={`recipes__planner-board ${pointerDrag?.isActive ? "is-pointer-dragging" : ""}`}
      role="region"
      aria-label="Přehled týdne pro plánování"
      onSelectStart={pointerDrag?.isActive ? (event) => event.preventDefault() : undefined}
    >
      <div className="recipes__planner-grid">
        <div className="recipes__planner-corner" aria-hidden="true">
          Slot
        </div>

        {DAYS.map((day, dayIndex) => (
          <div key={day} className="recipes__planner-day">
            {day}
            <span className="recipes__planner-dayCount">
              {PLANNED_MEAL_KEYS.filter(({ key }) => slotHasRecipes(weeklyMenu.week[dayIndex]?.[key])).length}/{PLANNED_MEAL_KEYS.length}
            </span>
          </div>
        ))}

        {MEAL_KEYS.map(({ key, optional }) => (
          <Fragment key={key}>
            <div className={`recipes__planner-slotLabel ${optional ? "recipes__planner-slotLabel--optional" : ""}`}>
              {MEAL_LABELS[key] ?? key}
            </div>

            {DAYS.map((day, dayIndex) => {
              const slotRecipes = getSlotRecipeIds(weeklyMenu.week[dayIndex]?.[key])
                .map((recipeId) => recipesById.get(recipeId))
                .filter(Boolean);
              const isActiveTarget =
                dayIndex === targetDay && key === targetSlot;
              const isDuplicateSource =
                dayIndex === duplicateSource?.dayIndex && key === duplicateSource?.slotKey;
              const isPointerTarget =
                pointerDrag?.isActive &&
                dayIndex === pointerDrag.target?.dayIndex &&
                key === pointerDrag.target?.slotKey;
              const isPointerSource =
                pointerDrag?.isActive &&
                dayIndex === pointerDrag.payload?.dayIndex &&
                key === pointerDrag.payload?.slotKey;
              const slotLabel = slotRecipes.map((recipe) => recipe.title).join(", ");

              return (
                <div
                  key={`${day}-${key}`}
                  data-planner-cell="true"
                  data-day-index={dayIndex}
                  data-slot-key={key}
                  ref={(node) => {
                    const refKey = `${dayIndex}-${key}`;
                    if (node) {
                      plannerCellRefs.current.set(refKey, node);
                    } else {
                      plannerCellRefs.current.delete(refKey);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`recipes__planner-cell ${slotRecipes.length ? "is-filled" : "is-empty"} ${isActiveTarget ? "is-activeTarget" : ""} ${isDuplicateSource ? "is-duplicateSource" : ""} ${isPointerTarget ? "is-drop-target" : ""} ${isPointerSource ? "is-drag-source" : ""} ${optional ? "recipes__planner-cell--optional" : ""}`}
                  onClick={() => handlePlannerCellClick(dayIndex, key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handlePlannerCellClick(dayIndex, key);
                    }
                  }}
                  onPointerDown={(event) => {
                    if (!slotRecipes.length) return;
                    handlePlannerPointerDown(event, dayIndex, key, {
                      moveAll: true,
                      label: slotLabel,
                    });
                  }}
                  title={
                    slotRecipes.length
                      ? `${day} – ${MEAL_LABELS[key] ?? key}: ${slotRecipes.map((recipe) => recipe.title).join(", ")}.`
                      : `${day} – ${MEAL_LABELS[key] ?? key}: prázdný slot`
                  }
                >
                  {slotRecipes.length > 0 && (
                    <div className="recipes__planner-slotActions">
                      <button
                        type="button"
                        className="recipes__planner-moveButton"
                        aria-label={`Přesunout celý slot ${day} – ${MEAL_LABELS[key] ?? key}`}
                        title="Přesunout celý slot"
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          handlePlannerPointerDown(event, dayIndex, key, {
                            moveAll: true,
                            label: slotLabel,
                          });
                        }}
                      >
                        ⋮⋮
                      </button>
                      <button
                        type="button"
                        className={`recipes__planner-copyButton ${isDuplicateSource ? "is-active" : ""}`}
                        aria-label={`Duplikovat slot ${day} – ${MEAL_LABELS[key] ?? key}`}
                        title={isDuplicateSource ? "Zrušit duplikování slotu" : "Duplikovat slot"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSlotStart(dayIndex, key);
                        }}
                      >
                        ⧉
                      </button>
                    </div>
                  )}
                  <span className="recipes__planner-cellState">
                    {slotRecipes.length ? `${slotRecipes.length}× recept` : "Volné"}
                  </span>
                  {slotRecipes.length > 0 && (
                    <span className="recipes__planner-cellList">
                      {slotRecipes.map((recipe) => (
                        <span
                          key={recipe.id}
                          className="recipes__planner-pill"
                          onPointerDown={(event) => {
                            event.stopPropagation();
                            handlePlannerPointerDown(event, dayIndex, key, {
                              recipeId: recipe.id,
                              label: recipe.title,
                            });
                          }}
                          title={`Přetáhni recept ${recipe.title} do jiného slotu`}
                        >
                          <strong className="recipes__planner-cellTitle">
                            {recipe.title}
                          </strong>
                          <button
                            type="button"
                            className="button--remove-control recipes__planner-pillRemove"
                            aria-label={`Odebrat ${recipe.title} ze slotu`}
                            onClick={(e) => {
                              e.stopPropagation();
                              clearPlannerCell(dayIndex, key, recipe.id);
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
      {pointerDrag?.isActive && (
        <div
          className="recipes__planner-dragGhost"
          style={{
            left: `${pointerDrag.x + 16}px`,
            top: `${pointerDrag.y + 16}px`,
          }}
          aria-hidden="true"
        >
          {pointerDrag.label || "Přesouvaný recept"}
        </div>
      )}
    </div>
  );
};
