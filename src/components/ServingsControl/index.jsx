import "./style.css"

export const ServingsControl = ({ value, onChange }) => (
  <div className="servings-control">
    <label htmlFor="servings">Počet porcí:</label>
    <input
      type="number"
      id="servings"
      min="1"
      max="12"
      value={value}
      onChange={onChange}
    />
  </div>
);

