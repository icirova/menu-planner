import "./style.css";

export const CardToolbar = ({ clearDay, label = "Vymazat den" }) => {
  return (
    <div className="card__toolbar">
      <button className="button button--danger" onClick={clearDay} title={label}>
        {label}
      </button>
    </div>
  );
};
