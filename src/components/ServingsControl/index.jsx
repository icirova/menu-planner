import "./style.css";
import { MAX_SERVINGS, MIN_SERVINGS } from "../../constants/servings.js";

export const ServingsControl = ({ value, onChange }) => (
  <div className="servings-control">
    <label htmlFor="servings">Počet porcí:</label>
    <input
      type="number"
      id="servings"
      min={MIN_SERVINGS}
      max={MAX_SERVINGS}
      value={value}
      onChange={onChange}
    />
  </div>
);
