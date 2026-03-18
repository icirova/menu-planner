import { KEYS } from "../../constants/keys";

export const MealSlotView = ({
  label,
  day,
  dayIndex,
  mealKey,
  value,
  isSource = false,
  carrying = false,
  forceEditing = false,
  kbdDrag,
  setKbdDrag,
  announce,
  dispatch,
  hintId,
  onDragStart,
  onDropTo,
  onStartEditing,
}) => {
  return (
    <p
      className={`card__slot ${isSource ? "is-kbd-source" : ""}`}
      tabIndex={0}
      role="button"
      aria-describedby={hintId}
      aria-label={
        carrying
          ? `${label}: ${value || "prázdné"}. Cíl přesunu — stiskni mezerník pro položení, Esc zruší.`
          : `${label}: ${value || "prázdné"}. Enter: upravit.`
      }
      draggable={!!value}
      onDragStart={(e) => onDragStart(e, mealKey)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.currentTarget.classList.add("is-drop-target")}
      onDragLeave={(e) => e.currentTarget.classList.remove("is-drop-target")}
      onDrop={(e) => {
        e.currentTarget.classList.remove("is-drop-target");
        onDropTo(e, mealKey);
      }}
      onFocus={(e) => {
        if (kbdDrag) e.currentTarget.classList.add("is-drop-target");
      }}
      onBlur={(e) => e.currentTarget.classList.remove("is-drop-target")}
      onKeyDown={(e) => {
        if (e.key === KEYS.ENTER) {
          e.preventDefault();
          if (!forceEditing) onStartEditing();
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
            if (!value) {
              announce && announce("Slot je prázdný, není co přesouvat.");
              return;
            }

            setKbdDrag({ fromDay: dayIndex, fromKey: mealKey, value });
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
          });
          setKbdDrag(null);
          announce && announce(`Přesunuto do ${day} – ${label}.`);
          e.currentTarget.classList.remove("is-drop-target");
        }
      }}
      title={value ? "Přetáhni na jiný slot/den" : "Sem můžeš přetáhnout jídlo"}
    >
      {value}
    </p>
  );
};
