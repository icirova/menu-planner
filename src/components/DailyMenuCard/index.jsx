import { useState } from "react";
import "./style.css";

const MEAL_KEYS = [
  { key: "breakfast", label: "Snídaně" },
  { key: "snack1",    label: "Svačina" },
  { key: "lunch",     label: "Oběd" },
  { key: "snack2",    label: "Svačina" },
  { key: "dinner",    label: "Večeře" },
];

const DEFAULT_DAY = {
  breakfast: "",
  snack1: "",
  lunch: "",
  snack2: "",
  dinner: "",
};

export const DailyMenuCard = ({
  day,
  img,
  dayIndex,
  data,
  dispatch,
  forceEditing = false,
  shouldAutoFocus = false,
}) => {
  const [editing, setEditing] = useState(false);
  const isEditing = forceEditing || editing;
  const model = { ...DEFAULT_DAY, ...(data || {}) };

  const onDragStart = (e, mealKey) => {
    const value = model[mealKey];
    if (!value) return e.preventDefault();
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ dayIndex, mealKey, value })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropTo = (e, toKey) => {
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
    });
  };

  const clearDay = () => {
    MEAL_KEYS.forEach(({ key }) =>
      dispatch({ type: "CLEAR_MEAL", dayIndex, mealKey: key })
    );
  };

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "0px";                 // přesný scrollHeight
    el.style.height = el.scrollHeight + "px";
    el.style.overflowY = "hidden";
  };

  return (
    <div
      className={`card ${isEditing ? "is-editing" : ""}`}
      role="region"
      aria-label={`Denní plán: ${day}`}
    >
      {img && <img className="card__image" src={`./image/${img}`} alt="" />}

      <h1 className="card__title">{day}</h1>

      <div className="card__toolbar">
        {isEditing && (
          <span className="chip chip--edit" aria-live="polite">✏️</span>
        )}
        <button
          className="button button--ghost"
          onClick={() => setEditing((v) => !v)}
          disabled={forceEditing}
          title={forceEditing ? "Řízeno tlačítkem „Upravit vše“" : ""}
        >
          {isEditing ? "Hotovo" : "Upravit"}
        </button>
        <button
          className="button button--danger"
          onClick={clearDay}
          title="Vymazat celý den"
        >
          Vymazat den
        </button>
      </div>

      <div className="card__content" id={`day-${dayIndex}`}>
        {MEAL_KEYS.map(({ key, label }, i) => {
         
          const hintId = `hint-${dayIndex}-${key}`; //pro přístupnost

          return (
            <div
              key={key}
              className={`card__text ${key === "dinner" ? "card__text--dinner" : ""}`}
            >
              <p className="card__subtitle">{label}:</p>

              {isEditing ? (
                <div className="slot">
                  <textarea
                    className="card__slot card__slot--input card__slot--withClear"
                    placeholder="Napiš…"
                    value={model[key]}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_MEAL",
                        dayIndex,
                        mealKey: key,
                        value: e.target.value,
                      })
                    }
                    ref={autoGrow}
                    onInput={(e) => autoGrow(e.currentTarget)}
                    onFocus={(e) => autoGrow(e.currentTarget)}
                    rows={1}
                    autoComplete="off"
                    autoFocus={i === 0 && shouldAutoFocus}
                    
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.currentTarget.blur();
                        if (!forceEditing) setEditing(false);
                      }
                      // U textarea: Enter bez Shift = potvrdit (ukončit edit)
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!forceEditing) setEditing(false);
                      }
                    }}
                  />
                  {!!model[key] && (
                    <button
                      type="button"
                      className="button button--icon slot__clear"
                      title="Smazat obsah"
                      aria-label={`Smazat ${label}`}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_MEAL",
                          dayIndex,
                          mealKey: key,
                          value: "",
                        })
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              ) : (
                <p
                  className="card__slot"
                  tabIndex={0}
                  role="button"
                  aria-describedby={hintId}
                  aria-label={`${label}: ${model[key] ? model[key] : "prázdné"}`}
                  draggable={!!model[key]}
                  onDragStart={(e) => onDragStart(e, key)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.currentTarget.classList.add("is-drop-target")}
                  onDragLeave={(e) => e.currentTarget.classList.remove("is-drop-target")}
                  onDrop={(e) => {
                    e.currentTarget.classList.remove("is-drop-target");
                    onDropTo(e, key);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (!forceEditing) setEditing(true);
                    }
                  }}
                  title={
                    model[key]
                      ? "Přetáhni na jiný slot/den"
                      : "Sem můžeš přetáhnout jídlo"
                  }
                >
                  {model[key] || ""}
                </p>
              )}

              {/* skrytá nápověda pro čtečky – přístupná přes aria-describedby */}
              <span id={hintId} className="sr-only">
                Enter: upravit. Mezera: (přesun přidáme v dalším kroku). Esc: zavřít editaci.
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
