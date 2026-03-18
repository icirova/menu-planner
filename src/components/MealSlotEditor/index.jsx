import { KEYS } from "../../constants/keys";
import { getTitle } from "../../utils/getTitle";
import { AutoGrowTextarea } from "../AutoGrowTextarea";
import { SuggestList } from "../SuggestList";

export const MealSlotEditor = ({
  label,
  value,
  hasValue,
  shouldAutoFocus = false,
  forceEditing = false,
  listId,
  optId,
  hasSuggest,
  active,
  suggestions,
  onChange,
  onMoveActive,
  onPickSuggestion,
  onHoverSuggestion,
  onClear,
  onDoneEditing,
}) => {
  return (
    <div className="slot">
      <AutoGrowTextarea
        className="card__slot card__slot--input card__slot--withClear"
        placeholder="Napiš…"
        value={value}
        onChange={onChange}
        rows={1}
        autoComplete="off"
        autoFocus={shouldAutoFocus}
        aria-controls={hasSuggest ? listId : undefined}
        aria-activedescendant={hasSuggest && active >= 0 ? optId(active) : undefined}
        onKeyDown={(e) => {
          if (e.key === KEYS.ESC) {
            e.currentTarget.blur();
            if (!forceEditing) onDoneEditing();
            return;
          }

          if (e.key === KEYS.ENTER && !e.shiftKey) {
            e.preventDefault();
            if (hasSuggest && active >= 0) {
              onPickSuggestion(suggestions[active].id);
            } else if (!forceEditing) {
              onDoneEditing();
            }
            return;
          }

          if (hasSuggest && e.key === KEYS.DOWN) {
            e.preventDefault();
            onMoveActive("down", listId);
            return;
          }

          if (hasSuggest && e.key === KEYS.UP) {
            e.preventDefault();
            onMoveActive("up", listId);
          }
        }}
      />

      {hasValue && (
        <button
          type="button"
          className="button button--icon slot__clear"
          title="Smazat obsah"
          aria-label={`Smazat ${label}`}
          onClick={onClear}
        >
          ✕
        </button>
      )}

      {hasSuggest && (
        <SuggestList
          id={listId}
          items={suggestions}
          activeIndex={active}
          getKey={(r, idx) => r.id ?? getTitle(r) ?? idx}
          getLabel={(r) => getTitle(r)}
          getItemId={(idx) => optId(idx)}
          onPick={(item) => onPickSuggestion(getTitle(item))}
          onHover={onHoverSuggestion}
        />
      )}
    </div>
  );
};
