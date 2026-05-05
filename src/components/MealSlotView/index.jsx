import { Link } from "react-router-dom";
import { KEYS } from "../../constants/keys";
import { resolveImageSrc } from "../../utils/resolveImageSrc";

export const MealSlotView = ({
  label,
  day,
  dayIndex,
  mealKey,
  recipes = [],
  value,
  isSource = false,
  carrying = false,
  kbdDrag,
  setKbdDrag,
  announce,
  dispatch,
  hintId,
  onDragStart,
  onDropTo,
  onClear,
  variant = "planner",
  isOptional = false,
  readOnly = false,
  showDetailLink = true,
  onClearRecipe,
}) => {
  const recipe = recipes[0] ?? null;
  const cover = resolveImageSrc(recipe?.photo_urls?.[0] || "/image/placeholder.png");
  const isOverview = variant === "overview";
  const hasRecipes = recipes.length > 0;

  return (
    <div
      className={`card__slot ${hasRecipes ? "card__slot--filled" : "card__slot--empty"} ${isSource ? "is-kbd-source" : ""} ${isOverview ? "card__slot--overview" : ""} ${isOptional ? "card__slot--optional" : ""}`}
      tabIndex={readOnly ? -1 : 0}
      role={readOnly ? undefined : "button"}
      aria-describedby={readOnly ? undefined : hintId}
      aria-label={
        readOnly
          ? `${label}: ${value || "prázdné"}.`
          : carrying
          ? `${label}: ${value || "prázdné"}. Cíl přesunu, stiskni mezerník pro položení.`
          : `${label}: ${value || "prázdné"}.`
      }
      draggable={!readOnly && hasRecipes}
      onDragStart={
        readOnly
          ? undefined
          : (e) => onDragStart(e, mealKey, { moveAll: true })
      }
      onDragOver={readOnly ? undefined : (e) => e.preventDefault()}
      onDragEnter={readOnly ? undefined : (e) => e.currentTarget.classList.add("is-drop-target")}
      onDragLeave={readOnly ? undefined : (e) => e.currentTarget.classList.remove("is-drop-target")}
      onDrop={readOnly ? undefined : (e) => {
        e.currentTarget.classList.remove("is-drop-target");
        onDropTo(e, mealKey);
      }}
      onFocus={(e) => {
        if (readOnly) return;
        if (kbdDrag) e.currentTarget.classList.add("is-drop-target");
      }}
      onBlur={readOnly ? undefined : (e) => e.currentTarget.classList.remove("is-drop-target")}
      onKeyDown={(e) => {
        if (readOnly) return;
        if (e.key === KEYS.ESC && kbdDrag) {
          setKbdDrag(null);
          announce && announce("Přesun zrušen.");
          e.currentTarget.classList.remove("is-drop-target");
          return;
        }

        if (e.key === KEYS.SPACE || e.key === KEYS.SPACE_FALLBACK) {
          e.preventDefault();

          if (!kbdDrag) {
            if (!recipe) {
              announce && announce("Slot je prázdný, není co přesouvat.");
              return;
            }

            setKbdDrag({ fromDay: dayIndex, fromKey: mealKey, value: recipe.id });
            announce &&
              announce(`Zvednuto: ${value} z ${day} – ${label}. Přejdi na cílový slot a stiskni mezerník.`);
            return;
          }

          dispatch({
            type: "MOVE_MEAL",
            fromDay: kbdDrag.fromDay,
            fromKey: kbdDrag.fromKey,
            toDay: dayIndex,
            toKey: mealKey,
            recipeId: kbdDrag.value,
          });
          setKbdDrag(null);
          announce && announce(`Přesunuto do ${day} – ${label}.`);
          e.currentTarget.classList.remove("is-drop-target");
        }
      }}
      title={
        readOnly
          ? undefined
          : recipes.length === 1
            ? "Přetáhni recept na jiný slot nebo den"
            : hasRecipes
              ? "Přetáhni jednotlivý recept na jiný slot nebo den"
            : "Přetáhni recept sem"
      }
    >
      {hasRecipes ? (
        <>
          {!isOverview && <img src={cover} alt="" className="card__slot-image" />}
          <div className="card__slot-body">
            <div className="card__slot-list">
              {recipes.map((item) => (
                <div
                  key={item.id}
                  className="card__slot-actions"
                  draggable={!readOnly}
                  onDragStart={
                    readOnly
                      ? undefined
                      : (e) => {
                          e.stopPropagation();
                          onDragStart(e, mealKey, { recipeId: item.id });
                        }
                  }
                  title={readOnly ? undefined : `Přetáhni recept ${item.title} na jiný slot nebo den`}
                >
                  {showDetailLink && (
                    <Link
                      to={`/recipe-detail/${item.id}`}
                      className="card__slot-iconButton card__slot-iconButton--detail"
                      aria-label={`Zobrazit detail receptu ${item.title}`}
                      title="Zobrazit detail receptu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="card__slot-detailIcon" aria-hidden="true">i</span>
                    </Link>
                  )}
                  <strong className="card__slot-title">{item.title}</strong>
                  {!readOnly && (
                    <button
                      type="button"
                      className="button--remove-control card__slot-iconButton card__slot-iconButton--remove"
                      aria-label={`Odebrat recept ${item.title}`}
                      title="Odebrat recept"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (recipes.length > 1 && onClearRecipe) {
                          onClearRecipe(item.id, item.title);
                          return;
                        }
                        onClear();
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <span className="card__slot-placeholder">
          {isOverview ? "" : "Přetáhni recept sem"}
        </span>
      )}
    </div>
  );
};
