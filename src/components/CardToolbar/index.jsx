import "./style.css";

export const CardToolbar = ({ isEditing, setEditing, forceEditing, clearDay }) => {
    return (
<div className="card__toolbar">
{isEditing && <span className="chip chip--edit" aria-live="polite">✏️</span>}
<button
  className="button button--ghost"
  onClick={() => setEditing((v) => !v)}
  disabled={forceEditing}
  title={forceEditing ? "Řízeno tlačítkem „Upravit vše“" : ""}
>
  {isEditing ? "Hotovo" : "Upravit"}
</button>
<button className="button button--danger" onClick={clearDay} title="Vymazat celý den">
  Vymazat den
</button>
</div>
);
};