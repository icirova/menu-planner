import "./style.css";

export const SuggestList = ({
  id,
  items,
  activeIndex,
  getKey,
  getLabel,
  getItemId,
  onPick,
  onHover,
}) => {
  if (!items?.length) return null;
  return (
    <ul id={id} className="suggest" role="listbox">
      {items.map((item, idx) => {
        const isActive = activeIndex === idx;
        return (
          <li
            key={getKey(item, idx)}
            role="option"
            id={getItemId(idx)}
            aria-selected={isActive}
          >
            <button
              type="button"
              className={`suggest__item ${isActive ? "is-active" : ""}`}
              onMouseEnter={() => onHover(idx)}
              onMouseLeave={() => onHover(-1)}
              onClick={() => onPick(item)}
            >
              {getLabel(item)}
            </button>
          </li>
        );
      })}
    </ul>
  );
};