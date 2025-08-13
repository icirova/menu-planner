import React, { useEffect, useReducer } from "react";
import "./style.css";
import { DailyMenuCard } from "../DailyMenuCard";
import { ShoppingList } from "../ShoppingList";
import { NotesCard } from "../NotesCard";

const DAYS = ["Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota","Neděle"];
const STORAGE_KEY = "weeklyMenu";
const DEFAULT_DAY = { breakfast: "", snack1: "", lunch: "", snack2: "", dinner: "" };

function reducer(state, action) {
  switch (action.type) {
    case "INIT_FROM_STORAGE": {
      return action.payload ?? state;
    }
    case "UPDATE_MEAL": {
      const { dayIndex, mealKey, value } = action;
      const next = state.map((d, i) => (i === dayIndex ? { ...d, [mealKey]: value } : d));
      return next;
    }
    case "CLEAR_MEAL": {
      const { dayIndex, mealKey } = action;
      const next = state.map((d, i) => (i === dayIndex ? { ...d, [mealKey]: "" } : d));
      return next;
    }
    case "MOVE_MEAL": {
      const { fromDay, fromKey, toDay, toKey } = action;
      const value = state[fromDay][fromKey];
      if (!value || (fromDay === toDay && fromKey === toKey)) return state;
      const next = state.map((d) => ({ ...d }));
      if (next[toDay][toKey]) {
        // swap
        const tmp = next[toDay][toKey];
        next[toDay][toKey] = value;
        next[fromDay][fromKey] = tmp;
      } else {
        // move
        next[toDay][toKey] = value;
        next[fromDay][fromKey] = "";
      }
      return next;
    }
    case "RESET_WEEK": {
      return DAYS.map(() => ({ ...DEFAULT_DAY }));
    }
    default:
      return state;
  }
}

export const DailyMenuCards = () => {
  const [week, dispatch] = useReducer(
    reducer,
    DAYS.map(() => ({ ...DEFAULT_DAY }))
  );

  // init from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === DAYS.length) {
          dispatch({ type: "INIT_FROM_STORAGE", payload: parsed });
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(week));
    } catch {}
  }, [week]);

  const images = [
    "1-menu.webp","2-menu.webp","3-menu.webp","4-menu.webp",
    "5-menu.webp","6-menu.webp","7-menu.webp"
  ];

  return (
     <>

      {/* Toolbar pro celý týden */}
      <div className="cards__toolbar">
        <button className="button button--toolbar" onClick={() => dispatch({ type: "RESET_WEEK" })}>
          Vymazat plán
        </button>
      </div>

    <div className="cards">
     

      {DAYS.map((day, i) => (
        <DailyMenuCard
          key={day}
          day={day}
          img={images[i]}
          dayIndex={i}
          data={week[i]}
          dispatch={dispatch}
        />
      ))}

      {/* Tvoje existující doplňkové karty zůstávají */}
      <NotesCard />
      <ShoppingList />
    </div>
    </>
  );
};
