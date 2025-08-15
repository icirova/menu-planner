import React, { useEffect, useReducer, useState } from "react";
import "./style.css";
import { DailyMenuCard } from "../DailyMenuCard";
import { ShoppingList } from "../ShoppingList";
import { NotesCard } from "../NotesCard";

const DAYS = [
  "Pondělí",
  "Úterý",
  "Středa",
  "Čtvrtek",
  "Pátek",
  "Sobota",
  "Neděle",
];
const STORAGE_KEY = "weeklyMenu"; // používáme stejný klíč, ale s migrací
const DEFAULT_DAY = {
  breakfast: "",
  snack1: "",
  lunch: "",
  snack2: "",
  dinner: "",
};

const makeEmptyWeek = () => DAYS.map(() => ({ ...DEFAULT_DAY }));

const initialState = { week: makeEmptyWeek(),notes: "", shopping: "" };

function reducer(state, action) {
  switch (action.type) {
    case "INIT_FROM_STORAGE": {
      const payload = action.payload;
      // MIGRACE: dříve byl uložen čistě Array; teď očekáváme {week, shopping}
      if (Array.isArray(payload)) {
        return { week: payload, shopping: "" };
      }
      if (payload && Array.isArray(payload.week)) {
        return { week: payload.week, shopping: payload.shopping ?? "" };
      }
      return state;
    }
    case "UPDATE_MEAL": {
      const { dayIndex, mealKey, value } = action;
      const nextWeek = state.week.map((d, i) =>
        i === dayIndex ? { ...d, [mealKey]: value } : d
      );
      return { ...state, week: nextWeek };
    }
    case "CLEAR_MEAL": {
      const { dayIndex, mealKey } = action;
      const nextWeek = state.week.map((d, i) =>
        i === dayIndex ? { ...d, [mealKey]: "" } : d
      );
      return { ...state, week: nextWeek };
    }
    case "CLEAR_DAY": {
      const { dayIndex } = action;
      const nextWeek = state.week.map((d, i) =>
        i === dayIndex ? { ...DEFAULT_DAY } : d
      );
      return { ...state, week: nextWeek };
    }
    case "MOVE_MEAL": {
      const { fromDay, fromKey, toDay, toKey } = action;
      const value = state.week[fromDay][fromKey];
      if (!value || (fromDay === toDay && fromKey === toKey)) return state;
      const next = state.week.map((d) => ({ ...d }));
      if (next[toDay][toKey]) {
        const tmp = next[toDay][toKey];
        next[toDay][toKey] = value;
        next[fromDay][fromKey] = tmp;
      } else {
        next[toDay][toKey] = value;
        next[fromDay][fromKey] = "";
      }
      return { ...state, week: next };
    }
    case "UPDATE_NOTES": {
      return { ...state, notes: action.value };
    }
    case "UPDATE_SHOPPING": {
      return { ...state, shopping: action.value };
    }
    case "RESET_WEEK": {
      return { week: makeEmptyWeek(),notes: "", shopping: "" };
    }
    default:
      return state;
  }
}

export const DailyMenuCards = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [editAll, setEditAll] = useState(false);


  // init from localStorage (s migrací)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: "INIT_FROM_STORAGE", payload: parsed });
      }
    } catch {}
  }, []);

  // persist to localStorage (nově ukládáme {week, shopping})
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const images = [
    "1-menu.webp",
    "2-menu.webp",
    "3-menu.webp",
    "4-menu.webp",
    "5-menu.webp",
    "6-menu.webp",
    "7-menu.webp",
  ];

  return (
    <>
      {/* Toolbar NAD gridem karet */}
      <div className="cards__toolbar">
        <button
          className="button button--ghost"
          onClick={() => setEditAll(v => !v)}
          title={editAll ? "Vypnout úpravy na všech kartách" : "Zapnout úpravy na všech kartách"}
        >
          {editAll ? "Hotovo (vypnout úpravy)" : "Upravit vše"}
        </button>

        <button
          className="button button--danger"
          onClick={() => dispatch({ type: "RESET_WEEK" })}
        >
          Vymazat plán
        </button>
      </div>

      {/* GRID karet */}
      <div className="cards">
        {DAYS.map((day, i) => (
          <DailyMenuCard
            key={day}
            day={day}
            img={images[i]}
            dayIndex={i}
            data={state.week[i]}
            dispatch={dispatch}
            forceEditing={editAll}
            shouldAutoFocus={editAll && i === 0}   // ⬅️ focus na Pondělí vreřimu editAll
          />
        ))}

        <NotesCard
          value={state.notes}
          onChange={(v) => dispatch({ type: "UPDATE_NOTES", value: v })}
          forceEditing={editAll}
          shouldAutoFocus={false} // aby nekradl focus 
        />

        <ShoppingList
          value={state.shopping}
          onChange={(value) => dispatch({ type: "UPDATE_SHOPPING", value })}
          forceEditing={editAll}
          shouldAutoFocus={false}
        />
      </div>
    </>
  );
};
