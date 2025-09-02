import { useState, useEffect } from "react";
import "./style.css";

const KEYS = {
  ENTER: "Enter", ESC: "Escape",
  SPACE: " ", SPACE_FALLBACK: "Spacebar",
  UP: "ArrowUp", DOWN: "ArrowDown"
};

const MEAL_KEYS = [
  { key: "breakfast", label: "Snídaně" },
  { key: "snack1",    label: "Svačina" },
  { key: "lunch",     label: "Oběd" },
  { key: "snack2",    label: "Svačina" },
  { key: "dinner",    label: "Večeře" },
];

const DEFAULT_DAY = { breakfast: "", snack1: "", lunch: "", snack2: "", dinner: "" };

const getTitle = (r) => (r?.title ?? r?.name ?? "").trim();

const getSuggestions = (recipes = [], query = "", limit = 6) => {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];
  return recipes
    .filter((r) => getTitle(r).toLowerCase().includes(q))
    .slice(0, limit);
};

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
    MEAL_KEYS.forEach(({ key }) =>
      dispatch({ type: "CLEAR_MEAL", dayIndex, mealKey: key })
    );
  };

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
    el.style.overflowY = "hidden";
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
      {img && <img className="card__image" src={`./image/${img}`} alt="" />}

      <h1 className="card__title">{day}</h1>

      <div className="card__toolbar">
        {isEditing && <span className="chip chip--edit" aria-live="polite">✏️</span>}
        <button
          className="button button--ghost"
          onClick={() => setEditing((v) => !v)}
          disabled={forceEditing}
          title={forceEditing ? "Řízeno tlačítkem „Upravit vše“" : ""}
        >
          {isEditing ? "Hotovo" : "Upravit"}
        </button>
        <button className="button button--danger" onClick={clearDay} title="Vymazat celý den">
          Vymazat den
        </button>
      </div>

      <div className="card__content" id={`day-${dayIndex}`}>
        {MEAL_KEYS.map(({ key, label }, i) => {
          const hintId = `hint-${dayIndex}-${key}`;
          const listId = `suggest-${dayIndex}-${key}`;
          const optId = (idx) => `opt-${dayIndex}-${key}-${idx}`;

          const carrying = !!kbdDrag;
          const isSource =
            carrying && kbdDrag.fromDay === dayIndex && kbdDrag.fromKey === key;

          // našeptávač – výpočet uvnitř map (key existuje)
          const suggestions = hideSuggest[key]
            ? []
            : getSuggestions(recipes, model[key]);
          const hasSuggest = suggestions.length > 0;
          const active = Math.max(-1, Math.min(activeIdx[key] ?? -1, suggestions.length - 1));

          return (
            <div key={key} className={`card__text ${key === "dinner" ? "card__text--dinner" : ""}`}>
              <p className="card__subtitle">{label}:</p>

              {isEditing ? (
                <div className="slot">
                  <textarea
                    className="card__slot card__slot--input card__slot--withClear"
                    placeholder="Napiš…"
                    value={model[key]}
                    onChange={(e) => {
                      dispatch({ type: "UPDATE_MEAL", dayIndex, mealKey: key, value: e.target.value });
                      autoGrow(e.currentTarget);
                      setActiveIdx((s) => ({ ...s, [key]: -1 }));
                      // Zobraz našeptávače pouze když uživatel píše a má alespoň 2 znaky
                      if (e.target.value.trim().length >= 2) {
                        setHideSuggest((s) => ({ ...s, [key]: false }));
                      } else {
                        setHideSuggest((s) => ({ ...s, [key]: true }));
                      }
                    }}
                    ref={autoGrow}
                    onInput={(e) => autoGrow(e.currentTarget)}
                    onFocus={(e) => autoGrow(e.currentTarget)}
                    rows={1}
                    autoComplete="off"
                    autoFocus={i === 0 && shouldAutoFocus}
                    aria-controls={hasSuggest ? listId : undefined}
                    aria-activedescendant={hasSuggest && active >= 0 ? optId(active) : undefined}
                    onKeyDown={(e) => {
                      if (e.key === KEYS.ESC) {
                        e.currentTarget.blur();
                        if (!forceEditing) setEditing(false);
                        return;
                      }
                      if (e.key === KEYS.ENTER && !e.shiftKey) {
                        e.preventDefault();
                        if (hasSuggest && active >= 0) {
                          pickSuggestion(key, getTitle(suggestions[active]));
                        } else if (!forceEditing) {
                          setEditing(false);
                        }
                        return;
                      }
                      if (hasSuggest && e.key === KEYS.DOWN) {
                        e.preventDefault();
                        moveActive(key, "down", listId);
                        return;
                      }
                      if (hasSuggest && e.key === KEYS.UP) {
                        e.preventDefault();
                        moveActive(key, "up", listId);
                        return;
                      }
                    }}
                  />
                  {!!model[key] && (
                    <button
                      type="button"
                      className="button button--icon slot__clear"
                      title="Smazat obsah"
                      aria-label={`Smazat ${label}`}
                      onClick={() => {
                        dispatch({ type: "UPDATE_MEAL", dayIndex, mealKey: key, value: "" });
                        setActiveIdx((s) => ({ ...s, [key]: -1 }));
                        setHideSuggest((s) => ({ ...s, [key]: true }));
                      }}
                    >
                      ✕
                    </button>
                  )}

                  {hasSuggest && (
                    <ul id={listId} className="suggest" role="listbox" aria-label={`Návrhy pro ${label}`}>
                      {suggestions.map((r, idx) => (
                        <li key={r.id ?? getTitle(r) ?? idx} role="option" id={optId(idx)} aria-selected={active === idx}>
                          <button
                            type="button"
                            className={`suggest__item ${active === idx ? "is-active" : ""}`}
                            onMouseEnter={() => setActiveIdx((s) => ({ ...s, [key]: idx }))}
                            onMouseLeave={() => setActiveIdx((s) => ({ ...s, [key]: -1 }))}
                            onClick={() => pickSuggestion(key, getTitle(r))}
                          >
                            {getTitle(r)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p
                  className={`card__slot ${isSource ? "is-kbd-source" : ""}`}
                  tabIndex={0}
                  role="button"
                  aria-describedby={hintId}
                  aria-label={
                    carrying
                      ? `${label}: ${model[key] || "prázdné"}. Cíl přesunu — stiskni mezerník pro položení, Esc zruší.`
                      : `${label}: ${model[key] ? model[key] : "prázdné"}. Enter: upravit.`
                  }
                  draggable={!!model[key]}
                  onDragStart={(e) => onDragStart(e, key)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.currentTarget.classList.add("is-drop-target")}
                  onDragLeave={(e) => e.currentTarget.classList.remove("is-drop-target")}
                  onDrop={(e) => { e.currentTarget.classList.remove("is-drop-target"); onDropTo(e, key); }}
                  onFocus={(e) => { if (kbdDrag) e.currentTarget.classList.add("is-drop-target"); }}
                  onBlur={(e) => e.currentTarget.classList.remove("is-drop-target")}
                  onKeyDown={(e) => {
                    if (e.key === KEYS.ENTER) {
                      e.preventDefault();
                      if (!forceEditing) setEditing(true);
                      return;
                    }
                    if (e.key === KEYS.ESC && kbdDrag) {
                      setKbdDrag(null);
                      announce && announce("Přesun zrušen.");
                      e.currentTarget.classList.remove("is-drop-target");
                      return;
                    }
                    if (e.key === KEYS.SPACE || e.key === KEYS.SPACE_FALLBACK) {
                      e.preventDefault();
                      if (!kbdDrag) {
                        if (!model[key]) { announce && announce("Slot je prázdný, není co přesouvat."); return; }
                        setKbdDrag({ fromDay: dayIndex, fromKey: key, value: model[key] });
                        announce && announce(`Zvednuto: ${model[key]} z ${day} – ${label}. Přejdi na cílový slot a stiskni mezerník.`);
                        return;
                      }
                      dispatch({ type: "MOVE_MEAL", fromDay: kbdDrag.fromDay, fromKey: kbdDrag.fromKey, toDay: dayIndex, toKey: key });
                      setKbdDrag(null);
                      announce && announce(`Přesunuto do ${day} – ${label}.`);
                      e.currentTarget.classList.remove("is-drop-target");
                    }
                  }}
                  title={model[key] ? "Přetáhni na jiný slot/den" : "Sem můžeš přetáhnout jídlo"}
                >
                  {model[key] || ""}
                </p>
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
