import "./style.css";
import { useState, useEffect } from "react";
import { MEAL_KEYS } from "../../constants/mealKeys";
import { DEFAULT_DAY } from "../../constants/defaultDay";
import { getSuggestions } from "../../utils/getSuggestions";
import { CardToolbar } from "../CardToolbar";
import { CardHeader } from "../CardHeader";
import { MealSlotEditor } from "../MealSlotEditor";
import { MealSlotView } from "../MealSlotView";

export const DailyMenuCard = ({
  day,
  img,
  dayIndex,
  data,
  dispatch,
  forceEditing = false,
  shouldAutoFocus = false,
  // klávesnicový přesun
  kbdDrag,
  setKbdDrag,
  announce,
  // našeptávač
  recipes = [],
}) => {
  const [editing, setEditing] = useState(false);
  const isEditing = forceEditing || editing;
  const model = { ...DEFAULT_DAY, ...(data || {}) };

  // stav pro aktivní návrh a skrytí dropdownu po výběru (per-slot)
  const [activeIdx, setActiveIdx] = useState({
    breakfast: -1, snack1: -1, lunch: -1, snack2: -1, dinner: -1,
  });
  const [hideSuggest, setHideSuggest] = useState({
    breakfast: true, snack1: true, lunch: true, snack2: true, dinner: true,
  });

  // Skryj všechny našeptávače při opuštění editačního módu
  useEffect(() => {
    if (!isEditing) {
      setHideSuggest({
        breakfast: true, snack1: true, lunch: true, snack2: true, dinner: true,
      });
      setActiveIdx({
        breakfast: -1, snack1: -1, lunch: -1, snack2: -1, dinner: -1,
      });
    }
  }, [isEditing]);

  const getSlotLabel = (slotValue) => {
    if (typeof slotValue === "number") {
      return recipes.find((recipe) => recipe.id === slotValue)?.title ?? "";
    }
    return slotValue ?? "";
  };

  const onDragStart = (e, mealKey) => {
    const value = model[mealKey];
    if (!value) return e.preventDefault();
    e.dataTransfer.setData("text/plain", JSON.stringify({ dayIndex, mealKey, value }));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropTo = (e, toKey) => {
    e.preventDefault();
    let payload = null;
    try { payload = JSON.parse(e.dataTransfer.getData("text/plain")); } catch {}
    if (!payload) return;
    dispatch({ type: "MOVE_MEAL", fromDay: payload.dayIndex, fromKey: payload.mealKey, toDay: dayIndex, toKey });
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
    setActiveIdx((s) => ({ ...s, [slotKey]: -1 }));
    setHideSuggest((s) => ({ ...s, [slotKey]: true }));
  };

 

  const moveActive = (slotKey, dir, listId) => {
    setActiveIdx((prev) => {
      const list = document.getElementById(listId);
      const items = list ? Array.from(list.querySelectorAll('[role="option"]')) : [];
      if (!items.length) return prev;

      const cur = prev[slotKey] ?? -1;
      const next = dir === "down"
        ? (cur + 1) % items.length
        : (cur <= 0 ? items.length - 1 : cur - 1);

      const el = items[next];
      if (el?.scrollIntoView) el.scrollIntoView({ block: "nearest" });

      return { ...prev, [slotKey]: next };
    });
  };

  const pickSuggestion = (slotKey, name) => {
    dispatch({ type: "UPDATE_MEAL", dayIndex, mealKey: slotKey, value: name });
    setActiveIdx((s) => ({ ...s, [slotKey]: -1 }));
    setHideSuggest((s) => ({ ...s, [slotKey]: true })); // zavři dropdown po vložení
  };

  return (
    <div className={`card ${isEditing ? "is-editing" : ""}`} role="region" aria-label={`Denní plán: ${day}`}>
      
      <CardHeader img={img} day={day} />
      <CardToolbar isEditing={isEditing} setEditing={setEditing} forceEditing={forceEditing} clearDay={clearDay} />

      <div className="card__content" id={`day-${dayIndex}`}>
        {MEAL_KEYS.map(({ key, label }, i) => {
          const hintId = `hint-${dayIndex}-${key}`;
          const listId = `suggest-${dayIndex}-${key}`;
          const optId = (idx) => `opt-${dayIndex}-${key}-${idx}`;

          const carrying = !!kbdDrag;
          const isSource =
            carrying && kbdDrag.fromDay === dayIndex && kbdDrag.fromKey === key;
          const slotLabel = getSlotLabel(model[key]);

          // našeptávač – výpočet uvnitř map (key existuje)
          const suggestions = hideSuggest[key]
            ? []
            : getSuggestions(recipes, slotLabel);
          const hasSuggest = suggestions.length > 0;
          const active = Math.max(-1, Math.min(activeIdx[key] ?? -1, suggestions.length - 1));

          return (
            <div key={key} className={`card__text ${key === "dinner" ? "card__text--dinner" : ""}`}>
              <p className="card__subtitle">{label}:</p>

              {isEditing ? (
                <MealSlotEditor
                  label={label}
                  value={slotLabel}
                  hasValue={!!model[key]}
                  shouldAutoFocus={i === 0 && shouldAutoFocus}
                  forceEditing={forceEditing}
                  listId={listId}
                  optId={optId}
                  hasSuggest={hasSuggest}
                  active={active}
                  suggestions={suggestions}
                  onChange={(e) => {
                    dispatch({ type: "UPDATE_MEAL", dayIndex, mealKey: key, value: e.target.value });
                    setActiveIdx((s) => ({ ...s, [key]: -1 }));
                    if (e.target.value.trim().length >= 2) {
                      setHideSuggest((s) => ({ ...s, [key]: false }));
                    } else {
                      setHideSuggest((s) => ({ ...s, [key]: true }));
                    }
                  }}
                  onMoveActive={(dir) => moveActive(key, dir, listId)}
                  onPickSuggestion={(value) => pickSuggestion(key, value)}
                  onHoverSuggestion={(idx) => setActiveIdx((s) => ({ ...s, [key]: idx }))}
                  onClear={() => clearSlot(key, label)}
                  onDoneEditing={() => setEditing(false)}
                />
              ) : (
                <MealSlotView
                  label={label}
                  day={day}
                  dayIndex={dayIndex}
                  mealKey={key}
                  value={slotLabel}
                  isSource={isSource}
                  carrying={carrying}
                  forceEditing={forceEditing}
                  kbdDrag={kbdDrag}
                  setKbdDrag={setKbdDrag}
                  announce={announce}
                  dispatch={dispatch}
                  hintId={hintId}
                  onDragStart={onDragStart}
                  onDropTo={onDropTo}
                  onStartEditing={() => setEditing(true)}
                />
              )}

              <span id={hintId} className="sr-only">
                Enter: upravit. Mezerník: zvednout/položit. Esc: zrušit přesun.
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
