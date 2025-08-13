import { useState } from "react";
import "./style.css";

const MEAL_KEYS = [
  { key: "breakfast", label: "Snídaně" },
  { key: "snack1", label: "Svačina" },
  { key: "lunch", label: "Oběd" },
  { key: "snack2", label: "Svačina" },
  { key: "dinner", label: "Večeře" },
];

const DEFAULT_DAY = {
  breakfast: "",
  snack1: "",
  lunch: "",
  snack2: "",
  dinner: "",
};

export const DailyMenuCard = ({ day, img, dayIndex, data, dispatch }) => {
  const [editing, setEditing] = useState(false);
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
  el.style.height = "auto";                 // reset
  el.style.height = el.scrollHeight + "px"; // výška podle obsahu
};

  return (
    <div
      className={`card ${editing ? "is-editing" : ""}`}
      role="region"
      aria-label={`Denní plán: ${day}`}
    >
      {img && <img className="card__image" src={`./image/${img}`} alt="" />}

      <h1 className="card__title">{day}</h1>

      <div className="card__toolbar">
        {editing && (
          <span className="chip chip--edit" aria-live="polite">
            ✏️
          </span>
        )}
        <button
          className="button button--ghost"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "Hotovo" : "Upravit"}
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
        {MEAL_KEYS.map(({ key, label }, i) => (
          <div
            key={key}
            className={`card__text ${
              key === "dinner" ? "card__text--dinner" : ""
            }`}
          >
            <p className="card__subtitle">{label}:</p>

            {editing ? (
  <div className="slot">
    <textarea
      className="card__slot card__slot--input card__slot--withClear"
      placeholder="Napiš…"
      value={model[key]}
      onChange={(e) =>
        dispatch({ type: "UPDATE_MEAL", dayIndex, mealKey: key, value: e.target.value })
      }
      // ⬇️ autosize: při mountu, při psaní i při focusu
      ref={autoGrow}
      onInput={(e) => autoGrow(e.currentTarget)}
      onFocus={(e) => autoGrow(e.currentTarget)}
      rows={1}
      autoComplete="off"
      autoFocus={i === 0}
    />
    {!!model[key] && (
      <button
        type="button"
        className="button button--icon slot__clear"
        title="Smazat obsah"
        aria-label={`Smazat ${label}`}
        onClick={() => dispatch({ type: "UPDATE_MEAL", dayIndex, mealKey: key, value: "" })}
      >
        ✕
      </button>
    )}
  </div>
) : (
  <p
    className="card__slot"
    draggable={!!model[key]}
    onDragStart={(e) => onDragStart(e, key)}
    onDragOver={(e) => e.preventDefault()}
    onDragEnter={(e) => e.currentTarget.classList.add("is-drop-target")}
    onDragLeave={(e) => e.currentTarget.classList.remove("is-drop-target")}
    onDrop={(e) => { e.currentTarget.classList.remove("is-drop-target"); onDropTo(e, key); }}
    title={model[key] ? "Přetáhni na jiný slot/den" : "Sem můžeš přetáhnout jídlo"}
  >
    {model[key] || ""}
  </p>
)}
            
          </div>
        ))}
      </div>
    </div>
  );
};
