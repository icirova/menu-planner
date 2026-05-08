import { useState } from "react";
import "./style.css";
import { DailyMenuCard } from "../DailyMenuCard/index.jsx";
import { DAYS } from "../../constants/days.js";
import { DAY_IMAGES } from "../../constants/dayImages.js";

export const DailyMenuCards = ({
  recipes = [],
  state,
  dispatch,
  variant = "planner",
  showDayReset = true,
  dailyCardProps = {},
  trailingContent = null,
}) => {
  const [kbdDrag, setKbdDrag] = useState(null); // {fromDay, fromKey, value} | null
  const [liveMsg, setLiveMsg] = useState("");
  const announce = (msg) => setLiveMsg(msg);

  return (
    <>
      <div className="cards">
        {DAYS.map((day, i) => (
          <DailyMenuCard
            key={day}
            day={day}
            imageSrc={DAY_IMAGES[i]}
            dayIndex={i}
            data={state.week[i]}
            dispatch={dispatch}
            // keyboard DnD + live region
            kbdDrag={kbdDrag}
            setKbdDrag={setKbdDrag}
            announce={announce}
            recipes={recipes}
            variant={variant}
            showDayReset={showDayReset}
            {...dailyCardProps}
          />
        ))}

        {trailingContent}
      </div>

      {/* Live region pro čtečky */}
      <div className="sr-only" aria-live="polite">
        {liveMsg}
      </div>
    </>
  );
};
