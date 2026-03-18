import "./style.css"

export const Button = ({ label, onClick, active = false }) => {
  return (
    <button
      type="button"
      className={`button ${active ? "button--active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
