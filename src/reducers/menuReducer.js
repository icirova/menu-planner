import { autoFillWeekByTags } from "./utils/autoFill";
import { SLOT_TAGS } from "./constants";

export function menuReducer(state, action) {
  switch (action.type) {
    

    case "AUTO_FILL_WEEK": {
      const { recipes, fillOnlyEmpty = true } = action.payload;

      const weekFilled = autoFillWeekByTags({
        week: state.week,
        recipes,
        slotTagsMap: SLOT_TAGS,
        fillOnlyEmpty,
        // pokud ukládáš ID:
        // getSlot: (day, key) => day[key],
        // setSlot: (day, key, val) => { day[key] = val; },
      });

      return { ...state, week: weekFilled };
    }

    default:
      return state;
  }
}import { autoFillWeekByTags } from "../utils/autoFill";
import { SLOT_TAGS } from "../constants/slotTags";

export const menuReducer = (state, action) => {
  switch (action.type) {

    case "AUTO_FILL_WEEK": {
      const { recipes, fillOnlyEmpty = true } = action.payload;

      const weekFilled = autoFillWeekByTags({
        week: state.week,
        recipes,
        slotTagsMap: SLOT_TAGS,
        fillOnlyEmpty,
        // Pokud ukládáš ID, není potřeba nic měnit – default get/set je OK.
        // Pokud ukládáš TITLE, můžeš nechat default a jen výše v autoFill přepnout setSlot.
      });

      return { ...state, week: weekFilled };
    }

    // ...tvoje další akce

    default:
      return state;
  }
};
