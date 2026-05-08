import "./style.css";

export const ConfirmDialog = ({
  busyLabel = "Pracuji...",
  cancelLabel = "Zrušit",
  confirmLabel = "Potvrdit",
  confirmVariant = "danger",
  id,
  isBusy = false,
  onCancel,
  onConfirm,
  text,
  title,
}) => (
  <div
    className="recipe-confirm"
    role="dialog"
    aria-modal="true"
    aria-labelledby={id}
    onClick={() => {
      if (!isBusy) {
        onCancel();
      }
    }}
  >
    <div className="recipe-confirm__panel" onClick={(event) => event.stopPropagation()}>
      <h2 id={id} className="recipe-confirm__title">
        {title}
      </h2>
      <p className="recipe-confirm__text">{text}</p>
      <div className="recipe-confirm__actions">
        <button type="button" className="button button--ghost" onClick={onCancel} disabled={isBusy}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`button button--${confirmVariant}`}
          onClick={onConfirm}
          disabled={isBusy}
        >
          {isBusy ? busyLabel : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);
