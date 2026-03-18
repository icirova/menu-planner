import { useEffect, useReducer, useState } from "react";
import "./style.css";
import { DailyMenuCard } from "../DailyMenuCard";
import { ShoppingList } from "../ShoppingList";
import { NotesCard } from "../NotesCard";
import { initialMenuState, menuReducer } from "../../reducers/menuReducer";
import { loadStoredMenuState, saveMenuState } from "../../storage/menuStorage";

const DAYS = ["Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota","Neděle"];

export const DailyMenuCards = ({ recipes = [] }) => {
  const [state, dispatch] = useReducer(menuReducer, initialMenuState);
  const [editAll, setEditAll] = useState(false);

  // ⬇️ keyboard DnD stav + live region
  const [kbdDrag, setKbdDrag] = useState(null);          // {fromDay, fromKey, value} | null
  const [liveMsg, setLiveMsg] = useState("");
  const announce = (msg) => setLiveMsg(msg);
  const confirmResetWeek = () => {
    if (!window.confirm("Opravdu chceš vymazat celý plán, poznámky i nákupní seznam?")) {
      return;
    }
    dispatch({ type: "RESET_WEEK" });
  };

  // init ze storage (s migrací přes reducer)
  useEffect(() => {
    const storedState = loadStoredMenuState();
    if (storedState) {
      dispatch({ type: "INIT_FROM_STORAGE", payload: storedState, recipes });
    }
  }, [recipes]);

  // persist menu state do storage
  useEffect(() => {
    saveMenuState(state);
  }, [state]);

  const images = [
    "1-menu.webp","2-menu.webp","3-menu.webp","4-menu.webp",
    "5-menu.webp","6-menu.webp","7-menu.webp",
  ];

  return (
    <>
      {/* Toolbar NAD gridem karet */}
      <div className="cards__toolbar">

      <button
          className="button"
          onClick={() =>
            dispatch({
              type: "AUTO_FILL_WEEK",
              payload: { recipes, fillOnlyEmpty: true }, // jen prázdné sloty
            })
          }
          title="Automaticky vyplnit prázdné sloty podle tagů"
        >
          Automaticky vyplnit
        </button>

        <button
          className="button button--ghost"
          onClick={() => setEditAll((v) => !v)}
          title={editAll ? "Vypnout úpravy na všech kartách" : "Zapnout úpravy na všech kartách"}
        >
          {editAll ? "Hotovo vše" : "Upravit vše"}
        </button>

      
        <button
          className="button button--danger"
          onClick={confirmResetWeek}
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
            shouldAutoFocus={editAll && i === 0}  // fokus Pondělí v režimu „Upravit vše“
            // keyboard DnD + live region
            kbdDrag={kbdDrag}
            setKbdDrag={setKbdDrag}
            announce={announce}
            recipes={recipes}
          />
        ))}

        <NotesCard
          value={state.notes}
          onChange={(v) => dispatch({ type: "UPDATE_NOTES", value: v })}
          forceEditing={editAll}
          shouldAutoFocus={false}
        />

        <ShoppingList
          value={state.shopping}
          onChange={(value) => dispatch({ type: "UPDATE_SHOPPING", value })}
          forceEditing={editAll}
          shouldAutoFocus={false}
        />
      </div>

      {/* Live region pro čtečky */}
      <div className="sr-only" aria-live="polite">{liveMsg}</div>
    </>
  );
};
