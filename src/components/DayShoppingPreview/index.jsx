export const DayShoppingPreview = ({
  day,
  dayIndex,
  items = [],
  onToggleItem,
}) => (
  <section className="card__shopping" aria-label={`Nákup pro ${day}`}>
    <div className="card__shopping-header">
      <h3 className="card__shopping-title">Nakoupit</h3>
      <p className="card__shopping-hint">Klikem vypni položky, které už máš doma.</p>
    </div>

    {items.length > 0 ? (
      <ul className="card__shopping-list">
        {items.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              className={`card__shopping-chip ${item.selected ? "is-selected" : ""}`}
              aria-pressed={item.selected}
              onClick={() => onToggleItem(dayIndex, item.key)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="card__shopping-empty">Na tento den zatím není nic naplánováno.</p>
    )}
  </section>
);
